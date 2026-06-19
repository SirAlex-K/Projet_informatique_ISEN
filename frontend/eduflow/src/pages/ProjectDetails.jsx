import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown, Users, BookOpen, CheckCircle, Clock, Flag } from "lucide-react";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-600",
];

export default function ProjectDetails() {
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);
  const projectId = params.get("id");

  const [project,    setProject]    = useState(null);
  const [groups,     setGroups]     = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [sujetFilter, setSujetFilter] = useState("tous");

  const handleValidateMilestone = async (msId) => {
    try {
      const res = await api.put(`/milestones/${msId}/reach`);
      setMilestones(prev => prev.map(m => m.id === msId ? res.data : m));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }
    Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/projects/${projectId}/groups`),
      api.get(`/projects/${projectId}/milestones`),
    ]).then(([pRes, gRes, mRes]) => {
      setProject(pRes.data);
      setGroups(gRes.data);
      setMilestones(mRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <Link to="/supervisor/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Retour aux projets
      </Link>
      <p className="text-gray-400">Projet introuvable.</p>
    </div>
  );

  const nbAtteints   = milestones.filter(m => m.atteint).length;
  const progression  = milestones.length ? Math.round((nbAtteints / milestones.length) * 100) : 0;
  const totalMembers = groups.reduce((s, g) => s + g.members.length, 0);
  const sujetsChoisis = groups.filter(g => g.sujet_id).length;
  const currentMilestone = milestones.find(m => !m.atteint);

  const filteredGroups = groups.filter(g => {
    if (sujetFilter === "tous") return true;
    if (sujetFilter === "sans") return !g.sujet_id;
    return g.sujet?.id === parseInt(sujetFilter);
  });

  return (
    <div className="min-h-screen bg-[#020817] text-white">
    <div className="max-w-6xl mx-auto p-8">

      <Link to="/supervisor/projects" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6">
        ← Retour aux projets
      </Link>

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1e1b4b] p-8 mb-8">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-purple-500/15 blur-[120px]" />
        <div className="relative z-10">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 flex items-center justify-center text-2xl shadow-xl flex-shrink-0">
              🚀
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">{project.titre}</h1>
              <p className="text-gray-400 text-sm mt-1">{project.description || "Aucune description"}</p>
              {project.supervisor && (
                <p className="text-gray-500 text-xs mt-1">
                  Encadrant : {project.supervisor.prenom} {project.supervisor.nom?.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="text-gray-400 text-xs">Groupes</p>
              <p className="text-xl font-bold">{groups.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="text-gray-400 text-xs">Étudiants</p>
              <p className="text-xl font-bold">{totalMembers}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="text-gray-400 text-xs">Sujets choisis</p>
              <p className="text-xl font-bold">{sujetsChoisis}/{groups.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="text-gray-400 text-xs">Progression</p>
              <p className="text-xl font-bold text-purple-400">{progression}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression jalons */}
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5 mb-8">
        <div className="flex justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold">Progression des jalons</h2>
            {currentMilestone && (
              <p className="text-gray-500 text-xs mt-0.5">
                En cours : {currentMilestone.titre} · {new Date(currentMilestone.date_cible).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
          <span className="text-purple-400 font-bold">{progression}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progression}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-600">{nbAtteints} validé{nbAtteints > 1 ? "s" : ""}</span>
          <span className="text-xs text-gray-600">{milestones.length - nbAtteints} restant{milestones.length - nbAtteints > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Groupes */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Groupes du projet</h2>
        <span className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl text-purple-300 text-sm">
          {filteredGroups.length}/{groups.length} groupe{groups.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filtre par sujet */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { value: "tous", label: "Tous" },
            { value: "sans", label: "Sans sujet" },
            ...(project.subjects || []).map(s => ({ value: String(s.id), label: s.libelle })),
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setSujetFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sujetFilter === opt.value
                  ? "bg-purple-600 text-white"
                  : "bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {groups.length === 0 ? (
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-10 text-center text-gray-500 text-sm">
          Aucun groupe créé pour ce projet.
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-10 text-center text-gray-500 text-sm">
          Aucun groupe correspond à ce filtre.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGroups.map(group => {
            const memberCount = group.members.length;
            const fillPct     = Math.round((memberCount / group.capacite_max) * 100);
            const isFull      = memberCount >= group.capacite_max;

            return (
              <div
                key={group.id}
                className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-all duration-200"
              >
                {/* En-tête */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold">Groupe {group.numero}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {memberCount}/{group.capacite_max} membres
                      {isFull && <span className="text-orange-400 ml-1">· Complet</span>}
                    </p>
                  </div>
                  {group.sujet ? (
                    <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl max-w-[180px]">
                      <BookOpen size={12} className="text-purple-400 flex-shrink-0" />
                      <span className="text-xs text-purple-300 truncate">{group.sujet.libelle}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600 italic">Sans sujet</span>
                  )}
                </div>

                {/* Barre de remplissage */}
                <div className="w-full bg-white/5 rounded-full h-1.5 mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFull ? "bg-orange-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
                    }`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                {/* Membres */}
                {memberCount === 0 ? (
                  <p className="text-xs text-gray-600 italic text-center py-4">Aucun membre</p>
                ) : (
                  <div className="space-y-2">
                    {group.members.map(m => (
                      <div key={m.user_id} className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-3 py-2.5">
                        <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[m.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {m.user?.prenom?.[0]}{m.user?.nom?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{m.user?.prenom} {m.user?.nom?.toUpperCase()}</p>
                          <p className="text-xs text-gray-500 truncate">{m.user?.email}</p>
                        </div>
                        {m.role_in_project === "lead" && (
                          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                            <Crown size={10} className="text-amber-400" />
                            <span className="text-xs text-amber-300">Leader</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <Link
                    to={`/supervisor/group-details?groupId=${group.id}&projectId=${projectId}`}
                    className="flex items-center justify-center gap-2 w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200"
                  >
                    Consulter →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Jalons */}
      {milestones.length > 0 && (
        <div className="mt-8 bg-[#0B1220] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Flag size={16} className="text-purple-400" /> Jalons
            </h2>
            <span className="text-xs text-gray-500">{nbAtteints}/{milestones.length} validé{nbAtteints > 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-3">
            {milestones.map((m, i) => {
              const isCurrent = m === currentMilestone;
              return (
                <div key={m.id} className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                  m.atteint ? "bg-green-500/[0.04] border-green-500/15" : "bg-white/[0.02] border-white/[0.06]"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                    m.atteint   ? "bg-green-500/20 border-green-500 text-green-400"
                    : isCurrent ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "bg-white/[0.03] border-white/10 text-gray-600"
                  }`}>
                    {m.atteint ? <CheckCircle size={14} /> : isCurrent ? <Clock size={14} /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!m.atteint && !isCurrent ? "text-gray-500" : "text-white"}`}>
                      {m.titre}
                    </p>
                    {m.atteint && m.atteint_le && (
                      <p className="text-green-500/70 text-xs mt-0.5">
                        Validé le {new Date(m.atteint_le).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0">
                    {new Date(m.date_cible).toLocaleDateString("fr-FR")}
                  </span>
                  {m.atteint ? (
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-1 flex-shrink-0 flex items-center gap-1">
                      <CheckCircle size={10} /> Validé
                    </span>
                  ) : (
                    <button
                      onClick={() => handleValidateMilestone(m.id)}
                      className="flex-shrink-0 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 rounded-full px-2.5 py-1 transition-all flex items-center gap-1"
                    >
                      <CheckCircle size={10} /> Valider
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
