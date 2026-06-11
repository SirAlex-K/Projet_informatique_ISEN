import { Link } from "react-router-dom";

export default function ProjectDetails() {
  const groupes = [
    {
      nom: "Groupe A",
      sujet: "Frontend React",
      chef: "Nathan",
      membres: 4,
      progression: 80,
    },
    {
      nom: "Groupe B",
      sujet: "Backend API",
      chef: "Jean",
      membres: 4,
      progression: 65,
    },
    {
      nom: "Groupe C",
      sujet: "Base de données",
      chef: "Paul",
      membres: 4,
      progression: 90,
    },
    {
      nom: "Groupe D",
      sujet: "Tests & Qualité",
      chef: "Sarah",
      membres: 4,
      progression: 70,
    },
    {
      nom: "Groupe E",
      sujet: "Documentation",
      chef: "Alice",
      membres: 4,
      progression: 50,
    },
    {
      nom: "Groupe F",
      sujet: "Déploiement",
      chef: "David",
      membres: 4,
      progression: 85,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1220] to-[#1e1b4b] border border-purple-500/20 rounded-3xl p-10 mb-12">

        <h1 className="text-6xl font-bold mb-4">
          Projet EduFlow
        </h1>

        <p className="text-gray-300 text-xl mb-6">
          Application de gestion éducative avec React et TypeScript
        </p>

        <div className="flex gap-10 text-lg">
          <span>👨‍🎓 24 étudiants</span>
          <span>👥 6 groupes</span>
          <span>📚 6 sujets</span>
        </div>

      </div>

      {/* Titre */}
      <h2 className="text-5xl font-bold mb-10">
        Groupes du projet
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-2 gap-8">

        {groupes.map((groupe, i) => (

          <Link
            key={i}
            to="/group-details"
            className="
              relative
              bg-gradient-to-br
              from-[#0B1220]
              to-[#111827]
              border
              border-white/10
              rounded-3xl
              p-8
              hover:border-purple-500
              hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            {/* Badge */}
            <div className="absolute top-6 right-6">

              <div
                className="
                  w-14 h-14
                  rounded-full
                  bg-gradient-to-r
                  from-purple-500
                  to-purple-400
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                "
              >
                {groupe.nom.split(" ")[1]}
              </div>

            </div>

            {/* Nom */}
            <h3 className="text-4xl font-bold mb-2">
              {groupe.nom}
            </h3>

            <p className="text-purple-400 text-xl mb-8">
              {groupe.sujet}
            </p>

            {/* Infos */}
            <div className="grid grid-cols-3 gap-6 mb-8">

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Chef
                </p>

                <p className="text-lg">
                  {groupe.chef}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Membres
                </p>

                <p className="text-lg">
                  {groupe.membres}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Progression
                </p>

                <p className="text-lg text-green-400">
                  {groupe.progression}%
                </p>
              </div>

            </div>

            {/* Barre */}
            <div className="mb-6">

              <div className="w-full bg-white/5 rounded-full h-3">

                <div
                  className="
                    bg-gradient-to-r
                    from-purple-500
                    to-pink-400
                    h-3
                    rounded-full
                  "
                  style={{
                    width: `${groupe.progression}%`,
                  }}
                />

              </div>

            </div>

            {/* Bouton */}
            <div
              className="
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-500
                text-center
                py-4
                rounded-2xl
                font-semibold
                text-lg
                shadow-lg
              "
            >
              Consulter le groupe →
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}