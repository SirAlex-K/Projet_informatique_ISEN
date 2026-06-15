import { useState, useEffect, useMemo } from "react";
import { X, Plus, BookOpen, Send, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SupervisorNewProject() {
  const navigate = useNavigate();

  // Formulaire
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Options & étudiants depuis l'API
  const [options, setOptions] = useState({ formations: [], promos: [], classesByFormation: {} });
  const [allStudents, setAllStudents] = useState([]);
  const [selected, setSelected] = useState(new Set());

  // Filtres
  const [filterFormation, setFilterFormation] = useState("");
  const [filterPromo, setFilterPromo] = useState("");
  const [filterClasse, setFilterClasse] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/admin/options"),
      api.get("/admin/users/by-role/student"),
    ]).then(([optRes, stuRes]) => {
      setOptions(optRes.data);
      setAllStudents(stuRes.data);
    }).catch(console.error);
  }, []);

  // Classes disponibles selon la formation sélectionnée
  const classeOptions = filterFormation
    ? (options.classesByFormation[filterFormation] || [])
    : Object.values(options.classesByFormation).flat();

  // Étudiants filtrés
  const filtered = useMemo(() => allStudents.filter(s => {
    if (filterFormation && s.formation !== filterFormation) return false;
    if (filterPromo && s.promo !== filterPromo) return false;
    if (filterClasse && s.classe !== filterClasse) return false;
    return true;
  }), [allStudents, filterFormation, filterPromo, filterClasse]);

  const toggleStudent = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (filtered.every(s => selected.has(s.id))) {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(s => next.delete(s.id)); return next; });
    } else {
      setSelected(prev => { const next = new Set(prev); filtered.forEach(s => next.add(s.id)); return next; });
    }
  };

  const addSubject = () => {
    const s = subjectInput.trim();
    if (s && !subjects.includes(s)) setSubjects(prev => [...prev, s]);
    setSubjectInput("");
  };

  const handleSubmit = async () => {
    if (!titre.trim()) { setError("Le titre est obligatoire."); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/projects", { titre: titre.trim(), description: description.trim() || undefined });
      navigate("/supervisor/projects");
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de la création du projet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <div className="max-w-5xl mx-auto">

        <Link to="/supervisor/projects" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 text-sm">
          ← Retour à la liste
        </Link>

        <h1 className="text-2xl font-bold mb-8">Créer et Configurer un Nouveau Projet</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {/* PARAMETRES */}
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Plus size={20} />
            <h2 className="text-xl font-bold">1. Paramètres Généraux</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-gray-300">Titre <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                placeholder="ex: Module de communication SPI"
                className="w-full bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description du projet (optionnel)"
                rows={3}
                className="w-full bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-purple-500/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm text-gray-300">Nombre de Groupes</label>
                <input type="number" defaultValue="3" className="w-full bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-300">Capacité Max / Groupe</label>
                <input type="number" defaultValue="5" className="w-full bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SUJETS */}
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={20} />
            <h2 className="text-xl font-bold">2. Banque de Sujets Imposés</h2>
          </div>
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSubject()}
              placeholder="Ajouter un libellé de sujet..."
              className="flex-1 bg-[#020817] border border-white/10 rounded-xl p-3.5 text-sm outline-none focus:border-purple-500/50"
            />
            <button onClick={addSubject} className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 rounded-xl font-bold text-sm">
              Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {subjects.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">Aucun sujet ajouté.</p>
            )}
            {subjects.map((s, i) => (
              <div key={i} className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-xl text-sm flex items-center justify-between">
                {s}
                <button onClick={() => setSubjects(prev => prev.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ASSIGNATION */}
        <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <Users size={20} />
              <h2 className="text-xl font-bold">3. Assignation</h2>
            </div>
            <div className="flex items-center gap-4">
              {selected.size > 0 && (
                <span className="text-purple-400 text-sm">{selected.size} sélectionné{selected.size > 1 ? "s" : ""}</span>
              )}
              <button onClick={toggleAll} className="text-purple-400 hover:text-purple-300 text-sm">
                {filtered.length > 0 && filtered.every(s => selected.has(s.id)) ? "Tout désélectionner" : "Tout sélectionner"}
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <select
              value={filterFormation}
              onChange={e => { setFilterFormation(e.target.value); setFilterClasse(""); }}
              className="bg-[#020817] border border-white/10 rounded-xl p-3 text-sm outline-none"
            >
              <option value="">Toutes les formations</option>
              {options.formations.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={filterPromo}
              onChange={e => setFilterPromo(e.target.value)}
              className="bg-[#020817] border border-white/10 rounded-xl p-3 text-sm outline-none"
            >
              <option value="">Toutes les promos</option>
              {options.promos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={filterClasse}
              onChange={e => setFilterClasse(e.target.value)}
              className="bg-[#020817] border border-white/10 rounded-xl p-3 text-sm outline-none"
            >
              <option value="">Toutes les classes</option>
              {classeOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Liste */}
          <div className="bg-[#020817] rounded-xl p-3 h-[360px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-600 text-sm py-16">Aucun étudiant trouvé.</div>
            ) : (
              filtered.map(student => (
                <label key={student.id} className={`flex items-center gap-4 border rounded-xl p-4 mb-3 cursor-pointer transition-colors ${selected.has(student.id) ? "bg-purple-500/10 border-purple-500/40" : "bg-[#0B1220] border-white/10 hover:border-purple-500/40"}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 accent-purple-500"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{student.prenom} {student.nom}</h3>
                    <p className="text-gray-400 text-xs">{student.formation} · {student.classe} · Promo {student.promo}</p>
                  </div>
                  <span className="text-gray-600 text-xs">{student.email}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {loading ? "Création en cours..." : "Publier le Projet"}
        </button>

      </div>
    </div>
  );
}
