import React, { useState } from 'react';
import { LayoutDashboard, Crown, UserCheck, Users, Info, CheckCircle2, LogOut, FolderKanban, FileText, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        return {
          ...g,
          members: [...g.members, { name: currentStudentName, isLeader: isFirst }]
        };
      })
    }));
    setJoinedGroupId(groupId);
  };

  const handleSelectSubject = (groupId, subject) => {
    setProject(prev => ({
      ...prev,
      groups: prev.groups.map(g => (g.id === groupId ? { ...g, chosenSubject: subject } : g))
    }));
  };

  const myGroup = project.groups.find(g => g.id === joinedGroupId);
  const isLeader = myGroup?.members.find(m => m.name === currentStudentName)?.isLeader;

  return (
    <div className="flex min-h-screen bg-[#020817] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1220] border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">EF</div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduFlow</span>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-400 font-medium border border-indigo-500/20 w-full text-left">
            <LayoutDashboard size={18} /> Dashboard Étudiant
          </button>
          <Link to="/student/kanban" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm">
            <FolderKanban size={18} /> Mon Projet
          </Link>
          <Link to="/student/livrables" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm">
            <FileText size={18} /> Livrables
          </Link>
          <Link to="/student/notes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm">
            <Star size={18} /> Notes
          </Link>
          <Link to="/student/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-sm">
            <MessageSquare size={18} /> Chat du groupe
          </Link>
        </div>
        <div className="border-t border-slate-800 pt-4 px-2 space-y-3">
          <div className="text-xs text-slate-500">Connecté : <span className="font-semibold">{currentStudentName}</span></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm hover:bg-red-500/20 transition"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Mon Espace de Travail</h1>
          <p className="text-slate-400 text-sm">Affectations de projets et gestion d'équipe en temps réel.</p>
        </header>

        <div className="bg-[#0B1220] border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">Projet En Cours</span>
            <h2 className="text-xl font-bold text-white mt-2">{project.title}</h2>
          </div>

          {joinedGroupId ? (
            <div className="bg-[#020817] border border-emerald-500/20 rounded-xl p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle2 size={22} /></div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-base">Votre Équipe : {myGroup.name}</h3>
                    <p className="text-xs text-slate-500">Effectif : {myGroup.members.length} / {myGroup.capacity} places occupées</p>
                  </div>
                </div>
                {isLeader && (
                  <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold">
                    <Crown size={12} /> Team Leader
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Membres */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Users size={12}/> Vos Coéquipiers</h4>
                  <div className="bg-[#0B1220] border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden">
                    {myGroup.members.map((m, idx) => (
                      <div key={idx} className="px-4 py-2.5 text-xs flex justify-between items-center">
                        <span className={m.name === currentStudentName ? "text-indigo-400 font-semibold" : "text-slate-300"}>
                          {m.name} {m.name === currentStudentName && "(Vous)"}
                        </span>
                        {m.isLeader && <span className="text-amber-400 flex items-center gap-0.5 text-[10px]"><Crown size={10}/> Leader</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sujet */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><Info size={12}/> Sujet de Recherche</h4>
                  {isLeader ? (
                    <div className="space-y-2">
                      <label className="block text-[11px] text-slate-500">Sélectionnez un sujet parmi la liste validée par votre encadrant :</label>
                      <select
                        value={myGroup.chosenSubject}
                        onChange={(e) => handleSelectSubject(myGroup.id, e.target.value)}
                        className="w-full bg-[#0B1220] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">-- Choisir un sujet officiel --</option>
                        {project.subjects.map((sbj, i) => (
                          <option key={i} value={sbj}>{sbj}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-amber-500/80 italic">Modifications autorisées uniquement pour le Team Leader.</p>
                    </div>
                  ) : (
                    <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-4 min-h-[80px] flex flex-col justify-between">
                      <p className="text-xs text-slate-200 font-medium italic">
                        {myGroup.chosenSubject ? `"${myGroup.chosenSubject}"` : "Le Team Leader n'a pas encore choisi de sujet."}
                      </p>
                      <span className="text-[10px] text-slate-500 block mt-2">Lecture seule — Attente du choix de votre responsable de groupe.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 flex items-center gap-1.5"><Info size={14} className="text-indigo-400"/> Veuillez vous positionner dans l'un des espaces projets disponibles :</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.groups.map(group => {
                  const remains = group.capacity - group.members.length;
                  const isFull = remains <= 0;
                  const isEmpty = group.members.length === 0;

                  return (
                    <div key={group.id} className="bg-[#020817] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700/60 transition-all">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-sm text-slate-200">{group.name}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                            Places : {group.members.length}/{group.capacity}
                          </span>
                        </div>
                        <div className="space-y-1 mb-4 text-xs">
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Membres :</span>
                          {isEmpty ? (
                            <p className="text-slate-500 italic text-[11px]">Emplacement libre.</p>
                          ) : (
                            group.members.map((m, idx) => (
                              <div key={idx} className="text-slate-400 flex items-center gap-1 text-[11px]">
                                <span>• {m.name}</span>
                                {m.isLeader && <Crown size={10} className="text-amber-400"/>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <button
                        disabled={isFull}
                        onClick={() => handleJoinGroup(group.id)}
                        className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1
                          ${isFull ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800' :
                            isEmpty ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                          }`}
                      >
                        {isFull ? 'Complet' : isEmpty ? <><Crown size={12}/> Créer l'Équipe (Leader)</> : <><UserCheck size={12}/> Rejoindre</>}
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
