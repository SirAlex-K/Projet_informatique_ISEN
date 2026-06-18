import { useState, useEffect, useRef } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard,
  Bell, LogOut, ClipboardCheck, Megaphone, Users, Send,
  ChevronDown, User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-500",
];

const TABS = [
  { key: "annonces", label: "Annonces",           icon: Megaphone },
  { key: "groupes",  label: "Discussions de groupe", icon: Users },
];

export default function SupervisorMessages() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,        setActiveTab]        = useState("annonces");
  const [projects,         setProjects]         = useState([]);
  const [selectedProject,  setSelectedProject]  = useState(null);
  const [showProjectDrop,  setShowProjectDrop]  = useState(false);
  const [groups,           setGroups]           = useState([]);
  const [selectedConv,     setSelectedConv]     = useState(null); // null=broadcast, group obj=group chat
  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState("");
  const bottomRef = useRef(null);

  // Charge les projets au mount
  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0]);
    }).catch(console.error);
  }, []);

  // Quand le projet change → charge les groupes, reset conversation
  useEffect(() => {
    if (!selectedProject) return;
    setSelectedConv(null);
    setMessages([]);
    api.get(`/projects/${selectedProject.id}/groups`)
      .then(res => setGroups(res.data))
      .catch(console.error);
    // Sur l'onglet annonces, charge directement le broadcast
    if (activeTab === "annonces") loadMessages(selectedProject.id, null);
  }, [selectedProject]);

  // Quand l'onglet change → reset la conversation sélectionnée
  useEffect(() => {
    setSelectedConv(null);
    setMessages([]);
    if (activeTab === "annonces" && selectedProject) {
      loadMessages(selectedProject.id, null);
    }
  }, [activeTab]);

  // Quand la conversation change → charge les messages
  useEffect(() => {
    if (!selectedProject) return;
    if (activeTab === "annonces") {
      loadMessages(selectedProject.id, null);
    } else if (selectedConv) {
      loadMessages(selectedProject.id, selectedConv.id);
    }
  }, [selectedConv]);

  // Polling
  useEffect(() => {
    if (!selectedProject) return;
    const groupId = activeTab === "annonces" ? null : selectedConv?.id;
    if (activeTab === "groupes" && !selectedConv) return;
    const interval = setInterval(() => {
      loadMessages(selectedProject.id, groupId);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedProject, selectedConv, activeTab]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadMessages = async (projectId, groupId) => {
    try {
      const url = groupId
        ? `/projects/${projectId}/messages?group_id=${groupId}`
        : `/projects/${projectId}/messages`;
      const res = await api.get(url);
      // Pour le broadcast, on prend uniquement les messages sans group_id
      const filtered = groupId
        ? res.data
        : res.data.filter(m => !m.group_id);
      setMessages(filtered);
    } catch (e) { console.error(e); }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedProject) return;
    const groupId = activeTab === "annonces" ? null : selectedConv?.id;
    if (activeTab === "groupes" && !selectedConv) return;
    try {
      const body = { contenu: text };
      if (groupId) body.group_id = groupId;
      const res = await api.post(`/projects/${selectedProject.id}/messages`, body);
      setMessages(prev => [...prev, res.data]);
      setInput("");
    } catch (e) { console.error(e); }
  };

  const convTitle = activeTab === "annonces"
    ? "Annonce générale"
    : selectedConv ? `Groupe ${selectedConv.numero}` : "Sélectionnez un groupe";

  const canSend = activeTab === "annonces" || (activeTab === "groupes" && selectedConv);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* ── Sidebar ── */}
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
            <Link to="/supervisor/evaluation" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><ClipboardCheck size={17} /> Évaluation</Link>
            <Link to="/supervisor/projects" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><FolderKanban size={17} /> Projets</Link>
            <Link to="/supervisor/students" className="px-3 py-2.5 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition"><GraduationCap size={17} /> Étudiants</Link>
            <div className="bg-purple-600/90 rounded-xl px-3 py-2.5 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-purple-500/20">
              <MessageSquare size={17} /> Messages
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-3 py-2.5 text-red-400 text-sm hover:bg-red-500/15 transition">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0 bg-[#0B1220]">
          <div>
            <h1 className="text-xl font-bold">Messages</h1>
            <p className="text-gray-500 text-xs mt-0.5">Communiquez avec vos étudiants</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0B1220]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "P"}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom?.toUpperCase()}</p>
                <p className="text-gray-500 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* ── Colonne gauche : conversations ── */}
          <div className="w-[280px] flex-shrink-0 border-r border-white/[0.06] flex flex-col">

            {/* Sélecteur de projet */}
            <div className="p-4 border-b border-white/[0.06]">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Projet</p>
              <div className="relative">
                <button
                  onClick={() => setShowProjectDrop(v => !v)}
                  className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-left hover:border-purple-500/30 transition"
                >
                  <span className="truncate text-gray-300">{selectedProject?.titre || "Choisir..."}</span>
                  <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
                </button>
                {showProjectDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1220] border border-white/[0.08] rounded-xl shadow-xl z-20 overflow-hidden">
                    {projects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProject(p); setShowProjectDrop(false); }}
                        className={`w-full text-left px-3 py-2.5 text-sm truncate hover:bg-white/[0.05] transition ${selectedProject?.id === p.id ? "text-purple-300" : "text-gray-400"}`}
                      >
                        {p.titre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Onglets */}
            <div className="flex border-b border-white/[0.06]">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition border-b-2 ${
                    activeTab === key
                      ? "border-purple-500 text-purple-300"
                      : "border-transparent text-gray-600 hover:text-gray-400"
                  }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {activeTab === "annonces" && (
                <button
                  onClick={() => setSelectedConv(null)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition bg-purple-500/10 border border-purple-500/20 text-purple-300"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                    <Megaphone size={14} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Annonce générale</p>
                    <p className="text-xs text-gray-500 truncate">Tous les groupes du projet</p>
                  </div>
                </button>
              )}

              {activeTab === "groupes" && groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedConv(g)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
                    selectedConv?.id === g.id
                      ? "bg-purple-500/10 border border-purple-500/20 text-purple-300"
                      : "hover:bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${AVATAR_COLORS[g.id % AVATAR_COLORS.length]}`}>
                    {g.numero}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Groupe {g.numero}</p>
                    <p className="text-xs text-gray-500">{g.members?.length}/{g.capacite_max} membres</p>
                  </div>
                  {g.sujet && (
                    <span className="ml-auto text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full flex-shrink-0 max-w-[80px] truncate">
                      {g.sujet.libelle}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Zone de chat ── */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header chat */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3 flex-shrink-0">
              {activeTab === "annonces" ? (
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Megaphone size={16} className="text-purple-400" />
                </div>
              ) : selectedConv ? (
                <div className={`w-9 h-9 rounded-xl ${AVATAR_COLORS[selectedConv.id % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold`}>
                  {selectedConv.numero}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <Users size={16} className="text-gray-600" />
                </div>
              )}
              <div>
                <p className="font-bold text-sm">{convTitle}</p>
                <p className="text-gray-500 text-xs">
                  {activeTab === "annonces"
                    ? `${selectedProject?.titre || ""} — broadcast vers tous les groupes`
                    : selectedConv
                      ? `${selectedProject?.titre || ""} · ${selectedConv.members?.length} membre${(selectedConv.members?.length || 0) !== 1 ? "s" : ""}`
                      : "Sélectionnez un groupe à gauche"}
                </p>
              </div>
              {activeTab === "annonces" && (
                <span className="ml-auto flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full font-semibold">
                  <Megaphone size={11} /> Broadcast
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
                    {activeTab === "annonces" ? <Megaphone size={22} className="text-gray-600" /> : <MessageSquare size={22} className="text-gray-600" />}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {activeTab === "annonces"
                      ? "Aucune annonce pour ce projet"
                      : canSend ? "Aucun message dans ce groupe" : "Sélectionnez un groupe"}
                  </p>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                const senderColor = AVATAR_COLORS[(msg.sender_id || 0) % AVATAR_COLORS.length];
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full ${senderColor} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                      {msg.sender?.prenom?.[0]}{msg.sender?.nom?.[0]}
                    </div>
                    <div className={`max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        {!isMe && <span className="text-xs font-semibold text-gray-400">{msg.sender?.prenom} {msg.sender?.nom?.toUpperCase()}</span>}
                        <span className="text-gray-600 text-[10px]">
                          {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? "bg-purple-600 text-white rounded-tr-sm"
                          : "bg-[#0d1117] border border-white/[0.07] text-gray-200 rounded-tl-sm"
                      }`}>
                        {msg.contenu}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-4 flex-shrink-0">
              {canSend ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder={
                      activeTab === "annonces"
                        ? "Écrire une annonce pour tous les groupes..."
                        : `Écrire au groupe ${selectedConv?.numero}...`
                    }
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/40 transition placeholder-gray-700"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-5 rounded-xl text-sm font-semibold transition disabled:opacity-30 shadow-lg shadow-purple-500/20"
                  >
                    <Send size={15} /> Envoyer
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm py-2">
                  Sélectionnez un groupe dans la liste pour chatter
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
