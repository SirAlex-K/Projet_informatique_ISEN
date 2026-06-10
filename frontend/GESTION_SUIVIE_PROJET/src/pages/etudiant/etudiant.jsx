import { useState } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  FileText,
  Star,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

const checkpoints = [
  { name: "Checkpoint 1 – Cahier des charges", status: "done", date: "01/03/2024" },
  { name: "Checkpoint 2 – Maquettes UI/UX", status: "done", date: "15/03/2024" },
  { name: "Checkpoint 3 – MVP", status: "current", date: "30/03/2024" },
  { name: "Checkpoint 4 – Rendu final", status: "upcoming", date: "15/04/2024" },
];

const groupMembers = [
  { name: "Aziz Diop", role: "Chef de projet", color: "bg-blue-500", initial: "A", isMe: true },
  { name: "Léa Martin", role: "Développeuse", color: "bg-purple-500", initial: "L" },
  { name: "Tom Bernard", role: "Designer", color: "bg-green-500", initial: "T" },
  { name: "Camille Roy", role: "Développeuse", color: "bg-orange-500", initial: "C" },
];

const stats = [
  {
    icon: <FolderKanban size={22} />,
    value: "1",
    label: "Projet actif",
    bg: "bg-blue-500/10",
    iconBg: "bg-blue-600",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  {
    icon: <Users size={22} />,
    value: "4",
    label: "Membres du groupe",
    bg: "bg-purple-500/10",
    iconBg: "bg-purple-600",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
  },
  {
    icon: <FileText size={22} />,
    value: "2",
    label: "Livrables à rendre",
    bg: "bg-orange-500/10",
    iconBg: "bg-orange-500",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/10",
  },
  {
    icon: <TrendingUp size={22} />,
    value: "50%",
    label: "Progression",
    bg: "bg-green-500/10",
    iconBg: "bg-green-600",
    border: "border-green-500/20",
    glow: "shadow-green-500/10",
  },
];

// ─── Infos du projet ─────────────────────────────────────────────────
const STUDENT_CLASS = "CIR3";
const PROJECT_YEAR = "2025–2026";

export default function Student() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar (repliable) */}
      <div
        className={`${
          sidebarOpen ? "w-72 border-r border-white/[0.06]" : "w-0"
        } overflow-hidden flex-shrink-0 bg-[#0B1220] transition-[width] duration-300 ease-in-out`}
      >
        <div className="w-72 h-full flex flex-col justify-between">
          <div>
            {/* Logo */}
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

            {/* Nav */}
            <div className="p-4 space-y-1">
              <Link
                to="/etudiant"
                className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
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
              <Link to="/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  Chat du groupe
                </div>
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold">3</span>
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-white/[0.06]">
            <Link to="/login" className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200">
              <LogOut size={16} />
              Déconnexion
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Bouton masquer / afficher le menu */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Tableau de bord</h1>
              <p className="text-gray-500 text-sm mt-0.5">Vue d'ensemble de votre projet</p>
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

        <div className="flex-1 overflow-y-auto p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-1">Bonjour, Aziz 👋</h2>
            <p className="text-gray-500 text-sm mb-3">Voici l'état de votre projet · Checkpoint 3 en cours</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-medium">
                <GraduationCap size={13} />
                {STUDENT_CLASS}
              </span>
              <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-medium">
                <Calendar size={13} />
                {PROJECT_YEAR}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">Progression globale</span>
              <span className="text-sm font-bold text-blue-400">50%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg shadow-blue-500/30" />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">2 checkpoints validés</span>
              <span className="text-xs text-gray-600">2 restants</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`${s.bg} border ${s.border} rounded-2xl p-5 shadow-lg ${s.glow} hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center mb-4 shadow-md`}>
                  {s.icon}
                </div>
                <p className="text-3xl font-bold mb-1">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Progression */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-base font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Checkpoints
              </h2>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/[0.06]" />
                <div className="space-y-5">
                  {checkpoints.map((cp, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                        cp.status === "done"
                          ? "bg-green-500/20 border-green-500 text-green-400"
                          : cp.status === "current"
                          ? "bg-blue-500/20 border-blue-500 text-blue-400"
                          : "bg-white/[0.03] border-white/10 text-gray-600"
                      }`}>
                        {cp.status === "done" ? (
                          <CheckCircle size={16} />
                        ) : cp.status === "current" ? (
                          <Clock size={16} />
                        ) : (
                          <span className="text-xs font-bold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`text-sm font-medium leading-tight ${
                          cp.status === "upcoming" ? "text-gray-600" : "text-white"
                        }`}>{cp.name}</p>
                        <p className="text-gray-600 text-xs mt-1">{cp.date}</p>
                      </div>
                      {cp.status === "current" && (
                        <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-2.5 py-1 mt-0.5">
                          En cours
                        </span>
                      )}
                      {cp.status === "done" && (
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-1 mt-0.5">
                          Validé
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Groupe */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users size={16} className="text-purple-400" />
                  Mon groupe · Groupe 3
                </h2>
                <Link to="/chat" className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-lg hover:bg-blue-500/10">
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {groupMembers.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-3 transition-all duration-200">
                    <div className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-sm font-bold shadow-md flex-shrink-0`}>
                      {m.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{m.name}</p>
                      <p className="text-gray-500 text-xs">{m.role}</p>
                    </div>
                    {m.isMe && (
                      <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-2.5 py-1">
                        Vous
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                to="/chat"
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/15 rounded-xl py-2.5 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <MessageSquare size={15} />
                Ouvrir le chat du groupe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}