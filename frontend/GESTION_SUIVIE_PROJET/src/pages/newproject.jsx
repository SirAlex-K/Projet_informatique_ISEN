import { X } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewProject() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-[#111827] border border-white/10 rounded-3xl p-8 text-white max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-5xl font-bold">
            Créer un nouveau projet
          </h1>

          <Link
            to="/projects"
            className="text-gray-400 hover:text-white transition"
          >
            <X size={36} />
          </Link>
        </div>

        {/* Nom */}
        <div className="mb-8">
          <label className="block text-2xl font-semibold mb-4">
            Nom du projet
          </label>

          <input
            type="text"
            placeholder="Ex: Application React"
            className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500"
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-2xl font-semibold mb-4">
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Décrivez le projet..."
            className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500 resize-none"
          ></textarea>
        </div>

        {/* Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Date */}
          <div>
            <label className="block text-2xl font-semibold mb-4">
              Date limite
            </label>

            <input
              type="date"
              className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-2xl font-semibold mb-4">
              Statut
            </label>

            <select className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500">
              <option>Proposé</option>
              <option>En cours</option>
              <option>Validé</option>
            </select>
          </div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Encadrant */}
          <div>
            <label className="block text-2xl font-semibold mb-4">
              Encadrant
            </label>

            <select className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500">
              <option>Aucun encadrant</option>
              <option>Dr. Marie Leclerc</option>
              <option>Dr. Jean Dupont</option>
            </select>
          </div>

          {/* Groupes */}
          <div>
            <label className="block text-2xl font-semibold mb-4">
              Nombre de groupes
            </label>

            <input
              type="number"
              defaultValue="3"
              className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Taille */}
        <div className="mb-8">
          <label className="block text-2xl font-semibold mb-4">
            Taille maximale par groupe
          </label>

          <input
            type="number"
            defaultValue="4"
            className="w-full bg-[#020817] border border-white/10 rounded-2xl px-6 py-5 text-2xl outline-none focus:border-purple-500"
          />
        </div>

        {/* Students */}
        <div className="mb-10">

          <label className="block text-2xl font-semibold mb-4">
            Étudiants assignés (0)
          </label>

          <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-6 h-[260px] overflow-y-auto">

            <div className="space-y-8">

              {[
                "Alice Martin",
                "Bob Durand",
                "Claire Moreau",
                "David Petit",
              ].map((student, index) => (

                <label
                  key={index}
                  className="flex items-center gap-5 text-2xl"
                >
                  <input
                    type="checkbox"
                    className="w-6 h-6 accent-purple-500"
                  />

                  {student}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-5">

          <button className="bg-white/10 hover:bg-white/20 transition px-8 py-5 rounded-2xl text-2xl">
            Annuler
          </button>

          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-105 transition px-12 py-5 rounded-2xl text-2xl font-semibold shadow-lg">
            Créer le projet
          </button>
        </div>

      </div>
    </div>
  );
}