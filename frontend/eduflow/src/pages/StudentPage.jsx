import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, CheckCircle2, Clock, Circle,
  FileText, Flag, LogOut, Bell, LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function StudentPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    api.get('/dashboard/student')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const initials = user
    ? `${(user.prenom || '')[0] || ''}${(user.nom || '')[0] || ''}`.toUpperCase()
    : 'E';

  const taskIcon = (statut) => {
    if (statut === 'done')     return <CheckCircle2 size={16} className="text-green-400 shrink-0" />;
    if (statut === 'en_cours') return <Clock        size={16} className="text-yellow-400 shrink-0" />;
    return                            <Circle       size={16} className="text-gray-500 shrink-0" />;
  };

  const taskLabel = (statut) => {
    if (statut === 'done')     return 'bg-green-500/20 text-green-400';
    if (statut === 'en_cours') return 'bg-yellow-500/20 text-yellow-400';
    return                            'bg-white/10 text-gray-400';
  };

  const taskText = (statut) => {
    if (statut === 'done')     return 'Terminé';
    if (statut === 'en_cours') return 'En cours';
    return                            'À faire';
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className="w-[280px] shrink-0 border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EduFlow</h1>
                <p className="text-gray-400 text-xs">Étudiant</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg">
              <LayoutDashboard size={18} />
              Mon dashboard
            </div>
            {data && (
              <div className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold mt-2">
                {data.role_in_project === 'lead' ? '⭐ Chef d\'équipe' : 'Membre de l\'équipe'}
              </div>
            )}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mon projet</h1>
            <p className="text-gray-400 text-sm mt-0.5">Suivi de votre avancement</p>
          </div>
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
          ) : !data?.project ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <GraduationCap size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Aucun projet assigné</p>
              <p className="text-sm mt-1">Contactez votre encadrant.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Carte projet */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{data.project.titre}</h2>
                    {data.project.description && (
                      <p className="text-gray-400 text-sm mt-1">{data.project.description}</p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    data.project.statut === 'en_cours' ? 'bg-yellow-500/20 text-yellow-400' :
                    data.project.statut === 'termine'  ? 'bg-green-500/20 text-green-400' :
                                                          'bg-blue-500/20 text-blue-400'
                  }`}>
                    {data.project.statut === 'en_cours' ? 'En cours' : data.project.statut === 'termine' ? 'Terminé' : data.project.statut}
                  </span>
                </div>

                {data.project.supervisor && (
                  <p className="text-xs text-gray-500 mb-4">
                    Encadrant : <span className="text-gray-300">{data.project.supervisor.prenom} {data.project.supervisor.nom}</span>
                  </p>
                )}

                {/* Barre de progression globale */}
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Avancement global</span>
                    <span>{data.avancement}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${data.avancement}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">

                {/* Mes tâches */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-cyan-400" />
                    Mes tâches ({data.mes_taches?.length || 0})
                  </h3>
                  {data.mes_taches?.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune tâche assignée.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.mes_taches?.map(t => (
                        <div key={t.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                          {taskIcon(t.statut)}
                          <span className="text-sm flex-1 truncate">{t.titre}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${taskLabel(t.statut)}`}>
                            {taskText(t.statut)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Jalons */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                    <Flag size={16} className="text-purple-400" />
                    Jalons ({data.jalons?.length || 0})
                  </h3>
                  {data.jalons?.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucun jalon.</p>
                  ) : (
                    <div className="space-y-2">
                      {data.jalons?.map(j => (
                        <div key={j.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${j.atteint ? 'bg-green-400' : 'bg-gray-600'}`} />
                          <span className="text-sm flex-1 truncate">{j.titre}</span>
                          <span className="text-xs text-gray-500">
                            {j.date_cible ? new Date(j.date_cible).toLocaleDateString('fr-FR') : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Livrables */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-orange-400" />
                  Livrables ({data.livrables?.length || 0})
                </h3>
                {data.livrables?.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun livrable.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {data.livrables?.map(l => (
                      <div key={l.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                        <FileText size={14} className="text-orange-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{l.titre}</p>
                          <p className="text-xs text-gray-500">
                            {l.date_limite ? `Échéance : ${new Date(l.date_limite).toLocaleDateString('fr-FR')}` : ''}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          l.statut === 'valide'   ? 'bg-green-500/20 text-green-400' :
                          l.statut === 'soumis'   ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-white/10 text-gray-400'
                        }`}>
                          {l.statut === 'valide' ? 'Validé' : l.statut === 'soumis' ? 'Soumis' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
