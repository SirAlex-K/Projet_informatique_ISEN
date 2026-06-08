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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const NOTES_DATA = [
  {
    id: 1,
    project: "Application React – EduFlow",
    professor: "Prof. Dubois",
    checkpoints: [
      {
        name: "Checkpoint 1 – Cahier des charges",
        date: "01/03/2024",
        note: 16,
        max: 20,
        coeff: 1,
        comment: "Très bon travail, structure claire et bien détaillée. Très bonne analyse du besoin.",
      },
      {
        name: "Checkpoint 2 – Maquettes UI/UX",
        date: "15/03/2024",
        note: 17,
        max: 20,
        coeff: 1,
        comment: "Maquettes professionnelles avec un bon sens de l'expérience utilisateur.",
      },
      {
        name: "Checkpoint 3 – MVP",
        date: "30/03/2024",
        note: null,
        max: 20,
        coeff: 2,
        comment: null,
      },
      {
        name: "Checkpoint 4 – Rendu final",
        date: "15/04/2024",
        note: null,
        max: 20,
        coeff: 3,
        comment: null,
      },
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

  const allGraded = NOTES_DATA.flatMap((p) => p.checkpoints).filter((c) => c.note !== null);
  const totalWeighted = allGraded.reduce((acc, c) => acc + c.note * c.coeff, 0);
  const totalCoeff = allGraded.reduce((acc, c) => acc + c.coeff, 0);
  const moyenne = totalCoeff > 0 ? totalWeighted / totalCoeff : null;
  const moyenneStr = moyenne !== null ? moyenne.toFixed(2) : "–";
  const best = allGraded.length > 0 ? Math.max(...allGraded.map((c) => c.note)) : null;
  const mention = moyenne ? getMention(moyenne) : null;
  const moyenneColors = moyenne ? getNoteColor(moyenne) : null;

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

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Mes Notes</h1>
            <p className="text-gray-500 text-sm mt-0.5">Suivi de vos évaluations</p>
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

            {/* Évaluations */}
            <div className="bg-orange-500/[0.07] border border-orange-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <Star size={22} />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Évaluations</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{allGraded.length}</span>
                  <span className="text-gray-500 text-sm">/{NOTES_DATA.flatMap((p) => p.checkpoints).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            {NOTES_DATA.map((project) => {
              const graded = project.checkpoints.filter((c) => c.note !== null);
              const wSum = graded.reduce((acc, c) => acc + c.note * c.coeff, 0);
              const cSum = graded.reduce((acc, c) => acc + c.coeff, 0);
              const projMoy = cSum > 0 ? (wSum / cSum).toFixed(2) : null;
              const projColors = projMoy ? getNoteColor(parseFloat(projMoy)) : null;
              const isOpen = expanded[project.id];

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
                      {projMoy && (
                        <div className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${projColors?.badge}`}>
                          {projMoy} / 20
                        </div>
                      )}
                      {isOpen
                        ? <ChevronUp size={18} className="text-gray-500" />
                        : <ChevronDown size={18} className="text-gray-500" />
                      }
                    </div>
                  </button>

                  {/* Checkpoints */}
                  {isOpen && (
                    <div className="border-t border-white/[0.06]">
                      {/* Table header */}
                      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] gap-4 px-6 py-3 border-b border-white/[0.04]">
                        {["Évaluation", "Date", "Coeff.", "Note", "Progression", "Commentaire"].map((h) => (
                          <span key={h} className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</span>
                        ))}
                      </div>

                      {/* Rows */}
                      {project.checkpoints.map((cp, ci) => {
                        const colors = cp.note !== null ? getNoteColor(cp.note) : null;
                        const percent = cp.note !== null ? (cp.note / cp.max) * 100 : 0;
                        return (
                          <div
                            key={ci}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] gap-4 px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center last:border-0"
                          >
                            {/* Name */}
                            <span className="text-sm font-medium">{cp.name}</span>

                            {/* Date */}
                            <span className="text-gray-500 text-xs">{cp.date}</span>

                            {/* Coeff */}
                            <span className="bg-white/[0.06] text-gray-400 rounded-lg px-2.5 py-1 text-xs font-medium w-fit">×{cp.coeff}</span>

                            {/* Note */}
                            {cp.note !== null ? (
                              <div className="flex items-baseline gap-1">
                                <span className={`text-base font-bold ${colors.text}`}>{cp.note}</span>
                                <span className="text-gray-600 text-xs">/{cp.max}</span>
                              </div>
                            ) : (
                              <span className="text-gray-700 text-sm">–</span>
                            )}

                            {/* Progress bar */}
                            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                              {cp.note !== null && (
                                <div
                                  className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                                  style={{ width: `${percent}%` }}
                                />
                              )}
                            </div>

                            {/* Comment */}
                            <span className="text-gray-500 text-xs italic leading-relaxed truncate">
                              {cp.comment ?? <span className="text-gray-700 not-italic">–</span>}
                            </span>
                          </div>
                        );
                      })}
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