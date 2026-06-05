import { ClipboardCheck, FileText } from "lucide-react";

export default function Evaluation() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">
      <h1 className="text-5xl font-bold mb-4">
        Évaluation des groupes
      </h1>

      <p className="text-gray-400 text-xl mb-10">
        Évaluer les projets et suivre l'avancement des groupes.
      </p>

      <div className="grid gap-8">

        {/* Groupe IA */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <ClipboardCheck size={30} />
            <h2 className="text-3xl font-bold">
              Groupe IA
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="block text-gray-400 mb-2">
                Note /20
              </label>

              <input
                type="number"
                placeholder="16"
                className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">
                Statut
              </label>

              <select className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10">
                <option>Excellent</option>
                <option>Bon</option>
                <option>À améliorer</option>
                <option>En difficulté</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-400 mb-2">
              Commentaire
            </label>

            <textarea
              rows="4"
              placeholder="Très bon projet, bonne organisation..."
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            ></textarea>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-xl font-semibold">
              Enregistrer
            </button>

            <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-xl font-semibold flex items-center gap-2">
              <FileText size={20} />
              Voir le rapport
            </button>
          </div>
        </div>

        {/* Groupe Web */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <ClipboardCheck size={30} />
            <h2 className="text-3xl font-bold">
              Groupe Web
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <label className="block text-gray-400 mb-2">
                Note /20
              </label>

              <input
                type="number"
                placeholder="14"
                className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">
                Statut
              </label>

              <select className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10">
                <option>Excellent</option>
                <option>Bon</option>
                <option>À améliorer</option>
                <option>En difficulté</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-400 mb-2">
              Commentaire
            </label>

            <textarea
              rows="4"
              placeholder="Projet fonctionnel mais amélioration possible..."
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            ></textarea>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-xl font-semibold">
              Enregistrer
            </button>

            <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-xl font-semibold flex items-center gap-2">
              <FileText size={20} />
              Voir le rapport
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}