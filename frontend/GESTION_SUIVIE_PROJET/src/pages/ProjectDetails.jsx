import { Link } from "react-router-dom";

export default function ProjectDetails() {
const sujets = [
{
sujet: "Frontend React",
groupe: "Groupe A",
chef: "Nathan",
membres: 4,
},
{
sujet: "Backend API",
groupe: "Groupe B",
chef: "Jean",
membres: 4,
},
{
sujet: "Base de données",
groupe: "Groupe C",
chef: "Paul",
membres: 4,
},
{
sujet: "Tests & Qualité",
groupe: "Groupe D",
chef: "Sarah",
membres: 4,
},
{
sujet: "Documentation",
groupe: "Groupe E",
chef: "Alice",
membres: 4,
},
{
sujet: "Déploiement",
groupe: "Groupe F",
chef: "David",
membres: 4,
},
];

return ( <div className="min-h-screen bg-[#020817] text-white p-10">

```
  <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-10">

    <h1 className="text-5xl font-bold mb-4">
      Projet EduFlow
    </h1>

    <p className="text-gray-400 text-xl">
      Application de gestion éducative avec React et TypeScript
    </p>

    <div className="flex gap-8 mt-6 text-gray-400">

      <span>👨‍🎓 24 étudiants</span>
      <span>👥 6 groupes</span>
      <span>📚 6 sujets</span>

    </div>

  </div>

  <h2 className="text-4xl font-bold mb-8">
    Groupes du projet
  </h2>

  <div className="grid grid-cols-2 gap-8">

    {sujets.map((item, index) => (

      <div
        key={index}
        className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 hover:border-purple-500 transition"
      >

        <div className="flex justify-between items-start mb-6">

          <div>

            <h3 className="text-3xl font-bold mb-2">
              {item.groupe}
            </h3>

            <p className="text-purple-400 text-xl">
              {item.sujet}
            </p>

          </div>

          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center font-bold text-xl">
            {item.groupe.split(" ")[1]}
          </div>

        </div>

        <div className="space-y-3 mb-8">

          <p>
            👑 Chef de groupe :
            <span className="text-gray-400">
              {" "} {item.chef}
            </span>
          </p>

          <p>
            👨‍🎓 Membres :
            <span className="text-gray-400">
              {" "} {item.membres}
            </span>
          </p>

          <p>
            📌 Sujet :
            <span className="text-gray-400">
              {" "} {item.sujet}
            </span>
          </p>

        </div>

        <Link
          to="/group-details"
          className="w-full block text-center bg-gradient-to-r from-purple-500 to-purple-400 py-4 rounded-2xl font-semibold text-xl hover:scale-105 transition"
        >
          Consulter le groupe
        </Link>

      </div>

    ))}

  </div>

</div>

);
}
