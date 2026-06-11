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

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[35px] border border-purple-500/20 bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1e1b4b] p-12 mb-14">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[180px]" />

        <div className="relative z-10 flex justify-between items-center">

          <div>

            <div className="flex items-center gap-6 mb-8">

              <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-600 to-fuchsia-500 flex items-center justify-center text-5xl shadow-2xl">
                
              </div>

              <div>

                <h1 className="text-7xl font-extrabold">
                  Projet EduFlow
                </h1>

                <p className="text-gray-400 text-2xl mt-3">
                  Plateforme de gestion éducative avec React & TypeScript
                </p>

              </div>

            </div>

            <div className="flex gap-6">

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-5">

                <p className="text-gray-400">
                  Étudiants
                </p>

                <h3 className="text-4xl font-bold">
                  24
                </h3>

              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-5">

                <p className="text-gray-400">
                  Groupes
                </p>

                <h3 className="text-4xl font-bold">
                  6
                </h3>

              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-5">

                <p className="text-gray-400">
                  Sujets
                </p>

                <h3 className="text-4xl font-bold">
                  6
                </h3>

              </div>

            </div>

          </div>

          <div className="hidden lg:block text-[180px] opacity-90">
            
          </div>

        </div>

      </div>

      {/* TITRE */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h2 className="text-5xl font-bold">
            Groupes du projet
          </h2>

          <p className="text-gray-400 text-xl mt-2">
            Sélectionnez un groupe pour voir son avancement.
          </p>

        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 px-6 py-4 rounded-2xl text-purple-300">
          6 groupes actifs
        </div>

      </div>

      {/* GROUPES */}
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
              rounded-[30px]
              p-8
              hover:border-purple-500
              hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]
              hover:-translate-y-2
              transition-all
              duration-300
            "
          >

            <div className="absolute top-6 right-6">

              <div className="
                w-16 h-16
                rounded-full
                bg-gradient-to-r
                from-purple-500
                to-fuchsia-500
                flex
                items-center
                justify-center
                text-2xl
                font-bold
                shadow-xl
              ">
                {groupe.nom.split(" ")[1]}
              </div>

            </div>

            <h3 className="text-4xl font-bold mb-2">
              {groupe.nom}
            </h3>

            <p className="text-purple-400 text-xl mb-8">
              {groupe.sujet}
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Chef
                </p>

                <p className="text-lg font-semibold">
                  {groupe.chef}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Membres
                </p>

                <p className="text-lg font-semibold">
                  {groupe.membres}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm uppercase">
                  Progression
                </p>

                <p className="text-lg font-semibold text-green-400">
                  {groupe.progression}%
                </p>
              </div>

            </div>

            <div className="mb-6">

              <div className="w-full bg-white/5 rounded-full h-3">

                <div
                  className="
                    bg-gradient-to-r
                    from-purple-500
                    via-fuchsia-500
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

            <div className="
              bg-gradient-to-r
              from-purple-600
              via-purple-500
              to-fuchsia-500
              text-center
              py-4
              rounded-2xl
              font-semibold
              text-lg
              shadow-xl
            ">
              Consulter le groupe →
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}