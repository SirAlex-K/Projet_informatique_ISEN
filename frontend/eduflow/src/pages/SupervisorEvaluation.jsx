import { useState, useEffect } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard,
  Bell, LogOut, ClipboardCheck, Save, ChevronDown, Users, CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-500",
];

function getNoteColor(note) {
  if (note >= 16) return "text-green-400";
  if (note >= 12) return "text-blue-400";
  if (note >= 10) return "text-orange-400";
  return "text-red-400";
}

const INPUT_CLS = "w-full bg-[#020817] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/40 transition";

export default function SupervisorEvaluation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects,        setProjects]        = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjDrop,    setShowProjDrop]    = useState(false);
  const [groups,          setGroups]          = useState([]);
  const [evaluations,     setEvaluations]     = useState([]);
  const [selectedGroup,   setSelectedGroup]   = useState(null);
  const [note,            setNote]            = useState("");
  const [commentaire,     setCommentaire]     = useState("");
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");

  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setSelectedGroup(null);
    setNote(""); setCommentaire(""); setError(""); setSuccess("");
    Promise.all([
      api.get(`/projects/${selectedProject.id}/groups`),
      api.get(`/projects/${selectedProject.id}/evaluations`),
    ]).then(([gRes, eRes]) => {
      setGroups(gRes.data);
      setEvaluations(eRes.data.evaluations || []);
    }).catch(console.error);
  }, [selectedProject]);

  // Groupes pas encore notés
  const evaluatedGroupIds = new Set(evaluations.map(e => e.group_id).filter(Boolean));
  const pendingGroups = groups.filter(g => !evaluatedGroupIds.has(g.id));

  const handleSave = async () => {
    if (!selectedProject || !selectedGroup || !note) {
      setError("Sélectionnez un projet, un groupe et entrez une note.");
      return;
    }
    const n = parseFloat(note);
    if (isNaN(n) || n < 0 || n > 20) { setError("La note doit être entre 0 et 20."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await api.post(`/projects/${selectedProject.id}/evaluations`, {
        note: n, commentaire, group_id: selectedGroup.id,
      });
      const newEval = { ...res.data, projectTitre: selectedProject.titre };
      setEvaluations(prev => [newEval, ...prev]);
      setSelectedGroup(null); setNote(""); setCommentaire("");
      setSuccess(`Groupe ${selectedGroup.numero} noté avec succès !`);
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className="w-[260px] border-r border-white/[0.06] bg-[#0B1220] flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center font-black text-sm shadow-lg shadow-purple-500/20">PH</div>
              <div>
                <h1 className="text-base font-bold">ProjectHub</h1>
                <p className="text-gray-500 text-xs">Professeur</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1 mt-1">
            <Link to="/supervisor" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><LayoutDashboard size={17} /> Tableau de bord</Link>
            <div className="bg-purple-600/90 rounded-xl px-3 py-2.5 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-purple-500/20">
              <ClipboardCheck size={17} /> Évaluation
            </div>
            <Link to="/supervisor/projects" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><FolderKanban size={17} /> Projets</Link>
            <Link to="/supervisor/students" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><GraduationCap size={17} /> Étudiants</Link>
            <Link to="/supervisor/messages" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><MessageSquare size={17} /> Messages</Link>
          </div>
        </div>
        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm hover:bg-red-500/15 transition">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="border-b border-white/[0.06] bg-[#0B1220] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold">Évaluation</h1>
            <p className="text-gray-500 text-xs mt-0.5">Notez les groupes projet par projet</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0B1220]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{user?.prenom?.[0] || "P"}</div>
              <div>
                <p className="text-sm font-semibold">{user?.prenom} {user?.nom?.toUpperCase()}</p>
                <p className="text-gray-500 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Formulaire */}
          <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <ClipboardCheck size={17} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-bold">Nouvelle évaluation</h2>
                <p className="text-gray-500 text-xs">Sélectionnez un projet puis un groupe à noter</p>
              </div>
            </div>

            {error   && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
            {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2"><CheckCircle size={14} />{success}</div>}

            {/* Étape 1 — Projet */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">1. Projet</label>
              <div className="relative">
                <button
                  onClick={() => setShowProjDrop(v => !v)}
                  className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-white/[0.08] rounded-xl px-4 py-3 text-sm hover:border-purple-500/30 transition text-left"
                >
                  <span className={selectedProject ? "text-white" : "text-gray-600"}>
                    {selectedProject?.titre || "Choisir un projet..."}
                  </span>
                  <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
                </button>
                {showProjDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1220] border border-white/[0.08] rounded-xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                    {projects.map(p => (
                      <button key={p.id} onClick={() => { setSelectedProject(p); setShowProjDrop(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.05] transition ${selectedProject?.id === p.id ? "text-purple-300" : "text-gray-400"}`}>
                        {p.titre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Étape 2 — Groupe */}
            {selectedProject && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  2. Groupe à noter
                  <span className="ml-2 font-normal text-gray-600 normal-case">
                    {pendingGroups.length} groupe{pendingGroups.length !== 1 ? "s" : ""} en attente · {evaluatedGroupIds.size} noté{evaluatedGroupIds.size !== 1 ? "s" : ""}
                  </span>
                </label>
                {pendingGroups.length === 0 ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={15} /> Tous les groupes de ce projet ont été notés
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                    {pendingGroups.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGroup(g)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                          selectedGroup?.id === g.id
                            ? "bg-purple-500/10 border-purple-500/30 text-white"
                            : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[g.id % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {g.numero}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Groupe {g.numero}</p>
                          {g.sujet && <p className="text-xs text-gray-600 truncate">{g.sujet.libelle}</p>}
                          <p className="text-xs text-gray-600">{g.members?.length || 0} membre{(g.members?.length || 0) !== 1 ? "s" : ""}</p>
                        </div>
                        {selectedGroup?.id === g.id && (
                          <CheckCircle size={14} className="text-purple-400 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Étape 3 — Note + commentaire */}
            {selectedGroup && (
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[selectedGroup.id % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold`}>
                    {selectedGroup.numero}
                  </div>
                  <span className="text-sm font-semibold">Évaluation du Groupe {selectedGroup.numero}</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Note / 20</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number" min="0" max="20" step="0.5" placeholder="Ex : 16"
                      value={note} onChange={e => setNote(e.target.value)}
                      className={INPUT_CLS + " max-w-[140px]"}
                    />
                    {note && !isNaN(parseFloat(note)) && (
                      <span className={`text-2xl font-extrabold ${getNoteColor(parseFloat(note))}`}>
                        {parseFloat(note).toFixed(1)} /20
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Commentaire <span className="normal-case font-normal text-gray-600">(optionnel)</span></label>
                  <textarea
                    rows={3} placeholder="Appréciation du professeur..."
                    value={commentaire} onChange={e => setCommentaire(e.target.value)}
                    className={INPUT_CLS + " resize-none"}
                  />
                </div>
                <button
                  onClick={handleSave} disabled={saving || !note}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:opacity-40 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-green-500/20"
                >
                  <Save size={15} /> {saving ? "Enregistrement..." : "Enregistrer la note"}
                </button>
              </div>
            )}
          </div>

          {/* Historique */}
          <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-bold">Évaluations enregistrées</h2>
              <p className="text-gray-500 text-xs mt-0.5">{evaluations.length} évaluation{evaluations.length !== 1 ? "s" : ""} au total</p>
            </div>

            {evaluations.length === 0 ? (
              <div className="py-12 text-center text-gray-600 text-sm">Aucune évaluation pour ce projet.</div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {evaluations.map((ev, i) => {
                  // Cherche le groupe dans l'état local (contient les membres) ou dans ev.group
                  const groupId = ev.group?.id || ev.group_id;
                  const fullGroup = groups.find(g => g.id === groupId) || null;
                  const groupNumero = fullGroup?.numero ?? ev.group?.numero ?? null;
                  const groupSujet = fullGroup?.sujet?.libelle ?? ev.group?.sujet?.libelle ?? null;
                  const members = fullGroup?.members || [];

                  return (
                    <div key={ev.id ?? i} className="px-6 py-4 hover:bg-white/[0.02] transition">
                      <div className="flex items-start gap-4">
                        {/* Groupe + membres */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[(groupId || 0) % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
                            {groupNumero ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold">
                              {groupNumero != null ? `Groupe ${groupNumero}` : "Groupe inconnu"}
                            </p>
                            {groupSujet && (
                              <p className="text-xs text-purple-400 truncate mt-0.5">{groupSujet}</p>
                            )}
                            {members.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {members.map(m => (
                                  <span key={m.user_id} className="text-[11px] bg-white/[0.04] border border-white/[0.06] rounded-full px-2 py-0.5 text-gray-400">
                                    {m.user?.prenom} {m.user?.nom?.toUpperCase()}
                                    {m.role_in_project === "lead" && <span className="text-amber-400 ml-1">★</span>}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-700 mt-1 italic">Membres non disponibles</p>
                            )}
                          </div>
                        </div>

                        {/* Note */}
                        <div className="text-right flex-shrink-0">
                          <span className={`text-2xl font-extrabold ${getNoteColor(ev.note)}`}>{ev.note}</span>
                          <span className="text-gray-600 text-xs">/20</span>
                          <p className="text-gray-600 text-[11px] mt-0.5">
                            {new Date(ev.evaluated_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      {ev.commentaire && (
                        <p className="mt-2.5 ml-12 text-xs text-gray-500 italic bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
                          "{ev.commentaire}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
