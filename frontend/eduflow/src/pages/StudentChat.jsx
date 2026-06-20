import { useState, useRef, useEffect } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard, Bell, LogOut,
  FileText, Star, Send, Users, PanelLeftClose, PanelLeftOpen, Megaphone,
  Pencil, Trash2, Check, X, Paperclip, Image,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const FILE_BASE = "http://localhost:3000/";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-red-500",
];

function getColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }
function getInitials(u) { return ((u?.prenom?.[0] || "") + (u?.nom?.[0] || "")).toUpperCase() || "?"; }

function FileAttachment({ msg, isMe }) {
  if (!msg.fichier_url) return null;
  const url = FILE_BASE + msg.fichier_url;
  if (msg.fichier_type === "image") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block mt-2">
        <img src={url} alt={msg.fichier_nom} className="max-w-[220px] max-h-[180px] rounded-xl object-cover border border-white/10" />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer"
      className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:opacity-80 transition w-fit border ${isMe ? "bg-blue-700/50 border-blue-400/20 text-blue-100" : "bg-white/[0.06] border-white/10 text-gray-300"}`}>
      <FileText size={14} className="text-red-400 flex-shrink-0" />
      <span className="truncate max-w-[160px]">{msg.fichier_nom}</span>
    </a>
  );
}

export default function StudentChat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [input, setInput] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const bottomRef      = useRef(null);
  const bottomBroadRef = useRef(null);
  const fileInputRef   = useRef(null);

  const [groupId, setGroupId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/auth/me/project");
      if (!data.project) return;
      setProject(data.project);
      setMembers(data.group?.members || []);
      setGroupId(data.membership?.group_id || null);
      const [msgRes, broadRes] = await Promise.all([
        data.membership?.group_id
          ? api.get(`/projects/${data.project.id}/messages?group_id=${data.membership.group_id}`)
          : Promise.resolve({ data: [] }),
        api.get(`/projects/${data.project.id}/messages?group_id=none`),
      ]);
      setMessages(msgRes.data);
      setBroadcasts(broadRes.data);
    };
    load().catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!project || !groupId) return;
    const interval = setInterval(() => {
      api.get(`/projects/${project.id}/messages?group_id=${groupId}`).then(r => setMessages(r.data)).catch(() => {});
      api.get(`/projects/${project.id}/messages?group_id=none`).then(r => setBroadcasts(r.data)).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [project, groupId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { bottomBroadRef.current?.scrollIntoView({ behavior: "smooth" }); }, [broadcasts]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !pendingFile) return;
    if (!project || !groupId) return;
    try {
      const formData = new FormData();
      if (text) formData.append("contenu", text);
      formData.append("group_id", String(groupId));
      if (pendingFile) formData.append("fichier", pendingFile);
      const res = await api.post(`/projects/${project.id}/messages`, formData);
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

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-72 border-r border-white/[0.06]" : "w-0"} overflow-hidden flex-shrink-0 bg-[#0B1220] transition-[width] duration-300 ease-in-out`}>
        <div className="w-72 h-full flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><GraduationCap size={20} /></div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">ProjectHub</h1>
                  <p className="text-gray-500 text-xs">Étudiant</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <Link to="/student" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><LayoutDashboard size={18} /> Tableau de bord</Link>
              <Link to="/student/kanban" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><FolderKanban size={18} /> Mon Projet</Link>
              <Link to="/student/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><FileText size={18} /> Livrables</Link>
              <Link to="/student/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><Star size={18} /> Notes</Link>
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <MessageSquare size={18} /> Chat du groupe
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-white/[0.06]">
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200 w-full">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              {activeTab === "chat" ? <Users size={18} /> : <Megaphone size={18} />}
            </div>
            <div>
              <h1 className="text-base font-bold">{activeTab === "chat" ? (project?.titre || "Chat du groupe") : "Annonces générales"}</h1>
              <p className="text-gray-500 text-xs">{activeTab === "chat" ? `${members.length} membre${members.length !== 1 ? "s" : ""}` : "Messages du superviseur"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${getColor(user?.id)} flex items-center justify-center text-sm font-bold`}>{getInitials(user)}</div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom?.toUpperCase()}</p>
                <p className="text-gray-500 text-xs">{project?.titre || "Mon projet"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-white/[0.06] flex-shrink-0">
          <button onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all duration-200 ${
              activeTab === "chat" ? "border-blue-500 text-white bg-blue-500/[0.07]" : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
            }`}>
            <Users size={15} /> Chat du groupe
          </button>
          <button onClick={() => setActiveTab("annonces")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-all duration-200 relative ${
              activeTab === "annonces" ? "border-amber-500 text-white bg-amber-500/[0.07]" : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
            }`}>
            <Megaphone size={15} /> Annonces
            {broadcasts.length > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {broadcasts.length > 9 ? "9+" : broadcasts.length}
              </span>
            )}
          </button>
        </div>

        {/* Chat du groupe */}
        {activeTab === "chat" && (
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-600 py-16 text-sm">Aucun message pour le moment. Soyez le premier à écrire !</div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user?.id;
                  const sender = msg.sender || {};
                  const prevMsg = messages[idx - 1];
                  const showAuthor = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                  const isEditing = editingId === msg.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 group ${isMe ? "flex-row-reverse" : ""} ${!showAuthor ? (isMe ? "pr-11" : "pl-11") : ""}`}>
                      {showAuthor && (
                        <div className={`w-8 h-8 rounded-full ${getColor(msg.sender_id)} flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md mt-0.5`}>{getInitials(sender)}</div>
                      )}
                      <div className={`max-w-md flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {showAuthor && (
                          <div className="flex items-baseline gap-2 mb-1.5">
                            {!isMe && <span className="text-sm font-semibold text-gray-300">{sender.prenom} {sender.nom?.toUpperCase()}</span>}
                            <span className="text-gray-600 text-xs">{new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
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
                        )}
                        {isEditing ? (
                          <div className="flex flex-col gap-2 w-full">
                            <textarea value={editText} onChange={e => setEditText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSave(msg.id); } if (e.key === "Escape") setEditingId(null); }}
                              rows={2} autoFocus className="w-full bg-[#0d1117] border border-blue-500/40 rounded-xl px-3 py-2 text-sm outline-none resize-none" />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
                                <X size={12} /> Annuler
                              </button>
                              <button onClick={() => handleEditSave(msg.id)} className="flex items-center gap-1 text-xs text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1 rounded-lg transition">
                                <Check size={12} /> Sauvegarder
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20" : "bg-[#0d1117] border border-white/[0.07] rounded-tl-sm"}`}>
                            {msg.contenu && <p>{msg.contenu}</p>}
                            <FileAttachment msg={msg} isMe={isMe} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-white/[0.06] p-4 flex-shrink-0">
                <div className="flex flex-col gap-2">
                  {pendingFile && (
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-300">
                      {pendingFile.type.startsWith("image/") ? <Image size={13} className="text-blue-400" /> : <FileText size={13} className="text-red-400" />}
                      <span className="flex-1 truncate">{pendingFile.name}</span>
                      <button onClick={() => setPendingFile(null)} className="text-gray-600 hover:text-white transition"><X size={13} /></button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-blue-500/30 focus-within:bg-[#0f1520] transition-all duration-200">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && !pendingFile && sendMessage()}
                      placeholder="Écrire un message au groupe..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder-gray-700" />
                    <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                      onChange={e => { setPendingFile(e.target.files?.[0] || null); e.target.value = ""; }} />
                    <button onClick={() => fileInputRef.current?.click()}
                      className={`p-1.5 rounded-lg transition ${pendingFile ? "text-blue-400 bg-blue-500/10" : "text-gray-600 hover:text-white hover:bg-white/[0.05]"}`}
                      title="Joindre une image ou un PDF">
                      <Paperclip size={15} />
                    </button>
                    <button onClick={sendMessage} disabled={!input.trim() && !pendingFile}
                      className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 flex-shrink-0">
                      <Send size={14} />
                    </button>
                  </div>
                  <p className="text-center text-gray-700 text-xs">Appuyez sur Entrée pour envoyer · <span className="text-gray-600">PDF, PNG, JPG acceptés</span></p>
                </div>
              </div>
            </div>

            {/* Membres panel */}
            <div className="w-56 border-l border-white/[0.06] p-5 flex-shrink-0 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users size={13} /> Membres — {members.length}
              </h3>
              <div className="space-y-3">
                {members.map(m => {
                  const isMe = m.user_id === user?.id;
                  const u = m.user || {};
                  return (
                    <div key={m.user_id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getColor(m.user_id)} flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>{getInitials(u)}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{u.prenom} {u.nom?.toUpperCase()}{isMe && <span className="text-blue-400 ml-1">(vous)</span>}</p>
                        <p className="text-gray-600 text-xs truncate">{m.role_in_project === "lead" ? "Chef de projet" : "Membre"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {project && (
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Projet</p>
                  <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-3">
                    <p className="text-blue-300 text-xs font-semibold leading-snug">{project.titre}</p>
                    {project.description && <p className="text-gray-500 text-xs mt-1 truncate">{project.description}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Annonces — lecture seule, les pièces jointes du superviseur sont visibles */}
        {activeTab === "annonces" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {broadcasts.length === 0 ? (
              <div className="text-center text-gray-600 py-16 text-sm">
                <Megaphone size={32} className="mx-auto mb-3 opacity-20" />
                Aucune annonce pour le moment.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Megaphone size={11} /> Lecture seule
                  </span>
                  <span className="text-gray-600 text-xs">Ces annonces sont envoyées par votre superviseur</span>
                </div>
                {broadcasts.map((msg, idx) => {
                  const sender = msg.sender || {};
                  const prevMsg = broadcasts[idx - 1];
                  const showAuthor = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${!showAuthor ? "pl-11" : ""}`}>
                      {showAuthor && (
                        <div className={`w-8 h-8 rounded-full ${getColor(msg.sender_id)} flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md mt-0.5`}>{getInitials(sender)}</div>
                      )}
                      <div className="max-w-2xl flex flex-col items-start">
                        {showAuthor && (
                          <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-sm font-semibold text-amber-300">{sender.prenom} {sender.nom?.toUpperCase()}</span>
                            <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Superviseur</span>
                            <span className="text-gray-600 text-xs">{new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        )}
                        <div className="bg-amber-500/[0.07] border border-amber-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed text-gray-200">
                          {msg.contenu && <p>{msg.contenu}</p>}
                          <FileAttachment msg={msg} isMe={false} />
                        </div>
                        <span className="text-gray-700 text-xs mt-1">
                          {new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomBroadRef} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
