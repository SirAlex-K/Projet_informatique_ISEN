import { useState, useEffect } from 'react';
import { Bell, Users, UserCircle } from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorGroups() {
  const { user } = useAuth();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => setProjets(res.data.projets || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Groupes</h1>
            <p className="text-gray-400 text-xs mt-0.5">Composition et progression des groupes</p>
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
          <h2 className="text-2xl font-bold mb-1">Gestion des groupes</h2>
          <p className="text-gray-400 text-sm mb-5">Composition, progression et membres des projets</p>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement...</div>
          ) : projets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Users size={40} className="mb-3 opacity-30" />
              <p className="text-sm">Aucun groupe trouvé.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {projets.map((projet, index) => {
                const membres = projet.membres || [];
                return (
                  <div key={projet.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    {/* Group header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-bold">Groupe {index + 1} — {projet.titre}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{membres.length} membre(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-purple-400">{projet.avancement}%</p>
                        <p className="text-gray-400 text-xs">progression</p>
                      </div>
                    </div>

                    {/* Group progress bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${projet.avancement}%` }}
                      />
                    </div>

                    {/* Members */}
                    {membres.length > 0 ? (
                      <div className="space-y-3">
                        {membres.map((membre, idx) => (
                          <div
                            key={idx}
                            className="bg-white/[0.02] rounded-xl p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                                {(membre.prenom || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{membre.prenom} {membre.nom}</p>
                                <p className="text-gray-400 text-xs">{membre.email}</p>
                              </div>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              membre.role_in_project === 'lead'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {membre.role_in_project === 'lead' ? "Chef d'équipe" : 'Membre'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/[0.02] rounded-xl p-5 text-center text-gray-400 text-sm">
                        Aucun membre dans ce groupe
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
