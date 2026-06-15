import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ClipboardCheck,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SupervisorMessages() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const load = () => api.get(`/projects/${selectedProject.id}/messages`)
      .then(res => setMessages(res.data))
      .catch(console.error);
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selectedProject]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedProject) return;
    try {
      const res = await api.post(`/projects/${selectedProject.id}/messages`, { contenu: text });
      setMessages(prev => [...prev, res.data]);
      setInput("");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className="w-[280px] border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">EduFlow</h1>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <Link to="/supervisor" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <LayoutDashboard size={18} /> Tableau de bord
            </Link>
            <Link to="/supervisor/evaluation" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <ClipboardCheck size={18} /> Évaluation
            </Link>
            <Link to="/supervisor/projects" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <FolderKanban size={18} /> Projets
            </Link>
            <Link to="/supervisor/students" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <GraduationCap size={18} /> Étudiants
            </Link>
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center justify-between text-sm font-semibold shadow-lg">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> Messages
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                {messages.filter(m => !m.is_read && m.sender_id !== user?.id).length || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex items-center gap-5">
            <div className="relative"><Bell size={20} /><div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div></div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "P"}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{user?.prenom} {user?.nom}</h2>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Messages</h2>
              <p className="text-gray-400 text-sm">Communiquez avec vos étudiants</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* Conversations */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4">Projets</h3>
              <div className="space-y-2">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left rounded-xl p-3 text-sm transition ${selectedProject?.id === p.id ? "bg-purple-500/20 text-white" : "bg-white/[0.03] text-gray-400 hover:text-white"}`}
                  >
                    📁 {p.titre}
                  </button>
                ))}
              </div>
            </div>

            {/* Discussion */}
            <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col">
              <h3 className="text-lg font-bold mb-4">
                {selectedProject ? `📢 ${selectedProject.titre}` : "Sélectionnez un projet"}
              </h3>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-80">
                {messages.map(msg => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`rounded-xl p-4 ${isMe ? "bg-purple-500/10 ml-12" : "bg-blue-500/10 mr-12"}`}>
                      <p className="font-semibold text-sm mb-1">
                        {isMe ? `${user.prenom} ${user.nom}` : `${msg.sender?.prenom || ""} ${msg.sender?.nom || ""}`}
                      </p>
                      <p className="text-gray-300 text-sm">{msg.contenu}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {selectedProject && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-[#0B1220] border border-white/10 rounded-xl p-3 text-sm outline-none"
                  />
                  <button onClick={handleSend} className="bg-gradient-to-r from-purple-500 to-purple-400 px-6 rounded-xl text-sm font-semibold">Envoyer</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
