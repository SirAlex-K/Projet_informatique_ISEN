import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, FolderKanban, MessageSquare,
  LayoutDashboard, LogOut, ClipboardCheck, Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfessorSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user
    ? `${(user.prenom || '')[0] || ''}${(user.nom || '')[0] || ''}`.toUpperCase()
    : 'P';

  const links = [
    { to: '/professor',    icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/projects',     icon: <FolderKanban size={20} />,   label: 'Projets'          },
    { to: '/groups',       icon: <Users size={20} />,          label: 'Groupes'          },
    { to: '/students',     icon: <GraduationCap size={20} />,  label: 'Étudiants'        },
    { to: '/messages',     icon: <MessageSquare size={20} />,  label: 'Messages'         },
    { to: '/evaluation',   icon: <ClipboardCheck size={20} />, label: 'Évaluation'       },
  ];

  return (
    <div className="w-[280px] shrink-0 border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduFlow</h1>
              <p className="text-gray-400 text-xs">Encadrant</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1">
          {links.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
