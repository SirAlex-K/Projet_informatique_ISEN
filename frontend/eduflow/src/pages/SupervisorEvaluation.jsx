import { useState, useEffect } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ClipboardCheck,
  Save,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SupervisorEvaluation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  const [projects, setProjects] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/projects").then(res => setProjects(res.data)).catch(console.error);
    loadAllEvaluations();
  }, []);

  const loadAllEvaluations = async () => {
    try {
      const projectsRes = await api.get("/projects");
      const all = [];
      for (const p of projectsRes.data) {
        const evalRes = await api.get(`/projects/${p.id}/evaluations`);
        evalRes.data.evaluations.forEach(e => all.push({ ...e, projectTitre: p.titre }));
      }
      setEvaluations(all);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!selectedProject || !note) { setError("Sélectionnez un projet et entrez une note."); return; }
    setSaving(true);
    setError("");
    try {
      await api.post(`/projects/${selectedProject}/evaluations`, {
        note: parseFloat(note),
        commentaire,
      });
      setNote("");
      setCommentaire("");
      setSelectedProject("");
      await loadAllEvaluations();
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className="w-[280px] border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">ProjectHub</h1>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <Link to="/supervisor" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <LayoutDashboard size={18} /> Tableau de bord
            </Link>
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <ClipboardCheck size={18} /> Évaluation
            </div>
            <Link to="/supervisor/projects" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <FolderKanban size={18} /> Projets
            </Link>
            <Link to="/supervisor/students" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <GraduationCap size={18} /> Étudiants
            </Link>
            <Link to="/supervisor/messages" className="p-3 flex items-center justify-between text-sm text-gray-400 hover:text-white transition">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> Messages
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">1</div>
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-red-400 text-sm hover:bg-red-500/20 transition">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Évaluation</h1>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "P"}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{user?.prenom} {user?.nom?.toUpperCase()}</h2>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          <h1 className="text-2xl font-bold mb-1">Évaluation des groupes</h1>
          <p className="text-gray-400 text-sm mb-6">Sélectionnez un projet pour l'évaluer.</p>

          {/* Formulaire */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardCheck size={20} />
              <h2 className="text-lg font-bold">Nouvelle évaluation</h2>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Projet</label>
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="w-full bg-[#0B1220] p-3 rounded-xl border border-white/10 text-sm"
              >
                <option value="">Choisir un projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.titre}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Note globale /20</label>
              <input
                type="number" min="0" max="20" placeholder="Ex : 16"
                value={note} onChange={e => setNote(e.target.value)}
                className="w-full bg-[#0B1220] p-3 rounded-xl border border-white/10 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Commentaire</label>
              <textarea
                rows="4" placeholder="Commentaires du professeur..."
                value={commentaire} onChange={e => setCommentaire(e.target.value)}
                className="w-full bg-[#0B1220] p-3 rounded-xl border border-white/10 text-sm"
              ></textarea>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
            >
              <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer l'évaluation"}
            </button>
          </div>

          {/* Historique */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-5">Évaluations réalisées</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="py-3">Projet</th>
                  <th>Date</th>
                  <th>Note Finale</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-gray-400">Aucune évaluation enregistrée.</td></tr>
                )}
                {evaluations.map(e => (
                  <tr key={e.id} className="border-b border-white/10">
                    <td className="py-3">{e.projectTitre}</td>
                    <td>{new Date(e.evaluated_at).toLocaleDateString("fr-FR")}</td>
                    <td className={e.note >= 16 ? "text-green-400" : e.note >= 12 ? "text-yellow-400" : "text-red-400"}>
                      {e.note} / 20
                    </td>
                    <td className="text-gray-400 text-xs">{e.commentaire || "—"}</td>
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
