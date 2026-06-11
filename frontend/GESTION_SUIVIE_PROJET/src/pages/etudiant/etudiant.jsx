import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Crown, 
  UserCheck, 
  Users, 
  Info, 
  CheckCircle2, 
  Edit3 
} from 'lucide-react';

// Simulation de l'état initial des projets assignés à l'étudiant connecté
const INITIAL_ASSIGNED_PROJECTS = [
  {
    id: 'p-101',
    title: 'Développement d\'une Architecture d\'Audio Mixer Pro',
    groups: [
      { id: 'g-1', name: 'Groupe Alpha', capacity: 4, members: [{ name: 'Marie Dupont', isLeader: true }], subject: 'Filtres Audio Numériques' },
      { id: 'g-2', name: 'Groupe Beta', capacity: 4, members: [], subject: '' },
      { id: 'g-3', name: 'Groupe Gamma', capacity: 4, members: [{ name: 'Lucas Martin', isLeader: false }], subject: '' },
    ]
  }
];

export default function StudentDashboard() {
  const [projects, setProjects] = useState(INITIAL_ASSIGNED_PROJECTS);
  
  // État simulant l'inscription de l'étudiant connecté à un groupe spécifique
  // Clé : ID du projet, Valeur : ID du groupe rejoint
  const [joinedGroups, setJoinedGroups] = useState({});

  // Méthode pour rejoindre un groupe
  const handleJoinGroup = (projectId, groupId) => {
    // Nom fictif de l'étudiant connecté
    const currentUserName = "Assane Diakite";

    setProjects(prevProjects => prevProjects.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        groups: project.groups.map(group => {
          if (group.id !== groupId) return group;

          // Déterminer s'il devient automatiquement leader (si le groupe est vide)
          const isGroupEmpty = group.members.length === 0;
          
          return {
            ...group,
            members: [...group.members, { name: currentUserName, isLeader: isGroupEmpty }]
          };
        })
      };
    }));

    // Enregistrement local de l'affiliation de l'étudiant
    setJoinedGroups(prev => ({ ...prev, [projectId]: groupId }));
  };

  // Méthode permettant uniquement au Team Leader de modifier le sujet
  const handleUpdateSubject = (projectId, groupId, newSubject) => {
    setProjects(prevProjects => prevProjects.map(project => {
      if (project.id !== projectId) return project;
      return {
        ...project,
        groups: project.groups.map(group => {
          if (group.id !== groupId) return group;
          return { ...group, subject: newSubject };
        })
      };
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#020817] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1220] border-r border-slate-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            EF
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduFlow</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-400 font-medium border border-indigo-500/20 transition-all">
            <LayoutDashboard size={18} />
            Dashboard Étudiant
          </button>
        </nav>
        <div className="border-t border-slate-800 pt-4 px-2 text-xs text-slate-500">
          Connecté : **Assane Diakite**
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Mon Espace de Travail</h1>
          <p className="text-slate-400">Consultez vos projets assignés, rejoignez une équipe et configurez vos livrables.</p>
        </header>

        <div className="space-y-12">
          {projects.map((project) => {
            const myGroupId = joinedGroups[project.id];
            const hasJoinedAnyGroup = !!myGroupId;
            const myGroup = project.groups.find(g => g.id === myGroupId);
            const isLeader = myGroup?.members.find(m => m.name === "Assane Diakite")?.isLeader;

            return (
              <div key={project.id} className="bg-[#0B1220] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">Projet Assigné</span>
                    <h2 className="text-xl font-bold text-white mt-2">{project.title}</h2>
                  </div>
                </div>

                {/* CONDITION 1 : L'étudiant a déjà rejoint un groupe -> Focus exclusif sur ses infos */}
                {hasJoinedAnyGroup ? (
                  <div className="bg-[#020817] border border-emerald-500/20 rounded-xl p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-200">Votre équipe : {myGroup.name}</h3>
                          <p className="text-xs text-slate-500">Membres : {myGroup.members.length} / {myGroup.capacity}</p>
                        </div>
                      </div>
                      {isLeader && (
                        <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium">
                          <Crown size={12} /> Team Leader
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Liste des coéquipiers */}
                      <div>
                        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1">
                          <Users size={12} /> Liste des membres actuels
                        </h4>
                        <ul className="bg-[#0B1220] border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden">
                          {myGroup.members.map((member, i) => (
                            <li key={i} className="px-4 py-3 text-sm flex items-center justify-between">
                              <span className={member.name === "Assane Diakite" ? "font-semibold text-indigo-400" : "text-slate-300"}>
                                {member.name} {member.name === "Assane Diakite" && "(Vous)"}
                              </span>
                              {member.isLeader && (
                                <span className="text-[10px] text-amber-400 flex items-center gap-0.5"><Crown size={10}/> Leader</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Zone Sujet du Projet */}
                      <div>
                        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1">
                          <Edit3 size={12} /> Sujet d'étude de l'équipe
                        </h4>
                        {isLeader ? (
                          <div className="space-y-2">
                            <textarea
                              value={myGroup.subject}
                              onChange={(e) => handleUpdateSubject(project.id, myGroup.id, e.target.value)}
                              placeholder="Décrivez brièvement l'axe de recherche ou la problématique choisie..."
                              className="w-full h-24 bg-[#0B1220] border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                            <p className="text-[11px] text-amber-500/80 flex items-center gap-1">
                              <Info size={12} /> En tant que Team Leader, vos modifications sont enregistrées en temps réel.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-4 min-h-24 flex flex-col justify-between">
                            <p className="text-sm text-slate-300 italic">
                              "{myGroup.subject || 'Aucun sujet défini pour le moment.'}"
                            </p>
                            <p className="text-[10px] text-slate-500 mt-2">
                              Seul votre Team Leader peut éditer ce champ.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CONDITION 2 : L'étudiant n'a pas encore choisi de groupe -> Grille d'options */
                  <div>
                    <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                      <Info size={16} className="text-indigo-400" />
                      Veuillez sélectionner un groupe ci-dessous pour vous positionner.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {project.groups.map((group) => {
                        const remainingPlaces = group.capacity - group.members.length;
                        const isFull = remainingPlaces <= 0;
                        const isGroupEmpty = group.members.length === 0;

                        return (
                          <div 
                            key={group.id} 
                            className="bg-[#020817] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-inner"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-slate-200">{group.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                  Places: {group.members.length}/{group.capacity}
                                </span>
                              </div>

                              {/* Liste mini des membres existants */}
                              <div className="space-y-1.5 mb-6">
                                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Membres :</p>
                                {group.members.length === 0 ? (
                                  <p className="text-xs text-slate-600 italic">Groupe vide (Devenez Leader !)</p>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    {group.members.map((m, idx) => (
                                      <div key={idx} className="text-xs text-slate-400 flex items-center gap-1">
                                        <span>{m.name}</span>
                                        {m.isLeader && <Crown size={10} className="text-amber-400" />}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bouton adaptatif */}
                            <button
                              disabled={isFull}
                              onClick={() => handleJoinGroup(project.id, group.id)}
                              className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5
                                ${isFull 
                                  ? 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed' 
                                  : isGroupEmpty
                                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-500/10'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                            >
                              {isFull ? (
                                'Complet'
                              ) : isGroupEmpty ? (
                                <>
                                  <Crown size={12} />
                                  Rejoindre (Leader)
                                </>
                              ) : (
                                <>
                                  <UserCheck size={12} />
                                  Rejoindre l'équipe
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}