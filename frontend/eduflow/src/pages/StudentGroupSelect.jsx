import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, UserCheck, Users, GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-600",
];

export default function StudentGroupSelect() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]   = useState(null);
  const [groups, setGroups]     = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [joining, setJoining]   = useState(false);
  const [error, setError]       = useState("");

  // Après avoir rejoint un groupe, si leader : choisir le sujet
  const [myGroupId, setMyGroupId]       = useState(null);
  const [isLeader, setIsLeader]         = useState(false);
  const [chosenSubjetId, setChosenSubjetId] = useState("");
  const [savingSubjet, setSavingSubjet] = useState(false);

  useEffect(() => {
    api.get("/auth/me/project").then(({ data }) => {
      if (!data.project) { setLoading(false); return; }
      setProject(data.project);
      setSubjects(data.project.subjects || []);
      return api.get(`/projects/${data.project.id}/groups`);
    }).then(res => {
      if (res) setGroups(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const refreshGroups = async () => {
    if (!project) return;
    const { data } = await api.get(`/projects/${project.id}/groups`);
    setGroups(data);
  };

  const handleJoin = async (groupId) => {
    setJoining(true);
    setError("");
    try {
      const { data } = await api.post(`/projects/${project.id}/groups/${groupId}/join`);
      setMyGroupId(groupId);
      setIsLeader(data.isLeader);
      await refreshGroups();
      if (!data.isLeader) {
        // membre simple → aller directement au dashboard
        navigate("/student");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de la tentative de rejoindre le groupe.");
    } finally {
      setJoining(false);
    }
  };

  const handleChooseSubjet = async () => {
    if (!chosenSubjetId) return;
    setSavingSubjet(true);
    setError("");
    try {
      await api.put(`/projects/${project.id}/groups/${myGroupId}/sujet`, {
        sujet_id: parseInt(chosenSubjetId)
      });
      navigate("/student");
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors du choix du sujet.");
    } finally {
      setSavingSubjet(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center">
        <div className="text-center">
          <GraduationCap size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-bold mb-2">Aucun projet assigné</h2>
          <p className="text-gray-500 text-sm">Votre encadrant ne vous a pas encore assigné à un projet.</p>
          <button onClick={handleLogout} className="mt-6 text-red-400 text-sm hover:text-red-300">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // Affichage après avoir rejoint (si leader → choix du sujet)
  if (myGroupId && isLeader) {
    const availableSubjects = subjects.filter(s => {
      const taken = groups.find(g => g.sujet_id === s.id && g.id !== myGroupId);
      return !taken;
    });

    return (
      <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-[#0B1220] border border-amber-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown size={24} className="text-amber-400" />
              <h2 className="text-xl font-bold text-amber-300">Vous êtes Team Leader !</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              En tant que premier membre, vous devez choisir le sujet de votre groupe.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
                {error}
              </div>
            )}

            {availableSubjects.length === 0 ? (
              <p className="text-gray-500 text-sm italic mb-6">Aucun sujet disponible — passez quand même au dashboard.</p>
            ) : (
              <select
                value={chosenSubjetId}
                onChange={e => setChosenSubjetId(e.target.value)}
                className="w-full bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-amber-500/50 mb-6"
              >
                <option value="">-- Choisir un sujet --</option>
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.libelle}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleChooseSubjet}
              disabled={savingSubjet || (!chosenSubjetId && availableSubjects.length > 0)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingSubjet ? "Enregistrement..." : availableSubjects.length === 0 ? "Continuer sans sujet" : "Valider le sujet et continuer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1220] border-r border-slate-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
              PH
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ProjectHub
            </span>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-purple-300 font-medium">
            <Users size={15} className="inline mr-2" />
            Choisir un groupe
          </div>
        </div>
        <div className="border-t border-slate-800 pt-4 px-2 space-y-2">
          <div className="text-xs text-slate-500">
            Connecté : <span className="font-semibold text-slate-400">{user?.prenom} {user?.nom}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Choisissez votre groupe</h1>
          <p className="text-slate-400 text-sm mt-1">
            Projet : <span className="text-white font-medium">{project.titre}</span>
            {project.supervisor && (
              <> · Encadrant : {project.supervisor.prenom} {project.supervisor.nom}</>
            )}
          </p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map(group => {
            const memberCount = group.members.length;
            const isFull      = memberCount >= group.capacite_max;
            const isEmpty     = memberCount === 0;

            return (
              <div
                key={group.id}
                className={`bg-[#0B1220] border rounded-2xl p-5 flex flex-col gap-4 transition-all ${
                  isFull ? "border-white/5 opacity-60" : "border-white/10 hover:border-purple-500/40"
                }`}
              >
                {/* En-tête groupe */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">Groupe {group.numero}</h3>
                    {group.sujet && (
                      <p className="text-xs text-purple-300 mt-0.5">{group.sujet.libelle}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
                    isFull ? "bg-red-500/10 text-red-400" : "bg-indigo-500/10 text-indigo-300"
                  }`}>
                    {memberCount}/{group.capacite_max}
                  </span>
                </div>

                {/* Membres */}
                <div className="flex-1">
                  {isEmpty ? (
                    <p className="text-xs text-slate-600 italic">Aucun membre — vous serez Team Leader</p>
                  ) : (
                    <div className="space-y-1.5">
                      {group.members.map(m => (
                        <div key={m.user_id} className="flex items-center gap-2 text-xs text-slate-300">
                          <div className={`w-6 h-6 rounded-full ${AVATAR_COLORS[m.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                            {m.user.prenom[0]}{m.user.nom[0]}
                          </div>
                          <span>{m.user.prenom} {m.user.nom}</span>
                          {m.role_in_project === "lead" && (
                            <Crown size={10} className="text-amber-400 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bouton */}
                <button
                  disabled={isFull || joining}
                  onClick={() => handleJoin(group.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isFull
                      ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                      : isEmpty
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                  }`}
                >
                  {isFull ? "Complet" : isEmpty
                    ? <><Crown size={13} /> Créer l'équipe (Leader)</>
                    : <><UserCheck size={13} /> Rejoindre</>
                  }
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
