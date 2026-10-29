Response: Architecture Globale du Layout (Shell Applicatif)
L'application utilise une grille CSS structurée en deux zones fixes (navigation latérale et barre supérieure) et une zone de contenu fluide. Palette
chromatique : fond principal bg-slate-950, panneaux secondaires bg-slate-900, bordures border-slate-800, texte principal text-slate100, texte secondaire text-slate-400, couleur d'accentuation primaire emerald-500 (conformité), couleur d'alerte amber-500 (anomalie à
vérifier), couleur critique rose-500 (rupture PAF ou fraude). Police d'écriture : Inter pour l'interface, JetBrains Mono pour les identifiants
fiscaux, les montants financiers et les empreintes cryptographiques SHA-256.
Bloc0 → Bloc1 → BlocN
Barre Latérale Gauche (Sidebar - Fixe, largeur 260px)
En-tête Sidebar (Hauteur 64px) : Icône ShieldCheck (24px, text-emerald-500) suivie du titre en gras "AUDIA-CORE" et du
badge "v2.6 CNCC" en police monospace 10px.
Sélecteur de Cabinet Actif (Tenant Box) : Conteneur encadré avec icône Building2, texte principal "Cabinet Katrinale
Audit", sous-texte "SIREN : 842 910 384 • Tours", et icône ChevronsUpDown à droite.
Menu de Navigation Vertical :
1. Icône LayoutDashboard + Texte "Tableau de Bord & Missions"
2. Icône FolderKanban + Texte "Ingestion & Contrôle PAF"
3. Icône SplitSquareVertical + Texte "Revue Critique NEP 500"
4. Icône FileLock2 + Texte "Registre Cryptographique"
5. Icône Users + Texte "Gouvernance RACI & Accès"
6. Icône FileCheck2 + Texte "Rapports & Scellement PDF"
Pied de Sidebar (Bas de page) : Encart d'état système avec un point lumineux vert bg-emerald-500, texte "Isolation Tenant
Active", sous-texte "Base SQLite Chiffrée • EU AI Act".
Barre Supérieure (Topbar - Fixe, hauteur 64px)
Zone Gauche (Fil d'Ariane) : Icône Briefcase + Texte "Espace de Travail / Mission Audit Légal 2026 / Cycle AchatsFournisseurs".
Zone Centrale (Simulateur de Rôle RACI - Défi 3) : Groupe de trois boutons segmentés permettant de tester les permissions en
direct devant le jury :
Bouton 1 : Icône Scale + Texte "Vue CAC Associé (Signataire)"
Bouton 2 : Icône UserCheck + Texte "Vue Auditeur Financier"
Bouton 3 : Icône Terminal + Texte "Vue Expert Data / IA"
Zone Droite (Identité & Sécurité) : Badge "API data.gouv.fr : Connectée", icône Bell (notifications d'alertes), avatar
circulaire Google de l'utilisateur connecté, nom "Alexis Coiffard", sous-titre "Commissaire aux Comptes", et bouton icône
LogOut.
Page 1 : Portail d'Authentification Fédérée & Provisionnement de Cabinet (/login &
/onboarding)
Cette page ne contient ni la Sidebar ni la Topbar. Elle est divisée verticalement en deux colonnes égales (50% gauche / 50% droite).
Colonne Gauche : Identité Visuelle et Conformité Réglementaire
Haut : Logo "AUDIA-CORE" accompagné de la mention "Plateforme d'Audit Légal & Contrôle Automatisé des Factures
Électroniques".
Centre : Liste structurée de trois blocs d'engagement réglementaire :
Bloc 1 : Icône FileCheck + Titre "Conformité Normes NEP 230 & NEP 500" + Description "Traçabilité intégrale des
éléments probants et documentation systématique des travaux d'audit assistés par agents algorithmiques."
Bloc 2 : Icône Link + Titre "Piste d'Audit Fiable (PAF) & Réforme 2027" + Description "Rapprochement tripartite
automatisé entre devis, bons de commande, bons de réception et factures au format hybride Factur-X."
Bloc 3 : Icône Lock + Titre "Cloisonnement Multi-Cabinet & Secret Professionnel" + Description "Isolation stricte
des bases documentaires par identifiant de cabinet et gouvernance conforme au règlement européen EU AI
Act."
Bas : Mention légale "7e Édition #HackAudit 2026 — Compagnie Nationale des Commissaires aux Comptes (CNCC) — IAE
Tours Val de Loire".
Colonne Droite : Carte de Connexion et Création d'Espace (Workspace)
Onglet 1 : Connexion Cabinet Existant
Titre : "Accès au Cockpit d'Audit"
Sous-titre : "Authentification sécurisée via identité professionnelle Google Workspace."
Bouton Principal (Pleine largeur, fond blanc, texte noir) : Logo vectoriel Google (18px) + Texte "Continuer avec un compte
Google"
Séparateur horizontal avec texte "OU ACCÈS DÉMONSTRATION JURY CNCC"
Bouton Secondaire : Icône KeyRound + Texte "Charger la Session Démo (Cabinet IAE Tours)"
Onglet 2 : Initialisation d'un Nouveau Cabinet (Provisioning Multi-Tenant)
Champ 1 (Input texte) : Label "Dénomination sociale du cabinet ou de l'entreprise", Placeholder "Ex : Cabinet AudIA
Associés"
Champ 2 (Input numérique avec bouton d'action intégré) : Label "Numéro SIREN du cabinet (9 chiffres)", Placeholder "Ex :
552100554", Bouton intégré à droite avec icône Search et texte "Vérifier via API État".
Encart de retour API : Affiche après clic "Statut INSEE : Entreprise Active — Siège social vérifié".
Champ 3 (Menu déroulant) : Label "Rôle initial du créateur dans la matrice RACI", valeur fixe sélectionnée
"Commissaire aux Comptes Associé (A/R - Approbateur & Responsable)".
Bouton de validation : Icône ArrowRight + Texte "Initialiser l'Espace de Travail et Générer le Bloc Genesis SHA256".
Page 2 : Tableau de Bord Exécutif & Gestion des Missions (/dashboard)
Cette vue présente les indicateurs de valeur ajoutée mesurable du Défi 1 et la liste des dossiers d'audit du cabinet.
Section 1 : Bandeau Supérieur d'Action
Gauche : Titre "Synthèse Opérationnelle du Cycle Achats-Fournisseurs", sous-titre "Exercice comptable 2026 — Périmètre
: Contrôle exhaustif des factures entrantes et sortantes".
Droite : Deux boutons d'action :
Bouton Secondaire : Icône FileSpreadsheet + Texte "Générer Lot de Test CNCC (Factures Piégées PDF)"
Bouton Primaire (bg-emerald-600) : Icône UploadCloud + Texte "Nouvelle Mission / Importer Liasse PDF"
Section 2 : Grille des 4 Cartes KPI (Défi 1 - Valeur Ajoutée Mesurable)
Quatre cartes alignées horizontalement comparant le travail humain avant l'agent IA et l'apport de l'agent IA :
1. Carte 1 : Couverture d'Audit
En-tête : Titre "TAUX DE COUVERTURE DU CYCLE" + Icône CheckCircle2
Valeur principale : "100,0 %" (50 / 50 pièces contrôlées)
Sous-texte comparatif : "Référence humaine : Échantillonnage partiel (~10%)"
2. Carte 2 : Vélocité de Traitement
En-tête : Titre "TEMPS MOYEN D'EXÉCUTION PAR PIÈCE" + Icône Timer
Valeur principale : "1,4 sec"
Sous-texte comparatif : "Référence humaine : 10 min / facture (Gain : -99,7%)"
3. Carte 3 : Détection d'Anomalies & Fraude
En-tête : Titre "ALERTES & ÉCARTS IDENTIFIÉS" + Icône AlertTriangle
Valeur principale : "12 Anomalies" (38 pièces conformes)
Sous-texte comparatif : "3 TVA • 3 Doublons • 3 Ruptures PAF • 3 SIREN"
4. Carte 4 : Statut de Validation Humaine (NEP 500)
En-tête : Titre "REVUE DU COMMISSAIRE AUX COMPTES" + Icône Stamp
Valeur principale : "4 / 12 Arbitrées" (8 en attente de visa CAC)
Sous-texte comparatif : "Scellement PDF verrouillé jusqu'à revue complète"
Section 3 : Tableau des Lotissements et Pièces Comptables Analysées
Barre de Filtres au-dessus du tableau :
Champ de recherche : Icône Search + Placeholder "Rechercher par numéro de facture, raison sociale ou SIREN..."
Boutons filtres rapides : "Toutes les pièces (50)", "Anomalies Critiques (12)", "Ruptures PAF (3)", "Doublons
Détectés (3)", "Écarts TVA (3)", "Validées par le CAC (4)".
Colonnes du Tableau de Données (De gauche à droite) :
1. ID / Réf. Pièce : Numéro de facture en police monospace (ex: FAC-2026-0892).
2. Fournisseur & SIREN : Raison sociale + numéro SIREN avec badge de vérification Luhn/INSEE (Valide ou SIREN Invalide).
3. Montants (HT / TVA / TTC) : Valeurs alignées à droite en euros avec taux de TVA affiché entre parenthèses (20,0 %, 10,0 %,
5,5 %).
4. Contrôle PAF (3-Way Match) : Trois badges compacts côte à côte : CMD (Bon de commande), REC (Bon de réception), FAC
(Facture) colorés en vert si concordants ou rouge si écart ou pièce manquante.
5. Score de Risque IA : Jauge numérique de 0 / 100 à 100 / 100 avec code couleur.
6. Nature de l'Alerte : Texte précis (ex: "Écart arithmétique TVA (+142,00 €)", "Doublon exact avec FAC-2026-0811",
"Bon de réception non signé").
7. Statut Revue CAC : Badge "En attente de revue", "Anomalie Confirmée", ou "Alerte Écartée (Justifiée)".
8. Action : Bouton avec icône Eye + Texte "Inspecter (NEP 500)" ouvrant la Page 4.
Page 3 : Centre d'Ingestion & Pipeline Multi-Agents Temps Réel (/ingestion)
Cette page permet d'uploader les documents ou de générer un lot de démonstration, et affiche l'exécution séquentielle des trois agents décrite
dans le Défi 2.
Section 1 : Générateur de Liasse Comptable de Test (Simulateur d'Audit)
Encart Supérieur (bg-slate-900) :
Titre : "Générateur de Lot de Factures Électroniques de Démonstration (Norme Factur-X / PDF)"
Description : "Génère instantanément un jeu de données anonymisé comprenant des factures fournisseurs, des
bons de commande et des bons de réception avec injection paramétrable d'anomalies comptables et fiscales."
Contrôles de génération : Compteur "Nombre de liasses : 10", cases à cocher pré-activées : "Inclure erreurs de calcul
et taux de TVA", "Inclure factures en doublon", "Inclure écarts Facture / Commande / Réception (Rupture
PAF)", "Inclure faux SIREN".
Boutons : Icône Download + "Télécharger les Factures PDF Générées sur le PC" et Icône Play + "Injecter Directement
dans le Pipeline d'Audit IA".
Section 2 : Zone de Dépôt Documentaire (Drag & Drop)
Cadre en pointillés (border-dashed border-2 border-slate-700) avec icône centrale FileUp (48px).
Texte principal : "Glissez-déposez vos lots de factures fournisseurs, devis, bons de commande et bons de réception".
Sous-texte : "Formats supportés : PDF natif, PDF/A-3 (Factur-X avec XML intégré), archives ZIP. Traitement isolé
au sein du cabinet actif."
Section 3 : Visualiseur d'Exécution du Pipeline à 3 Agents (Temps Réel)
Trois panneaux horizontaux reliés par des flèches directionnelles ArrowRight illustrant la progression du traitement :
1. Panneau Agent 1 : Agent d'Extraction Multimodale & Vision
Icône : ScanText
Modèle affiché : "Modèle : gemini-3-flash • Température : 0.0 • Sortie : Schéma JSON Strict"
Tâches affichées : "Calcul de l'empreinte SHA-256 du fichier source", "Extraction SIREN, SIRET, HT, Taux TVA,
Montant TVA, TTC", "Identification des références de commande et de livraison".
2. Panneau Agent 2 : Agent Logique de Conformité & PAF
Icône : Calculator
Modèle affiché : "Moteur Déterministe Python + Contrôle API Gouvernementale"
Tâches affichées : "Vérification arithmétique stricte : HT × Taux = TVA et HT + TVA = TTC", "Validation Luhn
SIREN/SIRET & statut actif INSEE", "Détection des doublons multi-critères", "Rapprochement tripartite PAF
(Facture vs Commande vs Réception)".
3. Panneau Agent 3 : Agent de Scoring de Risque & Traçabilité
Icône : ShieldAlert
Modèle affiché : "Matrice de Pondération Algorithmique & Scellement SHA-256"
Tâches affichées : "Attribution du score de fraude potentielle sur 100", "Enregistrement immuable du prompt,
des paramètres et du JSON en base", "Mise en file d'attente pour revue humaine du CAC".
Page 4 : Poste d'Inspection Split-Screen — Revue Humaine NEP 500 (/review/:id)
Cette page constitue le cœur de la démonstration pour le Défi 2 (articulation entre l'analyse de l'IA et le jugement professionnel du Commissaire
aux Comptes). L'écran est divisé en deux panneaux verticaux de largeur égale.
Barre d'En-tête d'Inspection (Au-dessus du Split-Screen)
Gauche : Bouton retour ArrowLeft + Texte "Dossier Pièce : FAC-2026-0892 — Fournisseur : TECHNO-LOGISTIQUE SAS" +
Badge rouge "SCORE DE RISQUE : 70 / 100 — ANOMALIE DÉTECTÉE".
Droite : Bouton "Télécharger le Fichier Source PDF" (Icône Download) et Bouton "Voir le Bloc Cryptographique SHA-256"
(Icône Hash).
Panneau Gauche (50% de la largeur) : Visionneuse Documentaire Originale
Barre d'onglets du document :
Onglet 1 (Actif) : Icône FileText + "Facture Fournisseur (FAC-2026-0892.pdf)"
Onglet 2 : Icône ShoppingCart + "Bon de Commande Associé (BC-2026-441.pdf)"
Onglet 3 : Icône PackageCheck + "Bon de Réception (BR-2026-441.pdf)"
Zone de rendu PDF : Affichage haute précision de la facture PDF générée ou importée, avec contrôles de zoom (ZoomIn, ZoomOut) et
l'empreinte du fichier inscrite en bas : "SHA-256 du fichier original :
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".
Panneau Droit (50% de la largeur) : Analyse Détaillée, Preuve d'Audit et Arbitrage CAC
Bloc 1 : Extraction Structurée & Vérification Légale du Tiers
Grille à 2 colonnes affichant les champs extraits :
Raison Sociale : "TECHNO-LOGISTIQUE SAS"
SIREN / SIRET : "732 829 320 00074" + Badge "Algorithme de Luhn : Valide • API data.gouv.fr : Entreprise
Active"
Date d'émission : "14/10/2026"
IBAN Fournisseur : "FR76 3000 4000 0312 3456 7890 143"
Bloc 2 : Contrôle Mathématique de la TVA & Cohérence Arithmétique
Tableau comparatif à 4 colonnes : Élément, Valeur Lue sur Facture (IA), Valeur Recalculée (Moteur Python), Statut du
Contrôle.
Ligne 1 (Montant HT) : 10 000,00 € | 10 000,00 € | Badge vert Conforme
Ligne 2 (Taux de TVA appliqué) : 20,0 % | 20,0 % | Badge vert Taux Légal Valide
Ligne 3 (Montant TVA) : 2 250,00 € | 2 000,00 € | Badge rouge Écart Détecté : +250,00 €
Ligne 4 (Total TTC) : 12 250,00 € | 12 000,00 € | Badge rouge Total TTC Inexact
Bloc 3 : Contrôle de la Piste d'Audit Fiable (PAF — Rapprochement Tripartite)
Tableau de correspondance :
Référence Commande (BC-2026-441) : Montant engagé 9 500,00 € HT vs Facturé 10 000,00 € HT Badge rouge
"Dépassement de commande (+500,00 € HT)".
Bon de Réception (BR-2026-441) : Document présent, signé le 12/10/2026 Badge vert "Livraison attestée".
Bloc 4 : Inspecteur de Trace Algorithmique (Conformité NEP 230 / EU AI Act)
Accordéon dépliable intitulé "Afficher la Preuve Technique d'Exécution (Prompt, Paramètres & JSON Brut)".
Contenu en police monospace sur fond noir : affiche la version exacte du prompt système, l'horodatage UTC (2026-10-
29T17:15:02Z), le modèle utilisé, et la sortie JSON brute non modifiée.
Bloc 5 : Zone de Décision et Jugement Professionnel du CAC (Verrouillée par Rôle RACI)
Si le simulateur de rôle en haut de l'écran est sur Auditeur Financier ou Expert Data / IA : Affiche un bandeau
d'avertissement gris avec icône Lock : "Mode Lecture Seule — Conformément à la norme NEP 500 et à la matrice RACI,
seul le Commissaire aux Comptes Associé est habilité à valider ou écarter définitivement cette anomalie."
Si le simulateur de rôle est sur CAC Associé (Signataire) :
Champ de saisie (Textarea) : Label "Motivation obligatoire du jugement professionnel (conservée au dossier
de travail NEP 230)", Placeholder "Saisir les conclusions de la revue humaine (ex : Demande d'avoir
exigée auprès du fournisseur pour l'écart de TVA de 250 € et le dépassement de commande)...".
Deux boutons d'arbitrage côte à côte :
Bouton Gauche (bg-rose-600, texte blanc) : Icône FileWarning + "Confirmer l'Anomalie & Inscrire au Rapport
d'Audit"
→
→
Bouton Droit (bg-emerald-600, texte blanc) : Icône CheckCheck + "Écarter l'Alerte (Pièce Justifiée après
Revue)"
Page 5 : Registre Cryptographique Immuable & Traçabilité NEP 230 (/ledger)
Cette page démontre techniquement comment les preuves générées par l'IA deviennent opposables et inaltérables dans le dossier de travail du
CAC.
Section 1 : En-tête de Vérification d'Intégrité Mathématique
Gauche : Titre "Journal d'Audit Cryptographique Chaîné (SHA-256)", sous-titre "Garantie d'inaltérabilité des travaux
d'audit assistés par IA conformément aux normes NEP 230 et NEP 500".
Droite : Bouton interactif bg-emerald-600 avec icône ShieldCheck + Texte "Exécuter le Contrôle d'Intégrité de la Chaîne".
Bandeau de Résultat (affiché après clic) : Encart vert "INTÉGRITÉ CONFIRMÉE : 51/51 blocs vérifiés mathématiquement.
Aucune altération détectée sur les fichiers PDF, les prompts, les sorties JSON ou les visas du CAC depuis le
Bloc Genesis du cabinet."
Section 2 : Chronologie Visuelle des Blocs Scellés
Liste verticale de cartes représentant chaque événement enregistré dans le cabinet actif :
Chaque Carte de Bloc contient :
En-tête du Bloc : Badge "BLOC #0042", Type d'événement ("ANALYSE_IA_INITIALE" ou "VISA_HUMAIN_CAC"), Horodatage UTC
précis, et Utilisateur/Agent auteur.
Corps du Bloc (Grille Monospace) :
Hash du Bloc Précédent (Prev_Hash) : 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
Hash du Fichier PDF Source : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Signature Paramètres IA : gemini-3-flash | temp=0.0 | prompt_v2.4_cncc
Décision rattachée : "ANOMALIE_CONFIRMEE par Alexis Coiffard (CAC Associé)"
Empreinte Actuelle Scellée (Current_Hash) :
2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae (Surligné en vert émeraude).
Page 6 : Gouvernance Pluridisciplinaire RACI & Conformité Réglementaire (/governance)
Cette page traduit directement en fonctionnalités logicielles les tableaux du Défi 3 d'AudIA-IN et d'AudIA Out.
Section 1 : Matrice RACI Interactive du Cabinet Actif
Tableau structuré à 5 colonnes reprenant exactement les acteurs du concours :
1. Ligne 1 : Commissaire aux Comptes / Associé Signataire
Membres assignés : Alexis Coiffard, Fadi Matloob
Responsabilité RACI : Badge "R / A (Réalise & Approuve)"
Droits Techniques dans l'Application : "Définition du périmètre, revue des alertes, validation/rejet des
anomalies, signature et scellement du rapport PDF final."
Mesure de Contrôle & Norme : "Normes NEP 230 / NEP 500 & Code de déontologie (Prévention de la perte
d'esprit critique)."
2. Ligne 2 : Expert Data / Architecte IA
Membres assignés : Ismail El Bakassi, Andrea Launay
Responsabilité RACI : Badge "A / R (Approuve l'architecture & Prépare les flux)"
Droits Techniques dans l'Application : "Calibrage des prompts, supervision des schémas JSON, contrôle de
non-hallucination, accès en lecture seule aux conclusions d'audit."
Mesure de Contrôle & Norme : "Règlement Européen EU AI Act (Supervision humaine, transparence algorithmique
et exactitude)."
3. Ligne 3 : Référent Cybersécurité & Juriste Conformité
Membres assignés : Lina Ijiji, Hosam Gdache
Responsabilité RACI : Badge "C (Consulté)"
Droits Techniques dans l'Application : "Vérification du cloisonnement multi-cabinet, audit des journaux
d'accès JWT, contrôle de la politique de rétention et de minimisation des données."
Mesure de Contrôle & Norme : "RGPD & Secret Professionnel du Commissaire aux Comptes."
Section 2 : Panneau de Contrôle de Sécurité du Workspace
Quatre indicateurs techniques actifs avec interrupteurs verrouillés :
"Cloisonnement Strict du Périmètre (Aucune donnée partagée hors du cabinet)" : Statut ACTIF
"Désactivation de l'Entraînement Externe sur les Données Comptables Clients" : Statut ACTIF
"Blocage de Certification Automatique sans Intervention Humaine du CAC" : Statut ACTIF
"Journalisation Horodatée de Toutes les Requêtes API (NEP 230)" : Statut ACTIF
Page 7 : Centre de Clôture & Génération du Rapport PDF Scellé (/export)
Cette page génère le livrable PDF final exigé à la fin du processus d'audit.
Section 1 : Liste de Contrôle Pré-Scellement (Checklist NEP 500)
Trois étapes de vérification avec icônes CheckCircle2 :
1. "Exhaustivité du contrôle : 100 % des factures du lot ont été analysées par les 3 agents."
2. "Intégrité de la piste d'audit : La chaîne cryptographique SHA-256 du dossier est valide."
3. "Jugement professionnel exercé : Toutes les anomalies critiques ont été revues et visées par le CAC Associé."
Section 2 : Aperçu Structuré du Document PDF Officiel Généré
Un cadre central prévisualise la mise en page exacte du document PDF multi-pages que le bouton télécharge via ReportLab :
En-tête du PDF :
Gauche : Nom et SIREN du cabinet ("CABINET KATRINALE / AUDIA — COMMISSARIAT AUX COMPTES")
Droite : Titre officiel encadré "NOTE DE SYNTHÈSE D'AUDIT LÉGAL & CERTIFICAT DE CONTRÔLE NEP 500"
Sous-titre : "Cycle Achats-Fournisseurs • Contrôle de Conformité TVA, Doublons et Piste d'Audit Fiable (PAF)"
Section 1 du PDF : Métriques d'Exécution & Gains d'Audit (Défi 1)
Tableau récapitulatif : Nombre total de pièces contrôlées (50), Taux de couverture (100 %), Temps d'exécution total (1 min 10 s
contre 8 h 20 min en traitement humain estimé), Nombre d'anomalies détectées (12), Anomalies confirmées après revue du CAC
(10), Alertes écartées et justifiées (2).
Section 2 du PDF : État Détaillé des Anomalies & Rapprochements PAF (Défi 2)
Tableau listant chaque facture en anomalie avec : Référence pièce, Fournisseur & SIREN, Montant HT / TVA / TTC, Nature exacte
de l'écart (TVA, Doublon, Rupture PAF), Score de risque IA, Décision finale du CAC et Commentaire d'audit motivé.
Section 3 du PDF : Registre des Preuves Algorithmiques & Traçabilité (NEP 230 / EU AI Act)
Tableau technique mentionnant la version du modèle d'IA utilisé, la température (0.0), l'identifiant du prompt système, et la liste des
empreintes SHA-256 des fichiers sources analysés.
Bas de Page du PDF : Bloc de Signature & Cachet Cryptographique
Gauche : "Visa du Commissaire aux Comptes Signataire : Alexis Coiffard / Fadi Matloob — Date et heure UTC de
scellement".
Droite : QR Code haute résolution encodant l'empreinte maître SHA-256 du rapport et l'URL de vérification du registre,
accompagné de la mention "Document scellé cryptographiquement — Élement probant conservé au dossier de
travail (NEP 230 / NEP 500)".
Section 3 : Barre d'Export Finale
Bouton Principal (Grande taille, bg-emerald-600) : Icône FileDown + Texte "Générer et Télécharger le Rapport d'Audit
Officiel Scellé (.PDF)"
Bouton Secondaire : Icône FileJson + Texte "Exporter l'Archive Complète des Preuves JSON Horodatées (.JSON)"
User prompt: continue
Response: Page 8 : Paramètres du Cabinet & Configuration Technique Multi-Tenant
(/settings)
Cette vue permet à l'administrateur du cabinet (CAC Associé ou Expert Data / IA) de configurer l'identité de l'espace de travail, de gérer les
membres invités via Google Workspace, et de verrouiller les paramètres de déterminisme de l'agent IA conformément au Défi 2 et au Défi 3.
Section 1 : En-tête de la Page
Gauche : Titre "Configuration du Workspace & Paramètres de Sécurité", sous-titre "Gestion de l'isolation multi-tenant,
des habilitations Google OAuth 2.0 et du calibrage algorithmique".
Droite : Badge d'état en police monospace "TENANT_ID : ws_katrinale_37000" + Bouton "Enregistrer les modifications"
(Icône Save, bg-emerald-600).
Section 2 : Identité Légale du Cabinet (En-tête des Rapports PDF Scellés)
Panneau structuré en grille de 2 colonnes permettant de personnaliser les métadonnées imprimées sur la facture et le certificat d'audit final :
Champ 1 (Lecture seule après vérification INSEE) : Label "Raison Sociale du Cabinet", Valeur "KATRINALE AUDIT &
COMMISSARIAT — AUDIA".
Champ 2 (Lecture seule) : Label "Numéro SIREN / SIRET du Cabinet", Valeur "842 910 384 00019" + Icône CheckCircle2 (textemerald-500).
Champ 3 : Label "Inscription Compagnie Régionale (CRCC)", Valeur "CRCC Centre-Val de Loire — Cour d'Appel d'Orléans
/ Tours".
Champ 4 : Label "Adresse du Siège Social", Valeur "50 Avenue du Portillon, 37100 Tours, France".
Section 3 : Gestion des Collaborateurs & Invitations Google OAuth 2.0
Barre d'ajout rapide :
Champ Email : Icône Mail + Placeholder "prenom.nom@cabinet-audit.fr (Compte Google)".
Sélecteur de Rôle RACI : Menu déroulant proposant "CAC Associé (Signataire NEP 500)", "Auditeur Financier
(Opérateur)", "Expert Data / IA (Superviseur Technique)", "Juriste / Référent Cybersécurité (Auditeur RGPD)".
Bouton : Icône UserPlus + Texte "Envoyer l'invitation d'accès au Workspace".
Tableau des Membres Actifs du Cabinet (6 Étudiants + Ingénieur) :
Colonnes : Collaborateur, Compte Google Associé, Rôle RACI Attribué, Périmètre d'Intervention, Statut.
Ligne 1 : Alexis Coiffard | alexis.coiffard@etu.univ-tours.fr | Badge CAC Associé (R/A) | "Validation finale &
Scellement NEP 500" | Actif.
Ligne 2 : Fadi Matloob | fadi.matloob@etu.univ-tours.fr | Badge CAC Associé (R/A) | "Revue critique PAF &
Supervision mission" | Actif.
Ligne 3 : Andrea Launay | andrea.launay@etu.univ-tours.fr | Badge Auditeur Financier (R) | "Contrôle de cohérence
TVA & Doublons" | Actif.
Ligne 4 : Lina Ijiji | lina.ijiji@etu.univ-tours.fr | Badge Juriste / Cyber (C) | "Conformité RGPD, EU AI Act &
Secret Pro" | Actif.
Ligne 5 : Hosam Gdache | hosam.gdache@etu.univ-tours.fr | Badge Responsable Achats / PAF (C) | "Rapprochement
Commande / Réception / Facture" | Actif.
Ligne 6 : Ismail El Bakassi | ismailelbakassi@gmail.com | Badge Architecte Data / IA (A/R) | "Orchestration
Agents, API & Ledger SHA-256" | Actif.
Section 4 : Calibrage du Moteur IA & Règles Fiscales (Verrouillage Défi 2)
Trois cartes techniques côte à côte illustrant la maîtrise des paramètres exigée dans la colonne "Documentation tracée" du Défi 2 :
1. Carte 1 : Hyperparamètres du Modèle Vision
Modèle sélectionné : "gemini-3-flash (Google GenAI SDK)"
Température (Déterminisme) : "0.0 (Verrouillé — Zéro créativité)"
Mode de sortie : "Structured Outputs (Schéma Pydantic Strict)"
Conservation des données API : "Zero Data Retention (Conforme Secret Professionnel)"
2. Carte 2 : Matrice des Règles Fiscales Françaises (Agent 2)
Taux de TVA autorisés : "20,0 % (Normal) • 10,0 % (Intermédiaire) • 5,5 % (Réduit) • 2,1 % (Particulier)"
Tolérance d'arrondi arithmétique : "± 0,01 € sur la formule HT × Taux = TVA"
Contrôle externe SIREN/SIRET : "Algorithme de Luhn + API recherche-entreprises.api.gouv.fr"
3. Carte 3 : Pondération du Score de Risque (Agent 3)
Rupture de la Piste d'Audit Fiable (PAF) : "+ 40 points (Alerte Critique)"
Suspicion de Doublon de Facturation : "+ 30 points (Alerte Majeure)"
Incohérence de Calcul ou Taux de TVA : "+ 20 points (Alerte Modérée)"
SIREN Invalide ou Entreprise Radiée : "+ 10 points (Alerte Conformité)"
Modèles des 5 Fenêtres Modales, Drawers et États Système
Pour qu'aucun détail d'interface ne soit laissé au hasard lors de la génération dans Google Antigravity, voici la spécification exacte des
composants flottants (Dialogs Shadcn UI) :
1. Modale d'Inspection du Prompt & Schéma JSON (PromptInspectorDialog)
Déclencheur : Clic sur le bouton "Voir Prompt & Version" dans le tableau du Défi 2 ou sur la Page 4.
En-tête : Icône Code2 + Titre "Spécification du Prompt Système & Schéma d'Extraction" + Badge "Version :
prompt_v2.4_cncc_2026".
Zone 1 (Texte du Prompt en lecture seule, police JetBrains Mono) : "Tu es un agent d'extraction comptable opérant sous
la norme NEP 500. Extrais exclusivement les mentions légales présentes sur le document fourni sans jamais
extrapoler ni corriger une erreur arithmétique visible. Si un champ est absent ou illisible, retourne null.
Champs requis : siren_fournisseur, siret_fournisseur, raison_sociale, numero_facture, date_emission,
montant_ht, taux_tva, montant_tva, montant_ttc, reference_bon_commande, reference_bon_reception,
signature_reception_presente."
Zone 2 (Pied de modale) : Texte "Empreinte SHA-256 du Prompt :
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" + Bouton "Copier la preuve JSON" (Icône Copy).
2. Modale de Comparaison de Doublons Côte-à-Côte (DuplicateComparisonModal)
Déclencheur : Clic sur une alerte de type "Doublon Détecté" dans le tableau du Dashboard.
En-tête : Icône CopySlash (text-rose-500) + Titre "Analyse Comparative de Suspicion de Doublon".
Corps (Tableau à 3 colonnes : Critère de Comparaison, Pièce Déjà Comptabilisée (FAC-2026-0811), Pièce Analysée (FAC2026-0895)) :
Fournisseur & SIREN : BUREAU-PRO SAS (552 100 554) | BUREAU-PRO SAS (552 100 554) Badge rouge Identique
Montant TTC : 4 800,00 € | 4 800,00 € Badge rouge Identique
Date de Facture : 02/10/2026 | 03/10/2026 Badge ambre Écart de 24h (Doublon déguisé)
Référence Commande : BC-2026-109 | BC-2026-109 Badge rouge Même commande facturée 2 fois
Pied de modale : Bouton "Rejeter la facture en doublon et notifier le CAC" (bg-rose-600).
3. Modale de Blocage de Sécurité RACI (RaciPermissionDeniedDialog)
Déclencheur : Clic sur "Sceller le Rapport PDF" ou "Valider l'anomalie" lorsque le simulateur de rôle est positionné sur
Auditeur Financier ou Expert Data / IA.
En-tête : Icône ShieldBan (text-amber-500) + Titre "Restriction Réglementaire — Norme NEP 500 & EU AI Act".
Texte explicatif : "Votre profil actif ne dispose pas du pouvoir de signature légale. Conformément à la matrice de
gouvernance RACI du cabinet et aux normes de la CNCC, l'agent IA prépare l'analyse mais seul le Commissaire aux
Comptes Associé (rôle CAC_ASSOCIE) peut exercer son jugement professionnel pour valider une anomalie ou sceller
le rapport final."
Bouton d'action rapide pour la démo : Icône SwitchCamera + Texte "Basculer immédiatement sur le profil CAC Associé".
Spécification du Document PDF Final Généré (CERTIFICAT_AUDIT_NEP500.pdf)
Voici la structure exacte du fichier PDF physique que la bibliothèque Python ReportLab génère lorsque le CAC clique sur le bouton d'export
final (Page 7) :
+-----------------------------------------------------------------------------------+
| CABINET KATRINALE AUDIT — AUDIA-CORE DOSSIER DE TRAVAIL SCELLÉ |
| SIREN : 842 910 384 • CRCC Tours Réf. Norme : NEP 230 & NEP 500 |
| Espace : ws_katrinale_37000 Date UTC : 2026-10-29 17:30 |
+-----------------------------------------------------------------------------------+
| |
| CERTIFICAT DE CONTRÔLE AUTOMATISÉ & SYNTHÈSE DES ANOMALIES |
| Cycle Achats-Fournisseurs — Facturation Électronique |
| |
| 1. INDICATEURS DE PERFORMANCE ET COUVERTURE DE LA MISSION (DÉFI 1) |
| +-------------------------+------------------------+----------------------------+ |
| | Volume Total du Lot | Taux de Couverture | Temps d'Exécution Total | |
| | 50 Liasses (150 pages) | 100,0 % (Exhaustif) | 42,8 secondes (< 1s/pièce) | |
| +-------------------------+------------------------+----------------------------+ |
| | Pièces 100 % Conformes | Anomalies Détectées IA | Anomalies Confirmées CAC | |
→
→
→
→
| | 38 Factures | 12 Alertes levées | 10 Confirmées / 2 Écartées | |
| +-------------------------+------------------------+----------------------------+ |
| |
| 2. REGISTRE DES ANOMALIES ET ARBITRAGE DU COMMISSAIRE AUX COMPTES (DÉFI 2) |
| +--------------+------------------+---------------+--------------+--------------+ |
| | Réf. Facture | Fournisseur | Écart / Alerte| Score Risque | Décision CAC | |
| +--------------+------------------+---------------+--------------+--------------+ |
| | FAC-2026-004 | TECHNO-LOG SAS | Écart TVA +250| 70 / 100 | CONFIRMÉE | |
| | FAC-2026-012 | BUREAU-PRO SAS | Doublon exact | 85 / 100 | CONFIRMÉE | |
| | FAC-2026-019 | ALPHA TRANS | Rupture PAF | 90 / 100 | CONFIRMÉE | |
| | FAC-2026-027 | OUEST MÉTAL | SIREN Luhn KO | 60 / 100 | CONFIRMÉE | |
| +--------------+------------------+---------------+--------------+--------------+ |
| |
| 3. TRAÇABILITÉ ALGORITHMIQUE & CONFORMITÉ EU AI ACT (DÉFI 3) |
| - Modèle d'extraction : gemini-3-flash (Température = 0.0, Schéma JSON strict) |
| - Moteur de contrôle : Python Déterministe v2.6 (TVA, Luhn SIREN, 3-Way PAF) |
| - Empreinte Genesis : 4a7d1ed414474e4033ac29ccb8653d9b0000000000000000 |
| - Empreinte Maître : 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0 |
| |
| +------------------------------------------------+ +---------------------------+ |
| | VISA DU COMMISSAIRE AUX COMPTES SIGNATAIRE | | [ QR CODE CRYPTO SHA-256 ]| |
| | Signé électroniquement par : Alexis COIFFARD | | Scannez pour vérifier | |
| | Qualité : CAC Associé (Responsable R/A) | | l'intégrité de la chaîne | |
| | Horodatage : 2026-10-29T17:30:11Z | | NEP 230 / NEP 500 | |
| +------------------------------------------------+ +---------------------------+ |
+-----------------------------------------------------------------------------------+

