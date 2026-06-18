import { useState, useEffect } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard, Bell, LogOut,
  FileText, Star, TrendingUp, Award, CheckCircle, Clock,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

function getNoteColor(note) {
  if (note >= 16) return { text: "text-green-400",  bar: "bg-green-500",  badge: "bg-green-500/15 border-green-500/25 text-green-400" };
  if (note >= 12) return { text: "text-blue-400",   bar: "bg-blue-500",   badge: "bg-blue-500/15 border-blue-500/25 text-blue-400" };
  if (note >= 10) return { text: "text-orange-400", bar: "bg-orange-500", badge: "bg-orange-500/15 border-orange-500/25 text-orange-400" };
  return             { text: "text-red-400",    bar: "bg-red-500",    badge: "bg-red-500/15 border-red-500/25 text-red-400" };
}

function getMention(avg) {
  if (avg >= 16) return { label: "Très bien",  color: "text-green-400" };
  if (avg >= 14) return { label: "Bien",        color: "text-blue-400" };
  if (avg >= 12) return { label: "Assez bien",  color: "text-blue-300" };
  if (avg >= 10) return { label: "Passable",    color: "text-orange-400" };
  return           { label: "Insuffisant",  color: "text-red-400" };
}

export default function StudentNotes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [project, setProject] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [moyenne, setMoyenne] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/auth/me/project");
      if (!data.project) return;
      setProject(data.project);
      const [evalRes, msRes] = await Promise.all([
        api.get(`/projects/${data.project.id}/evaluations`),
        api.get(`/projects/${data.project.id}/milestones`),
      ]);
      setEvaluations(evalRes.data.evaluations || []);
      setMoyenne(evalRes.data.moyenne ?? null);
      setMilestones(msRes.data || []);
    };
    load().catch(console.error);
  }, [user]);

  const best = evaluations.length > 0 ? Math.max(...evaluations.map(e => e.note)) : null;
  const moyenneColors = moyenne !== null ? getNoteColor(moyenne) : null;
  const mention = moyenne !== null ? getMention(moyenne) : null;

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
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <Star size={18} /> Notes
              </div>
              <Link to="/student/chat" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3"><MessageSquare size={18} /> Chat du groupe</div>
              </Link>
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
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Mes Notes</h1>
              <p className="text-gray-500 text-sm mt-0.5">Suivi de vos évaluations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold">{user?.prenom?.[0] || "A"}</div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-500 text-xs">{project?.titre || "Mon projet"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"><TrendingUp size={22} /></div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Moyenne générale</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${moyenneColors?.text ?? "text-white"}`}>{moyenne !== null ? moyenne.toFixed(2) : "–"}</span>
                  <span className="text-gray-500 text-sm">/20</span>
                </div>
                {mention && <span className={`text-xs font-semibold ${mention.color}`}>{mention.label}</span>}
              </div>
            </div>
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20"><Award size={22} /></div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Meilleure note</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-green-400">{best ?? "–"}</span>
                  <span className="text-gray-500 text-sm">/20</span>
                </div>
              </div>
            </div>
            <div className="bg-orange-500/[0.07] border border-orange-500/20 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20"><Star size={22} /></div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Évaluations</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{evaluations.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluations */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-bold">{project?.titre || "Mon projet"}</h2>
              <p className="text-gray-500 text-sm mt-0.5">Évaluations du professeur</p>
            </div>
            {evaluations.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">Aucune évaluation pour le moment.</div>
            ) : (
              <div>
                <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_2fr] gap-4 px-6 py-3 border-b border-white/[0.04]">
                  {["Évaluation", "Date", "Note", "Progression", "Commentaire"].map((h) => (
                    <span key={h} className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {evaluations.map((ev, i) => {
                  const colors = getNoteColor(ev.note);
                  const percent = (ev.note / 20) * 100;
                  return (
                    <div key={ev.id ?? i} className="grid grid-cols-[2fr_1fr_1fr_1.5fr_2fr] gap-4 px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors items-center last:border-0">
                      <span className="text-sm font-medium">
                        {ev.evaluateur ? `${ev.evaluateur.prenom} ${ev.evaluateur.nom}` : `Évaluation #${i + 1}`}
                      </span>
                      <span className="text-gray-500 text-xs">{new Date(ev.created_at).toLocaleDateString("fr-FR")}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base font-bold ${colors.text}`}>{ev.note}</span>
                        <span className="text-gray-600 text-xs">/20</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                        <div className={`${colors.bar} h-full rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-gray-500 text-xs italic leading-relaxed truncate">
                        {ev.commentaire || <span className="text-gray-700 not-italic">–</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-base font-bold">Jalons du projet</h2>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {milestones.map((ms) => (
                  <div key={ms.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      {ms.atteint
                        ? <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                        : <Clock size={18} className="text-gray-600 flex-shrink-0" />}
                      <span className={`text-sm font-medium ${ms.atteint ? "text-white" : "text-gray-400"}`}>{ms.titre}</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {ms.date_cible ? new Date(ms.date_cible).toLocaleDateString("fr-FR") : "–"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
