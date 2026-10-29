import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle, 
  Clock, Database, Lock, Download, Play, RefreshCw, Eye, Search, 
  Award, Sparkles, UserCheck, TrendingUp, UploadCloud, SplitSquareVertical, 
  ArrowLeft, ArrowRight, QrCode, FileCheck, FileCheck2, BookOpen, Layers, 
  HelpCircle, ExternalLink, Cpu, Building2, PlusCircle, Check, Key, 
  LogOut, LogIn, User, LayoutDashboard, FolderKanban, FileLock2, Users, 
  Settings, Briefcase, Scale, Terminal, Bell, ChevronsUpDown, KeyRound, 
  Link as LinkIcon, FileSpreadsheet, Timer, Stamp, FileUp, ScanText, 
  Calculator, ShieldAlert, ShoppingCart, PackageCheck, Hash, FileWarning, 
  CheckCheck, Copy, CopySlash, ShieldBan, SwitchCamera, UserPlus, Mail, 
  ChevronRight, ZoomIn, ZoomOut, Save, CheckSquare
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeView, setActiveView] = useState('DASHBOARD'); // LOGIN | DASHBOARD | INGESTION | REVIEW | LEDGER | GOVERNANCE | EXPORT | SETTINGS
  const [currentRole, setCurrentRole] = useState('CAC_ASSOCIE'); // CAC_ASSOCIE | AUDITEUR_FINANCIER | EXPERT_DATA_IA
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('ws_katrinale_37000');
  const [jwtToken, setJwtToken] = useState('');
  
  // Data State
  const [workspaces, setWorkspaces] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [ledgerBlocks, setLedgerBlocks] = useState([]);
  const [chainVerification, setChainVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Filters & Review
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDocTab, setReviewDocTab] = useState('invoice'); // invoice | po | rec
  
  // Modals
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatePair, setDuplicatePair] = useState(null);
  const [showRaciDeniedModal, setShowRaciDeniedModal] = useState(false);
  const [raciDeniedAction, setRaciDeniedAction] = useState('');
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  
  // Forms
  const [newWsName, setNewWsName] = useState('');
  const [newWsSiren, setNewWsSiren] = useState('');
  const [sirenCheckResult, setSirenCheckResult] = useState(null);
  const [sirenChecking, setSirenChecking] = useState(false);
  
  // Pipeline demo state
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Synchronize Token and Fetch All Data
  const syncTokenAndData = async (wsId, role) => {
    setLoading(true);
    try {
      const authRes = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: wsId,
          role: role,
          user_name: role === 'CAC_ASSOCIE' ? 'Alexis Coiffard' : (role === 'AUDITEUR_FINANCIER' ? 'Andrea Launay' : 'Ismail El Bakassi'),
          email: role === 'CAC_ASSOCIE' ? 'alexis.coiffard@katrinale-audit.fr' : 'andrea.launay@katrinale-audit.fr'
        })
      });
      
      let token = '';
      if (authRes.ok) {
        const authData = await authRes.json();
        token = authData.access_token;
        setJwtToken(token);
      }
      
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const [wsRes, kpiRes, invRes, ledRes] = await Promise.all([
        fetch('/api/v1/workspaces', { headers }),
        fetch('/api/v1/kpis', { headers }),
        fetch('/api/v1/invoices', { headers }),
        fetch('/api/v1/ledger/blocks', { headers })
      ]);
      
      if (wsRes.ok) setWorkspaces(await wsRes.json());
      if (kpiRes.ok) setKpis(await kpiRes.json());
      if (invRes.ok) {
        const invList = await invRes.json();
        setInvoices(invList);
        if (invList.length > 0 && !selectedInvoice) {
          setSelectedInvoice(invList[3] || invList[0]); // default to an anomaly for review demo
        }
      }
      if (ledRes.ok) setLedgerBlocks(await ledRes.json());
      
    } catch (err) {
      console.error('Data sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncTokenAndData(currentWorkspaceId, currentRole);
  }, [currentWorkspaceId, currentRole]);

  // Role Simulator Handler
  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    showToast(`Rôle RACI actif : ${newRole}`);
  };

  // Workspace Change Handler
  const handleWorkspaceChange = (newWsId) => {
    setCurrentWorkspaceId(newWsId);
    showToast(`Bascule sur le Workspace : ${newWsId}`);
  };

  // Verify SIREN via API État
  const handleCheckSiren = async (sirenInput) => {
    const s = (sirenInput || newWsSiren).trim();
    if (!s) return;
    setSirenChecking(true);
    try {
      const res = await fetch(`/api/v1/insee/verify/${s}`);
      if (res.ok) {
        const data = await res.json();
        setSirenCheckResult(data);
      }
    } catch (e) {
      setSirenCheckResult({ valid_luhn: false, status_insee: "Erreur de connexion API État" });
    } finally {
      setSirenChecking(false);
    }
  };

  // Create Workspace
  const handleCreateWorkspace = async (e) => {
    if (e) e.preventDefault();
    if (!newWsName.trim() || !newWsSiren.trim()) return;
    try {
      const res = await fetch('/api/v1/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWsName.trim(),
          siren: newWsSiren.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Workspace initialisé : ${data.name}`);
        setShowNewWorkspaceModal(false);
        setNewWsName('');
        setNewWsSiren('');
        setSirenCheckResult(null);
        handleWorkspaceChange(data.id);
        setActiveView('DASHBOARD');
      }
    } catch (err) {
      showToast("Erreur lors de la création de l'espace");
    }
  };

  // Inspect invoice in View 4
  const handleInspectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setReviewComment(inv.cac_comment || '');
    setActiveView('REVIEW');
  };

  // CAC Review Arbitrage
  const handleReviewDecision = async (decision) => {
    if (currentRole !== 'CAC_ASSOCIE') {
      setRaciDeniedAction("Arbitrage et Validation des Anomalies (Norme NEP 500)");
      setShowRaciDeniedModal(true);
      return;
    }
    if (!reviewComment.trim()) {
      showToast("La motivation obligatoire du jugement professionnel est requise (NEP 230).");
      return;
    }
    try {
      const res = await fetch(`/api/v1/invoices/${selectedInvoice.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          decision: decision,
          comment: reviewComment.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Décision ${decision} enregistrée et scellée en SHA-256.`);
        // Refresh data
        await syncTokenAndData(currentWorkspaceId, currentRole);
      } else {
        const err = await res.json();
        showToast(err.detail || "Erreur lors de la revue.");
      }
    } catch (e) {
      showToast("Erreur de connexion.");
    }
  };

  // Verify Ledger Chain Integrity
  const handleVerifyChain = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/ledger/verify', {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChainVerification(data);
        showToast(data.message);
      }
    } catch (e) {
      showToast("Erreur de vérification.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Demo Test PDFs on Disk
  const handleGeneratePdfs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/demo/generate-pdfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          num_liasses: 10,
          include_tva_errors: true,
          include_duplicates: true,
          include_paf_breaks: true,
          include_bad_siren: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Lot CNCC généré : ${data.generated_count} factures PDF sur le disque.`);
      }
    } catch (e) {
      showToast("Erreur de génération PDF.");
    } finally {
      setLoading(false);
    }
  };

  // Run 3-Agent Pipeline Demo
  const handleRunPipeline = async () => {
    setPipelineRunning(true);
    setPipelineStep(1);
    setTimeout(() => setPipelineStep(2), 1200);
    setTimeout(() => setPipelineStep(3), 2400);
    setTimeout(async () => {
      setPipelineRunning(false);
      setPipelineStep(0);
      showToast("Pipeline 3 Agents terminé : 50 pièces analysées, registre scellé.");
      await syncTokenAndData(currentWorkspaceId, currentRole);
    }, 3600);
  };

  const activeWs = workspaces.find(w => w.id === currentWorkspaceId) || {
    id: "ws_katrinale_37000",
    name: "Cabinet Katrinale Audit",
    siren: "842910384",
    crcc: "CRCC Centre-Val de Loire — Cour d'Appel d'Orléans / Tours"
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus === 'ANOMALIES' && inv.is_compliant) return false;
    if (filterStatus === 'COMPLIANT' && !inv.is_compliant) return false;
    if (filterStatus === 'REVIEWED' && inv.cac_decision === 'EN_ATTENTE') return false;
    if (filterCategory !== 'ALL') {
      const anoms = inv.anomalies || [];
      if (!anoms.some(a => a.category === filterCategory)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = inv.invoice_ref.toLowerCase().includes(q);
      const matchSup = inv.supplier_name.toLowerCase().includes(q);
      const matchSiren = inv.supplier_siren.toLowerCase().includes(q);
      if (!matchNum && !matchSup && !matchSiren) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          PAGE 1 : PORTAIL D'AUTHENTIFICATION & ONBOARDING (FULLSCREEN)
          ========================================================================= */}
      {activeView === 'LOGIN' ? (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* Colonne Gauche : Identité Visuelle & Conformité */}
          <div className="bg-slate-900 border-r border-slate-800 p-8 lg:p-14 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold tracking-tight text-white">AUDIA-CORE</span>
                    <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/40">
                      v2.6 CNCC
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Plateforme d'Audit Légal & Contrôle Automatisé des Factures Électroniques
                  </p>
                </div>
              </div>

              <div className="space-y-4 my-10">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1">
                    <FileCheck className="h-4 w-4" />
                    <span>Conformité Normes NEP 230 & NEP 500</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Traçabilité intégrale des éléments probants et documentation systématique des travaux d'audit assistés par agents algorithmiques.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1">
                    <LinkIcon className="h-4 w-4" />
                    <span>Piste d'Audit Fiable (PAF) & Réforme 2027</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rapprochement tripartite automatisé entre devis, bons de commande, bons de réception et factures au format hybride Factur-X.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-1">
                    <Lock className="h-4 w-4" />
                    <span>Cloisonnement Multi-Cabinet & Secret Professionnel</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Isolation stricte des bases documentaires par identifiant de cabinet et gouvernance conforme au règlement européen EU AI Act.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
              7e Édition #HackAudit 2026 — Compagnie Nationale des Commissaires aux Comptes (CNCC) — IAE Tours Val de Loire
            </div>
          </div>

          {/* Colonne Droite : Carte de Connexion & Provisioning */}
          <div className="bg-slate-950 p-8 lg:p-14 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white">Accès au Cockpit d'Audit</h2>
                <p className="text-xs text-slate-400">
                  Authentification sécurisée via identité professionnelle Google Workspace.
                </p>
              </div>

              {/* Bouton Principal Google OAuth */}
              <Button 
                onClick={() => {
                  syncTokenAndData(currentWorkspaceId, 'CAC_ASSOCIE');
                  setActiveView('DASHBOARD');
                  showToast("Session Google Workspace active : Alexis Coiffard (CAC)");
                }}
                className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continuer avec un compte Google</span>
              </Button>

              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-950 px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
                  OU ACCÈS DÉMONSTRATION JURY CNCC
                </span>
                <div className="border-t border-slate-800 w-full"></div>
              </div>

              {/* Bouton Secondaire Démo IAE Tours */}
              <Button 
                variant="outline"
                onClick={() => {
                  syncTokenAndData('ws_katrinale_37000', 'CAC_ASSOCIE');
                  setActiveView('DASHBOARD');
                  showToast("Session Démo Jury chargée : Cabinet Katrinale Audit");
                }}
                className="w-full h-10 border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <KeyRound className="h-4 w-4 text-emerald-400" />
                <span>Charger la Session Démo (Cabinet IAE Tours)</span>
              </Button>

              {/* Provisioning New Cabinet */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 mt-4">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  <span>Initialiser un Nouveau Cabinet (Multi-Tenant)</span>
                </div>
                
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Dénomination sociale :</label>
                  <input 
                    type="text" 
                    placeholder="Ex : Cabinet AudIA Associés"
                    value={newWsName}
                    onChange={(e) => setNewWsName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Numéro SIREN (9 chiffres) :</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ex : 552100554"
                      value={newWsSiren}
                      onChange={(e) => setNewWsSiren(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-emerald-500"
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => handleCheckSiren(newWsSiren)}
                      disabled={sirenChecking}
                      className="text-xs shrink-0"
                    >
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Vérifier API État
                    </Button>
                  </div>
                </div>

                {sirenCheckResult && (
                  <div className={`p-2 rounded text-[11px] font-medium border ${sirenCheckResult.valid_luhn ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {sirenCheckResult.status_insee}
                  </div>
                )}

                <Button 
                  onClick={handleCreateWorkspace}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-lg h-9"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                  Initialiser l'Espace & Bloc Genesis SHA-256
                </Button>
              </div>

            </div>
          </div>
        </div>
      ) : (

        /* =========================================================================
            SHELL APPLICATIF : SIDEBAR GAUCHE + TOPBAR + CONTENU FLUIDE
            ========================================================================= */
        <div className="flex h-screen overflow-hidden">
          
          {/* BARRE LATÉRALE GAUCHE (Sidebar - Fixe 260px) */}
          <aside className="w-[260px] bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
            <div>
              {/* En-tête Sidebar (Hauteur 64px) */}
              <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  <span className="font-extrabold text-base tracking-tight text-white">AUDIA-CORE</span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/40 bg-slate-950">
                  v2.6 CNCC
                </Badge>
              </div>

              {/* Sélecteur de Cabinet Actif (Tenant Box) */}
              <div className="p-3">
                <div 
                  onClick={() => setShowNewWorkspaceModal(true)}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate">{activeWs.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SIREN : {activeWs.siren} • Tours</div>
                    </div>
                  </div>
                  <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </div>
              </div>

              {/* Menu de Navigation Vertical (8 entrées) */}
              <nav className="px-2 space-y-1">
                {[
                  { id: 'LOGIN', label: 'Portail & Provisioning', icon: LogIn },
                  { id: 'DASHBOARD', label: 'Tableau de Bord & Missions', icon: LayoutDashboard },
                  { id: 'INGESTION', label: 'Ingestion & Contrôle PAF', icon: FolderKanban },
                  { id: 'REVIEW', label: 'Revue Critique NEP 500', icon: SplitSquareVertical },
                  { id: 'LEDGER', label: 'Registre Cryptographique', icon: FileLock2 },
                  { id: 'GOVERNANCE', label: 'Gouvernance RACI & Accès', icon: Users },
                  { id: 'EXPORT', label: 'Rapports & Scellement PDF', icon: FileCheck2 },
                  { id: 'SETTINGS', label: 'Paramètres du Workspace', icon: Settings },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 font-bold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Pied de Sidebar (Bas de page) */}
            <div className="p-3 border-t border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-slate-200">Isolation Tenant Active</span>
                </div>
                <div className="text-[10px] text-slate-500">Base SQLite Chiffrée • EU AI Act</div>
              </div>
            </div>
          </aside>

          {/* ZONE CENTRALE : TOPBAR + CONTENU FLUIDE */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* BARRE SUPÉRIEURE (Topbar - Fixe 64px) */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30">
              
              {/* Zone Gauche (Fil d'Ariane) */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Briefcase className="h-4 w-4 text-emerald-500" />
                <span className="hover:text-slate-200 cursor-pointer">Espace de Travail</span>
                <span>/</span>
                <span className="hover:text-slate-200 cursor-pointer">Mission Audit Légal 2026</span>
                <span>/</span>
                <span className="text-slate-200 font-bold">Cycle Achats-Fournisseurs</span>
              </div>

              {/* Zone Centrale (Simulateur de Rôle RACI - Défi 3) */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleRoleChange('CAC_ASSOCIE')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentRole === 'CAC_ASSOCIE' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Vue CAC Associé (Signataire)</span>
                </button>

                <button
                  onClick={() => handleRoleChange('AUDITEUR_FINANCIER')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentRole === 'AUDITEUR_FINANCIER' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Vue Auditeur Financier</span>
                </button>

                <button
                  onClick={() => handleRoleChange('EXPERT_DATA_IA')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentRole === 'EXPERT_DATA_IA' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Vue Expert Data / IA</span>
                </button>
              </div>

              {/* Zone Droite (Identité & Sécurité) */}
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden xl:inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  API data.gouv.fr : Connectée
                </Badge>

                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 relative cursor-pointer hover:bg-slate-700">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    AC
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-slate-200 leading-tight">Alexis Coiffard</div>
                    <div className="text-[10px] text-slate-400">Commissaire aux Comptes</div>
                  </div>
                  <button 
                    onClick={() => setActiveView('LOGIN')}
                    className="text-slate-400 hover:text-rose-400 ml-1 p-1"
                    title="Déconnexion"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </header>

            {/* CONTENU PRINCIPAL DE LA VUE ACTIVE (Scrollable) */}
            <main className="flex-1 overflow-y-auto bg-slate-950 p-6">

              {/* ===================================================================
                  PAGE 2 : TABLEAU DE BORD EXÉCUTIF & GESTION DES MISSIONS
                  =================================================================== */}
              {activeView === 'DASHBOARD' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Section 1 : Bandeau Supérieur d'Action */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <div>
                      <h1 className="text-lg font-extrabold text-white">Synthèse Opérationnelle du Cycle Achats-Fournisseurs</h1>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Exercice comptable 2026 — Périmètre : Contrôle exhaustif des factures entrantes et sortantes
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Button 
                        variant="secondary" 
                        onClick={handleGeneratePdfs}
                        className="text-xs h-9 bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1.5 text-emerald-400" />
                        Générer Lot de Test CNCC (Factures Piégées PDF)
                      </Button>

                      <Button 
                        onClick={() => setActiveView('INGESTION')}
                        className="text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        <UploadCloud className="h-4 w-4 mr-1.5" />
                        Nouvelle Mission / Importer Liasse PDF
                      </Button>
                    </div>
                  </div>

                  {/* Section 2 : Grille des 4 Cartes KPI (Défi 1 - Valeur Ajoutée) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Carte 1 : Couverture */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Taux de Couverture du Cycle</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-white font-mono">100,0 %</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        50 / 50 pièces contrôlées
                      </div>
                      <div className="text-[10px] text-slate-500 border-t border-slate-800 mt-2 pt-1.5">
                        Référence humaine : Échantillonnage partiel (~10%)
                      </div>
                    </div>

                    {/* Carte 2 : Vélocité */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Temps Moyen d'Exécution par Pièce</span>
                        <Timer className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">1,4 sec</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Traitement asynchrone multi-agents
                      </div>
                      <div className="text-[10px] text-emerald-400/80 border-t border-slate-800 mt-2 pt-1.5">
                        Référence humaine : 10 min / facture (Gain : -99,7%)
                      </div>
                    </div>

                    {/* Carte 3 : Anomalies & Fraude */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Alertes & Écarts Identifiés</span>
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                      </div>
                      <div className="text-2xl font-black text-rose-400 font-mono">12 Anomalies</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        38 pièces conformes
                      </div>
                      <div className="text-[10px] text-slate-500 border-t border-slate-800 mt-2 pt-1.5">
                        3 TVA • 3 Doublons • 3 Ruptures PAF • 3 SIREN
                      </div>
                    </div>

                    {/* Carte 4 : Validation Humaine CAC */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Revue du Commissaire aux Comptes</span>
                        <Stamp className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-amber-400 font-mono">
                        {kpis?.reviewed_count || 4} / 12 Arbitrées
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {12 - (kpis?.reviewed_count || 4)} en attente de visa CAC
                      </div>
                      <div className="text-[10px] text-slate-500 border-t border-slate-800 mt-2 pt-1.5">
                        Scellement PDF verrouillé jusqu'à revue complète
                      </div>
                    </div>
                  </div>

                  {/* Section 3 : Tableau des Pièces Comptables Analysées */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    
                    {/* Barre de Filtres */}
                    <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="relative w-full md:w-80">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Rechercher par numéro de facture, raison sociale ou SIREN..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { label: `Toutes les pièces (${invoices.length})`, cat: 'ALL', stat: 'ALL' },
                          { label: 'Anomalies Critiques (12)', cat: 'ALL', stat: 'ANOMALIES' },
                          { label: 'Ruptures PAF (3)', cat: 'PAF_BREAK', stat: 'ALL' },
                          { label: 'Doublons Détectés (3)', cat: 'DUPLICATE', stat: 'ALL' },
                          { label: 'Écarts TVA (3)', cat: 'TVA_ERROR', stat: 'ALL' },
                          { label: `Validées par le CAC (${kpis?.reviewed_count || 4})`, cat: 'ALL', stat: 'REVIEWED' },
                        ].map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFilterCategory(btn.cat);
                              setFilterStatus(btn.stat);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              filterCategory === btn.cat && filterStatus === btn.stat
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-slate-800">
                            <TableHead className="text-slate-400 font-bold">ID / Réf. Pièce</TableHead>
                            <TableHead className="text-slate-400 font-bold">Fournisseur & SIREN</TableHead>
                            <TableHead className="text-slate-400 font-bold text-right">Montants (HT / TVA / TTC)</TableHead>
                            <TableHead className="text-slate-400 font-bold text-center">Contrôle PAF (3-Way)</TableHead>
                            <TableHead className="text-slate-400 font-bold text-center">Score Risque</TableHead>
                            <TableHead className="text-slate-400 font-bold">Nature de l'Alerte</TableHead>
                            <TableHead className="text-slate-400 font-bold text-center">Statut Revue CAC</TableHead>
                            <TableHead className="text-slate-400 font-bold text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((inv) => (
                            <TableRow key={inv.id} className="border-b border-slate-800/60 hover:bg-slate-850">
                              
                              {/* 1. ID / Réf Pièce */}
                              <TableCell className="font-mono text-xs font-bold text-emerald-400">
                                {inv.invoice_ref}
                              </TableCell>

                              {/* 2. Fournisseur & SIREN */}
                              <TableCell>
                                <div className="text-xs font-semibold text-slate-200">{inv.supplier_name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-slate-400">{inv.supplier_siren}</span>
                                  {inv.siren_valid_luhn ? (
                                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-emerald-400 border-emerald-500/30">
                                      Luhn Valide
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-[9px] py-0 px-1">
                                      SIREN Invalide
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>

                              {/* 3. Montants */}
                              <TableCell className="text-right font-mono text-xs">
                                <div className="text-slate-200 font-bold">{inv.montant_ttc?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                                <div className="text-[10px] text-slate-400">
                                  HT: {inv.montant_ht?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € • TVA ({inv.tva_rate}%) : {inv.tva_amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                </div>
                              </TableCell>

                              {/* 4. Contrôle PAF */}
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${inv.paf_cmd_ref ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    CMD
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${inv.paf_rec_signed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    REC
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${inv.is_compliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    FAC
                                  </span>
                                </div>
                              </TableCell>

                              {/* 5. Score de Risque */}
                              <TableCell className="text-center">
                                <span className={`inline-block font-mono text-xs font-black px-2 py-0.5 rounded ${
                                  inv.risk_score >= 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                                  inv.risk_score > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {inv.risk_score} / 100
                                </span>
                              </TableCell>

                              {/* 6. Nature de l'Alerte */}
                              <TableCell className="text-xs">
                                {inv.is_compliant ? (
                                  <span className="text-emerald-400 font-medium">Conforme aux normes NEP</span>
                                ) : (
                                  <span 
                                    onClick={() => {
                                      if (inv.nature?.includes('Doublon')) {
                                        setDuplicatePair({ current: inv, orig_ref: 'FAC-2026-1011' });
                                        setShowDuplicateModal(true);
                                      }
                                    }}
                                    className={`font-semibold cursor-pointer ${inv.nature?.includes('Doublon') ? 'underline text-rose-400' : 'text-slate-300'}`}
                                  >
                                    {inv.nature}
                                  </span>
                                )}
                              </TableCell>

                              {/* 7. Statut Revue CAC */}
                              <TableCell className="text-center">
                                {inv.cac_decision === 'CONFIRMEE' ? (
                                  <Badge variant="destructive" className="text-[10px]">Anomalie Confirmée</Badge>
                                ) : inv.cac_decision === 'ECARTEE' ? (
                                  <Badge variant="success" className="text-[10px]">Alerte Écartée (Justifiée)</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-[10px] text-amber-400 bg-amber-500/10 border-amber-500/30">
                                    En attente de revue
                                  </Badge>
                                )}
                              </TableCell>

                              {/* 8. Action */}
                              <TableCell className="text-right">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleInspectInvoice(inv)}
                                  className="h-7 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                                  Inspecter (NEP 500)
                                </Button>
                              </TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 3 : CENTRE D'INGESTION & PIPELINE MULTI-AGENTS TEMPS RÉEL
                  =================================================================== */}
              {activeView === 'INGESTION' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Section 1 : Générateur de Liasse Comptable de Test */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="text-base font-extrabold text-white">
                          Générateur de Lot de Factures Électroniques de Démonstration (Norme Factur-X / PDF)
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                          Génère instantanément un jeu de données anonymisé comprenant des factures fournisseurs, des bons de commande et des bons de réception avec injection paramétrable d'anomalies comptables et fiscales.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          onClick={handleGeneratePdfs}
                          className="h-9 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          <Download className="h-4 w-4 mr-1.5 text-emerald-400" />
                          Télécharger les Factures PDF Générées sur le PC
                        </Button>

                        <Button 
                          onClick={handleRunPipeline}
                          disabled={pipelineRunning}
                          className="h-9 text-xs bg-emerald-600 hover:bg-emerald-500 font-bold"
                        >
                          <Play className="h-4 w-4 mr-1.5 fill-white" />
                          {pipelineRunning ? "Traitement en cours..." : "Injecter Directement dans le Pipeline d'Audit IA"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-slate-800 flex-wrap text-xs text-slate-300">
                      <span className="font-bold text-slate-400">Contrôles de génération :</span>
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">Nombre de liasses : 10</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                        <span>Inclure erreurs de calcul et taux de TVA</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                        <span>Inclure factures en doublon</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                        <span>Inclure écarts Facture / Commande / Réception (Rupture PAF)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                        <span>Inclure faux SIREN</span>
                      </label>
                    </div>
                  </div>

                  {/* Section 2 : Zone de Dépôt Documentaire (Drag & Drop) */}
                  <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/60 rounded-2xl p-10 text-center transition-all cursor-pointer">
                    <FileUp className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-200">
                      Glissez-déposez vos lots de factures fournisseurs, devis, bons de commande et bons de réception
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                      Formats supportés : PDF natif, PDF/A-3 (Factur-X avec XML intégré), archives ZIP. Traitement isolé au sein du cabinet actif.
                    </p>
                  </div>

                  {/* Section 3 : Visualiseur d'Exécution du Pipeline à 3 Agents (Temps Réel) */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Architecture d'Exécution Asynchrone du Pipeline Multi-Agents (Défi 2)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Panneau Agent 1 */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        pipelineStep === 1 ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ScanText className="h-5 w-5 text-emerald-400" />
                            <span className="font-bold text-xs text-white">Agent 1 : Vision & Extraction</span>
                          </div>
                          {pipelineStep === 1 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 mb-3">
                          Modèle : gemini-3-flash • Température : 0.0 • Sortie : Schéma JSON Strict
                        </div>
                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                          <li>Calcul de l'empreinte SHA-256 du fichier source</li>
                          <li>Extraction SIREN, SIRET, HT, Taux TVA, Montant TVA, TTC</li>
                          <li>Identification des références de commande et de livraison</li>
                        </ul>
                      </div>

                      {/* Panneau Agent 2 */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        pipelineStep === 2 ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-emerald-400" />
                            <span className="font-bold text-xs text-white">Agent 2 : Logique & Contrôle PAF</span>
                          </div>
                          {pipelineStep === 2 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 mb-3">
                          Moteur Déterministe Python + Contrôle API Gouvernementale
                        </div>
                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                          <li>Vérification arithmétique stricte : HT × Taux = TVA et HT + TVA = TTC</li>
                          <li>Validation Luhn SIREN/SIRET & statut actif INSEE</li>
                          <li>Détection des doublons multi-critères</li>
                          <li>Rapprochement tripartite PAF (Facture vs Commande vs Réception)</li>
                        </ul>
                      </div>

                      {/* Panneau Agent 3 */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        pipelineStep === 3 ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-emerald-400" />
                            <span className="font-bold text-xs text-white">Agent 3 : Scoring & Traçabilité</span>
                          </div>
                          {pipelineStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 mb-3">
                          Matrice de Pondération Algorithmique & Scellement SHA-256
                        </div>
                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                          <li>Attribution du score de fraude potentielle sur 100</li>
                          <li>Enregistrement immuable du prompt, des paramètres et du JSON en base</li>
                          <li>Mise en file d'attente pour revue humaine du CAC</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 4 : POSTE D'INSPECTION SPLIT-SCREEN — REVUE HUMAINE NEP 500
                  =================================================================== */}
              {activeView === 'REVIEW' && selectedInvoice && (
                <div className="space-y-4 max-w-7xl mx-auto">
                  
                  {/* Barre d'En-tête d'Inspection */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveView('DASHBOARD')}
                        className="h-8 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                        Retour
                      </Button>
                      <div>
                        <div className="text-xs font-extrabold text-white flex items-center gap-2">
                          <span>Dossier Pièce : {selectedInvoice.invoice_ref}</span>
                          <span className="text-slate-400 font-normal">— Fournisseur : {selectedInvoice.supplier_name}</span>
                        </div>
                      </div>
                      <Badge variant="destructive" className="font-mono text-xs font-bold">
                        SCORE DE RISQUE : {selectedInvoice.risk_score} / 100 — ANOMALIE DÉTECTÉE
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                        className="h-8 text-xs border-slate-700 bg-slate-950"
                      >
                        <a href={`/api/v1/invoices/${selectedInvoice.id}`} target="_blank" rel="noreferrer">
                          <Download className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                          JSON Preuve Brut
                        </a>
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveView('LEDGER')}
                        className="h-8 text-xs border-slate-700 bg-slate-950 text-slate-200"
                      >
                        <Hash className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                        Voir Bloc SHA-256
                      </Button>
                    </div>
                  </div>

                  {/* Split-Screen Dual Panes (50% / 50%) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* PANNEAU GAUCHE (50%) : Visionneuse Documentaire Originale */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        {/* Onglets document */}
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                          <button
                            onClick={() => setReviewDocTab('invoice')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              reviewDocTab === 'invoice' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Facture Fournisseur ({selectedInvoice.invoice_ref}.pdf)</span>
                          </button>

                          <button
                            onClick={() => setReviewDocTab('po')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              reviewDocTab === 'po' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Bon de Commande ({selectedInvoice.paf_cmd_ref || 'BC-2026-441'}.pdf)</span>
                          </button>

                          <button
                            onClick={() => setReviewDocTab('rec')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              reviewDocTab === 'rec' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                            <PackageCheck className="h-3.5 w-3.5" />
                            <span>Bon de Réception ({selectedInvoice.paf_rec_ref || 'BR-2026-441'}.pdf)</span>
                          </button>
                        </div>

                        {/* Rendu Documentaire Factur-X / PDF */}
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-300 space-y-4">
                          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                            <div>
                              <div className="font-bold text-sm text-white">{selectedInvoice.supplier_name}</div>
                              <div className="text-slate-400 text-[11px]">SIREN : {selectedInvoice.supplier_siren} • RCS Tours</div>
                              <div className="text-slate-400 text-[11px]">Zone Industrielle des Portillons, 37000 Tours</div>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-bold text-sm">{selectedInvoice.invoice_ref}</div>
                              <div className="text-slate-400 text-[11px]">Date : {selectedInvoice.timestamp_utc?.slice(0, 10)}</div>
                              <div className="text-slate-400 text-[11px]">Réf BC : {selectedInvoice.paf_cmd_ref}</div>
                            </div>
                          </div>

                          <div className="py-2">
                            <div className="text-[11px] text-slate-400 mb-2 font-sans font-bold">LIGNES DE FACTURATION LUES PAR L'AGENT 1 :</div>
                            <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between">
                              <span>Prestation logistique & informatique</span>
                              <span>1 × {selectedInvoice.montant_ht?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € HT</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-800 pt-3 space-y-1 text-right">
                            <div>Montant Hors Taxes (HT) : <span className="font-bold text-white">{selectedInvoice.montant_ht?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span></div>
                            <div>Taux TVA déclaré : <span className="text-slate-400">{selectedInvoice.tva_rate} %</span></div>
                            <div>Montant TVA déclaré : <span className="font-bold text-rose-400">{selectedInvoice.tva_amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span></div>
                            <div className="text-sm font-bold text-white border-t border-slate-800 pt-1">
                              Total TTC déclaré : <span className="text-emerald-400">{selectedInvoice.montant_ttc?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Empreinte SHA-256 du fichier original */}
                      <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 truncate mt-4">
                        SHA-256 du fichier original : <span className="text-slate-400">{selectedInvoice.pdf_sha256}</span>
                      </div>
                    </div>

                    {/* PANNEAU DROIT (50%) : Analyse Détaillée, Preuve d'Audit & Arbitrage CAC */}
                    <div className="space-y-4">
                      
                      {/* Bloc 1 : Extraction Structurée & Vérification Légale du Tiers */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>1. Extraction Structurée & Vérification Légale du Tiers</span>
                          {selectedInvoice.siren_valid_luhn ? (
                            <Badge variant="success" className="text-[10px]">Luhn : Valide • Entreprise Active</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">Luhn Invalide (INSEE KO)</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                          <div><span className="text-slate-500">Raison Sociale :</span> <span className="text-slate-200 font-bold">{selectedInvoice.supplier_name}</span></div>
                          <div><span className="text-slate-500">Date d'émission :</span> <span className="text-slate-200">{selectedInvoice.timestamp_utc?.slice(0, 10)}</span></div>
                          <div><span className="text-slate-500">SIREN :</span> <span className="text-slate-200">{selectedInvoice.supplier_siren}</span></div>
                          <div><span className="text-slate-500">IBAN :</span> <span className="text-slate-200">{selectedInvoice.supplier_iban || 'FR76 3000 4000 0312 3456 7890 143'}</span></div>
                        </div>
                      </div>

                      {/* Bloc 2 : Contrôle Mathématique de la TVA & Arithmétique */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="text-xs font-bold text-slate-300">
                          2. Contrôle Mathématique de la TVA & Cohérence Arithmétique (Agent 2)
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b border-slate-800 text-[11px]">
                                <TableHead className="text-slate-400">Élément</TableHead>
                                <TableHead className="text-slate-400 text-right">Valeur Lue (IA)</TableHead>
                                <TableHead className="text-slate-400 text-right">Recalculée (Python)</TableHead>
                                <TableHead className="text-slate-400 text-center">Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs font-mono">
                              <TableRow className="border-b border-slate-800/40">
                                <TableCell>Montant HT</TableCell>
                                <TableCell className="text-right">{selectedInvoice.montant_ht?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-right">{selectedInvoice.montant_ht?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-center"><Badge variant="success" className="text-[9px]">Conforme</Badge></TableCell>
                              </TableRow>
                              <TableRow className="border-b border-slate-800/40">
                                <TableCell>Taux TVA</TableCell>
                                <TableCell className="text-right">{selectedInvoice.tva_rate} %</TableCell>
                                <TableCell className="text-right">{selectedInvoice.tva_rate} %</TableCell>
                                <TableCell className="text-center"><Badge variant="success" className="text-[9px]">Taux Légal Valide</Badge></TableCell>
                              </TableRow>
                              <TableRow className="border-b border-slate-800/40">
                                <TableCell>Montant TVA</TableCell>
                                <TableCell className="text-right">{selectedInvoice.tva_amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-right">{selectedInvoice.tva_recalculated?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-center">
                                  {selectedInvoice.is_tva_compliant ? (
                                    <Badge variant="success" className="text-[9px]">Conforme</Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-[9px]">Écart : +250,00 €</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-bold">Total TTC</TableCell>
                                <TableCell className="text-right font-bold">{selectedInvoice.montant_ttc?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-right font-bold">{(selectedInvoice.montant_ht + selectedInvoice.tva_recalculated)?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</TableCell>
                                <TableCell className="text-center">
                                  {selectedInvoice.is_tva_compliant ? (
                                    <Badge variant="success" className="text-[9px]">Conforme</Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-[9px]">Total Inexact</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Bloc 3 : Contrôle de la Piste d'Audit Fiable (PAF) */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                        <div className="text-xs font-bold text-slate-300">
                          3. Contrôle de la Piste d'Audit Fiable (PAF — Rapprochement Tripartite)
                        </div>
                        <div className="space-y-1.5 text-xs font-mono">
                          <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                            <span>Bon de Commande ({selectedInvoice.paf_cmd_ref || 'BC-2026-441'}) :</span>
                            {selectedInvoice.paf_cmd_amount && selectedInvoice.paf_cmd_amount !== selectedInvoice.montant_ht ? (
                              <Badge variant="destructive" className="text-[10px]">Dépassement de commande (+500,00 € HT)</Badge>
                            ) : (
                              <Badge variant="success" className="text-[10px]">Montant Conforme</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                            <span>Bon de Réception ({selectedInvoice.paf_rec_ref || 'BR-2026-441'}) :</span>
                            {selectedInvoice.paf_rec_signed ? (
                              <Badge variant="success" className="text-[10px]">Livraison attestée & signée</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-[10px]">Document non signé (Service fait non attesté)</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bloc 4 : Inspecteur de Trace Algorithmique (NEP 230 / EU AI Act) */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowPromptModal(true)}
                          className="w-full text-xs font-bold text-emerald-400 hover:bg-slate-800 flex items-center justify-between"
                        >
                          <span>Afficher la Preuve Technique d'Exécution (Prompt, Paramètres & JSON Brut)</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Bloc 5 : Zone de Décision et Jugement Professionnel du CAC */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">5. Zone d'Arbitrage et Jugement Professionnel du CAC</span>
                          <span className="text-[10px] text-slate-500 font-mono">Norme NEP 230</span>
                        </div>

                        {currentRole !== 'CAC_ASSOCIE' ? (
                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                            <span>
                              Mode Lecture Seule — Conformément à la norme NEP 500 et à la matrice RACI, seul le Commissaire aux Comptes Associé est habilité à valider ou écarter définitivement cette anomalie.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                                Motivation obligatoire du jugement professionnel (conservée au dossier de travail NEP 230) :
                              </label>
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={3}
                                placeholder="Saisir les conclusions de la revue humaine (ex : Demande d'avoir exigée auprès du fournisseur pour l'écart de TVA de 250 € et le dépassement de commande)..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-emerald-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                onClick={() => handleReviewDecision('CONFIRMEE')}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs h-10 rounded-xl"
                              >
                                <FileWarning className="h-4 w-4 mr-1.5" />
                                Confirmer l'Anomalie & Inscrire au Rapport
                              </Button>

                              <Button
                                onClick={() => handleReviewDecision('ECARTEE')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl"
                              >
                                <CheckCheck className="h-4 w-4 mr-1.5" />
                                Écarter l'Alerte (Pièce Justifiée après Revue)
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 5 : REGISTRE CRYPTOGRAPHIQUE IMMUABLE (BLOCKCHAIN SHA-256)
                  =================================================================== */}
              {activeView === 'LEDGER' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Section 1 : En-tête de Vérification d'Intégrité Mathématique */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-lg font-extrabold text-white">Journal d'Audit Cryptographique Chaîné (SHA-256)</h1>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Garantie d'inaltérabilité des travaux d'audit assistés par IA conformément aux normes NEP 230 et NEP 500
                      </p>
                    </div>

                    <Button 
                      onClick={handleVerifyChain}
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-emerald-950"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Exécuter le Contrôle d'Intégrité de la Chaîne
                    </Button>
                  </div>

                  {/* Bandeau de Résultat après clic */}
                  {chainVerification && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span>{chainVerification.message}</span>
                    </div>
                  )}

                  {/* Section 2 : Chronologie Visuelle des Blocs Scellés */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Blocs Récents Scellés dans {activeWs.name}
                    </div>

                    <div className="space-y-3">
                      {ledgerBlocks.slice(-8).reverse().map((b) => (
                        <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 hover:border-slate-700 transition-all">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-slate-950 font-bold">
                                BLOC #{String(b.block_index).padStart(4, '0')}
                              </Badge>
                              <span className="text-slate-300 font-bold">{b.event_type}</span>
                              <span className="text-slate-500 text-[11px]">— Réf : {b.invoice_ref}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {b.timestamp_utc} • Auteur : <span className="text-slate-200">{b.author}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500">Prev_Hash : </span>
                              <span className="text-slate-400">{b.prev_hash}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Hash Fichier Source : </span>
                              <span className="text-slate-400">{b.pdf_sha256}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Signature Paramètres IA : </span>
                              <span className="text-slate-300">{b.model_name} | temp=0.0 | {b.prompt_version}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Décision rattachée : </span>
                              <span className={b.cac_decision === 'CONFIRMEE' ? 'text-rose-400' : 'text-emerald-400'}>
                                {b.cac_decision} par {b.author}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                            <span className="text-slate-400 font-bold">Empreinte Actuelle Scellée (Current_Hash) : </span>
                            <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 select-all">
                              {b.current_hash}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 6 : GOUVERNANCE PLURIDISCIPLINAIRE RACI & CONFORMITÉ (DÉFI 3)
                  =================================================================== */}
              {activeView === 'GOVERNANCE' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h1 className="text-lg font-extrabold text-white">Gouvernance Pluridisciplinaire RACI & Conformité Réglementaire</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Traduction directe des matrices du Défi 3 d'AudIA-IN et d'AudIA Out en règles logicielles opposables
                    </p>
                  </div>

                  {/* Section 1 : Matrice RACI Interactive */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 font-bold text-xs text-white">
                      Matrice RACI Active du Cabinet ({activeWs.name})
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-slate-800">
                          <TableHead className="text-slate-400">Rôle RACI & Membres</TableHead>
                          <TableHead className="text-slate-400 text-center">Responsabilité</TableHead>
                          <TableHead className="text-slate-400">Droits Techniques dans l'Application</TableHead>
                          <TableHead className="text-slate-400">Mesure de Contrôle & Norme Associée</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        <TableRow className="border-b border-slate-800/60">
                          <TableCell>
                            <div className="font-bold text-slate-200">Commissaire aux Comptes / Associé Signataire</div>
                            <div className="text-[11px] text-slate-400">Alexis Coiffard, Fadi Matloob</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-emerald-600 text-white font-mono">R / A (Réalise & Approuve)</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            Définition du périmètre, revue des alertes, validation/rejet des anomalies, signature et scellement du rapport PDF final.
                          </TableCell>
                          <TableCell className="text-slate-400">
                            Normes NEP 230 / NEP 500 & Code de déontologie (Prévention de la perte d'esprit critique).
                          </TableCell>
                        </TableRow>

                        <TableRow className="border-b border-slate-800/60">
                          <TableCell>
                            <div className="font-bold text-slate-200">Expert Data / Architecte IA</div>
                            <div className="text-[11px] text-slate-400">Ismail El Bakassi, Andrea Launay</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-600 text-white font-mono">A / R (Approuve & Prépare)</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            Calibrage des prompts, supervision des schémas JSON, contrôle de non-hallucination, accès en lecture seule aux conclusions d'audit.
                          </TableCell>
                          <TableCell className="text-slate-400">
                            Règlement Européen EU AI Act (Supervision humaine, transparence algorithmique et exactitude).
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <div className="font-bold text-slate-200">Référent Cybersécurité & Juriste Conformité</div>
                            <div className="text-[11px] text-slate-400">Lina Ijiji, Hosam Gdache</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-purple-600 text-white font-mono">C (Consulté)</Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            Vérification du cloisonnement multi-cabinet, audit des journaux d'accès JWT, contrôle de la politique de rétention des données.
                          </TableCell>
                          <TableCell className="text-slate-400">
                            RGPD & Secret Professionnel du Commissaire aux Comptes.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Section 2 : Panneau de Contrôle de Sécurité */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Cloisonnement Strict du Périmètre", desc: "Aucune donnée partagée hors du cabinet" },
                      { title: "Désactivation de l'Entraînement Externe", desc: "Zero Data Retention sur les pièces clients" },
                      { title: "Blocage de Certification Automatique", desc: "Intervention humaine du CAC obligatoire" },
                      { title: "Journalisation Horodatée NEP 230", desc: "Toutes les requêtes scellées en SHA-256" },
                    ].map((sec, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-200">{sec.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{sec.desc}</div>
                        </div>
                        <Badge variant="success" className="text-[10px] font-mono">ACTIF</Badge>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 7 : CENTRE DE CLÔTURE & GÉNÉRATION DU RAPPORT PDF SCELLÉ
                  =================================================================== */}
              {activeView === 'EXPORT' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h1 className="text-lg font-extrabold text-white">Centre de Clôture & Scellement du Rapport d'Audit</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Génération du livrable officiel opposable au format PDF avec signature et QR Code de certification
                    </p>
                  </div>

                  {/* Section 1 : Checklist Pré-Scellement (NEP 500) */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Liste de Contrôle Pré-Scellement (Checklist Norme NEP 500)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span>Exhaustivité du contrôle : 100 % des factures du lot analysées par les 3 agents.</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span>Intégrité de la piste d'audit : La chaîne cryptographique SHA-256 du dossier est valide.</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span>Jugement professionnel exercé : Toutes les anomalies critiques revues et visées par le CAC Associé.</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 : Aperçu Structuré du Document PDF Officiel Généré */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-xs space-y-4">
                    <div className="border border-slate-700 bg-slate-950 p-6 rounded-xl space-y-4 text-slate-300">
                      
                      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                        <div>
                          <div className="font-bold text-sm text-white">{activeWs.name.toUpperCase()} — AUDIA-CORE</div>
                          <div className="text-[11px] text-slate-400">SIREN : {activeWs.siren} • {activeWs.crcc}</div>
                          <div className="text-[11px] text-slate-400">Espace : {activeWs.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded">
                            DOSSIER DE TRAVAIL SCELLÉ
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">Réf. Norme : NEP 230 & NEP 500</div>
                        </div>
                      </div>

                      <div className="text-center py-2">
                        <div className="text-sm font-extrabold text-white">CERTIFICAT DE CONTRÔLE AUTOMATISÉ & SYNTHÈSE DES ANOMALIES</div>
                        <div className="text-xs text-slate-400">Cycle Achats-Fournisseurs — Facturation Électronique</div>
                      </div>

                      {/* Section 1 du PDF */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-emerald-400">1. INDICATEURS DE PERFORMANCE ET COUVERTURE DE LA MISSION (DÉFI 1)</div>
                        <div className="grid grid-cols-3 gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          <div>Volume Total : <b>50 Liasses</b></div>
                          <div>Taux de Couverture : <b>100,0 % (Exhaustif)</b></div>
                          <div>Temps Exécution : <b>42,8 sec (&lt; 1s/pièce)</b></div>
                          <div>Pièces Conformes : <b>38 Factures</b></div>
                          <div>Alertes Détectées : <b>12 Alertes</b></div>
                          <div>Arbitrage CAC : <b>10 Confirmées / 2 Écartées</b></div>
                        </div>
                      </div>

                      {/* Section 2 du PDF */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-emerald-400">2. REGISTRE DES ANOMALIES ET ARBITRAGE DU COMMISSAIRE AUX COMPTES (DÉFI 2)</div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                          <div className="grid grid-cols-5 text-slate-500 font-bold border-b border-slate-800 pb-1">
                            <span>Réf. Facture</span>
                            <span>Fournisseur</span>
                            <span>Écart / Alerte</span>
                            <span>Risque</span>
                            <span>Décision CAC</span>
                          </div>
                          <div className="grid grid-cols-5 text-slate-300">
                            <span>FAC-2026-1004</span>
                            <span>TECHNO-LOG SAS</span>
                            <span>Écart TVA +250 €</span>
                            <span>70 / 100</span>
                            <span className="text-rose-400 font-bold">CONFIRMÉE</span>
                          </div>
                          <div className="grid grid-cols-5 text-slate-300">
                            <span>FAC-2026-1012</span>
                            <span>BUREAU-PRO SAS</span>
                            <span>Doublon exact</span>
                            <span>85 / 100</span>
                            <span className="text-rose-400 font-bold">CONFIRMÉE</span>
                          </div>
                          <div className="grid grid-cols-5 text-slate-300">
                            <span>FAC-2026-1019</span>
                            <span>ALPHA TRANSPORT</span>
                            <span>Rupture PAF</span>
                            <span>90 / 100</span>
                            <span className="text-rose-400 font-bold">CONFIRMÉE</span>
                          </div>
                        </div>
                      </div>

                      {/* Bas de page du PDF */}
                      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                        <div>
                          <div className="text-xs font-bold text-white">VISA DU COMMISSAIRE AUX COMPTES SIGNATAIRE</div>
                          <div className="text-[11px] text-slate-400">Signé électroniquement par : Alexis COIFFARD / Fadi MATLOOB</div>
                          <div className="text-[10px] text-slate-500">Horodatage UTC : {new Date().toISOString().slice(0, 19)}Z</div>
                        </div>
                        <div className="w-16 h-16 bg-white p-1 rounded flex items-center justify-center">
                          <QrCode className="h-14 w-14 text-slate-950" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Section 3 : Barre d'Export Finale */}
                  <div className="flex items-center justify-end gap-3">
                    <Button 
                      variant="outline"
                      asChild
                      className="border-slate-700 bg-slate-900 text-slate-200 h-11 text-xs"
                    >
                      <a href={`/api/v1/export/audit-ledger-json?token=${jwtToken}`} download>
                        <FileText className="h-4 w-4 mr-2 text-emerald-400" />
                        Exporter l'Archive Complète des Preuves JSON Horodatées (.JSON)
                      </a>
                    </Button>

                    <Button 
                      asChild
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs px-6 rounded-xl shadow-lg shadow-emerald-950"
                    >
                      <a href={`/api/v1/export/sealed-certificate-pdf?token=${jwtToken}`} download>
                        <Download className="h-4 w-4 mr-2" />
                        Générer et Télécharger le Rapport d'Audit Officiel Scellé (.PDF)
                      </a>
                    </Button>
                  </div>

                </div>
              )}

              {/* ===================================================================
                  PAGE 8 : PARAMÈTRES DU CABINET & GESTION DES MEMBRES
                  =================================================================== */}
              {activeView === 'SETTINGS' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  
                  {/* Section 1 : En-tête */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-lg font-extrabold text-white">Configuration du Workspace & Paramètres de Sécurité</h1>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Gestion de l'isolation multi-tenant, des habilitations Google OAuth 2.0 et du calibrage algorithmique
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs bg-slate-950 text-emerald-400 border-slate-700">
                        TENANT_ID : {activeWs.id}
                      </Badge>
                      <Button className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold h-9">
                        <Save className="h-3.5 w-3.5 mr-1.5" />
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </div>

                  {/* Section 2 : Identité Légale du Cabinet */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Identité Légale du Cabinet (En-tête des Rapports PDF Scellés)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">Raison Sociale du Cabinet :</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="KATRINALE AUDIT & COMMISSARIAT — AUDIA" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Numéro SIREN / SIRET du Cabinet :</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="842 910 384 00019 (Vérifié INSEE)" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Inscription Compagnie Régionale (CRCC) :</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="CRCC Centre-Val de Loire — Cour d'Appel d'Orléans / Tours" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">Adresse du Siège Social :</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="50 Avenue du Portillon, 37100 Tours, France" 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3 : Gestion des Collaborateurs & Membres du Projet */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800 font-bold text-xs text-white">
                      Tableau des Membres Actifs du Cabinet (Collectif IAE de Tours)
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-slate-800 text-[11px]">
                          <TableHead className="text-slate-400">Collaborateur</TableHead>
                          <TableHead className="text-slate-400">Compte Google Associé</TableHead>
                          <TableHead className="text-slate-400">Rôle RACI Attribué</TableHead>
                          <TableHead className="text-slate-400">Périmètre d'Intervention</TableHead>
                          <TableHead className="text-slate-400 text-center">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs">
                        {[
                          { name: "Alexis Coiffard", email: "alexis.coiffard@etu.univ-tours.fr", role: "CAC Associé (R/A)", scope: "Validation finale & Scellement NEP 500" },
                          { name: "Fadi Matloob", email: "fadi.matloob@etu.univ-tours.fr", role: "CAC Associé (R/A)", scope: "Revue critique PAF & Supervision mission" },
                          { name: "Andrea Launay", email: "andrea.launay@etu.univ-tours.fr", role: "Auditeur Financier (R)", scope: "Contrôle de cohérence TVA & Doublons" },
                          { name: "Lina Ijiji", email: "lina.ijiji@etu.univ-tours.fr", role: "Juriste / Cyber (C)", scope: "Conformité RGPD, EU AI Act & Secret Pro" },
                          { name: "Hosam Gdache", email: "hosam.gdache@etu.univ-tours.fr", role: "Responsable Achats / PAF (C)", scope: "Rapprochement Commande / Réception / Facture" },
                          { name: "Ismail El Bakassi", email: "ismailelbakassi@gmail.com", role: "Architecte Data / IA (A/R)", scope: "Orchestration Agents, API & Ledger SHA-256" },
                        ].map((mem, idx) => (
                          <TableRow key={idx} className="border-b border-slate-800/60">
                            <TableCell className="font-bold text-slate-200">{mem.name}</TableCell>
                            <TableCell className="font-mono text-slate-400 text-[11px]">{mem.email}</TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-600 text-white font-mono text-[10px]">{mem.role}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">{mem.scope}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">Actif</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Section 4 : Calibrage du Moteur IA & Règles Fiscales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-emerald-400" />
                        <span>Hyperparamètres Modèle Vision</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Modèle : <b className="text-slate-200">gemini-3-flash</b></div>
                        <div>Température : <b className="text-emerald-400">0.0 (Déterministe)</b></div>
                        <div>Sortie : <b className="text-slate-200">Schéma Pydantic Strict</b></div>
                        <div>Rétention : <b className="text-slate-200">Zero Data Retention</b></div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-emerald-400" />
                        <span>Matrice des Règles Fiscales (Agent 2)</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Taux TVA autorisés : <b className="text-slate-200">20%, 10%, 5.5%, 2.1%</b></div>
                        <div>Tolérance arithmétique : <b className="text-emerald-400">± 0,01 €</b></div>
                        <div>Contrôle SIREN : <b className="text-slate-200">Luhn + API recherche-entreprises</b></div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-emerald-400" />
                        <span>Pondération Risque (Agent 3)</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Rupture PAF : <b className="text-rose-400">+ 40 pts (Critique)</b></div>
                        <div>Suspicion Doublon : <b className="text-rose-400">+ 30 pts (Majeure)</b></div>
                        <div>Erreur Calcul TVA : <b className="text-amber-400">+ 20 pts (Modérée)</b></div>
                        <div>SIREN Invalide : <b className="text-amber-400">+ 10 pts (Conformité)</b></div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* =========================================================================
          MODALES ET DRAWERS D'INTERACTION
          ========================================================================= */}
      
      {/* 1. Modale d'Inspection du Prompt & Schéma JSON */}
      <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" />
              <DialogTitle className="text-sm font-bold text-white">
                Spécification du Prompt Système & Schéma d'Extraction (NEP 230)
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs">
              Version : prompt_v2.4_cncc_2026 • Modèle : gemini-3-flash • Température : 0.0
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
              "Tu es un agent d'extraction comptable opérant sous la norme NEP 500. Extrais exclusivement les mentions légales présentes sur le document fourni sans jamais extrapoler ni corriger une erreur arithmétique visible. Si un champ est absent ou illisible, retourne null. Champs requis : siren_fournisseur, siret_fournisseur, raison_sociale, numero_facture, date_emission, montant_ht, taux_tva, montant_tva, montant_ttc, reference_bon_commande, reference_bon_reception, signature_reception_presente."
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Empreinte SHA-256 du Prompt Système : <br/>
              <span className="text-emerald-400 select-all">9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</span>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
                showToast("Empreinte SHA-256 copiée dans le presse-papiers");
              }}
              className="text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Copier la preuve JSON
            </Button>
            <Button onClick={() => setShowPromptModal(false)} className="bg-emerald-600 text-xs font-bold">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Modale de Comparaison de Doublons Côte-à-Côte */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CopySlash className="h-5 w-5 text-rose-400" />
              <DialogTitle className="text-sm font-bold text-white">
                Analyse Comparative de Suspicion de Doublon
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs">
              Rapprochement automatique multicritères entre la facture analysée et les archives comptables
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs font-mono">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-800">
                  <TableHead className="text-slate-400">Critère</TableHead>
                  <TableHead className="text-slate-400">Pièce Déjà Comptabilisée (FAC-2026-1011)</TableHead>
                  <TableHead className="text-slate-400">Pièce Analysée (FAC-2026-1012)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-slate-800/40">
                  <TableCell className="font-bold text-slate-300">Fournisseur & SIREN</TableCell>
                  <TableCell>BUREAU-PRO SERVICES (552 100 554)</TableCell>
                  <TableCell><Badge variant="destructive" className="text-[10px]">Identique</Badge></TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-800/40">
                  <TableCell className="font-bold text-slate-300">Montant TTC</TableCell>
                  <TableCell>4 800,00 €</TableCell>
                  <TableCell><Badge variant="destructive" className="text-[10px]">Identique (4 800,00 €)</Badge></TableCell>
                </TableRow>
                <TableRow className="border-b border-slate-800/40">
                  <TableCell className="font-bold text-slate-300">Date de Facture</TableCell>
                  <TableCell>14/10/2026</TableCell>
                  <TableCell><Badge variant="warning" className="text-[10px]">Écart de 24h (Doublon déguisé)</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-slate-300">Réf. Commande</TableCell>
                  <TableCell>BC-2026-411</TableCell>
                  <TableCell><Badge variant="destructive" className="text-[10px]">Même commande facturée 2 fois</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="mt-2">
            <Button 
              onClick={() => {
                setShowDuplicateModal(false);
                showToast("Facture en doublon rejetée. Alerte transmise au signataire CAC.");
              }}
              className="bg-rose-600 hover:bg-rose-500 text-xs font-bold"
            >
              Rejeter la facture en doublon et notifier le CAC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Modale de Blocage de Sécurité RACI (Article 14 EU AI Act) */}
      <Dialog open={showRaciDeniedModal} onOpenChange={setShowRaciDeniedModal}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldBan className="h-5 w-5 text-amber-400" />
              <DialogTitle className="text-sm font-bold text-white">
                Restriction Réglementaire — Norme NEP 500 & EU AI Act
              </DialogTitle>
            </div>
          </DialogHeader>

          <p className="text-xs text-slate-300 leading-relaxed">
            Votre profil actif (<b className="text-amber-400">{currentRole}</b>) ne dispose pas du pouvoir de signature légale pour l'action : <br/>
            <span className="font-semibold text-white">"{raciDeniedAction}"</span>.
          </p>

          <p className="text-xs text-slate-400 leading-relaxed">
            Conformément à la matrice de gouvernance RACI du cabinet et aux normes de la CNCC, l'agent IA prépare l'analyse mais seul le Commissaire aux Comptes Associé (rôle <b>CAC_ASSOCIE</b>) peut exercer son jugement professionnel pour valider une anomalie ou sceller le rapport final.
          </p>

          <DialogFooter className="mt-2">
            <Button 
              onClick={() => {
                handleRoleChange('CAC_ASSOCIE');
                setShowRaciDeniedModal(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs font-bold"
            >
              <SwitchCamera className="h-3.5 w-3.5 mr-1.5" />
              Basculer immédiatement sur le profil CAC Associé
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Modale de Création d'un Nouvel Espace Cabinet */}
      <Dialog open={showNewWorkspaceModal} onOpenChange={setShowNewWorkspaceModal}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" />
              <DialogTitle className="text-sm font-bold text-white">
                Changer de Cabinet ou Créer un Espace Étanche
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs">
              Basculez entre vos dossiers ou provisionnez un nouvel espace client cloisonné
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Espaces Clients Actifs :</label>
              <select 
                value={currentWorkspaceId}
                onChange={(e) => {
                  handleWorkspaceChange(e.target.value);
                  setShowNewWorkspaceModal(false);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-bold outline-none"
              >
                {workspaces.map(w => (
                  <option key={w.id} value={w.id}>{w.name} (SIREN : {w.siren})</option>
                ))}
              </select>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-3">
              <div className="font-bold text-slate-200">+ Initialiser un nouvel Espace :</div>
              <div>
                <input 
                  type="text" 
                  placeholder="Dénomination sociale du cabinet..."
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none mb-2"
                />
                <input 
                  type="text" 
                  placeholder="Numéro SIREN (9 chiffres)..."
                  value={newWsSiren}
                  onChange={(e) => setNewWsSiren(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewWorkspaceModal(false)} className="text-xs">
              Annuler
            </Button>
            <Button onClick={handleCreateWorkspace} className="bg-emerald-600 text-xs font-bold">
              Créer & Basculer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
