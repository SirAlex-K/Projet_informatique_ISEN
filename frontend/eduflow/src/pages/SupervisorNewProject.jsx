import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorNewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    titre: '',
    description: '',
    date_fin: '',
    statut: 'propose',
    nb_groupes: 3,
    taille_max: 4,
  });

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => {
        const membres = res.data.projets?.flatMap(p => p.membres || []) || [];
        const unique = Object.values(
          membres.reduce((acc, m) => { acc[m.id] = m; return acc; }, {})
        );
        setStudents(unique);
      })
      .catch(console.error);
  }, []);

  const toggleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!form.titre) { setMsg('Le nom du projet est obligatoire.'); return; }
    setSaving(true);
    try {
      const res = await api.post('/projects', {
        titre: form.titre,
        description: form.description || null,
        date_fin: form.date_fin || null,
      });
      const projetId = res.data.id;
      for (const userId of selectedStudents) {
        await api.post(`/projects/${projetId}/members`, { user_id: userId, role_in_project: 'member' });
      }
      navigate('/supervisor/projects');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0B1220] border border-white/10 rounded-2xl p-6 text-white max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Créer un nouveau projet</h1>
          <Link to="/supervisor/projects" className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </Link>
        </div>

        {msg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">{msg}</div>
        )}

        {/* Nom */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nom du projet *</label>
          <input
            type="text"
            value={form.titre}
            onChange={e => setForm({ ...form, titre: e.target.value })}
            placeholder="Ex: Application React"
            className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Décrivez le projet..."
            className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 resize-none transition"
          />
        </div>

        {/* Date limite + Statut */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Date limite</label>
            <input
              type="date"
              value={form.date_fin}
              onChange={e => setForm({ ...form, date_fin: e.target.value })}
              className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Statut</label>
            <select
              value={form.statut}
              onChange={e => setForm({ ...form, statut: e.target.value })}
              className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
            >
              <option value="propose">Proposé</option>
              <option value="en_cours">En cours</option>
              <option value="valide">Validé</option>
              <option value="livre">Livré</option>
              <option value="cloture">Clôturé</option>
            </select>
          </div>
        </div>

        {/* Encadrant + Nombre de groupes */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Encadrant</label>
            <div className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300">
              {user?.prenom} {user?.nom}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre de groupes</label>
            <input
              type="number"
              min="1"
              value={form.nb_groupes}
              onChange={e => setForm({ ...form, nb_groupes: e.target.value })}
              className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* Taille maximale par groupe */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Taille maximale par groupe</label>
          <input
            type="number"
            min="1"
            value={form.taille_max}
            onChange={e => setForm({ ...form, taille_max: e.target.value })}
            className="w-full bg-[#020817] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Étudiants assignés */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            Étudiants assignés ({selectedStudents.length})
          </label>
          <div className="bg-[#020817] border border-white/10 rounded-xl p-4 h-[180px] overflow-y-auto">
            {students.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun étudiant disponible.</p>
            ) : (
              <div className="space-y-3">
                {students.map((s) => (
                  <label key={s.id} className="flex items-center gap-3 text-sm cursor-pointer hover:text-white text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    {s.prenom} {s.nom}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3">
          <Link
            to="/supervisor/projects"
            className="bg-white/5 hover:bg-white/10 border border-white/10 transition px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white"
          >
            Annuler
          </Link>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 transition px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            {saving ? 'Création...' : 'Créer le projet'}
          </button>
        </div>

      </div>
    </div>
  );
}
