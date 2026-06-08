import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, FolderKanban, Users, ClipboardCheck, MessageSquare, ArrowRight } from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalEtudiants = data?.projets?.reduce((s, p) => s + p.nb_membres, 0) ?? 0;
  const totalDone      = data?.projets?.reduce((s, p) => s + p.nb_done, 0) ?? 0;
  const totalTaches    = data?.projets?.reduce((s, p) => s + p.nb_taches, 0) ?? 0;
  const avancement     = data?.projets?.[0]?.avancement ?? 0;

  const stats = [
    { label: 'Projets suivis',    value: data?.total_projets ?? 0, icon: <FolderKanban size={20} />, color: 'bg-purple-600' },
    { label: 'Étudiants',         value: totalEtudiants,           icon: <Users size={20} />,        color: 'bg-blue-600'   },
    { label: 'Tâches terminées',  value: totalDone,                icon: <ClipboardCheck size={20} />,color: 'bg-green-600' },
    { label: 'Tâches totales',    value: totalTaches,              icon: <MessageSquare size={20} />, color: 'bg-orange-500' },
    { label: 'Avancement',        value: `${avancement}%`,         icon: <ArrowRight size={20} />,    color: 'bg-cyan-600'  },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Tableau de bord</h1>
            <p className="text-gray-400 text-xs mt-0.5">Vue d'ensemble de vos projets et étudiants</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-gray-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </div>
            <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {(user?.prenom || 'E')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-xs text-gray-400">Encadrant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {stats.map(({ label, value, icon, color }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                      {icon}
                    </div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-gray-400 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Projets + Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold">Projets récents</h2>
                    <Link to="/supervisor/projects" className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                      Voir tout <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {data?.projets?.map(p => (
                      <div key={p.id} className="bg-white/[0.02] rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">{p.titre}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{p.nb_membres} étudiant(s) · {p.avancement}%</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.avancement}%` }} />
                          </div>
                          <ArrowRight size={14} className="text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4">Informations</h2>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                    <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
                    <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
                    <span className="inline-block mt-3 text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">Encadrant</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
