import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const COLUMNS = [
  { id: "todo",     label: "À faire",  color: "white/10",     textColor: "" },
  { id: "en_cours", label: "En cours", color: "blue-500/20",  textColor: "text-blue-400" },
  { id: "done",     label: "Terminé",  color: "green-500/20", textColor: "text-green-400" },
];

export default function GroupDetails() {
  const { user } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("projectId");

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    const load = async () => {
      try {
        const [pRes, mRes, tRes, msgRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/projects/${projectId}/members`),
          api.get(`/projects/${projectId}/tasks`),
          api.get(`/projects/${projectId}/messages`),
        ]);
        setProject(pRes.data);
        setMembers(mRes.data);
        setTasks(tRes.data);
        setMessages(msgRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
    const interval = setInterval(() => {
      api.get(`/projects/${projectId}/messages`).then(r => setMessages(r.data)).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !projectId) return;
    try {
      const res = await api.post(`/projects/${projectId}/messages`, { contenu: text });
      setMessages(prev => [...prev, res.data]);
      setInput("");
    } catch (e) { console.error(e); }
  };

  const done = tasks.filter(t => t.statut === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (loading) return <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#020817] text-white p-8">

      <Link to={`/supervisor/project-details?id=${projectId}`} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Retour au projet
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{project?.titre || "Projet"}</h1>
        <p className="text-gray-400 text-sm mb-4">Détails et progression</p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-xl text-sm">{members.length} membres</div>
          <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl text-sm">{progress}% terminé</div>
          <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl text-sm">{tasks.length} tâches</div>
        </div>
      </div>

      {/* Progression */}
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Progression du groupe</h2>
          <span className="text-green-400 text-lg font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {COLUMNS.map(col => (
          <div key={col.id} className={`bg-[#0B1220] border border-${col.color} rounded-2xl p-5 shadow-lg`}>
            <p className={`text-sm ${col.textColor || "text-gray-400"}`}>{col.label}</p>
            <h3 className="text-2xl font-bold mt-1">{tasks.filter(t => t.statut === col.id).length}</h3>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {COLUMNS.map(col => (
          <div key={col.id} className={`bg-[#0B1220] border border-${col.color} rounded-2xl p-4 min-h-[240px]`}>
            <h2 className={`font-bold text-sm mb-4 ${col.textColor}`}>{col.label}</h2>
            <div className="space-y-2">
              {tasks.filter(t => t.statut === col.id).map(task => (
                <div key={task.id} className={`bg-${col.id === "done" ? "green" : col.id === "en_cours" ? "blue" : col.id === "revision" ? "yellow" : "gradient-to-r from-[#111827] to-[#1e293b]"}-500/10 border border-white/10 rounded-xl p-3 text-sm`}>
                  {task.titre}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Membres */}
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-4">Membres du groupe</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {members.map((m, i) => (
            <div key={i} className="bg-[#020817] p-4 rounded-xl border border-white/10 text-sm">
              👤 {m.user?.prenom} {m.user?.nom}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-white/10 rounded-2xl p-8">
        <h2 className="text-lg font-bold mb-6">Conversation Professeur ↔ Groupe</h2>

        <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`max-w-[70%] ${isMe ? "ml-auto bg-purple-500/20" : "bg-blue-500/20"} rounded-2xl px-5 py-3 text-sm`}>
                <p className="text-xs text-gray-400 mb-1">{msg.sender?.prenom} {msg.sender?.nom}</p>
                {msg.contenu}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Écrire un message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 bg-[#020817] border border-white/10 rounded-xl p-3 outline-none text-sm"
          />
          <button onClick={handleSend} className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 rounded-xl text-sm font-semibold">
            Envoyer
          </button>
        </div>
      </div>

    </div>
  );
}
