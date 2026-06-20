import { useState, useEffect, useRef } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard,
  Bell, LogOut, ClipboardCheck, Megaphone, Users, Send,
  ChevronDown, Pencil, Trash2, Check, X, Paperclip, FileText, Image,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const FILE_BASE = "http://localhost:3000/";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-500",
];

const TABS = [
  { key: "annonces", label: "Annonces",              icon: Megaphone },
  { key: "groupes",  label: "Discussions de groupe", icon: Users },
];

function FileAttachment({ msg }) {
  if (!msg.fichier_url) return null;
  const url = FILE_BASE + msg.fichier_url;
  if (msg.fichier_type === "image") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block mt-2">
        <img src={url} alt={msg.fichier_nom} className="max-w-[240px] max-h-[200px] rounded-xl object-cover border border-white/10" />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer"
      className="mt-2 flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 hover:bg-white/10 transition w-fit">
      <FileText size={14} className="text-red-400 flex-shrink-0" />
      <span className="truncate max-w-[180px]">{msg.fichier_nom}</span>
    </a>
  );
}

export default function SupervisorMessages() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,        setActiveTab]        = useState("annonces");
  const [projects,         setProjects]         = useState([]);
  const [selectedProject,  setSelectedProject]  = useState(null);
  const [showProjectDrop,  setShowProjectDrop]  = useState(false);
  const [groups,           setGroups]           = useState([]);
  const [selectedConv,     setSelectedConv]     = useState(null);
  const [showAllGroups,    setShowAllGroups]    = useState(false);
  const GROUP_LIMIT = 10;
  const [messages,         setMessages]         = useState([]);
  const [input,            setInput]            = useState("");
  const [pendingFile,      setPendingFile]      = useState(null);
  const [editingId,        setEditingId]        = useState(null);
  const [editText,         setEditText]         = useState("");
  const fileInputRef = useRef(null);
  const bottomRef    = useRef(null);

  useEffect(() => {
    api.get("/projects").then(res => {
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setSelectedConv(null);
    setMessages([]);
    setShowAllGroups(false);
    api.get(`/projects/${selectedProject.id}/groups`).then(res => setGroups(res.data)).catch(console.error);
    if (activeTab === "annonces") loadMessages(selectedProject.id, null);
  }, [selectedProject]);

  useEffect(() => {
    setSelectedConv(null);
    setMessages([]);
    if (activeTab === "annonces" && selectedProject) loadMessages(selectedProject.id, null);
  }, [activeTab]);

  useEffect(() => {
    if (!selectedProject) return;
    if (activeTab === "annonces") loadMessages(selectedProject.id, null);
    else if (selectedConv) loadMessages(selectedProject.id, selectedConv.id);
  }, [selectedConv]);

  useEffect(() => {
    if (!selectedProject) return;
    const groupId = activeTab === "annonces" ? null : selectedConv?.id;
    if (activeTab === "groupes" && !selectedConv) return;
    const interval = setInterval(() => loadMessages(selectedProject.id, groupId), 5000);
    return () => clearInterval(interval);
  }, [selectedProject, selectedConv, activeTab]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadMessages = async (projectId, groupId) => {
    try {
      const url = groupId
        ? `/projects/${projectId}/messages?group_id=${groupId}`
        : `/projects/${projectId}/messages`;
      const res = await api.get(url);
      const filtered = groupId ? res.data : res.data.filter(m => !m.group_id);
      setMessages(filtered);
    } catch (e) { console.error(e); }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !pendingFile) return;
    if (!selectedProject) return;
    const groupId = activeTab === "annonces" ? null : selectedConv?.id;
    if (activeTab === "groupes" && !selectedConv) return;
    try {
      const formData = new FormData();
      if (text) formData.append("contenu", text);
      if (groupId) formData.append("group_id", String(groupId));
      if (pendingFile) formData.append("fichier", pendingFile);
      const res = await api.post(`/projects/${selectedProject.id}/messages`, formData);
      setMessages(prev => [...prev, res.data]);
      setInput("");
      setPendingFile(null);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await api.delete(`/messages/${msgId}`);
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (e) { console.error(e); }
  };

  const handleEditSave = async (msgId) => {
    const text = editText.trim();
    if (!text) return;
    try {
      const res = await api.put(`/messages/${msgId}`, { contenu: text });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, contenu: res.data.contenu } : m));
      setEditingId(null);
    } catch (e) { console.error(e); }
  };

  const convTitle = activeTab === "annonces"
    ? "Annonce générale"
    : selectedConv ? `Groupe ${selectedConv.numero}` : "Sélectionnez un groupe";

  const canSend = activeTab === "annonces" || (activeTab === "groupes" && selectedConv);

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

      {/* Main */}
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
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">{user?.prenom?.[0] || "P"}</div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom?.toUpperCase()}</p>
                <p className="text-gray-500 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* Colonne gauche */}
          <div className="w-[280px] flex-shrink-0 border-r border-white/[0.06] flex flex-col">
            <div className="p-4 border-b border-white/[0.06]">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Projet</p>
              <div className="relative">
                <button onClick={() => setShowProjectDrop(v => !v)}
                  className="w-full flex items-center justify-between gap-2 bg-[#020817] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-left hover:border-purple-500/30 transition">
                  <span className="truncate text-gray-300">{selectedProject?.titre || "Choisir..."}</span>
                  <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
                </button>
                {showProjectDrop && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1220] border border-white/[0.08] rounded-xl shadow-xl z-20 overflow-hidden">
                    {projects.map(p => (
                      <button key={p.id} onClick={() => { setSelectedProject(p); setShowProjectDrop(false); }}
                        className={`w-full text-left px-3 py-2.5 text-sm truncate hover:bg-white/[0.05] transition ${selectedProject?.id === p.id ? "text-purple-300" : "text-gray-400"}`}>
                        {p.titre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex border-b border-white/[0.06]">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition border-b-2 ${
                    activeTab === key ? "border-purple-500 text-purple-300" : "border-transparent text-gray-600 hover:text-gray-400"
                  }`}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {activeTab === "annonces" && (
                <button onClick={() => setSelectedConv(null)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                    <Megaphone size={14} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">Annonce générale</p>
                    <p className="text-xs text-gray-500 truncate">Tous les groupes du projet</p>
                  </div>
                </button>
              )}
              {activeTab === "groupes" && (
                <>
                  {(showAllGroups ? groups : groups.slice(0, GROUP_LIMIT)).map(g => (
                    <button key={g.id} onClick={() => setSelectedConv(g)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition ${
                        selectedConv?.id === g.id
                          ? "bg-purple-500/10 border border-purple-500/20 text-purple-300"
                          : "hover:bg-white/[0.04] text-gray-400 hover:text-white"
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${AVATAR_COLORS[g.id % AVATAR_COLORS.length]}`}>
                        {g.numero}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">Groupe {g.numero}</p>
                        <p className="text-xs text-gray-500">{g.members?.length}/{g.capacite_max} membres</p>
                      </div>
                    </button>
                  ))}
                  {groups.length > GROUP_LIMIT && (
                    <button
                      onClick={() => setShowAllGroups(v => !v)}
                      className="w-full text-center text-xs py-2 text-gray-500 hover:text-purple-300 transition"
                    >
                      {showAllGroups
                        ? "↑ Réduire"
                        : `Voir plus · ${groups.length - GROUP_LIMIT} groupe${groups.length - GROUP_LIMIT > 1 ? "s" : ""} masqué${groups.length - GROUP_LIMIT > 1 ? "s" : ""}`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Zone chat */}
          <div className="flex-1 flex flex-col min-w-0">

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
                    {activeTab === "annonces" ? "Aucune annonce pour ce projet" : canSend ? "Aucun message dans ce groupe" : "Sélectionnez un groupe"}
                  </p>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                const senderColor = AVATAR_COLORS[(msg.sender_id || 0) % AVATAR_COLORS.length];
                const isEditing = editingId === msg.id;
                return (
                  <div key={msg.id} className={`flex gap-3 group ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full ${senderColor} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                      {msg.sender?.prenom?.[0]}{msg.sender?.nom?.[0]}
                    </div>
                    <div className={`max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        {!isMe && <span className="text-xs font-semibold text-gray-400">{msg.sender?.prenom} {msg.sender?.nom?.toUpperCase()}</span>}
                        <span className="text-gray-600 text-[10px]">
                          {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isMe && !isEditing && (
                          <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {msg.contenu && (
                              <button onClick={() => { setEditingId(msg.id); setEditText(msg.contenu); }}
                                className="p-1 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition" title="Modifier">
                                <Pencil size={12} />
                              </button>
                            )}
                            <button onClick={() => handleDelete(msg.id)}
                              className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition" title="Supprimer">
                              <Trash2 size={12} />
                            </button>
                          </span>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="flex flex-col gap-2 w-full">
                          <textarea value={editText} onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSave(msg.id); } if (e.key === "Escape") setEditingId(null); }}
                            rows={2} autoFocus className="w-full bg-[#0d1117] border border-purple-500/40 rounded-xl px-3 py-2 text-sm outline-none resize-none" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
                              <X size={12} /> Annuler
                            </button>
                            <button onClick={() => handleEditSave(msg.id)} className="flex items-center gap-1 text-xs text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 px-2 py-1 rounded-lg transition">
                              <Check size={12} /> Sauvegarder
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe ? "bg-purple-600 text-white rounded-tr-sm" : "bg-[#0d1117] border border-white/[0.07] text-gray-200 rounded-tl-sm"}`}>
                          {msg.contenu && <p>{msg.contenu}</p>}
                          <FileAttachment msg={msg} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-4 flex-shrink-0">
              {canSend ? (
                <div className="flex flex-col gap-2">
                  {/* Aperçu fichier sélectionné */}
                  {pendingFile && (
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-300">
                      {pendingFile.type.startsWith("image/") ? <Image size={13} className="text-blue-400" /> : <FileText size={13} className="text-red-400" />}
                      <span className="flex-1 truncate">{pendingFile.name}</span>
                      <button onClick={() => setPendingFile(null)} className="text-gray-600 hover:text-white transition"><X size={13} /></button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text"
                      placeholder={activeTab === "annonces" ? "Écrire une annonce..." : `Écrire au groupe ${selectedConv?.numero}...`}
                      value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !pendingFile && handleSend()}
                      className="flex-1 bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/40 transition placeholder-gray-700"
                    />
                    {/* Bouton fichier */}
                    <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                      onChange={e => { setPendingFile(e.target.files?.[0] || null); e.target.value = ""; }} />
                    <button onClick={() => fileInputRef.current?.click()}
                      className={`px-3 rounded-xl border transition ${pendingFile ? "border-purple-500/40 bg-purple-500/10 text-purple-300" : "border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.05]"}`}
                      title="Joindre une image ou un PDF">
                      <Paperclip size={16} />
                    </button>
                    <button onClick={handleSend} disabled={!input.trim() && !pendingFile}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-5 rounded-xl text-sm font-semibold transition disabled:opacity-30 shadow-lg shadow-purple-500/20">
                      <Send size={15} /> Envoyer
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 text-sm py-2">Sélectionnez un groupe dans la liste pour chatter</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
