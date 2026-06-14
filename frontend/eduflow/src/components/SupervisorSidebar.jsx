import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, FolderKanban, MessageSquare,
  LayoutDashboard, LogOut, ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SupervisorSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/supervisor',            icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { to: '/supervisor/evaluation', icon: <ClipboardCheck size={20} />,  label: 'Évaluation'       },
    { to: '/supervisor/projects',   icon: <FolderKanban size={20} />,   label: 'Projets'          },
    { to: '/supervisor/students',   icon: <GraduationCap size={20} />,  label: 'Étudiants'        },
    { to: '/supervisor/messages',   icon: <MessageSquare size={20} />,  label: 'Messages'         },
  ];

  return (
    <div className="w-[280px] shrink-0 border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
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

        {/* Nav */}
        <div className="p-4 space-y-2">
          {links.map(({ to, icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
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
