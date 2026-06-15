import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";

export default function ProjectDetails() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("id");

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/projects/${projectId}/members`),
      api.get(`/projects/${projectId}/tasks`),
    ]).then(([pRes, mRes, tRes]) => {
      setProject(pRes.data);
      setMembers(mRes.data);
      setTasks(tRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  const done = tasks.filter(t => t.statut === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (loading) return <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">Chargement...</div>;
  if (!project) return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <Link to="/supervisor/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">← Retour aux projets</Link>
      <p className="text-gray-400">Projet introuvable. Sélectionnez un projet depuis la liste.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020817] text-white p-8">

      <Link to="/supervisor/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Retour aux projets
      </Link>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[24px] border border-purple-500/20 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1e1b4b] p-8 mb-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-[150px]" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 flex items-center justify-center text-3xl shadow-2xl">🚀</div>
              <div>
                <h1 className="text-3xl font-extrabold">{project.titre}</h1>
                <p className="text-gray-400 text-sm mt-1">{project.description || "Aucune description"}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                <p className="text-gray-400 text-xs">Membres</p>
                <h3 className="text-2xl font-bold">{members.length}</h3>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                <p className="text-gray-400 text-xs">Tâches</p>
                <h3 className="text-2xl font-bold">{tasks.length}</h3>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                <p className="text-gray-400 text-xs">Progression</p>
                <h3 className="text-2xl font-bold">{progress}%</h3>
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-[120px] opacity-80">🎓</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Progression globale</h2>
          <span className="text-purple-400 text-lg font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Membres */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Membres du projet</h2>
          <p className="text-gray-400 text-sm mt-1">Cliquez sur un membre pour voir ses détails.</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 px-5 py-3 rounded-xl text-purple-300 text-sm">
          {members.length} membre{members.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {members.map((m, i) => {
          const memberTasks = tasks.filter(t => t.assigned_to === m.user_id);
          const memberDone = memberTasks.filter(t => t.statut === "done").length;
          const memberProgress = memberTasks.length ? Math.round((memberDone / memberTasks.length) * 100) : 0;
          return (
            <Link
              key={i}
              to={`/supervisor/group-details?projectId=${projectId}&userId=${m.user_id}`}
              className="relative bg-gradient-to-br from-[#0B1220] to-[#111827] border border-white/10 rounded-2xl p-6 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-5 right-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold shadow-xl">
                  {m.user?.prenom?.[0] || "?"}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1">{m.user?.prenom} {m.user?.nom}</h3>
              <p className="text-purple-400 text-sm mb-5">{m.role_in_project === "leader" ? "Chef de groupe" : "Membre"}</p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Tâches</p>
                  <p className="text-sm font-semibold">{memberTasks.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Progression</p>
                  <p className="text-sm font-semibold text-green-400">{memberProgress}%</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400 h-2 rounded-full" style={{ width: `${memberProgress}%` }} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 text-center py-2.5 rounded-xl text-sm font-semibold shadow-lg">
                Consulter →
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
