import { useState, useEffect } from "react";

const Icons = {
  zap: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  database: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  search: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  brain: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.28.44 2.46 1.17 3.39"/><path d="M14.5 2A5.5 5.5 0 0 1 20 7.5c0 1.28-.44 2.46-1.17 3.39"/><path d="M4.6 13.1A4.999 4.999 0 0 0 7 22h10a5 5 0 0 0 2.4-8.9"/><path d="M12 2v20"/></svg>,
  gitBranch: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  flame: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  mail: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  check: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  clock: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  activity: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  trending: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  edit: (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

const NODES = [
  {
    id: "trigger", iconKey: "zap", label: "Webhook", sub: "Déclencheur", accent: "#ff6d5a", col: 0, row: 1,
    panelTitle: "Webhook — Déclencheur automatique",
    panelDesc: "Dès qu'un nouveau prospect remplit un formulaire, s'inscrit sur votre site, ou est ajouté dans votre CRM, ce node détecte l'événement et lance le workflow en temps réel. Aucune action humaine requise.",
    panelBenefits: ["Déclenchement instantané (< 1 seconde)", "Fonctionne 24h/24, 7j/7", "Compatible tous CRM et formulaires web"],
    panelTech: "Webhook HTTP / API REST / CRM Polling",
  },
  {
    id: "crm", iconKey: "database", label: "CRM", sub: "Extraction", accent: "#ff9922", col: 1, row: 0,
    panelTitle: "CRM — Récupération fiche lead",
    panelDesc: "Récupère automatiquement toutes les informations déjà disponibles dans votre CRM : nom, email, téléphone, entreprise, source d'acquisition, historique des échanges et tags existants.",
    panelBenefits: ["Aucune re-saisie manuelle", "Données toujours à jour et centralisées", "Connexion native avec votre CRM actuel"],
    panelTech: "HubSpot / Pipedrive / Salesforce API",
  },
  {
    id: "enrich", iconKey: "search", label: "Compléter", sub: "Profil enrichi", accent: "#00b4d8", col: 1, row: 2,
    panelTitle: "Compléter le profil — Données manquantes",
    panelDesc: "Votre lead a laissé un email et un nom d'entreprise — mais c'est insuffisant pour le qualifier. Ce node va chercher automatiquement les informations manquantes : taille de l'entreprise, chiffre d'affaires, secteur, poste du contact, etc. Comme si un assistant faisait la recherche Google et LinkedIn à votre place, mais en 2 secondes.",
    panelBenefits: ["Fiche lead complète sans effort", "Plus besoin de chercher sur LinkedIn / Google", "Meilleure qualité de scoring ensuite"],
    panelTech: "Clearbit / Apollo / Societeinfo / LinkedIn API",
  },
  {
    id: "ai", iconKey: "brain", label: "AI Agent", sub: "Scoring IA", accent: "#00c9a7", col: 2, row: 1,
    panelTitle: "AI Agent — Analyse & Score automatique",
    panelDesc: "Le cœur du système. L'IA analyse toutes les données collectées et attribue un score de 0 à 100 selon VOS critères : budget estimé, taille entreprise, adéquation produit, urgence du besoin. Elle rédige aussi un résumé de 3 lignes pour que votre commercial comprenne le lead en un coup d'œil.",
    panelBenefits: ["Scoring objectif, identique à chaque lead", "Résumé prêt à lire pour le commercial", "Critères personnalisés à votre business"],
    panelTech: "GPT-4 / Claude / Mistral — Prompt sur mesure",
  },
  {
    id: "router", iconKey: "gitBranch", label: "Aiguillage", sub: "Par score", accent: "#ffd166", col: 3, row: 1,
    panelTitle: "Aiguillage — Orientation automatique",
    panelDesc: "En fonction du score attribué par l'IA, le lead est envoyé vers le bon parcours. Un lead chaud (score élevé) part directement dans le pipeline commercial. Un lead tiède est mis en nurturing automatique. Les seuils sont ajustables selon votre stratégie.",
    panelBenefits: ["Les meilleurs leads traités en priorité", "Aucun prospect oublié ou perdu", "Seuils modifiables à tout moment"],
    panelTech: "Score ≥ 70 → Chaud | 40-69 → Tiède | < 40 → Froid",
  },
  {
    id: "hot", iconKey: "flame", label: "Pipeline", sub: "Lead chaud", accent: "#ff6b6b", col: 4, row: 0,
    panelTitle: "Pipeline — Opportunité commerciale",
    panelDesc: "Les leads à fort potentiel sont transformés en opportunité dans votre CRM automatiquement. Le commercial reçoit une notification instantanée (Slack, email, SMS) avec le score et le résumé IA. Il n'a plus qu'à appeler.",
    panelBenefits: ["Réactivité maximale sur les leads chauds", "Notification instantanée au bon commercial", "Opportunité CRM créée sans saisie"],
    panelTech: "CRM Pipeline + Slack / Email / SMS alert",
  },
  {
    id: "nurture", iconKey: "mail", label: "Nurturing", sub: "Suivi auto", accent: "#4ecdc4", col: 4, row: 2,
    panelTitle: "Nurturing — Séquence email automatique",
    panelDesc: "Les leads pas encore prêts à acheter sont inscrits automatiquement dans une séquence d'emails personnalisée. Le contenu s'adapte à leur profil et à leur score. Objectif : les faire mûrir jusqu'au bon moment, sans effort de votre part.",
    panelBenefits: ["Aucun lead gaspillé ou oublié", "Emails personnalisés selon le profil", "Relance automatique sans intervention"],
    panelTech: "Brevo / Mailchimp / ActiveCampaign",
  },
];

const CONNECTIONS = [
  ["trigger", "crm"], ["trigger", "enrich"], ["crm", "ai"],
  ["enrich", "ai"], ["ai", "router"], ["router", "hot"], ["router", "nurture"],
];

const COL_X = [40, 210, 390, 560, 730];
const ROW_Y = [28, 130, 232];
const NW = 136, NH = 72;

function ctr(n) { return { x: COL_X[n.col] + NW / 2, y: ROW_Y[n.row] + NH / 2 }; }
function bz(f, t) {
  const a = ctr(f), b = ctr(t), dx = Math.abs(b.x - a.x) * 0.5;
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
}

const DEFAULT_MANUAL_STEPS = [
  { text: "Lecture manuelle des informations", min: 4 },
  { text: "Recherche LinkedIn et Google", min: 5 },
  { text: "Évaluation du potentiel au ressenti", min: 4 },
  { text: "Saisie et mise à jour CRM", min: 4 },
  { text: "Assignation au bon commercial", min: 3 },
];

export default function App() {
  const [sel, setSel] = useState(null);
  const [lpm, setLpm] = useState(150);
  const [cph, setCph] = useState(35);
  const [manualMin, setManualMin] = useState(20);
  const [steps] = useState(DEFAULT_MANUAL_STEPS);
  const [rdy, setRdy] = useState(false);
  useEffect(() => { setTimeout(() => setRdy(true), 150); }, []);

  const nd = NODES.find(n => n.id === sel);
  const autoSec = 30;
  const sH = (lpm * manualMin) / 60 - (lpm * autoSec) / 3600;
  const sHY = sH * 12;
  const sM = sH * cph;
  const sY = sHY * cph;
  const spd = manualMin > 0 ? Math.round((manualMin * 60) / autoSec) : 0;
  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // % of time reinvested
  const pctTimeSaved = lpm > 0 && manualMin > 0 ? Math.min(99, Math.round(((manualMin * 60 - autoSec) / (manualMin * 60)) * 100)) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0e1018", fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: "#d0d5e0" }}>
      {/* Topbar */}
      <div style={{ height: 50, background: "#151820", borderBottom: "1px solid #232738", display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <div style={{ background: "linear-gradient(135deg,#ff6d5a,#ff9922)", borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>n8n</div>
        <span style={{ color: "#333848", fontSize: 16 }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#8890a4" }}>Qualification Leads</span>
        <span style={{ fontSize: 13, color: "#3a3f50" }}>—</span>
        <span style={{ fontSize: 13, color: "#5a6278" }}>Workflow automatisé</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 6, background: "#00c9a710", border: "1px solid #00c9a725" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00c9a7", boxShadow: "0 0 6px #00c9a760" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#00c9a7", letterSpacing: 0.5 }}>ACTIF</span>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Canvas */}
          <div style={{ flex: "0 0 auto", background: "#12141e", borderBottom: "1px solid #232738", position: "relative" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, pointerEvents: "none" }}>
              <defs><pattern id="gd" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.6" fill="#6a7090" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#gd)" />
            </svg>
            <div style={{ overflowX: "auto" }}>
              <svg viewBox="0 0 920 340" style={{ width: "100%", minWidth: 660, maxHeight: 340, display: "block", padding: "10px 16px" }}>
                {CONNECTIONS.map(([fId, tId], i) => {
                  const f = NODES.find(n => n.id === fId), t = NODES.find(n => n.id === tId);
                  return (
                    <g key={i}>
                      <path d={bz(f, t)} fill="none" stroke="#282d40" strokeWidth={2} />
                      {rdy && <circle r={3} fill="#00c9a7" opacity={0.65}>
                        <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={bz(f, t)} />
                      </circle>}
                    </g>
                  );
                })}
                {NODES.map(n => {
                  const x = COL_X[n.col], y = ROW_Y[n.row], s = sel === n.id;
                  return (
                    <g key={n.id} onClick={() => setSel(s ? null : n.id)} style={{ cursor: "pointer" }}>
                      {s && <rect x={x - 2} y={y - 2} width={NW + 4} height={NH + 4} rx={10} fill="none" stroke={n.accent} strokeWidth={1} opacity={0.2} />}
                      <rect x={x} y={y} width={NW} height={NH} rx={8} fill={s ? "#1a1e2c" : "#161924"} stroke={s ? n.accent : "#262a3a"} strokeWidth={s ? 2 : 1} />
                      <rect x={x} y={y} width={NW} height={3} fill={n.accent} />
                      <circle cx={x} cy={y + NH / 2} r={3.5} fill={n.accent} opacity={0.45} />
                      <circle cx={x + NW} cy={y + NH / 2} r={3.5} fill={n.accent} opacity={0.45} />
                      <foreignObject x={x + 10} y={y + 16} width={24} height={24}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons[n.iconKey](n.accent)}</div>
                      </foreignObject>
                      <text x={x + 40} y={y + 30} fill="#e0e4f0" fontSize={12} fontWeight={700} fontFamily="'Segoe UI',sans-serif">{n.label}</text>
                      <text x={x + 40} y={y + 46} fill="#555c70" fontSize={9.5} fontFamily="'Segoe UI',sans-serif">{n.sub}</text>
                      {n.id === "ai" && <rect x={x + 1} y={y + 1} width={NW - 2} height={NH - 2} rx={7} fill="none" stroke={n.accent} strokeWidth={1.2} opacity={0.15} style={{ animation: "glow 2.5s ease-in-out infinite" }} />}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {/* Comparison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", background: "#151820", borderRadius: 10, border: "1px solid #232738", overflow: "hidden", marginBottom: 20 }}>
              {/* MANUEL — editable */}
              <div style={{ padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  {Icons.clock("#ff6b6b")}
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#ff6b6b", textTransform: "uppercase" }}>Processus manuel</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={manualMin}
                    onChange={e => setManualMin(Math.max(1, Math.min(60, +e.target.value || 1)))}
                    style={{
                      width: 56, fontSize: 32, fontWeight: 800, color: "#ff6b6b",
                      background: "#1c1f2c", border: "1px solid #2e3244", borderRadius: 6,
                      padding: "2px 6px", outline: "none", textAlign: "center",
                      fontFamily: "'Segoe UI',sans-serif",
                    }}
                  />
                  <span style={{ fontSize: 14, color: "#4a5060" }}>min / lead</span>
                </div>
                <div style={{ fontSize: 12, color: "#454c60", lineHeight: 2 }}>
                  {steps.map((s, i) => (
                    <div key={i}>{s.text}</div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #232738", borderRight: "1px solid #232738" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#00c9a710", border: "1px solid #00c9a725", display: "flex", alignItems: "center", justifyContent: "center", color: "#00c9a7", fontSize: 15, fontWeight: 700 }}>→</div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 800, color: "#00c9a7" }}>×{spd}</div>
              </div>

              {/* AUTOMATISÉ */}
              <div style={{ padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  {Icons.activity("#00c9a7")}
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#00c9a7", textTransform: "uppercase" }}>Workflow automatisé</span>
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, color: "#00c9a7", marginBottom: 14 }}>30 <span style={{ fontSize: 14, fontWeight: 400, color: "#4a5060" }}>sec / lead</span></div>
                <div style={{ fontSize: 12, color: "#454c60", lineHeight: 2 }}>
                  Déclenchement automatique<br />
                  Profil complété en 2 secondes<br />
                  Scoring IA objectif 0 à 100<br />
                  Routage CRM instantané<br />
                  Notification temps réel
                </div>
              </div>
            </div>

            {/* Calculator */}
            <div style={{ background: "#151820", borderRadius: 10, border: "1px solid #232738", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #232738", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e0e4f0" }}>Calculateur d'impact</span>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 4, background: "#ffd16612", color: "#ffd166", fontWeight: 700, border: "1px solid #ffd16620" }}>INTERACTIF</span>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: "#5c6378", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Leads / mois</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#ff9922" }}>{fmt(lpm)}</span>
                    </div>
                    <input type="range" min={0} max={500} step={5} value={lpm} onChange={e => setLpm(+e.target.value)} className="sl sl-or" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333848", marginTop: 3 }}><span>0</span><span>500</span></div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: "#5c6378", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Coût horaire</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#00b4d8" }}>{cph} €</span>
                    </div>
                    <input type="range" min={8} max={120} step={1} value={cph} onChange={e => setCph(+e.target.value)} className="sl sl-cy" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333848", marginTop: 3 }}><span>8 €</span><span>120 €</span></div>
                  </div>
                </div>

                {/* KPIs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { l: "Heures / mois", v: fmt(sH), u: "h", c: "#00b4d8" },
                    { l: "Heures / an", v: fmt(sHY), u: "h", c: "#ffd166" },
                    { l: "Économie / mois", v: fmt(sM), u: "€", c: "#00c9a7" },
                    { l: "Économie / an", v: fmt(sY), u: "€", c: "#ff6d5a" },
                  ].map(k => (
                    <div key={k.l} style={{ background: `${k.c}08`, border: `1px solid ${k.c}18`, borderRadius: 8, padding: "16px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: k.c }}>{k.v}<span style={{ fontSize: 13, marginLeft: 2 }}>{k.u}</span></div>
                      <div style={{ fontSize: 9.5, color: "#4e5568", marginTop: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{k.l}</div>
                    </div>
                  ))}
                </div>

                {/* Replaced ETP/ROI line → Positive time reinvested bar */}
                <div style={{
                  padding: "16px 18px", background: "#12141e", borderRadius: 8, border: "1px solid #232738",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {Icons.trending("#00c9a7")}
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#8890a4" }}>Temps réinvesti dans la vente</span>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#00c9a7" }}>{pctTimeSaved}%</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ width: "100%", height: 8, background: "#1e2230", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${pctTimeSaved}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #00c9a7, #4ecdc4)",
                      borderRadius: 4,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 10.5, color: "#454c60" }}>
                      Vos commerciaux récupèrent <span style={{ color: "#00c9a7", fontWeight: 700 }}>{fmt(sH)}h/mois</span> pour closer
                    </span>
                    <span style={{ fontSize: 10.5, color: "#454c60" }}>
                      soit <span style={{ color: "#ffd166", fontWeight: 700 }}>{fmt(sY)}€</span> / an
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer — AURALIS */}
            <div style={{
              textAlign: "center", padding: "28px 0 12px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <div style={{
                fontSize: 16, fontWeight: 800, letterSpacing: 3,
                background: "linear-gradient(135deg, #ff6d5a, #ff9922, #ffd166, #00c9a7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                textTransform: "uppercase",
              }}>AURALIS</div>
              <div style={{ fontSize: 11, color: "#3a3f50", letterSpacing: 0.5 }}>Automatisation IA — Workflow n8n × CRM × AI Agent</div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{
          width: nd ? 360 : 0, minWidth: nd ? 360 : 0,
          background: "#151820", borderLeft: "1px solid #232738",
          transition: "width 0.3s ease, min-width 0.3s ease",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {nd && <>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #232738", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${nd.accent}12`, border: `1.5px solid ${nd.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{Icons[nd.iconKey](nd.accent)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e8eaf0" }}>{nd.label}</div>
                <div style={{ fontSize: 11, color: nd.accent, fontWeight: 600 }}>{nd.sub}</div>
              </div>
              <div onClick={() => setSel(null)} style={{ cursor: "pointer", width: 30, height: 30, borderRadius: 6, background: "#1c2030", display: "flex", alignItems: "center", justifyContent: "center", color: "#555c70", fontSize: 16, border: "1px solid #282d40" }}>✕</div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px 20px 24px" }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#555c70", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Ce que fait ce node</div>
                <div style={{ fontSize: 13.5, color: "#a0a8bc", lineHeight: 1.75 }}>{nd.panelDesc}</div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#555c70", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Bénéfices concrets</div>
                {nd.panelBenefits.map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, background: `${nd.accent}14`, border: `1px solid ${nd.accent}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.check(nd.accent)}</div>
                    <span style={{ fontSize: 13, color: "#8890a4", lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#555c70", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Stack technique</div>
                <div style={{ padding: "12px 14px", borderRadius: 7, background: "#12141e", border: "1px solid #232738", fontSize: 11.5, color: "#6a7288", fontFamily: "'SF Mono','Fira Code','Consolas',monospace", lineHeight: 1.6 }}>{nd.panelTech}</div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", borderTop: "1px solid #232738", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: nd.accent, boxShadow: `0 0 6px ${nd.accent}50` }} />
              <span style={{ fontSize: 11, color: "#454c60" }}>Node actif — exécution automatique</span>
            </div>
          </>}
        </div>
      </div>

      <style>{`
        @keyframes glow { 0%,100%{opacity:.1} 50%{opacity:.35} }
        .sl { -webkit-appearance:none; appearance:none; width:100%; height:4px; background:#232738; border-radius:2px; outline:none; cursor:pointer; }
        .sl::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; border:2px solid #151820; cursor:pointer; }
        .sl::-moz-range-thumb { width:16px; height:16px; border-radius:50%; border:2px solid #151820; cursor:pointer; }
        .sl-or::-webkit-slider-thumb { background:#ff9922; box-shadow:0 0 8px #ff992235; }
        .sl-or::-moz-range-thumb { background:#ff9922; box-shadow:0 0 8px #ff992235; }
        .sl-cy::-webkit-slider-thumb { background:#00b4d8; box-shadow:0 0 8px #00b4d835; }
        .sl-cy::-moz-range-thumb { background:#00b4d8; box-shadow:0 0 8px #00b4d835; }
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
