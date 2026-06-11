import { Link } from "react-router-dom";

export default function ProjectDetails() {
  const sujets = [
    {
      id: 1,
      nom: "Maquette UI",
      groupes: ["Groupe A", "Groupe B"],
    },
    {
      id: 2,
      nom: "Base de données",
      groupes: ["Groupe C", "Groupe D"],
    },
    {
      id: 3,
      nom: "Frontend React",
      groupes: ["Groupe E", "Groupe F"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">
      <h1 className="text-5xl font-bold mb-4">
        Projet HUB
      </h1>

      <p className="text-gray-400 mb-10">
        Choisissez un sujet puis un groupe.
      </p>

      {sujets.map((sujet) => (
        <div
          key={sujet.id}
          className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold mb-6">
            {sujet.nom}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {sujet.groupes.map((groupe) => (
              <Link
                key={groupe}
                to="/group-details"
                className="bg-purple-500/20 hover:bg-purple-500/40 rounded-2xl p-6 text-center"
              >
                {groupe}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}