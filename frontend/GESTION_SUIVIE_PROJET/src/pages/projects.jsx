import { useState, useMemo } from "react";
import {
  LayoutDashboard, FolderKanban, Users, Settings, Bell, Search,
  Plus, ChevronRight, Check, Filter, UserCheck, BookOpen,
  Crown, LogIn, ChevronDown, X, Layers, GraduationCap, Pencil, Save
} from "lucide-react";

// ─── SHARED DATA ────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: 1, name: "Amara Diallo",   email: "a.diallo@isen.fr",   promo: "CIR3", filiere: "IR" },
  { id: 2, name: "Hugo Lemaire",   email: "h.lemaire@isen.fr",  promo: "CIR3", filiere: "SN" },
  { id: 3, name: "Inès Kouakou",   email: "i.kouakou@isen.fr",  promo: "CIR3", filiere: "IR" },
  { id: 4, name: "Théo Bernard",   email: "t.bernard@isen.fr",  promo: "CIR3", filiere: "GB" },
  { id: 5, name: "Fatou Sow",      email: "f.sow@isen.fr",      promo: "CIR3", filiere: "SN" },
  { id: 6, name: "Lucas Martin",   email: "l.martin@isen.fr",   promo: "CIR3", filiere: "IR" },
  { id: 7, name: "Céline Dupont",  email: "c.dupont@isen.fr",   promo: "CIR2", filiere: "GB" },
  { id: 8, name: "Moussa Traoré",  email: "m.traore@isen.fr",   promo: "CIR2", filiere: "SN" },
  { id: 9, name: "Léa Fontaine",   email: "l.fontaine@isen.fr", promo: "CIR2", filiere: "IR" },
  { id: 10,name: "Omar Diarra",    email: "o.diarra@isen.fr",   promo: "CIR1", filiere: "SN" },
];

const PROMOS   = ["", "CIR3", "CIR2", "CIR1"];
const FILIERES = ["", "IR", "SN", "GB"];

const COLORS = {
  IR: { bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/20" },
  SN: { bg: "bg-teal-500/10",   text: "text-teal-300",   border: "border-teal-500/20"  },
  GB: { bg: "bg-amber-500/10",  text: "text-amber-300",  border: "border-amber-500/20" },
};
const PROMO_COLORS = {
  CIR3: { bg: "bg-purple-500/10", text: "text-purple-300" },
  CIR2: { bg: "bg-blue-500/10",   text: "text-blue-300"   },
  CIR1: { bg: "bg-pink-500/10",   text: "text-pink-300"   },
};

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(); }

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ role, activeItem, setActiveItem }) {
  const encItems = [
    { id: "projects",  icon: FolderKanban,    label: "Mes projets"  },
    { id: "students",  icon: Users,           label: "Étudiants"    },
    { id: "settings",  icon: Settings,        label: "Paramètres"   },
  ];
  const stuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard"    },
    { id: "projects",  icon: BookOpen,        label: "Mes projets"  },
    { id: "settings",  icon: Settings,        label: "Paramètres"   },
  ];
  const items = role === "encadrant" ? encItems : stuItems;
  const roleLabel = role === "encadrant" ? "Encadrant" : "Étudiant";
  const avatar = role === "encadrant" ? "PE" : "AD";
  const username = role === "encadrant" ? "Prof. El Amri" : "Amara Diallo";

  return (
    <aside className="flex flex-col w-56 min-h-screen shrink-0" style={{ background: "#0B1220", borderRight: "1px solid rgba(99,102,241,0.12)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Layers size={14} className="text-white" />
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">ProjectHub</span>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3">
        <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-400">{roleLabel}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {items.map(({ id, icon: Icon, label }) => {
          const active = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => setActiveItem(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-[10px] font-semibold text-indigo-200 shrink-0">
            {avatar}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{username}</p>
            <p className="text-[10px] text-slate-500 truncate">{roleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ─────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle }) {
  return (
    <header className="flex items-center justify-between px-7 py-4 border-b shrink-0" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Bell size={15} />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <Search size={15} />
        </button>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 1 — ENCADRANT
// ═══════════════════════════════════════════════════════════════════════════
function EncadrantPage() {
  const [step, setStep] = useState("form"); // form | assign | published
  const [activeItem, setActiveItem] = useState("projects");

  // Form state
  const [form, setForm] = useState({ title: "", groups: 4, capacity: 5 });

  // Assign state
  const [search, setSearch]     = useState("");
  const [promo, setPromo]       = useState("CIR3");
  const [filiere, setFiliere]   = useState("");
  const [selected, setSelected] = useState(new Set());

  // Published groups state
  const [publishedGroups, setPublishedGroups] = useState([]);

  const filtered = useMemo(() => STUDENTS.filter(s =>
    (!promo   || s.promo === promo) &&
    (!filiere || s.filiere === filiere) &&
    (!search  || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  ), [promo, filiere, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));

  function toggleStudent(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelected(prev => {
      const n = new Set(prev);
      if (allFilteredSelected) filtered.forEach(s => n.delete(s.id));
      else filtered.forEach(s => n.add(s.id));
      return n;
    });
  }

  function handlePublish() {
    // Single API call — one array of IDs
    const payload = { project_title: form.title, etudiant_ids: [...selected] };
    console.log("POST /api/projets — payload:", payload);
    // Generate slots
    const groups = Array.from({ length: form.groups }, (_, i) => ({
      id: i + 1, name: `Groupe ${i + 1}`, capacity: form.capacity, members: []
    }));
    setPublishedGroups(groups);
    setStep("published");
  }

  const stepLabels = ["Créer", "Assigner", "Publié"];
  const stepIndex  = step === "form" ? 0 : step === "assign" ? 1 : 2;

  return (
    <div className="flex h-screen text-white overflow-hidden" style={{ background: "#020817" }}>
      <Sidebar role="encadrant" activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Créer un projet" subtitle="JUNIA ISEN — Gestion des projets" />

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-7 py-4 border-b shrink-0" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                i < stepIndex ? "bg-indigo-600 text-white" :
                i === stepIndex ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40" :
                "bg-white/5 text-slate-500"
              }`}>
                {i < stepIndex ? <Check size={11} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === stepIndex ? "text-indigo-300" : i < stepIndex ? "text-slate-400" : "text-slate-600"}`}>{label}</span>
              {i < stepLabels.length - 1 && <ChevronRight size={12} className="text-slate-700 mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* ── STEP 1: FORM ── */}
          {step === "form" && (
            <div className="max-w-lg">
              <p className="text-sm text-slate-400 mb-6">Renseignez les informations du projet avant d'assigner les étudiants.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Titre du projet</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 placeholder:text-slate-600 transition-all"
                    placeholder="ex: Développement API REST — ISEN 3"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nombre de groupes</label>
                    <input type="number" min={1} max={30}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      value={form.groups}
                      onChange={e => setForm(f => ({ ...f, groups: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Capacité par groupe</label>
                    <input type="number" min={1} max={20}
                      className="w-full px-3 py-2.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      value={form.capacity}
                      onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/15 px-4 py-3">
                  <p className="text-xs text-indigo-400 font-medium mb-1">Aperçu des slots</p>
                  <p className="text-xs text-slate-400">{form.groups} groupes × {form.capacity} places = <span className="text-white font-medium">{form.groups * form.capacity} étudiants max</span></p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Array.from({ length: Math.min(form.groups, 8) }, (_, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/8">G{i+1}</span>
                    ))}
                    {form.groups > 8 && <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-500">+{form.groups-8}</span>}
                  </div>
                </div>

                <button
                  disabled={!form.title.trim()}
                  onClick={() => setStep("assign")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-all"
                >
                  Assigner les étudiants <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: ASSIGN ── */}
          {step === "assign" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-white">{form.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.size} étudiant(s) sélectionné(s)</p>
                </div>
                <button
                  disabled={selected.size === 0}
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all"
                >
                  <Check size={13} /> Publier le projet
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    className="pl-7 pr-3 py-2 rounded-lg text-xs text-white bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600 w-44 transition-all"
                    placeholder="Rechercher…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="px-2.5 py-2 rounded-lg text-xs text-slate-300 bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all"
                  value={promo} onChange={e => setPromo(e.target.value)}
                >
                  {PROMOS.map(p => <option key={p} value={p} className="bg-slate-900">{p || "Toutes promos"}</option>)}
                </select>
                <select
                  className="px-2.5 py-2 rounded-lg text-xs text-slate-300 bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-all"
                  value={filiere} onChange={e => setFiliere(e.target.value)}
                >
                  {FILIERES.map(f => <option key={f} value={f} className="bg-slate-900">{f || "Toutes filières"}</option>)}
                </select>
                {selected.size > 0 && (
                  <button onClick={() => setSelected(new Set())} className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-white/5 border border-white/10 transition-all">
                    <X size={11} /> Désélectionner
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "rgba(99,102,241,0.12)" }}>
                {/* Select-all header */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.12)" }}>
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded accent-indigo-500 cursor-pointer"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                  />
                  <span className="text-xs text-slate-400">
                    Tout sélectionner <span className="text-slate-600">({filtered.length} affichés)</span>
                  </span>
                  <span className="ml-auto text-xs text-indigo-400 font-medium">{selected.size} sélectionné(s)</span>
                </div>

                {/* Col headers */}
                <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="col-span-1" />
                  <div className="col-span-5 text-[10px] uppercase tracking-wider text-slate-600 font-medium">Étudiant</div>
                  <div className="col-span-3 text-[10px] uppercase tracking-wider text-slate-600 font-medium">Promo</div>
                  <div className="col-span-3 text-[10px] uppercase tracking-wider text-slate-600 font-medium">Filière</div>
                </div>

                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-600">Aucun étudiant pour ces critères</div>
                ) : (
                  filtered.map(s => {
                    const isSel = selected.has(s.id);
                    const pc = PROMO_COLORS[s.promo] || { bg: "bg-white/5", text: "text-slate-400" };
                    const fc = COLORS[s.filiere] || { bg: "bg-white/5", text: "text-slate-400" };
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleStudent(s.id)}
                        className={`grid grid-cols-12 gap-3 items-center px-4 py-2.5 cursor-pointer transition-colors border-b last:border-0 ${
                          isSel ? "bg-indigo-600/10" : "hover:bg-white/3"
                        }`}
                        style={{ borderColor: "rgba(255,255,255,0.04)" }}
                      >
                        <div className="col-span-1">
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                            isSel ? "bg-indigo-600 border-indigo-600" : "border-white/20"
                          }`}>
                            {isSel && <Check size={9} className="text-white" />}
                          </div>
                        </div>
                        <div className="col-span-5 flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-indigo-700/50 flex items-center justify-center text-[9px] font-semibold text-indigo-300 shrink-0">
                            {initials(s.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">{s.name}</p>
                            <p className="text-[10px] text-slate-600 truncate">{s.email}</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.text}`}>{s.promo}</span>
                        </div>
                        <div className="col-span-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${fc.bg} ${fc.text}`}>{s.filiere}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: PUBLISHED ── */}
          {step === "published" && (
            <div>
              <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-green-500/8 border border-green-500/15">
                <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-300">Projet publié avec succès</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.size} étudiants notifiés · {publishedGroups.length} groupes créés</p>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Slots de groupes générés</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {publishedGroups.map(g => (
                  <div key={g.id} className="rounded-xl border p-4" style={{ background: "rgba(99,102,241,0.04)", borderColor: "rgba(99,102,241,0.15)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-200">{g.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{g.members.length}/{g.capacity}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {Array.from({ length: g.capacity }, (_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-dashed border-white/15 flex items-center justify-center">
                          <span className="text-[8px] text-slate-700">+</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2">En attente de membres</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStep("form"); setForm({ title: "", groups: 4, capacity: 5 }); setSelected(new Set()); }}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/8 text-xs text-slate-300 transition-all"
              >
                <Plus size={13} /> Nouveau projet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE 2 — ÉTUDIANT
// ═══════════════════════════════════════════════════════════════════════════
const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Développement API REST",
    encadrant: "Prof. El Amri",
    deadline: "30 juin 2026",
    groups: [
      { id: 1, name: "Groupe 1", capacity: 4, members: [
        { id: 2, name: "Hugo Lemaire",  isLeader: false },
        { id: 3, name: "Inès Kouakou", isLeader: true  },
      ], subject: "Authentification JWT" },
      { id: 2, name: "Groupe 2", capacity: 4, members: [
        { id: 4, name: "Théo Bernard", isLeader: true },
      ], subject: "" },
      { id: 3, name: "Groupe 3", capacity: 4, members: [], subject: "" },
      { id: 4, name: "Groupe 4", capacity: 4, members: [], subject: "" },
    ],
  },
  {
    id: 2,
    title: "IA & Vision par ordinateur",
    encadrant: "Prof. Dubois",
    deadline: "15 juillet 2026",
    groups: [
      { id: 5, name: "Groupe 1", capacity: 3, members: [], subject: "" },
      { id: 6, name: "Groupe 2", capacity: 3, members: [], subject: "" },
      { id: 7, name: "Groupe 3", capacity: 3, members: [], subject: "" },
    ],
  },
];

const ME = { id: 1, name: "Amara Diallo" };

function GroupCard({ group, onJoin, onUpdateSubject, myGroupId }) {
  const isMember   = group.members.some(m => m.id === ME.id);
  const isMyGroup  = myGroupId === group.id;
  const iAmLeader  = group.members.find(m => m.id === ME.id)?.isLeader;
  const isFull     = group.members.length >= group.capacity;
  const isEmpty    = group.members.length === 0;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(group.subject);

  function saveSubject() { onUpdateSubject(group.id, draft); setEditing(false); }

  return (
    <div className={`rounded-xl border flex flex-col transition-all ${
      isMyGroup
        ? "border-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]"
        : "border-white/8 hover:border-white/15"
    }`} style={{ background: isMyGroup ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)" }}>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">{group.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            isFull ? "bg-red-500/10 text-red-400" :
            isEmpty ? "bg-white/5 text-slate-500" :
            "bg-green-500/10 text-green-400"
          }`}>
            {group.members.length}/{group.capacity}
          </span>
        </div>
        {isEmpty && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400/80 mt-1">
            <Crown size={9} /> Rejoindre = Team Leader
          </span>
        )}
      </div>

      {/* Members */}
      <div className="px-4 py-3 flex-1">
        {group.members.length === 0 ? (
          <p className="text-[11px] text-slate-600 italic">Aucun membre</p>
        ) : (
          <div className="space-y-1.5">
            {group.members.map(m => (
              <div key={m.id} className={`flex items-center gap-2 ${m.id === ME.id ? "opacity-100" : "opacity-70"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 ${
                  m.isLeader ? "bg-amber-500/20 text-amber-300" : "bg-white/8 text-slate-400"
                }`}>
                  {initials(m.name)}
                </div>
                <span className={`text-[11px] truncate ${m.id === ME.id ? "text-indigo-300 font-medium" : "text-slate-400"}`}>
                  {m.id === ME.id ? "Moi" : m.name}
                </span>
                {m.isLeader && (
                  <span className="ml-auto flex items-center gap-0.5 text-[9px] text-amber-400 shrink-0">
                    <Crown size={8} /> Leader
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Subject — visible to all, editable only by leader */}
        {isMyGroup && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1.5">Sujet</p>
            {iAmLeader ? (
              editing ? (
                <div className="flex gap-1.5">
                  <input
                    autoFocus
                    className="flex-1 px-2 py-1 rounded-md text-[11px] text-white bg-white/8 border border-indigo-500/40 focus:outline-none focus:border-indigo-500 min-w-0"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveSubject(); if (e.key === "Escape") setEditing(false); }}
                  />
                  <button onClick={saveSubject} className="p-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                    <Save size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setDraft(group.subject); setEditing(true); }}
                  className="flex items-center gap-1.5 w-full text-left px-2 py-1 rounded-md bg-white/5 hover:bg-white/8 border border-white/8 transition-colors group"
                >
                  <span className={`text-[11px] flex-1 truncate ${group.subject ? "text-slate-300" : "text-slate-600 italic"}`}>
                    {group.subject || "Définir un sujet…"}
                  </span>
                  <Pencil size={10} className="text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />
                </button>
              )
            ) : (
              <p className={`text-[11px] px-2 py-1 rounded-md bg-white/5 ${group.subject ? "text-slate-300" : "text-slate-600 italic"}`}>
                {group.subject || "Sujet non défini"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      {!isMember && !isFull && !myGroupId && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onJoin(group.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/25 hover:border-indigo-500/40 transition-all"
          >
            <LogIn size={12} /> Rejoindre
          </button>
        </div>
      )}
      {isMember && (
        <div className="px-4 pb-4">
          <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] text-indigo-400 border border-indigo-500/20 bg-indigo-500/5">
            <Check size={11} /> Mon groupe
          </div>
        </div>
      )}
    </div>
  );
}

function EtudiantPage() {
  const [activeItem, setActiveItem] = useState("projects");
  const [projects, setProjects]     = useState(INITIAL_PROJECTS);

  function joinGroup(projectId, groupId) {
    // Single API call
    console.log("POST /api/groupes/" + groupId + "/join — { student_id:", ME.id, "}");
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        groups: p.groups.map(g => {
          if (g.id !== groupId) return g;
          const isLeader = g.members.length === 0;
          return { ...g, members: [...g.members, { ...ME, isLeader }] };
        }),
      };
    }));
  }

  function updateSubject(projectId, groupId, subject) {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, groups: p.groups.map(g => g.id === groupId ? { ...g, subject } : g) };
    }));
  }

  return (
    <div className="flex h-screen text-white overflow-hidden" style={{ background: "#020817" }}>
      <Sidebar role="etudiant" activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Mes projets" subtitle="Projets qui vous sont assignés" />

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">
          {projects.map(project => {
            const myGroup = project.groups.find(g => g.members.some(m => m.id === ME.id));
            const myGroupId = myGroup?.id ?? null;

            return (
              <section key={project.id}>
                {/* Project header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-white">{project.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <UserCheck size={11} /> {project.encadrant}
                      </span>
                      <span className="text-[11px] text-slate-500">·</span>
                      <span className="text-[11px] text-slate-500">Deadline {project.deadline}</span>
                      <span className="text-[11px] text-slate-500">·</span>
                      <span className="text-[11px] text-slate-500">{project.groups.length} groupes</span>
                    </div>
                  </div>
                  {myGroupId && (
                    <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                      <Check size={10} /> Inscrit — {myGroup.name}
                    </span>
                  )}
                </div>

                {/* Groups grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.groups.map(g => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      myGroupId={myGroupId}
                      onJoin={(gid) => joinGroup(project.id, gid)}
                      onUpdateSubject={(gid, sub) => updateSubject(project.id, gid, sub)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT — Toggle between pages
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("encadrant");

  return (
    <div className="relative">
      {/* Page switcher */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-1.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-white/10 shadow-xl">
        {["encadrant", "etudiant"].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
              page === p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {p === "encadrant" ? "Vue Encadrant" : "Vue Étudiant"}
          </button>
        ))}
      </div>

      {page === "encadrant" ? <EncadrantPage /> : <EtudiantPage />}
    </div>
  );
}
