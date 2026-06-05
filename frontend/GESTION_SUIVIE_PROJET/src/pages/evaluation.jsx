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
  <div className="min-h-screen bg-[#020817] text-white flex">
    {/* Sidebar */}
      <div className="w-[320px] border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={28} />
              </div>

              <div>
                <h1 className="text-4xl font-bold">EduFlow</h1>
                <p className="text-gray-400 text-lg">Professeur</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-5 space-y-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-5 flex items-center gap-4 text-2xl font-semibold shadow-lg">
              <LayoutDashboard size={26} />
              Tableau de bord
            </div>
            <Link
  to="/evaluation"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
>
  <ClipboardCheck size={26} />
  Évaluation
</Link>

            <Link
  to="/projects"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition cursor-pointer"
>
              <FolderKanban size={26} />
              Projets
            </Link>

            <Link
  to="/groups"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
>
  <Users size={26} />
  Groupes
</Link>


            <Link
  to="/students"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition cursor-pointer"
>
  <GraduationCap size={26} />
  Étudiants
</Link>
            <Link
  to="/messages"
  className="p-5 flex items-center justify-between text-2xl text-gray-400 hover:text-white transition"
>
  <div className="flex items-center gap-4">
    <MessageSquare size={26} />
    Messages
  </div>

  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm text-white">
    1
  </div>
</Link>
          </div>
        </div>

        {/* Bottom */}
<div className="p-5 border-t border-white/10">
  <Link
  to="/login"
  className="w-full flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-2xl hover:bg-red-500/20 transition"
>
  <LogOut size={26} />
  Déconnexion
</Link>
</div>
        
      </div>

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
              <option key={s}>{s}</option>
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
                <option key={g}>{g}</option>
              ))}
          </select>
        </div>

        {/* Note globale */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Note globale /20
          </label>

          <input
            type="number"
            min="0"
            max="20"
            placeholder="Ex : 16"
            className="w-full bg-[#0B1220] p-4 rounded-xl border border-white/10"
          />
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
                16 / 20
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