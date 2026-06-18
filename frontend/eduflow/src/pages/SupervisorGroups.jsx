import { useState, useEffect } from "react";
import {
  GraduationCap, Users, FolderKanban, MessageSquare,
  LayoutDashboard, Bell, LogOut, ClipboardCheck, Crown, BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-600",
];

export default function SupervisorGroups() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  const [projects, setProjects]           = useState([]);
  const [groupsByProject, setGroupsByProject] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    api.get("/projects").then(async res => {
      const ps = res.data.filter(p => p.supervisor_id === user?.id || true);
      setProjects(ps);
      if (ps.length > 0) setSelectedProject(ps[0]);

      const groupsData = {};
      await Promise.all(ps.map(async p => {
        try {
          const { data } = await api.get(`/projects/${p.id}/groups`);
          groupsData[p.id] = data;
        } catch { groupsData[p.id] = []; }
      }));
      setGroupsByProject(groupsData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const groups = selectedProject ? (groupsByProject[selectedProject.id] || []) : [];
  const totalMembers = groups.reduce((sum, g) => sum + g.members.length, 0);
  const groupsAvecSujet = groups.filter(g => g.sujet_id).length;

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
                <h1 className="text-xl font-bold">ProjectHub</h1>
                <p className="text-gray-400 text-xs">Encadrant</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <Link to="/supervisor" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition">
              <LayoutDashboard size={18} /> Tableau de bord
            </Link>
            <Link to="/supervisor/evaluation" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition">
              <ClipboardCheck size={18} /> Évaluation
            </Link>
            <Link to="/supervisor/projects" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition">
              <FolderKanban size={18} /> Projets
            </Link>
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <Users size={18} /> Groupes
            </div>
            <Link to="/supervisor/students" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition">
              <GraduationCap size={18} /> Étudiants
            </Link>
            <Link to="/supervisor/messages" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition">
              <MessageSquare size={18} /> Messages
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
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Groupes</h1>
            <p className="text-gray-500 text-xs mt-0.5">Composition et progression par groupe</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell size={20} className="text-gray-400" />
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-400 text-xs">Encadrant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Sélecteur de projet */}
          {projects.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedProject?.id === p.id
                      ? "bg-purple-600 text-white"
                      : "bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {p.titre}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && !selectedProject && (
            <div className="text-center py-20 text-gray-500">Aucun projet disponible.</div>
          )}

          {!loading && selectedProject && (
            <>
              {/* Stats rapides */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <p className="text-2xl font-bold">{groups.length}</p>
                  <p className="text-gray-400 text-xs mt-1">Groupes</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <p className="text-2xl font-bold">{totalMembers}</p>
                  <p className="text-gray-400 text-xs mt-1">Étudiants assignés</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <p className="text-2xl font-bold">{groupsAvecSujet}/{groups.length}</p>
                  <p className="text-gray-400 text-xs mt-1">Sujets choisis</p>
                </div>
              </div>

              {/* Grille des groupes */}
              {groups.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-sm">
                  Ce projet n'a pas encore de groupes.
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.map(group => {
                    const memberCount = group.members.length;
                    const isFull = memberCount >= group.capacite_max;

                    return (
                      <div key={group.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">

                        {/* En-tête groupe */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold">Groupe {group.numero}</h3>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {memberCount}/{group.capacite_max} membres
                              {isFull && <span className="ml-2 text-orange-400">· Complet</span>}
                            </p>
                          </div>
                          {group.sujet ? (
                            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl">
                              <BookOpen size={13} className="text-purple-400" />
                              <span className="text-xs text-purple-300 font-medium">{group.sujet.libelle}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600 italic">Pas de sujet choisi</span>
                          )}
                        </div>

                        {/* Barre de remplissage */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                            style={{ width: `${(memberCount / group.capacite_max) * 100}%` }}
                          />
                        </div>

                        {/* Membres */}
                        {memberCount === 0 ? (
                          <div className="bg-white/[0.02] rounded-xl p-4 text-center text-gray-600 text-sm">
                            Aucun membre pour l'instant
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {group.members.map(m => (
                              <div key={m.user_id} className="bg-white/[0.02] rounded-xl px-4 py-3 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[m.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                  {m.user?.prenom?.[0]}{m.user?.nom?.[0]}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold">{m.user?.prenom} {m.user?.nom}</p>
                                  <p className="text-xs text-gray-500">{m.user?.email}</p>
                                </div>
                                {m.role_in_project === "lead" && (
                                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                                    <Crown size={11} className="text-amber-400" />
                                    <span className="text-xs text-amber-300">Leader</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
