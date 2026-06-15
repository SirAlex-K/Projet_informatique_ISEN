import { useState, useEffect } from "react";
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

export default function SupervisorProjects() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => { logout(); navigate("/"); };

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <FolderKanban size={18} /> Projets
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
          <h1 className="text-xl font-bold">Gestion des projets</h1>
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

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Gestion des projets</h2>
              <p className="text-gray-400 text-sm">Créez et gérez vos projets étudiants</p>
            </div>
            <Link
              to="/supervisor/new-project"
              className="bg-gradient-to-r from-purple-500 to-purple-400 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 hover:scale-105 transition"
            >
              <Plus size={18} /> Nouveau projet
            </Link>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-300 mb-4">MES PROJETS ACTIFS</h2>

            {loading && (
              <p className="text-gray-400 text-sm">Chargement...</p>
            )}

            {!loading && projects.length === 0 && (
              <p className="text-gray-400 text-sm">Aucun projet pour le moment.</p>
            )}

            {projects.map(project => (
              <Link key={project.id} to={`/supervisor/project-details?id=${project.id}`}>
                <div className="bg-[#0B1220] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500 transition">
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <FolderKanban size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{project.titre}</h2>
                        <p className="text-gray-400 text-sm">
                          {project.members?.length || 0} membre{project.members?.length !== 1 ? "s" : ""} assigné{project.members?.length !== 1 ? "s" : ""}
                          {project.statut ? ` • ${project.statut}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-500 text-2xl">→</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
