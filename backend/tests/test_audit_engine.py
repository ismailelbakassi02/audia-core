import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app_core import app, Base, get_db, AuditBlock, Workspace, RaciRole, create_access_token
from compliance_engine import (
    validate_luhn_siren, validate_deterministic_tva, validate_paf_tripartite,
    compute_sha256, compute_block_hash
)

from sqlalchemy.pool import StaticPool

# Test in-memory database with StaticPool so all connections share the same memory instance
TEST_DB_URL = "sqlite:///:memory:"
engine_test = create_engine(
    TEST_DB_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine_test)
    db = TestingSessionLocal()
    # Seed minimal workspace
    ws = Workspace(
        id="ws_katrinale_37000",
        name="Cabinet Katrinale Audit",
        siren="842910384",
        genesis_hash=compute_sha256("GENESIS_TEST")
    )
    db.add(ws)
    db.commit()
    yield
    Base.metadata.drop_all(bind=engine_test)

# 1. Contrôle de l'algorithme de Luhn sur un SIREN valide et invalide
def test_luhn_siren_validation():
    # SIREN valides connus (INSEE)
    assert validate_luhn_siren("842910384") is True  # Cabinet Katrinale
    assert validate_luhn_siren("552100554") is True  # Bureau-Pro
    assert validate_luhn_siren("732829320") is True  # Techno-Logistique
    
    # SIREN corrompus ou invalides
    assert validate_luhn_siren("732829329") is False
    assert validate_luhn_siren("123456789") is False
    assert validate_luhn_siren("abc123456") is False
    assert validate_luhn_siren("84291038") is False  # Trop court

# 2. Détection déterministe d'un écart de TVA de 0.05 €
def test_deterministic_tva_detection():
    # Cas Conforme : 1000 € HT * 20% = 200 € TVA, 1200 € TTC
    valid, recalc, delta, err = validate_deterministic_tva(1000.0, 20.0, 200.0, 1200.0)
    assert valid is True
    assert delta == 0.0
    assert err is None
    
    # Cas Écart de 0.05 € (Tolérance stricte de 0.01 € dépassée)
    valid_err, recalc_err, delta_err, err_msg = validate_deterministic_tva(1000.0, 20.0, 200.05, 1200.05)
    assert valid_err is False
    assert delta_err == 0.05
    assert "Écart arithmétique TVA" in err_msg

# 3. Détection d'une rupture de PAF (écart commande vs facture)
def test_paf_tripartite_rupture_detection():
    # Cas Conforme
    conforme, errs = validate_paf_tripartite(
        invoice_ht=1500.0,
        cmd_ref="BC-2026-101",
        cmd_amount=1500.0,
        rec_ref="BR-2026-101",
        rec_signed=True
    )
    assert conforme is True
    assert len(errs) == 0
    
    # Cas Dépassement de commande (+200 € HT)
    rupture_cmd, errs_cmd = validate_paf_tripartite(
        invoice_ht=1700.0,
        cmd_ref="BC-2026-101",
        cmd_amount=1500.0,
        rec_ref="BR-2026-101",
        rec_signed=True
    )
    assert rupture_cmd is False
    assert any("Dépassement de commande" in e for e in errs_cmd)
    
    # Cas Bon de Réception non signé
    rupture_rec, errs_rec = validate_paf_tripartite(
        invoice_ht=1500.0,
        cmd_ref="BC-2026-101",
        cmd_amount=1500.0,
        rec_ref="BR-2026-101",
        rec_signed=False
    )
    assert rupture_rec is False
    assert any("non signé" in e for e in errs_rec)

# 4. Invalidation immédiate de la chaîne cryptographique si altération en base
def test_cryptographic_chain_tamper_detection():
    db = TestingSessionLocal()
    ws = db.query(Workspace).filter(Workspace.id == "ws_katrinale_37000").first()
    
    # Création de deux blocs valides chaînés
    b1_hash = compute_block_hash(
        workspace_id=ws.id,
        prev_hash=ws.genesis_hash,
        event_type="ANALYSE_IA_INITIALE",
        invoice_ref="FAC-TEST-001",
        pdf_sha256="abc1",
        prompt_version="prompt_v2.4_cncc_2026",
        model_name="gemini-3-flash",
        raw_json_str="{}",
        timestamp_utc="2026-10-29T10:00:00Z"
    )
    block1 = AuditBlock(
        block_index=1,
        workspace_id=ws.id,
        prev_hash=ws.genesis_hash,
        current_hash=b1_hash,
        timestamp_utc="2026-10-29T10:00:00Z",
        event_type="ANALYSE_IA_INITIALE",
        invoice_ref="FAC-TEST-001",
        supplier_name="TEST SAS",
        supplier_siren="842910384",
        montant_ht=1000.0,
        montant_ttc=1200.0,
        pdf_sha256="abc1",
        raw_json_str="{}"
    )
    db.add(block1)
    
    b2_hash = compute_block_hash(
        workspace_id=ws.id,
        prev_hash=b1_hash,
        event_type="ANALYSE_IA_INITIALE",
        invoice_ref="FAC-TEST-002",
        pdf_sha256="abc2",
        prompt_version="prompt_v2.4_cncc_2026",
        model_name="gemini-3-flash",
        raw_json_str="{}",
        timestamp_utc="2026-10-29T10:01:00Z"
    )
    block2 = AuditBlock(
        block_index=2,
        workspace_id=ws.id,
        prev_hash=b1_hash,
        current_hash=b2_hash,
        timestamp_utc="2026-10-29T10:01:00Z",
        event_type="ANALYSE_IA_INITIALE",
        invoice_ref="FAC-TEST-002",
        supplier_name="TEST 2 SAS",
        supplier_siren="552100554",
        montant_ht=2000.0,
        montant_ttc=2400.0,
        pdf_sha256="abc2",
        raw_json_str="{}"
    )
    db.add(block2)
    db.commit()
    
    # Vérification avec token CAC
    cac_token = create_access_token(role=RaciRole.CAC_ASSOCIE, workspace_id=ws.id, user_name="Alexis CAC")
    res = client.get("/api/v1/ledger/verify", headers={"Authorization": f"Bearer {cac_token}"})
    assert res.status_code == 200
    assert res.json()["valid"] is True
    
    # ALTÉRATION FRAUDULEUSE : modification manuelle du montant sans recalcul de hachage
    block1.raw_json_str = '{"altered": true}'
    db.commit()
    
    res_tampered = client.get("/api/v1/ledger/verify", headers={"Authorization": f"Bearer {cac_token}"})
    assert res_tampered.status_code == 200
    assert res_tampered.json()["valid"] is False
    assert "Altération détectée au bloc #1" in res_tampered.json()["reason"]

# 5. Blocage HTTP 403 Forbidden si AUDITEUR_FINANCIER tente une validation CAC
def test_raci_403_forbidden_on_non_cac_review():
    db = TestingSessionLocal()
    b = AuditBlock(
        block_index=1,
        workspace_id="ws_katrinale_37000",
        prev_hash="0"*64,
        current_hash="1"*64,
        timestamp_utc="2026-10-29T12:00:00Z",
        event_type="ANALYSE_IA_INITIALE",
        invoice_ref="FAC-2026-004",
        supplier_name="TECHNO SAS",
        supplier_siren="732829320",
        pdf_sha256="fake_sha",
        is_compliant=False
    )
    db.add(b)
    db.commit()
    invoice_id = b.id
    
    # Token Auditeur Financier (Opérateur - non signataire)
    junior_token = create_access_token(
        role=RaciRole.AUDITEUR_FINANCIER,
        workspace_id="ws_katrinale_37000",
        user_name="Andrea Launay (Auditeur Financier)"
    )
    
    review_payload = {
        "decision": "CONFIRMEE",
        "comment": "Tentative non autorisée de validation par auditeur financier"
    }
    
    res = client.post(
        f"/api/v1/invoices/{invoice_id}/review",
        json=review_payload,
        headers={"Authorization": f"Bearer {junior_token}"}
    )
    assert res.status_code == 403
    assert "ACCÈS REFUSÉ" in res.json()["detail"]
    assert "Article 14" in res.json()["detail"]
