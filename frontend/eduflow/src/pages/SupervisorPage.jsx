import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap, Users, FolderKanban, MessageSquare,
  Bell, ArrowRight, ClipboardCheck,
} from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = stats?.projets?.reduce((sum, p) => sum + p.nb_membres, 0) ?? 0;
  const projetsActifs = stats?.projets?.filter(p => p.statut === 'en_cours').length ?? 0;

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || 'P'}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">Tableau de bord</h2>
          <p className="text-gray-400 text-sm mb-6">Vue d'ensemble de vos cours et étudiants</p>

          {loading ? (
            <p className="text-gray-400 text-sm">Chargement...</p>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                    <FolderKanban size={20} />
                  </div>
                  <p className="text-2xl font-bold">{stats?.total_projets ?? 0}</p>
                  <p className="text-gray-400 text-xs mt-1">Projets total</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mb-4">
                    <ClipboardCheck size={20} />
                  </div>
                  <p className="text-2xl font-bold">{projetsActifs}</p>
                  <p className="text-gray-400 text-xs mt-1">Projets actifs</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <Users size={20} />
                  </div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-gray-400 text-xs mt-1">Étudiants</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <MessageSquare size={20} />
                  </div>
                  <p className="text-2xl font-bold">—</p>
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
                    {stats.projets.slice(0, 5).map(p => (
                      <Link
                        key={p.id}
                        to={`/project-details?id=${p.id}`}
                        className="bg-white/[0.02] rounded-xl p-4 flex justify-between items-center hover:bg-white/[0.05] transition"
                      >
                        <div>
                          <p className="text-sm font-semibold">{p.titre}</p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {p.nb_membres} étudiant(s) · {p.avancement}% avancement ·{' '}
                            <span className={
                              p.statut === 'en_cours' ? 'text-green-400' :
                              p.statut === 'termine'  ? 'text-gray-400' : 'text-yellow-400'
                            }>
                              {p.statut === 'en_cours' ? 'En cours' : p.statut === 'termine' ? 'Terminé' : p.statut}
                            </span>
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-gray-500" />
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
