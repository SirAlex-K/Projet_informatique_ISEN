import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SupervisorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    api.get("/dashboard/supervisor")
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchCount = () =>
      api.get("/notifications/unread-count").then(r => setUnreadCount(r.data.count)).catch(() => {});
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleBellClick = async () => {
    if (!showNotifs) {
      const r = await api.get("/notifications").catch(() => ({ data: [] }));
      setNotifs(r.data);
      if (unreadCount > 0) {
        await api.put("/notifications/read-all").catch(() => {});
        setUnreadCount(0);
      }
    }
    setShowNotifs(v => !v);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalStudents = stats
    ? stats.projets.reduce((sum, p) => sum + p.nb_membres, 0)
    : 0;

  const projetsActifs = stats
    ? stats.projets.filter((p) => p.statut === "en_cours").length
    : 0;

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className="w-[280px] border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">ProjectHub</h1>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-3 space-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <LayoutDashboard size={18} />
              Tableau de bord
            </div>
            <Link
              to="/supervisor/evaluation"
              className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition"
            >
              <ClipboardCheck size={18} />
              Évaluation
            </Link>
            <Link
              to="/supervisor/projects"
              className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition cursor-pointer"
            >
              <FolderKanban size={18} />
              Projets
            </Link>
            <Link
              to="/supervisor/students"
              className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition cursor-pointer"
            >
              <GraduationCap size={18} />
              Étudiants
            </Link>
            <Link
              to="/supervisor/messages"
              className="p-3 flex items-center justify-between text-sm text-gray-400 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                Messages
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-5">
            <div className="relative" ref={bellRef}>
              <button
                onClick={handleBellClick}
                className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <Bell size={20} className="text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-[#0B1220] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    <span className="text-xs text-gray-500">{notifs.length} au total</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">Aucune notification</p>
                    ) : notifs.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors ${!n.is_read ? "bg-blue-500/[0.04]" : ""}`}>
                        <p className="text-sm text-white leading-snug">{n.contenu}</p>
                        <p className="text-xs text-gray-600 mt-1">{new Date(n.created_at).toLocaleString("fr-FR")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "P"}
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  {user?.prenom} {user?.nom?.toUpperCase()}
                </h2>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-gray-400 text-sm mb-6">
            Vue d'ensemble de vos cours et étudiants
          </p>

          {loading ? (
            <p className="text-gray-400 text-sm">Chargement...</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                    <FolderKanban size={20} />
                  </div>
                  <h1 className="text-2xl font-bold">{stats?.total_projets ?? 0}</h1>
                  <p className="text-gray-400 text-xs mt-1">Projets total</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mb-4">
                    <FolderKanban size={20} />
                  </div>
                  <h1 className="text-2xl font-bold">{projetsActifs}</h1>
                  <p className="text-gray-400 text-xs mt-1">Projets actifs</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <Users size={20} />
                  </div>
                  <h1 className="text-2xl font-bold">{totalStudents}</h1>
                  <p className="text-gray-400 text-xs mt-1">Étudiants</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <MessageSquare size={20} />
                  </div>
                  <h1 className="text-2xl font-bold">—</h1>
                  <p className="text-gray-400 text-xs mt-1">Messages</p>
                </div>
              </div>

              {/* Projets récents */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <h2 className="text-base font-bold mb-4">Projets récents</h2>
                {!stats?.projets?.length ? (
                  <p className="text-gray-400 text-sm">Aucun projet pour l'instant.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.projets.slice(0, 5).map((p) => (
                      <Link
                        key={p.id}
                        to={`/supervisor/projects`}
                        className="bg-white/[0.02] rounded-xl p-4 flex justify-between items-center hover:bg-white/[0.05] transition"
                      >
                        <div>
                          <h3 className="text-sm font-semibold">{p.titre}</h3>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {p.nb_membres} étudiant(s) · {p.avancement}% avancement ·{" "}
                            <span className={
                              p.statut === "en_cours" ? "text-green-400" :
                              p.statut === "termine"  ? "text-gray-400" : "text-yellow-400"
                            }>
                              {p.statut === "en_cours" ? "En cours" : p.statut === "termine" ? "Terminé" : p.statut}
                            </span>
                          </p>
                        </div>
                        <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
