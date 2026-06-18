import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard,
  Bell, LogOut, FileText, Star, CheckCircle, Clock, Users,
  ArrowRight, TrendingUp, Crown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-600",
];

export default function StudentPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [project,    setProject]    = useState(null);
  const [group,      setGroup]      = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.get("/auth/me/project").then(({ data }) => {
      if (!data.project) {
        // Pas de projet du tout — attente
        setLoading(false);
        return;
      }
      if (!data.membership?.group_id) {
        // Projet assigné mais pas de groupe → page de sélection
        navigate("/student/group-select", { replace: true });
        return;
      }
      setProject(data.project);
      setGroup(data.group);
      setMembership(data.membership);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="text-center">
          <GraduationCap size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-bold mb-2">Aucun projet assigné</h2>
          <p className="text-gray-500 text-sm">Votre encadrant ne vous a pas encore assigné à un projet.</p>
          <button onClick={handleLogout} className="mt-6 text-red-400 text-sm hover:text-red-300 flex items-center gap-2 mx-auto">
            <LogOut size={14} /> Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  const milestones   = project.milestones || [];
  const nbAtteints   = milestones.filter(m => m.atteint).length;
  const progression  = milestones.length > 0 ? Math.round((nbAtteints / milestones.length) * 100) : 0;
  const groupMembers = group?.members || [];
  const isLeader     = membership?.role_in_project === "lead";
  const currentMilestone = milestones.find(m => !m.atteint);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/[0.06] bg-[#0B1220] flex flex-col justify-between flex-shrink-0">
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
            <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
              <LayoutDashboard size={18} />
              Tableau de bord
            </div>
            <Link to="/student/kanban" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <FolderKanban size={18} /> Mon Projet
            </Link>
            <Link to="/student/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <FileText size={18} /> Livrables
            </Link>
            <Link to="/student/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <Star size={18} /> Notes
            </Link>
            <Link to="/student/chat" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <MessageSquare size={18} /> Chat du groupe
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200 w-full"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-0.5">Vue d'ensemble de votre projet</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[(user?.id || 0) % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold`}>
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-500 text-xs">
                  {group ? `Groupe ${group.numero}` : "Sans groupe"}
                  {isLeader && " · Leader"}
                </p>
              </div>
              {isLeader && <Crown size={14} className="text-amber-400 ml-1" />}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-1">Bonjour, {user?.prenom} 👋</h2>
            <p className="text-gray-500 text-sm">
              {project.titre}
              {currentMilestone && ` · ${currentMilestone.titre} en cours`}
            </p>
          </div>

          {/* Sujet du groupe */}
          {group?.sujet && (
            <div className="bg-purple-500/[0.06] border border-purple-500/20 rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3">
              <Star size={16} className="text-purple-400 shrink-0" />
              <div>
                <span className="text-xs text-purple-400 font-medium">Sujet du groupe</span>
                <p className="text-sm text-white font-semibold">{group.sujet.libelle}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">Progression globale</span>
              <span className="text-sm font-bold text-blue-400">{progression}%</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-500"
                style={{ width: `${progression}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">{nbAtteints} jalon{nbAtteints > 1 ? "s" : ""} validé{nbAtteints > 1 ? "s" : ""}</span>
              <span className="text-xs text-gray-600">{milestones.length - nbAtteints} restant{milestones.length - nbAtteints > 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-transform duration-200">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-md">
                <FolderKanban size={18} />
              </div>
              <p className="text-3xl font-bold mb-1">1</p>
              <p className="text-gray-400 text-sm">Projet actif</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 shadow-lg shadow-purple-500/10 hover:scale-[1.02] transition-transform duration-200">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center mb-4 shadow-md">
                <Users size={18} />
              </div>
              <p className="text-3xl font-bold mb-1">{groupMembers.length}</p>
              <p className="text-gray-400 text-sm">Membres du groupe</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 shadow-lg shadow-orange-500/10 hover:scale-[1.02] transition-transform duration-200">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center mb-4 shadow-md">
                <FileText size={18} />
              </div>
              <p className="text-3xl font-bold mb-1">{milestones.length - nbAtteints}</p>
              <p className="text-gray-400 text-sm">Jalons restants</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 shadow-lg shadow-green-500/10 hover:scale-[1.02] transition-transform duration-200">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center mb-4 shadow-md">
                <TrendingUp size={18} />
              </div>
              <p className="text-3xl font-bold mb-1">{progression}%</p>
              <p className="text-gray-400 text-sm">Progression</p>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Jalons */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-base font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Jalons
              </h2>
              {milestones.length === 0 ? (
                <p className="text-gray-600 text-sm italic">Aucun jalon défini.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/[0.06]" />
                  <div className="space-y-5">
                    {milestones.map((cp, i) => {
                      const status = cp.atteint ? "done" : cp === currentMilestone ? "current" : "upcoming";
                      return (
                        <div key={cp.id} className="flex items-start gap-4 relative">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                            status === "done"    ? "bg-green-500/20 border-green-500 text-green-400"
                            : status === "current" ? "bg-blue-500/20 border-blue-500 text-blue-400"
                            : "bg-white/[0.03] border-white/10 text-gray-600"
                          }`}>
                            {status === "done" ? <CheckCircle size={16} />
                              : status === "current" ? <Clock size={16} />
                              : <span className="text-xs font-bold">{i + 1}</span>}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`text-sm font-medium leading-tight ${status === "upcoming" ? "text-gray-600" : "text-white"}`}>
                              {cp.titre}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              {new Date(cp.date_cible).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          {status === "current" && (
                            <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-2.5 py-1 mt-0.5">
                              En cours
                            </span>
                          )}
                          {status === "done" && (
                            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-1 mt-0.5">
                              Validé
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Groupe */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Users size={16} className="text-purple-400" />
                  Mon groupe · Groupe {group?.numero}
                </h2>
                <Link to="/student/chat" className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-lg hover:bg-blue-500/10">
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {groupMembers.map(m => {
                  const isMe = m.user_id === user?.id;
                  return (
                    <div key={m.user_id} className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-3 transition-all duration-200">
                      <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[m.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-sm font-bold shadow-md flex-shrink-0`}>
                        {m.user.prenom[0]}{m.user.nom[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{m.user.prenom} {m.user.nom}</p>
                        <p className="text-gray-500 text-xs">
                          {m.role_in_project === "lead" ? "Chef de projet" : "Membre"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {m.role_in_project === "lead" && <Crown size={12} className="text-amber-400" />}
                        {isMe && (
                          <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-2.5 py-1">
                            Vous
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/student/chat"
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/15 rounded-xl py-2.5 transition-all duration-200 hover:bg-white/[0.03]"
              >
                <MessageSquare size={15} /> Ouvrir le chat du groupe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
