import { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => {
        const membres = res.data.projets?.flatMap(p => p.membres || []) || [];
        setStudents(membres);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    `${s.prenom} ${s.nom} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Étudiants</h1>
            <p className="text-gray-400 text-xs mt-0.5">Liste de tous les étudiants</p>
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
              <h2 className="text-2xl font-bold">Étudiants</h2>
              <p className="text-gray-400 text-sm mt-1">{students.length} étudiant(s) au total</p>
            </div>
            <div className="bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 w-64">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div>Nom</div>
              <div>Email</div>
              <div>Rôle</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className="px-6 py-8 text-gray-400 text-sm">Chargement...</div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-8 text-gray-400 text-sm">Aucun étudiant trouvé.</div>
            ) : filtered.map((s, i) => (
              <div key={i} className="grid grid-cols-4 px-6 py-4 border-b border-white/10 items-center hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                    {(s.prenom || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{s.prenom} {s.nom}</span>
                </div>
                <div className="text-gray-400 text-sm">{s.email}</div>
                <div>
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                    {s.role_in_project === 'lead' ? "Chef d'équipe" : 'Membre'}
                  </span>
                </div>
                <div>
                  <button className="text-purple-400 text-sm font-medium hover:text-purple-300 transition">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
