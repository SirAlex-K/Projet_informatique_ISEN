import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Crown, Users, CheckCircle, Clock, Send,
  Flag, FileText, Download, AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-600",
];

const COLUMNS = [
  { id: "todo",     label: "À faire",  dot: "bg-gray-400" },
  { id: "en_cours", label: "En cours", dot: "bg-blue-400" },
  { id: "done",     label: "Terminé",  dot: "bg-green-400" },
];

export default function GroupDetails() {
  const { user } = useAuth();
  const location = useLocation();
  const params    = new URLSearchParams(location.search);
  const projectId = params.get("projectId");
  const groupId   = params.get("groupId");

  const [group,      setGroup]      = useState(null);
  const [project,    setProject]    = useState(null);
  const [tasks,      setTasks]      = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [livrables,  setLivrables]  = useState([]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!projectId || !groupId) { setLoading(false); return; }
    const load = async () => {
      try {
        const [pRes, gRes, tRes, msgRes, msRes, livRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/groups/${groupId}`),
          api.get(`/projects/${projectId}/tasks`),
          api.get(`/projects/${projectId}/messages?group_id=${groupId}`),
          api.get(`/projects/${projectId}/milestones`),
          api.get(`/projects/${projectId}/deliverables`),
        ]);
        setProject(pRes.data);
        setGroup(gRes.data);
        setTasks(tRes.data);
        setMessages(msgRes.data);
        setMilestones(msRes.data);
        // Filtrer les livrables déposés par des membres de ce groupe
        const groupMemberIds = new Set(gRes.data.members.map(m => m.user_id));
        setLivrables(livRes.data.filter(l => groupMemberIds.has(l.uploaded_by)));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
    const interval = setInterval(() => {
      api.get(`/projects/${projectId}/messages?group_id=${groupId}`)
        .then(r => setMessages(r.data)).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [projectId, groupId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    try {
      const res = await api.post(`/projects/${projectId}/messages`, { contenu: text, group_id: parseInt(groupId) });
      setMessages(prev => [...prev, res.data]);
      setInput("");
    } catch (e) { console.error(e); }
  };

  const handleValidateMilestone = async (msId) => {
    try {
      const res = await api.put(`/milestones/${msId}/reach`);
      setMilestones(prev => prev.map(m => m.id === msId ? res.data : m));
    } catch (e) { console.error(e); }
  };

  const handleDownload = (liv) => {
    const a = document.createElement("a");
    a.href = `http://localhost:3000/${liv.chemin_fichier}`;
    a.download = liv.nom_fichier;
    a.click();
  };

  const done     = tasks.filter(t => t.statut === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const nbAtteints = milestones.filter(m => m.atteint).length;

  if (loading) return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!group) return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <Link to={`/supervisor/project-details?id=${projectId}`} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Retour au projet
      </Link>
      <p className="text-gray-500">Groupe introuvable.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="max-w-6xl mx-auto p-8">

        <Link to={`/supervisor/project-details?id=${projectId}`} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
          ← Retour au projet
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1e1b4b] p-8 mb-8">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 blur-[100px]" />
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center font-bold text-lg shadow-xl flex-shrink-0">
                {group.numero}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">Groupe {group.numero}</h1>
                <p className="text-gray-400 text-sm mt-0.5">{project?.titre}</p>
                {group.sujet && (
                  <span className="inline-block mt-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full">
                    {group.sujet.libelle}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <p className="text-gray-400 text-xs">Membres</p>
                <p className="text-xl font-bold">{group.members.length}/{group.capacite_max}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <p className="text-gray-400 text-xs">Tâches</p>
                <p className="text-xl font-bold">{tasks.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <p className="text-gray-400 text-xs">Progression</p>
                <p className="text-xl font-bold text-green-400">{progress}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <p className="text-gray-400 text-xs">Jalons</p>
                <p className="text-xl font-bold text-purple-400">{nbAtteints}/{milestones.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Colonne gauche ── */}
          <div className="space-y-6">

            {/* Membres */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
                <Users size={14} className="text-purple-400" /> Membres
              </h2>
              {group.members.length === 0 ? (
                <p className="text-gray-600 text-xs italic">Aucun membre</p>
              ) : (
                <div className="space-y-2.5">
                  {group.members.map(m => (
                    <div key={m.user_id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[m.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                        {m.user?.prenom?.[0]}{m.user?.nom?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{m.user?.prenom} {m.user?.nom?.toUpperCase()}</p>
                        <p className="text-xs text-gray-500 truncate">{m.user?.email}</p>
                      </div>
                      {m.role_in_project === "lead" && (
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                          <Crown size={10} className="text-amber-400" />
                          <span className="text-xs text-amber-300">Leader</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progression tâches */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex justify-between mb-3">
                <h2 className="text-sm font-bold">Tâches</h2>
                <span className="text-green-400 text-sm font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              {COLUMNS.map(col => (
                <div key={col.id} className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs text-gray-400">{col.label}</span>
                  </div>
                  <span className="text-xs font-bold">{tasks.filter(t => t.statut === col.id).length}</span>
                </div>
              ))}
            </div>

            {/* Jalons */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Flag size={14} className="text-purple-400" /> Jalons
                </h2>
                <span className="text-xs text-gray-600">{nbAtteints}/{milestones.length} validé{nbAtteints > 1 ? "s" : ""}</span>
              </div>

              {milestones.length === 0 ? (
                <p className="text-gray-600 text-xs italic">Aucun jalon défini</p>
              ) : (
                <div className="space-y-3">
                  {milestones.map(m => (
                    <div key={m.id} className={`rounded-xl border p-3 transition-all ${
                      m.atteint
                        ? "bg-green-500/[0.05] border-green-500/20"
                        : "bg-white/[0.02] border-white/[0.06]"
                    }`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          m.atteint ? "bg-green-500/20 text-green-400" : "bg-white/[0.05] text-gray-600"
                        }`}>
                          {m.atteint ? <CheckCircle size={13} /> : <Clock size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-snug ${m.atteint ? "text-gray-300" : "text-white"}`}>
                            {m.titre}
                          </p>
                          <p className="text-gray-600 text-[11px] mt-0.5">
                            Échéance : {new Date(m.date_cible).toLocaleDateString("fr-FR")}
                          </p>
                          {m.atteint && m.atteint_le && (
                            <p className="text-green-500/70 text-[11px] mt-0.5">
                              Validé le {new Date(m.atteint_le).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>
                      {!m.atteint && (
                        <button
                          onClick={() => handleValidateMilestone(m.id)}
                          className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 rounded-lg py-1.5 transition-all"
                        >
                          <CheckCircle size={11} /> Valider
                        </button>
                      )}
                      {m.atteint && (
                        <div className="mt-2 flex items-center gap-1.5 justify-center">
                          <span className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                            <CheckCircle size={11} /> Validé
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Livrables */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" /> Livrables
                </h2>
                <span className="text-xs text-gray-600">{livrables.length} fichier{livrables.length !== 1 ? "s" : ""}</span>
              </div>

              {livrables.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-600 text-xs italic py-2">
                  <AlertCircle size={13} /> Aucun livrable déposé
                </div>
              ) : (
                <div className="space-y-2">
                  {livrables.map(liv => (
                    <div key={liv.id} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2.5 hover:border-blue-500/20 transition-all">
                      <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={13} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{liv.nom_fichier}</p>
                        <p className="text-gray-600 text-[11px]">
                          {liv.uploader ? `${liv.uploader.prenom} ${liv.uploader.nom?.toUpperCase()}` : "—"} · {Math.round((liv.taille || 0) / 1024)} Ko
                        </p>
                        <p className="text-gray-700 text-[11px]">
                          {new Date(liv.uploaded_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(liv)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all flex-shrink-0"
                        title="Télécharger"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Colonne droite — Kanban + Chat ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Kanban */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-bold mb-4">Kanban</h2>
              <div className="grid grid-cols-3 gap-3">
                {COLUMNS.map(col => (
                  <div key={col.id} className="bg-white/[0.02] rounded-xl p-3 min-h-[120px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="text-xs font-semibold text-gray-400">{col.label}</span>
                      <span className="ml-auto text-xs text-gray-600">{tasks.filter(t => t.statut === col.id).length}</span>
                    </div>
                    <div className="space-y-2">
                      {tasks.filter(t => t.statut === col.id).map(task => (
                        <div key={task.id} className="bg-[#0d1117] border border-white/[0.06] rounded-lg p-2.5 text-xs text-gray-300">
                          {task.titre}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5 flex flex-col" style={{ minHeight: 340 }}>
              <h2 className="text-sm font-bold mb-4">Chat avec le groupe</h2>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-52">
                {messages.length === 0 && (
                  <p className="text-gray-600 text-xs text-center py-8">Aucun message — écrivez le premier</p>
                )}
                {messages.map(msg => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[(msg.sender_id || 0) % AVATAR_COLORS.length]} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                        {msg.sender?.prenom?.[0]}{msg.sender?.nom?.[0]}
                      </div>
                      <div className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm ${isMe ? "bg-purple-600 rounded-tr-sm" : "bg-white/[0.05] border border-white/[0.07] rounded-tl-sm"}`}>
                        {!isMe && <p className="text-xs text-gray-400 mb-1">{msg.sender?.prenom} {msg.sender?.nom?.toUpperCase()}</p>}
                        <p>{msg.contenu}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Écrire au groupe..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-[#020817] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500/40"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition disabled:opacity-30"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
