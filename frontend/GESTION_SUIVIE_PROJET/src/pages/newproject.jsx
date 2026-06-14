import { X, Plus, BookOpen, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewProject() {
  const students = [
    {
      nom: "Assane Diakite",
      formation: "Systèmes Embarqués",
      promo: "2027",
    },
    {
      nom: "Abdoul Kader Kebe",
      formation: "Cybersécurité",
      promo: "2027",
    },
    {
      nom: "Ange Yohan Kouassi",
      formation: "DevOps",
      promo: "2027",
    },
    {
      nom: "Marie Dupont",
      formation: "Cloud",
      promo: "2026",
    },
    {
      nom: "Lucas Martin",
      formation: "Cybersécurité",
      promo: "2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <div className="max-w-6xl mx-auto">

        <Link
          to="/projects"
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-8"
        >
          ← Retour à la liste
        </Link>

        <h1 className="text-6xl font-bold mb-10">
          Créer et Configurer un Nouveau Projet
        </h1>

        {/* PARAMETRES */}
        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-10">

          <div className="flex items-center gap-3 mb-8">
            <Plus size={28} />
            <h2 className="text-4xl font-bold">
              1. Paramètres Généraux
            </h2>
          </div>

          <div className="space-y-6">

            <div>
              <label className="block mb-3 text-xl">
                Titre
              </label>

              <input
                type="text"
                placeholder="ex: Module de communication SPI"
                className="w-full bg-[#020817] border border-white/10 rounded-2xl p-5 text-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block mb-3 text-xl">
                  Nombre de Groupes
                </label>

                <input
                  type="number"
                  defaultValue="3"
                  className="w-full bg-[#020817] border border-white/10 rounded-2xl p-5 text-xl"
                />
              </div>

              <div>
                <label className="block mb-3 text-xl">
                  Capacité Max / Groupe
                </label>

                <input
                  type="number"
                  defaultValue="5"
                  className="w-full bg-[#020817] border border-white/10 rounded-2xl p-5 text-xl"
                />
              </div>

            </div>

          </div>

        </div>

        {/* SUJETS */}
        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-10">

          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={28} />
            <h2 className="text-4xl font-bold">
              2. Banque de Sujets Imposés
            </h2>
          </div>

          <div className="flex gap-4 mb-6">

            <input
              type="text"
              placeholder="Ajouter un libellé de sujet..."
              className="flex-1 bg-[#020817] border border-white/10 rounded-2xl p-5 text-xl"
            />

            <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 rounded-2xl font-bold">
              Ajouter
            </button>

          </div>

          <div className="space-y-3">

            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl">
              Architecture Microservices
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl">
              Application Web React
            </div>

          </div>

        </div>

        {/* ASSIGNATION */}
        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-4xl font-bold">
              3. Assignation
            </h2>

            <button className="text-purple-400 hover:text-purple-300">
              Tout sélectionner
            </button>

          </div>

          {/* FILTRES */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <select className="bg-[#020817] border border-white/10 rounded-2xl p-4">
              <option>Toutes les promos</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>

            <select className="bg-[#020817] border border-white/10 rounded-2xl p-4">
              <option>Toutes les classes</option>
              <option>L1</option>
              <option>L2</option>
              <option>L3</option>
              <option>M1</option>
              <option>M2</option>
            </select>

            <select className="bg-[#020817] border border-white/10 rounded-2xl p-4">
              <option>Toutes spécialités</option>
              <option>Cybersécurité</option>
              <option>Cloud</option>
              <option>DevOps</option>
              <option>Systèmes Embarqués</option>
            </select>

          </div>

          {/* LISTE */}
          <div className="bg-[#020817] rounded-2xl p-4 h-[450px] overflow-y-auto">

            {students.map((student, index) => (
              <label
                key={index}
                className="flex items-center gap-5 bg-[#0B1220] border border-white/10 rounded-2xl p-5 mb-4 cursor-pointer hover:border-purple-500"
              >

                <input
                  type="checkbox"
                  className="w-5 h-5 accent-purple-500"
                />

                <div>
                  <h3 className="text-xl font-semibold">
                    {student.nom}
                  </h3>

                  <p className="text-gray-400">
                    {student.formation}
                  </p>
                </div>

              </label>
            ))}

          </div>

          <button className="w-full mt-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 py-5 rounded-2xl text-2xl font-bold flex items-center justify-center gap-3">
            <Send size={24} />
            Publier le Projet
          </button>

        </div>

      </div>

    </div>
  );
}