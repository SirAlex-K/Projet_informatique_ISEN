import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown, Users, CheckCircle, Clock, Send } from "lucide-react";
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

  const [group,    setGroup]    = useState(null);
  const [project,  setProject]  = useState(null);
  const [tasks,    setTasks]    = useState([]);
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!projectId || !groupId) { setLoading(false); return; }
    const load = async () => {
      try {
        const [pRes, gRes, tRes, msgRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/groups/${groupId}`),
          api.get(`/projects/${projectId}/tasks`),
          api.get(`/projects/${projectId}/messages?group_id=${groupId}`),
        ]);
        setProject(pRes.data);
        setGroup(gRes.data);
        setTasks(tRes.data);
        setMessages(msgRes.data);
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

  const done     = tasks.filter(t => t.statut === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Colonne gauche */}
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
          </div>

          {/* Colonne droite — Kanban + Chat */}
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
