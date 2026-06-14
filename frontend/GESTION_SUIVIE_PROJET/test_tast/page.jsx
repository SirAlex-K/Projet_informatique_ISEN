import React, { useState } from 'react';
import { 
  LayoutDashboard, FolderPlus, Users, ChevronDown, ChevronRight, 
  Filter, CheckSquare, Square, Send, Eye, Plus, X, ArrowLeft, BookOpen, Crown
} from 'lucide-react';

const MOCK_STUDENTS = [
  { id: '1', name: 'Assane Diakite', promo: '2027', specialite: 'Systèmes Embarqués' },
  { id: '2', name: 'Abdoul Kader Kebe', promo: '2027', specialite: 'Cybersécurité' },
  { id: '3', name: 'Ange Yohan Kouassi', promo: '2027', specialite: 'DevOps' },
  { id: '4', name: 'Marie Dupont', promo: '2026', specialite: 'Cloud' },
  { id: '5', name: 'Lucas Martin', promo: '2027', specialite: 'Cybersécurité' },
];

export default function SupervisorDashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [groupCount, setGroupCount] = useState(3);
  const [maxCapacity, setMaxCapacity] = useState(5);
  
  // Gestion des sujets multiples par projet
  const [subjectInput, setSubjectInput] = useState('');
  const [projectSubjects, setProjectSubjects] = useState([]);

  const [promoFilter, setPromoFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Projets avec "Effet Poupée Russe" intégré
  const [createdProjects, setCreatedProjects] = useState([
    {
      id: 'p-1',
      title: 'Projet Traitement de Signal & Audio Mixer',
      assignedStudentIds: ['1', '2', '3'],
      subjects: ['Architecture Mixeur Audio Pro', 'Filtres Numériques PIC18', 'DSP et Effets Temps Réel'],
      groups: [
        { id: 'g-101', name: 'Groupe 1', capacity: 4, chosenSubject: 'Architecture Mixeur Audio Pro', members: [{ name: 'Assane Diakite', isLeader: true }, { name: 'Abdoul Kader Kebe', isLeader: false }] },
        { id: 'g-102', name: 'Groupe 2', capacity: 4, chosenSubject: '', members: [] }
      ]
    }
  ]);

  // États d'expansion (Poupées russes)
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const addSubject = () => {
    if (subjectInput.trim()) {
      setProjectSubjects([...projectSubjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  };

  const removeSubject = (index) => {
    setProjectSubjects(projectSubjects.filter((_, i) => i !== index));
  };

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchPromo = promoFilter === 'All' || student.promo === promoFilter;
    const matchSpec = specFilter === 'All' || student.specialite === specFilter;
    return matchPromo && matchSpec;
  });

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handlePublishProject = (e) => {
    e.preventDefault();
    if (!title) return alert('Titre manquant');
    if (projectSubjects.length === 0) return alert('Ajoutez au moins un sujet pour ce projet');
    if (selectedStudentIds.length === 0) return alert('Assignez au moins un étudiant');

    const generatedGroups = Array.from({ length: groupCount }, (_, i) => ({
      id: `g-${Date.now()}-${i + 1}`,
      name: `Groupe ${i + 1}`,
      capacity: maxCapacity,
      chosenSubject: '',
      members: []
    }));

    const newProject = {
      id: `p-${Date.now()}`,
      title,
      assignedStudentIds: [...selectedStudentIds],
      subjects: projectSubjects,
      groups: generatedGroups
    };

    setCreatedProjects([newProject, ...createdProjects]);
    setShowCreateForm(false);
    // Reset
    setTitle('');
    setProjectSubjects([]);
    setSelectedStudentIds([]);
  };

  return (
    <div className="flex min-h-screen bg-[#020817] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1220] border-r border-slate-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">EF</div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduFlow</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-400 font-medium border border-indigo-500/20 w-full text-left">
            <LayoutDashboard size={18} /> Espace Encadrant
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
        {!showCreateForm ? (
          /* VUE LISTE DES PROJETS ACTIFS */
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Tableau de Bord</h1>
                <p className="text-slate-400 text-sm">Supervisez vos projets et déployez vos structures.</p>
              </div>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10"
              >
                <Plus size={18} /> Nouveau Projet
              </button>
            </header>

            <div className="space-y-4">
              <h2 className="text-sm uppercase font-bold tracking-wider text-slate-500">Mes Projets Actifs</h2>
              {createdProjects.map(project => {
                const isProjectExpanded = expandedProjectId === project.id;
                return (
                  <div key={project.id} className="bg-[#0B1220] border border-slate-800 rounded-xl overflow-hidden shadow-md transition-all">
                    {/* Niveau 1 : Le Projet */}
                    <div 
                      onClick={() => setExpandedProjectId(isProjectExpanded ? null : project.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-lg">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-base">{project.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{project.groups.length} groupes configurés • {project.subjects.length} sujets déposés</p>
                        </div>
                      </div>
                      {isProjectExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                    </div>

                    {/* Niveau 2 : Liste des Groupes (Effet poupée russe) */}
                    {isProjectExpanded && (
                      <div className="bg-[#050c1a] border-t border-slate-800/60 p-4 space-y-2">
                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider px-2 mb-2">Groupes rattachés :</p>
                        {project.groups.map(group => {
                          const isGroupExpanded = expandedGroupId === group.id;
                          return (
                            <div key={group.id} className="bg-[#0B1220] border border-slate-800/80 rounded-lg overflow-hidden">
                              <div 
                                onClick={() => setExpandedGroupId(isGroupExpanded ? null : group.id)}
                                className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800/40 text-sm"
                              >
                                <span className="font-medium text-slate-200">{group.name}</span>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{group.members.length} / {group.capacity} étudiants</span>
                                  {isGroupExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                              </div>

                              {/* Niveau 3 : Détails profonds du Groupe choisi */}
                              {isGroupExpanded && (
                                <div className="bg-[#020817] p-4 border-t border-slate-800 text-xs space-y-3">
                                  <div>
                                    <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Sujet Choisi par le groupe :</span>
                                    <span className={`font-medium ${group.chosenSubject ? 'text-emerald-400' : 'text-amber-500 italic'}`}>
                                      {group.chosenSubject || "Aucun sujet sélectionné pour l'instant par l'équipe."}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Composition de la table :</span>
                                    {group.members.length === 0 ? (
                                      <p className="text-slate-600 italic">Groupe actuellement vide.</p>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                        {group.members.map((m, i) => (
                                          <div key={i} className="bg-[#0B1220] border border-slate-800 px-3 py-2 rounded flex items-center justify-between">
                                            <span className="text-slate-300">{m.name}</span>
                                            {m.isLeader && <span className="text-amber-400 flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px]"><Crown size={10}/> Leader</span>}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* VUE CRÉATION DE PROJET (DÉPLIÉE AU CLIC) */
          <div className="animate-fadeIn">
            <button onClick={() => setShowCreateForm(false)} className="text-sm text-slate-400 flex items-center gap-1 hover:text-white mb-6">
              <ArrowLeft size={16} /> Retour à la liste
            </button>
            <h1 className="text-2xl font-bold mb-6 text-white">Créer et Configurer un Nouveau Projet</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Propriétés */}
                <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2"><FolderPlus size={16}/> 1. Paramètres Généraux</h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Titre</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex: Module de communication SPI" className="w-full bg-[#020817] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Nombre de Groupes</label>
                      <input type="number" value={groupCount} onChange={(e) => setGroupCount(parseInt(e.target.value) || 0)} className="w-full bg-[#020817] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Capacité Max / Groupe</label>
                      <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)} className="w-full bg-[#020817] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"/>
                    </div>
                  </div>
                </div>

                {/* Ajout des Sujets de l'Encadrant */}
                <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2"><BookOpen size={16}/> 2. Banque de Sujets Imposés</h3>
                  <div className="flex gap-2">
                    <input type="text" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} placeholder="Ajouter un libellé de sujet..." className="flex-1 bg-[#020817] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"/>
                    <button type="button" onClick={addSubject} className="bg-purple-600 hover:bg-purple-500 px-3 rounded-lg text-xs font-medium">Ajouter</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projectSubjects.map((sbj, idx) => (
                      <span key={idx} className="bg-[#020817] border border-purple-500/30 text-purple-300 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        {sbj}
                        <X size={12} className="cursor-pointer text-slate-500 hover:text-red-400" onClick={() => removeSubject(idx)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table d'assignation simplifiée de masse */}
              <div className="bg-[#0B1220] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
                    <span>3. Assignation</span>
                    <button type="button" onClick={handleSelectAll} className="text-[10px] text-indigo-400 hover:underline">Tout Sélectionner</button>
                  </h3>
                  <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
                    {filteredStudents.map(s => {
                      const isSelected = selectedStudentIds.includes(s.id);
                      return (
                        <div key={s.id} onClick={() => handleSelectStudent(s.id)} className="flex items-center gap-3 p-2 rounded-lg bg-[#020817] border border-slate-800/60 cursor-pointer hover:border-indigo-500/40 text-xs">
                          {isSelected ? <CheckSquare size={14} className="text-indigo-400" /> : <Square size={14} className="text-slate-600" />}
                          <div>
                            <p className="font-medium text-slate-200">{s.name}</p>
                            <p className="text-[10px] text-slate-500">{s.specialite}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handlePublishProject} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2.5 rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2">
                  <Send size={12} /> Publier le Projet
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}