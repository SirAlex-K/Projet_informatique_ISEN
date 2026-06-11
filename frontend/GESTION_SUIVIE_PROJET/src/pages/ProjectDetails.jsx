import { Link } from "react-router-dom";

export default function ProjectDetails() {
  const sujets = [
    {
      nom: "Frontend",
      groupes: [
        { nom: "Groupe A", membres: 4, progression: 80 },
        { nom: "Groupe B", membres: 5, progression: 65 },
        { nom: "Groupe C", membres: 4, progression: 90 },
      ],
    },
    {
      nom: "Backend",
      groupes: [
        { nom: "Groupe D", membres: 4, progression: 70 },
        { nom: "Groupe E", membres: 5, progression: 50 },
        { nom: "Groupe F", membres: 4, progression: 85 },
      ],
    },
    {
      nom: "Base de données",
      groupes: [
        { nom: "Groupe G", membres: 4, progression: 75 },
        { nom: "Groupe H", membres: 5, progression: 60 },
        { nom: "Groupe I", membres: 4, progression: 95 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        Projet EduFlow
      </h1>

      <p className="text-gray-400 text-xl mb-10">
        Sélectionnez un sujet puis un groupe.
      </p>

      {sujets.map((sujet, index) => (
        <div
          key={index}
          className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-10"
        >
          <h2 className="text-4xl font-bold mb-8 text-purple-400">
            {sujet.nom}
          </h2>

          <div className="grid grid-cols-3 gap-8">

            {sujet.groupes.map((groupe, i) => (
              <Link
                key={i}
                to="/group-details"
                className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 hover:border-purple-500 hover:scale-105 transition"
              >

                <div className="flex items-center justify-between mb-6">

                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center text-2xl font-bold">
                    {groupe.nom.split(" ")[1]}
                  </div>

                  <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-xl">
                    {groupe.membres} membres
                  </span>

                </div>

                <h3 className="text-3xl font-bold mb-4">
                  {groupe.nom}
                </h3>

                <p className="text-gray-400 mb-4">
                  Avancement du projet
                </p>

                <div className="w-full bg-gray-700 rounded-full h-3 mb-3">

                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full"
                    style={{
                      width: `${groupe.progression}%`,
                    }}
                  ></div>

                </div>

                <p className="text-green-400 text-xl font-semibold">
                  {groupe.progression}% terminé
                </p>

                <div className="mt-6 border-t border-white/10 pt-4">

                  <p className="text-gray-400">
                    💬 Conversation ouverte
                  </p>

                </div>

              </Link>
            ))}

          </div>
        </div>
      ))}
    </div>
  );
}