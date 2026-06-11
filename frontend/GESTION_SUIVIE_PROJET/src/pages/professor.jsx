import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderPlus, 
  Users, 
  ChevronRight, 
  Filter, 
  CheckSquare, 
  Square, 
  Send, 
  Eye 
} from 'lucide-react';

// Données fictives pour la simulation
const MOCK_STUDENTS = [
  { id: '1', name: 'Assane Diakite', promo: '2027', specialite: 'Systèmes Embarqués' },
  { id: '2', name: 'Abdoul Kader Kebe', promo: '2027', specialite: 'Cybersécurité' },
  { id: '3', name: 'Ange Yohan Kouassi', promo: '2027', specialite: 'DevOps' },
  { id: '4', name: 'Marie Dupont', promo: '2026', specialite: 'Cloud' },
  { id: '5', name: 'Lucas Martin', promo: '2027', specialite: 'Cybersécurité' },
];

export default function SupervisorDashboard() {
  // États Formulaire
  const [title, setTitle] = useState('');
  const [groupCount, setGroupCount] = useState(3);
  const [maxCapacity, setMaxCapacity] = useState(5);

  // États Filtres & Sélection Étudiants
  const [promoFilter, setPromoFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // État des projets créés (Simulation API)
  const [createdProjects, setCreatedProjects] = useState([]);
  const [activeProjectView, setActiveProjectView] = useState(null);
  const [activeGroupView, setActiveGroupView] = useState(null);

  // Filtrage des étudiants
  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchPromo = promoFilter === 'All' || student.promo === promoFilter;
    const matchSpec = specFilter === 'All' || student.specialite === specFilter;
    return matchPromo && matchSpec;
  });

  // Gestion de la sélection globale
  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Soumission et Publication du Projet
  const handlePublishProject = (e) => {
    e.preventDefault();
    if (!title) return alert('Veuillez donner un titre au projet');
    if (selectedStudentIds.length === 0) return alert('Veuillez assigner au moins un étudiant');

    // Génération automatique des slots de groupes demandés
    const generatedGroups = Array.from({ length: groupCount }, (_, i) => ({
      id: `g-${Date.now()}-${i + 1}`,
      name: `Groupe ${i + 1}`,
      capacity: maxCapacity,
      members: [],
      subject: ''
    }));

    const newProject = {
      id: `p-${Date.now()}`,
      title,
      assignedStudentIds: [...selectedStudentIds], // Envoi unique de l'array d'IDs
      groups: generatedGroups
    };

    setCreatedProjects([newProject, ...createdProjects]);
    alert(`Projet publié avec succès ! ${selectedStudentIds.length} étudiants assignés en un seul appel.`);
    
    // Reset formulaire
    setTitle('');
    setSelectedStudentIds([]);
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
            Espace Encadrant
          </button>
        </nav>
        <div className="border-t border-slate-800 pt-4 px-2 text-xs text-slate-500">
          Connecté en tant que : **Encadrant**
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Gestion des Projets</h1>
          <p className="text-slate-400">Créez des projets, assignez vos promotions en masse et supervisez les choix de groupes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne Formulaire & Assignation */}
          <section className="lg:col-span-2 space-y-8">
            {/* Formulaire de Création */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FolderPlus className="text-indigo-400" size={20} />
                1. Configuration du Projet
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Titre du Projet</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Conception Mixeur Audio de A à Z" 
                    className="w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Nombre de Groupes</label>
                    <input 
                      type="number" 
                      value={groupCount} 
                      onChange={(e) => setGroupCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Capacité max / groupe</label>
                    <input 
                      type="number" 
                      value={maxCapacity} 
                      onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Table d'Assignation Fluide */}
            <div className="bg-[#0B1220] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="text-purple-400" size={20} />
                  2. Assignation des Étudiants en Masse
                </h2>
                <button 
                  onClick={handleSelectAll}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg font-medium transition-colors border border-slate-700"
                >
                  {selectedStudentIds.length === filteredStudents.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
              </div>

              {/* Filtres intelligents */}
              <div className="flex flex-wrap gap-3 mb-4 bg-[#020817] p-3 rounded-xl border border-slate-900">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Filter size={14} /> Filtres :
                </div>
                <select 
                  value={promoFilter} 
                  onChange={(e) => setPromoFilter(e.target.value)}
                  className="bg-[#0B1220] border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">Toutes les promos</option>
                  <option value="2026">Promo 2026</option>
                  <option value="2027">Promo 2027</option>
                </select>
                <select 
                  value={specFilter} 
                  onChange={(e) => setSpecFilter(e.target.value)}
                  className="bg-[#0B1220] border border-slate-800 rounded-lg text-xs px-2 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">Toutes spécialités</option>
                  <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                  <option value="Cybersécurité">Cybersécurité</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#020817] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4 w-12">Sél.</th>
                      <th className="p-4">Nom Complet</th>
                      <th className="p-4">Promotion</th>
                      <th className="p-4">Spécialité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {filteredStudents.map((student) => {
                      const isSelected = selectedStudentIds.includes(student.id);
                      return (
                        <tr 
                          key={student.id} 
                          onClick={() => handleSelectStudent(student.id)}
                          className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${isSelected ? 'bg-indigo-600/5' : ''}`}
                        >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleSelectStudent(student.id)} className="text-indigo-400">
                              {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-600" />}
                            </button>
                          </td>
                          <td className="p-4 font-medium text-slate-200">{student.name}</td>
                          <td className="p-4 text-slate-400">{student.promo}</td>
                          <td className="p-4">
                            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">
                              {student.specialite}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bouton de Publication unique */}
              <button 
                onClick={handlePublishProject}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Publier le Projet ({selectedStudentIds.length} assignés)
              </button>
            </div>
          </section>

          {/* Colonne Droite : Superviseur d'États & Groupes */}
          <section className="space-y-6">
            <div className="bg-[#0B1220] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Projets Actifs</h2>
              {createdProjects.length === 0 ? (
                <p className="text-slate-500 text-sm italic">Aucun projet configuré pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {createdProjects.map(project => (
                    <div key={project.id} className="border border-slate-800 rounded-xl p-4 bg-[#020817]/60">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-200 text-sm">{project.title}</h3>
                        <button 
                          onClick={() => {
                            setActiveProjectView(activeProjectView === project.id ? null : project.id);
                            setActiveGroupView(null);
                          }}
                          className="text-xs text-indigo-400 flex items-center gap-1 hover:underline"
                        >
                          <Eye size={12} /> {activeProjectView === project.id ? 'Fermer' : 'Voir'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">{project.groups.length} groupes auto-générés • {project.assignedStudentIds.length} inscrits</p>

                      {/* Déploiement des Groupes si sélectionné */}
                      {activeProjectView === project.id && (
                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Groupes générés :</p>
                          {project.groups.map(group => (
                            <button
                              key={group.id}
                              onClick={() => setActiveGroupView(activeGroupView?.id === group.id ? null : group)}
                              className={`w-full flex justify-between items-center p-2 rounded-lg text-left text-xs border transition-colors ${activeGroupView?.id === group.id ? 'bg-purple-600/10 border-purple-500/30 text-purple-300' : 'bg-[#0B1220] border-slate-800 hover:border-slate-700 text-slate-300'}`}
                            >
                              <span>{group.name}</span>
                              <div className="flex items-center gap-1 text-slate-500">
                                <span>{group.members.length}/{group.capacity} pl.</span>
                                <ChevronRight size={12} />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vue Détails du Groupe Inspecté */}
            {activeGroupView && (
              <div className="bg-[#0B1220] border border-purple-500/20 rounded-2xl p-6 shadow-xl animate-fadeIn">
                <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Inspecteur : {activeGroupView.name}
                </h2>
                <p className="text-xs text-slate-400 mb-4">Détails structurels en temps réel</p>
                
                <div className="space-y-3 text-xs">
                  <div className="bg-[#020817] p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block mb-1">Sujet choisi :</span>
                    <span className="text-slate-200 font-medium italic">{activeGroupView.subject || 'Aucun sujet défini par le Team Leader'}</span>
                  </div>
                  <div className="bg-[#020817] p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block mb-1">Membres de l'équipe :</span>
                    {activeGroupView.members.length === 0 ? (
                      <span className="text-slate-600 italic">Aucun étudiant n'a rejoint ce groupe.</span>
                    ) : (
                      <ul className="space-y-1 mt-1">
                        {activeGroupView.members.map((m, index) => (
                          <li key={index} className="text-slate-200 flex items-center justify-between">
                            <span>• {m.name}</span>
                            {m.isLeader && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded">Team Leader</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}