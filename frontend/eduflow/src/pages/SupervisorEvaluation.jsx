import { useState, useEffect } from 'react';
import { Bell, Save, ClipboardCheck } from 'lucide-react';
import SupervisorSidebar from '../components/SupervisorSidebar';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function SupervisorEvaluation() {
  const { user } = useAuth();
  const [projets, setProjets] = useState([]);
  const [projetId, setProjetId] = useState('');
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/dashboard/supervisor')
      .then(res => setProjets(res.data.projets || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!projetId) return;
    api.get(`/projects/${projetId}/evaluations`)
      .then(res => setEvaluations(res.data.evaluations || []))
      .catch(console.error);
  }, [projetId]);

  const handleSave = async () => {
    if (!projetId || !note) { setMsg('Veuillez sélectionner un projet et saisir une note.'); return; }
    setSaving(true);
    try {
      await api.post(`/projects/${projetId}/evaluations`, { note: parseFloat(note), commentaire });
      setMsg('Évaluation enregistrée avec succès.');
      setNote(''); setCommentaire('');
      const res = await api.get(`/projects/${projetId}/evaluations`);
      setEvaluations(res.data || []);
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <SupervisorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Évaluation</h1>
            <p className="text-gray-400 text-xs mt-0.5">Évaluez les groupes de votre projet</p>
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

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-1">Évaluation des groupes</h2>
          <p className="text-gray-400 text-sm mb-5">Sélectionnez un projet pour l'évaluer.</p>

          {/* Formulaire */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <ClipboardCheck size={18} className="text-purple-400" />
              <h2 className="text-base font-bold">Nouvelle évaluation</h2>
            </div>

            {msg && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${msg.includes('Erreur') || msg.includes('Veuillez') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {msg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Projet</label>
                <select
                  value={projetId}
                  onChange={e => setProjetId(e.target.value)}
                  className="w-full bg-[#0B1220] p-2.5 rounded-xl border border-white/10 text-white text-sm"
                >
                  <option value="">Choisir un projet</option>
                  {projets.map(p => <option key={p.id} value={p.id}>{p.titre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Note /20</label>
                <input
                  type="number" min="0" max="20" step="0.5"
                  value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Ex : 16"
                  className="w-full bg-[#0B1220] p-2.5 rounded-xl border border-white/10 text-white text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Commentaire</label>
              <textarea
                rows="4" value={commentaire} onChange={e => setCommentaire(e.target.value)}
                placeholder="Commentaires sur le projet..."
                className="w-full bg-[#0B1220] p-2.5 rounded-xl border border-white/10 text-white text-sm resize-none"
              />
            </div>

            <button
              onClick={handleSave} disabled={saving}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Save size={16} />
              {saving ? 'Enregistrement...' : "Enregistrer l'évaluation"}
            </button>
          </div>

          {/* Historique */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <h2 className="text-base font-bold mb-4">Évaluations réalisées</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Projet</th>
                  <th className="pb-3">Note finale</th>
                  <th className="pb-3">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.length === 0 ? (
                  <tr><td colSpan={3} className="py-6 text-gray-400 text-sm">Aucune évaluation.</td></tr>
                ) : evaluations.map((e, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 text-sm">{e.project?.titre || `Projet #${e.project_id}`}</td>
                    <td className={`py-3 text-sm font-bold ${e.note >= 15 ? 'text-green-400' : e.note >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {e.note} / 20
                    </td>
                    <td className="py-3 text-gray-400 text-sm">{e.commentaire || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
