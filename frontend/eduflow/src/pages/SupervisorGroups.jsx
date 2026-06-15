import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SupervisorGroups() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  const [projects, setProjects] = useState([]);
  const [membersByProject, setMembersByProject] = useState({});
  const [tasksByProject, setTasksByProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get("/projects");
        const ps = projectsRes.data;
        setProjects(ps);

        const membersData = {};
        const tasksData = {};
        await Promise.all(ps.map(async p => {
          const [membersRes, tasksRes] = await Promise.all([
            api.get(`/projects/${p.id}/members`),
            api.get(`/projects/${p.id}/tasks`),
          ]);
          membersData[p.id] = membersRes.data;
          tasksData[p.id] = tasksRes.data;
        }));
        setMembersByProject(membersData);
        setTasksByProject(tasksData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getProgress = (projectId) => {
    const tasks = tasksByProject[projectId] || [];
    if (!tasks.length) return 0;
    const done = tasks.filter(t => t.statut === "done").length;
    return Math.round((done / tasks.length) * 100);
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
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <Users size={18} /> Groupes
            </div>
            <Link to="/supervisor/students" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <GraduationCap size={18} /> Étudiants
            </Link>
            <Link to="/supervisor/messages" className="p-3 flex items-center justify-between text-sm text-gray-400 hover:text-white transition">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> Messages
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">1</div>
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-red-400 text-sm hover:bg-red-500/20 transition">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Gestion des groupes</h1>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
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

          <h2 className="text-2xl font-bold mb-1">Gestion des groupes</h2>
          <p className="text-gray-400 text-sm mb-6">Composition, progression et déplacement des étudiants</p>

          {loading && <p className="text-gray-400 text-sm">Chargement...</p>}

          {/* Groups */}
          <div className="space-y-4">
            {projects.map((project, index) => {
              const members = membersByProject[project.id] || [];
              const progress = getProgress(project.id);

              return (
                <div key={project.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">

                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{project.titre}</h3>
                      <p className="text-gray-400 text-sm">{members.length} membre{members.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-purple-500">{progress}%</h3>
                      <p className="text-gray-400 text-sm">progression moyenne</p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {members.length > 0 ? (
                    <div className="space-y-3">
                      {members.map((m, idx) => {
                        const tasks = (tasksByProject[project.id] || []).filter(t => t.assigned_to === m.user_id);
                        const done = tasks.filter(t => t.statut === "done").length;
                        const memberProgress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
                        return (
                          <div key={idx} className="bg-white/[0.02] rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                                {m.user?.prenom?.[0] || "?"}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <h4 className="text-sm font-semibold">{m.user?.prenom} {m.user?.nom}</h4>
                                  <p className="text-gray-400 text-xs">{done}/{tasks.length} tâches</p>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                    style={{ width: `${memberProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <button className="ml-4 border border-purple-500/40 text-purple-400 px-4 py-2 rounded-xl flex items-center gap-2 text-xs hover:bg-purple-500/10 transition">
                              Déplacer <ChevronDown size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] rounded-xl p-6 text-center text-gray-400 text-sm">
                      Aucun membre dans ce groupe
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
