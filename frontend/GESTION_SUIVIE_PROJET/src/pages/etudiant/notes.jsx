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
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// Chaque projet a UNE note finale globale (grade), pas une note par checkpoint.
// Les checkpoints ne servent ici qu'à visualiser la progression (status uniquement).
const NOTES_DATA = [
  {
    id: 1,
    project: "Application React – EduFlow",
    professor: "Prof. Dubois",
    grade: null, // null = pas encore noté ; mettre un nombre (ex: 16) une fois la note donnée
    max: 20,
    gradedDate: null,
    comment: null,
    checkpoints: [
      { name: "Checkpoint 1 – Cahier des charges", date: "01/03/2024", status: "done" },
      { name: "Checkpoint 2 – Maquettes UI/UX", date: "15/03/2024", status: "done" },
      { name: "Checkpoint 3 – MVP", date: "30/03/2024", status: "current" },
      { name: "Checkpoint 4 – Rendu final", date: "15/04/2024", status: "upcoming" },
    ],
  },
];

function getNoteColor(note) {
  if (note >= 16) return { text: "text-green-400", bar: "bg-green-500", badge: "bg-green-500/15 border-green-500/25 text-green-400" };
  if (note >= 12) return { text: "text-blue-400", bar: "bg-blue-500", badge: "bg-blue-500/15 border-blue-500/25 text-blue-400" };
  if (note >= 10) return { text: "text-orange-400", bar: "bg-orange-500", badge: "bg-orange-500/15 border-orange-500/25 text-orange-400" };
  return { text: "text-red-400", bar: "bg-red-500", badge: "bg-red-500/15 border-red-500/25 text-red-400" };
}

function getMention(avg) {
  if (avg >= 16) return { label: "Très bien", color: "text-green-400" };
  if (avg >= 14) return { label: "Bien", color: "text-blue-400" };
  if (avg >= 12) return { label: "Assez bien", color: "text-blue-300" };
  if (avg >= 10) return { label: "Passable", color: "text-orange-400" };
  return { label: "Insuffisant", color: "text-red-400" };
}

export default function Notes() {
  const [expanded, setExpanded] = useState({ 1: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const gradedProjects = NOTES_DATA.filter((p) => p.grade !== null);
  const moyenne = gradedProjects.length > 0
    ? gradedProjects.reduce((acc, p) => acc + p.grade, 0) / gradedProjects.length
    : null;
  const moyenneStr = moyenne !== null ? moyenne.toFixed(2) : "–";
  const best = gradedProjects.length > 0 ? Math.max(...gradedProjects.map((p) => p.grade)) : null;
  const mention = moyenne ? getMention(moyenne) : null;
  const moyenneColors = moyenne ? getNoteColor(moyenne) : null;

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
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <Star size={18} />
                Notes
              </div>
              <Link to="/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  Chat du groupe
                </div>
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">3</span>
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
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Mes Notes</h1>
              <p className="text-gray-500 text-sm mt-0.5">Note finale par projet</p>
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
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Moyenne générale */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Moyenne générale</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${moyenneColors?.text ?? "text-white"}`}>{moyenneStr}</span>
                  <span className="text-gray-500 text-sm">/20</span>
                </div>
                {mention && (
                  <span className={`text-xs font-semibold ${mention.color}`}>{mention.label}</span>
                )}
              </div>
            </div>

            {/* Meilleure note */}
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20">
                <Award size={22} />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Meilleure note</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-400">{best ?? "–"}</span>
                  <span className="text-gray-500 text-sm">/20</span>
                </div>
              </div>
            </div>

            {/* Projets évalués */}
            <div className="bg-orange-500/[0.07] border border-orange-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <Star size={22} />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Projets évalués</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{gradedProjects.length}</span>
                  <span className="text-gray-500 text-sm">/{NOTES_DATA.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            {NOTES_DATA.map((project) => {
              const colors = project.grade !== null ? getNoteColor(project.grade) : null;
              const isOpen = expanded[project.id];
              const doneCount = project.checkpoints.filter((c) => c.status === "done").length;

              return (
                <div key={project.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  {/* Project header */}
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpanded((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                  >
                    <div className="text-left">
                      <h2 className="text-base font-bold">{project.project}</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{project.professor}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {project.grade !== null ? (
                        <div className={`flex items-baseline gap-1 px-4 py-2 rounded-xl border ${colors.badge}`}>
                          <span className="text-2xl font-bold">{project.grade}</span>
                          <span className="text-sm opacity-70">/{project.max}</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-white/[0.05] text-gray-500 border border-white/10 rounded-xl px-4 py-2 text-sm font-medium">
                          <Clock size={14} /> En attente
                        </span>
                      )}
                      {isOpen
                        ? <ChevronUp size={18} className="text-gray-500" />
                        : <ChevronDown size={18} className="text-gray-500" />
                      }
                    </div>
                  </button>

                  {/* Détail */}
                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 py-6">
                      {/* Commentaire du professeur, si la note a été donnée */}
                      {project.grade !== null && project.comment && (
                        <div className="mb-6 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl px-4 py-3 text-blue-300 text-sm flex items-start gap-2">
                          <span>💬</span>
                          <span className="italic">{project.comment}</span>
                          {project.gradedDate && (
                            <span className="ml-auto text-gray-600 text-xs flex-shrink-0 not-italic">{project.gradedDate}</span>
                          )}
                        </div>
                      )}

                      {/* Progression des checkpoints (sans note individuelle) */}
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">
                        Progression du projet · {doneCount}/{project.checkpoints.length} checkpoints validés
                      </p>
                      <div className="relative">
                        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/[0.06]" />
                        <div className="space-y-4">
                          {project.checkpoints.map((cp, ci) => (
                            <div key={ci} className="flex items-center gap-4 relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                                cp.status === "done"
                                  ? "bg-green-500/20 border-green-500 text-green-400"
                                  : cp.status === "current"
                                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                  : "bg-white/[0.03] border-white/10 text-gray-600"
                              }`}>
                                {cp.status === "done" ? (
                                  <CheckCircle size={14} />
                                ) : cp.status === "current" ? (
                                  <Clock size={14} />
                                ) : (
                                  <span className="text-xs font-bold">{ci + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${cp.status === "upcoming" ? "text-gray-600" : "text-white"}`}>
                                  {cp.name}
                                </p>
                                <p className="text-gray-600 text-xs mt-0.5">{cp.date}</p>
                              </div>
                              {cp.status === "current" && (
                                <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-2.5 py-1">
                                  En cours
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {project.grade === null && (
                        <p className="text-gray-600 text-xs mt-6">
                          La note finale sera attribuée par {project.professor} à l'issue du dernier checkpoint.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}