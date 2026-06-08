import { useState, useEffect } from 'react';
import { Bell, FolderKanban, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorProjects() {
  const { user } = useAuth();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => setProjets(res.data.projets || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statutLabel = (s) => {
    const labels = { en_cours: 'En cours', termine: 'Terminé', propose: 'Proposé', valide: 'Validé', livre: 'Livré', soutenu: 'Soutenu', cloture: 'Clôturé' };
    return labels[s] || s;
  };
  const statutColor = (s) => {
    if (s === 'en_cours') return 'bg-yellow-500/20 text-yellow-400';
    if (s === 'termine' || s === 'valide' || s === 'livre') return 'bg-green-500/20 text-green-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Projets</h1>
            <p className="text-gray-400 text-xs mt-0.5">Vos projets encadrés</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-400 cursor-pointer" />
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
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold">Projets</h2>
              <p className="text-gray-400 text-sm mt-0.5">Créez et gérez vos projets étudiants</p>
            </div>
            <Link
              to="/supervisor/new-project"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg transition"
            >
              <Plus size={16} />
              Nouveau projet
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement...</div>
          ) : projets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FolderKanban size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Aucun projet trouvé.</p>
              <Link to="/supervisor/new-project" className="mt-4 text-purple-400 text-sm hover:underline">
                Créer votre premier projet
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projets.map(p => (
                <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-base font-bold">{p.titre}</h2>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {p.nb_membres} étudiant(s) · {p.nb_taches} tâche(s) · {p.nb_livrables} livrable(s)
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutColor(p.statut)}`}>
                      {statutLabel(p.statut)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    {[
                      { label: 'Terminées', value: p.nb_done,                               color: 'text-green-400'  },
                      { label: 'En cours',  value: p.nb_en_cours,                           color: 'text-yellow-400' },
                      { label: 'À faire',   value: p.nb_taches - p.nb_done - p.nb_en_cours, color: 'text-gray-400'  },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-white/[0.02] rounded-xl p-3">
                        <p className={`text-xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${p.avancement}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{p.avancement}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
