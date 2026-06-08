import { useState, useRef, useEffect } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  FileText,
  Star,
  Send,
  Paperclip,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const GROUP_MEMBERS = [
  { name: "Aziz Diop", role: "Chef de projet", color: "bg-blue-500", initial: "A", isMe: true, online: true },
  { name: "Léa Martin", role: "Développeuse", color: "bg-purple-500", initial: "L", online: true },
  { name: "Tom Bernard", role: "Designer", color: "bg-green-500", initial: "T", online: false },
  { name: "Camille Roy", role: "Développeuse", color: "bg-orange-500", initial: "C", online: true },
];

const INITIAL_MESSAGES = [
  { id: 1, author: "Léa Martin", initial: "L", avatarColor: "bg-purple-500", text: "Salut tout le monde ! J'ai fini les maquettes, je les ai mises sur Drive 📁", time: "09:32", isMe: false },
  { id: 2, author: "Tom Bernard", initial: "T", avatarColor: "bg-green-500", text: "Super ! Je regarde ça tout de suite. J'ai aussi bien avancé sur le design system 🎨", time: "09:45", isMe: false },
  { id: 3, author: "Aziz Diop", initial: "A", avatarColor: "bg-blue-500", text: "Parfait ! Pour la partie kanban, je commence l'intégration React cet après-midi.", time: "10:01", isMe: true },
  { id: 4, author: "Camille Roy", initial: "C", avatarColor: "bg-orange-500", text: "OK ! Je finalise le schéma BDD et on fait un point à 17h ?", time: "10:15", isMe: false },
  { id: 5, author: "Léa Martin", initial: "L", avatarColor: "bg-purple-500", text: "Ça marche pour moi 👍", time: "10:16", isMe: false },
  { id: 6, author: "Tom Bernard", initial: "T", avatarColor: "bg-green-500", text: "Pareil ! Bon courage à tous pour la matinée ☕", time: "10:18", isMe: false },
];

export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "Aziz Diop",
        initial: "A",
        avatarColor: "bg-blue-500",
        text,
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/[0.06] bg-[#0B1220] flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">ProjectHub</h1>
                <p className="text-gray-500 text-xs">Étudiant</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <Link to="/etudiant" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <LayoutDashboard size={18} />
              Tableau de bord
            </Link>
            <Link to="/kanban" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <FolderKanban size={18} />
              Mon Projet
            </Link>
            <Link to="/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <FileText size={18} />
              Livrables
            </Link>
            <Link to="/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <Star size={18} />
              Notes
            </Link>
            <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
              <MessageSquare size={18} />
              Chat du groupe
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <Link to="/login" className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200">
            <LogOut size={16} />
            Déconnexion
          </Link>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Users size={18} />
            </div>
            <div>
              <h1 className="text-base font-bold">Groupe 3</h1>
              <p className="text-gray-500 text-xs">Application React – ProjectHub · 4 membres · 3 en ligne</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold">A</div>
              <div>
                <p className="text-sm font-semibold leading-tight">Aziz Diop</p>
                <p className="text-gray-500 text-xs">Groupe 3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const prevMsg = messages[idx - 1];
                const showAuthor = !prevMsg || prevMsg.author !== msg.author || prevMsg.isMe !== msg.isMe;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""} ${
                      !showAuthor ? (msg.isMe ? "pr-11" : "pl-11") : ""
                    }`}
                  >
                    {showAuthor && (
                      <div className={`w-8 h-8 rounded-full ${msg.avatarColor} flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md mt-0.5`}>
                        {msg.initial}
                      </div>
                    )}
                    <div className={`max-w-md flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                      {showAuthor && (
                        <div className="flex items-baseline gap-2 mb-1.5">
                          {!msg.isMe && <span className="text-sm font-semibold text-gray-300">{msg.author}</span>}
                          <span className="text-gray-600 text-xs">{msg.time}</span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.isMe
                          ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20"
                          : "bg-[#0d1117] border border-white/[0.07] rounded-tl-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.06] p-4 flex-shrink-0">
              <div className="flex items-center gap-3 bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-blue-500/30 focus-within:bg-[#0f1520] transition-all duration-200">
                <button
                  className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip size={18} />
                  <input ref={fileRef} type="file" className="hidden" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Écrire un message au groupe..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-700"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-center text-gray-700 text-xs mt-2">Appuyez sur Entrée pour envoyer</p>
            </div>
          </div>

          {/* Members panel */}
          <div className="w-56 border-l border-white/[0.06] p-5 flex-shrink-0 overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users size={13} />
              Membres — {GROUP_MEMBERS.filter(m => m.online).length} en ligne
            </h3>
            <div className="space-y-3">
              {GROUP_MEMBERS.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-xs font-bold shadow-sm`}>
                      {m.initial}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#020817] ${m.online ? "bg-green-500" : "bg-gray-600"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">
                      {m.name}
                      {m.isMe && <span className="text-blue-400 ml-1">(vous)</span>}
                    </p>
                    <p className="text-gray-600 text-xs truncate">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Projet</p>
              <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-xl p-3">
                <p className="text-blue-300 text-xs font-semibold leading-snug">Application React – ProjectHub</p>
                <p className="text-gray-500 text-xs mt-1">Checkpoint 3 en cours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}