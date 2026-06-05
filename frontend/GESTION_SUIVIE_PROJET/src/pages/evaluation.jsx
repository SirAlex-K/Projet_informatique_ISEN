import { useState } from "react";
import { ClipboardCheck, Save } from "lucide-react";

export default function Evaluation() {
  const groupesParSujet = {
    "Plateforme de gestion des projets": [
      "Groupe A",
      "Groupe B",
      "Groupe C",
    ],
    "Application Mobile ISEN": [
      "Groupe D",
      "Groupe E",
    ],
    "Intelligence Artificielle": [
      "Groupe F",
      "Groupe G",
      "Groupe H",
    ],
    "Gestion Bibliothèque": [
      "Groupe I",
      "Groupe J",
    ],
  };

  const [sujet, setSujet] = useState("");
  const [groupe, setGroupe] = useState("");

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        Évaluation des groupes
      </h1>

      <p className="text-gray-400 text-xl mb-10">
        Sélectionnez un sujet puis un groupe pour l'évaluer.
      </p>

      {/* Formulaire */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-8">

        <div className="flex items-center gap-4 mb-8">
          <ClipboardCheck size={32} />
          <h2 className="text-3xl font-bold">
            Nouvelle évaluation
          </h2>
        </div>

        {/* Sujet */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Sujet
          </label>

          <select
            value={sujet}
            onChange={(e) => {
              setSujet(e.target.value);
              setGroupe("");
            }}
            className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
          >
            <option value="">
              Choisir un sujet
            </option>

            {Object.keys(groupesParSujet).map((s) => (
              <option key={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Groupe */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Groupe
          </label>

          <select
            value={groupe}
            onChange={(e) => setGroupe(e.target.value)}
            className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
          >
            <option value="">
              Choisir un groupe
            </option>

            {sujet &&
              groupesParSujet[sujet].map((g) => (
                <option key={g}>
                  {g}
                </option>
              ))}
          </select>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="block text-gray-400 mb-2">
              Technique /20
            </label>

            <input
              type="number"
              placeholder="16"
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Interface /20
            </label>

            <input
              type="number"
              placeholder="15"
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Documentation /20
            </label>

            <input
              type="number"
              placeholder="18"
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">
              Présentation /20
            </label>

            <input
              type="number"
              placeholder="17"
              className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
            />
          </div>

        </div>

        {/* Commentaire */}
        <div className="mt-6">
          <label className="block text-gray-400 mb-2">
            Commentaire
          </label>

          <textarea
            rows="5"
            placeholder="Commentaires du professeur..."
            className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
          ></textarea>
        </div>

        {/* Bouton */}
        <button className="mt-6 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
          <Save size={18} />
          Enregistrer l'évaluation
        </button>

      </div>

      {/* Historique */}
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Évaluations réalisées
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-4">Sujet</th>
              <th>Groupe</th>
              <th>Note Finale</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b border-white/10">
              <td className="py-4">
                Plateforme de gestion des projets
              </td>
              <td>Groupe A</td>
              <td className="text-green-400">
                16.5 / 20
              </td>
            </tr>

            <tr className="border-b border-white/10">
              <td className="py-4">
                Application Mobile ISEN
              </td>
              <td>Groupe D</td>
              <td className="text-yellow-400">
                14 / 20
              </td>
            </tr>

            <tr>
              <td className="py-4">
                Intelligence Artificielle
              </td>
              <td>Groupe G</td>
              <td className="text-green-400">
                18 / 20
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}