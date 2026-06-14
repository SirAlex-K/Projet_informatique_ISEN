import { useState } from 'react';
import { LayoutDashboard, Crown, UserCheck, Users, Info, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const INITIAL_PROJECT = {
  id: 'p-1',
  title: 'Projet Traitement de Signal & Audio Mixer',
  subjects: ['Architecture Mixeur Audio Pro', 'Filtres Numériques PIC18', 'DSP et Effets Temps Réel'],
  groups: [
    { id: 'g-1', name: 'Groupe Alpha', capacity: 4, chosenSubject: 'Architecture Mixeur Audio Pro', members: [{ name: 'Marie Dupont', isLeader: true }] },
    { id: 'g-2', name: 'Groupe Beta',  capacity: 4, chosenSubject: '', members: [] },
    { id: 'g-3', name: 'Groupe Gamma', capacity: 4, chosenSubject: '', members: [{ name: 'Lucas Martin', isLeader: false }] },
  ]
};

export default function StudentPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(INITIAL_PROJECT);
  const [joinedGroupId, setJoinedGroupId] = useState(null);

  const currentStudentName = user ? `${user.prenom} ${user.nom}` : 'Étudiant';

  const handleLogout = () => { logout(); navigate('/'); };

  const handleJoinGroup = (groupId) => {
    setProject(prev => ({
      ...prev,
      groups: prev.groups.map(g => {
        if (g.id !== groupId) return g;
        const isFirst = g.members.length === 0;
        return { ...g, members: [...g.members, { name: currentStudentName, isLeader: isFirst }] };
      })
    }));
    setJoinedGroupId(groupId);
  };

  const handleSelectSubject = (groupId, subject) => {
    setProject(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === groupId ? { ...g, chosenSubject: subject } : g)
    }));
  };

  const myGroup = project.groups.find(g => g.id === joinedGroupId);
  const isLeader = myGroup?.members.find(m => m.name === currentStudentName)?.isLeader;

  return (
    <div className="flex min-h-screen bg-[#020817] text-white">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 bg-[#0B1220] border-r border-white/10 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">EF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">EduFlow</h1>
                <p className="text-gray-400 text-xs">Étudiant</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
              <LayoutDashboard size={18} />
              Dashboard Étudiant
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 px-2 mb-3">Connecté : {currentStudentName}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white">Mon Espace de Travail</h1>
          <p className="text-gray-400 text-sm mt-0.5">Affectations de projets et gestion d'équipe en temps réel.</p>
        </header>

        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5 shadow-xl relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl"></div>

          <div className="mb-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
              Projet En Cours
            </span>
            <h2 className="text-base font-bold text-white mt-2">{project.title}</h2>
          </div>

          {joinedGroupId ? (
            <div className="bg-[#020817] border border-emerald-500/20 rounded-xl p-4 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Votre Équipe : {myGroup.name}</h3>
                    <p className="text-xs text-gray-500">
                      Effectif : {myGroup.members.length} / {myGroup.capacity} places occupées
                    </p>
                  </div>
                </div>
                {isLeader && (
                  <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                    <Crown size={11} /> Team Leader
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Membres */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Users size={11} /> Vos Coéquipiers
                  </h4>
                  <div className="bg-[#0B1220] border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden">
                    {myGroup.members.map((m, idx) => (
                      <div key={idx} className="px-3 py-2 text-xs flex justify-between items-center">
                        <span className={m.name === currentStudentName ? 'text-indigo-400 font-semibold' : 'text-gray-300'}>
                          {m.name} {m.name === currentStudentName && '(Vous)'}
                        </span>
                        {m.isLeader && (
                          <span className="text-amber-400 flex items-center gap-0.5 text-[10px]">
                            <Crown size={9} /> Leader
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sujet */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Info size={11} /> Sujet de Recherche
                  </h4>
                  {isLeader ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] text-gray-500">
                        Sélectionnez un sujet parmi la liste validée :
                      </label>
                      <select
                        value={myGroup.chosenSubject}
                        onChange={e => handleSelectSubject(myGroup.id, e.target.value)}
                        className="w-full bg-[#0B1220] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Choisir un sujet --</option>
                        {project.subjects.map((sbj, i) => (
                          <option key={i} value={sbj}>{sbj}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-amber-500/80 italic">
                        Modifications autorisées uniquement pour le Team Leader.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#0B1220] border border-white/10 rounded-xl p-3 min-h-[70px] flex flex-col justify-between">
                      <p className="text-xs text-white italic">
                        {myGroup.chosenSubject ? `"${myGroup.chosenSubject}"` : "Le Team Leader n'a pas encore choisi de sujet."}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-2">
                        Lecture seule — Attente du choix de votre responsable.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Info size={13} className="text-indigo-400" />
                Veuillez vous positionner dans l'un des espaces projets disponibles :
              </p>
              <div className="grid grid-cols-3 gap-4">
                {project.groups.map(group => {
                  const remains = group.capacity - group.members.length;
                  const isFull = remains <= 0;
                  const isEmpty = group.members.length === 0;

                  return (
                    <div key={group.id} className="bg-[#020817] border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-sm text-white">{group.name}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            {group.members.length}/{group.capacity}
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Membres :</span>
                          {isEmpty ? (
                            <p className="text-gray-500 italic text-[11px]">Emplacement libre.</p>
                          ) : (
                            group.members.map((m, idx) => (
                              <div key={idx} className="text-gray-400 flex items-center gap-1 text-[11px]">
                                <span>• {m.name}</span>
                                {m.isLeader && <Crown size={9} className="text-amber-400" />}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <button
                        disabled={isFull}
                        onClick={() => handleJoinGroup(group.id)}
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1
                          ${isFull
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                            : isEmpty
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500'
                              : 'bg-indigo-600 text-white hover:bg-indigo-500'
                          }`}
                      >
                        {isFull ? 'Complet' : isEmpty
                          ? <><Crown size={11} /> Créer l'Équipe (Leader)</>
                          : <><UserCheck size={11} /> Rejoindre</>
                        }
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
