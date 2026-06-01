import {
  GraduationCap,
  Users,
  ClipboardList,
  Star,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    {
      title: "Professeur",
      description:
        "Créez des projets, gérez les groupes et suivez la progression",
      color: "from-purple-500 to-fuchsia-500",
      text: "text-purple-400",
      icon: <Users size={28} />,
      link: "/professor",
    },

    {
      title: "Étudiant",
      description:
        "Rejoignez des groupes et suivez vos checkpoints de projet",
      color: "from-blue-500 to-cyan-500",
      text: "text-blue-400",
      icon: <GraduationCap size={28} />,
      link: "/student",
    },

    {
      title: "Encadrant",
      description:
        "Supervisez les groupes, validez les livrables et évaluez",
      color: "from-green-500 to-emerald-500",
      text: "text-green-400",
      icon: <ClipboardList size={28} />,
      link: "/",
    },

    {
      title: "Jury",
      description:
        "Évaluez les soutenances et attribuez les notes finales",
      color: "from-yellow-500 to-orange-500",
      text: "text-yellow-400",
      icon: <Star size={28} />,
      link: "/",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/20 blur-[180px] rounded-full"></div>

      <div className="relative z-10 px-8 py-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>

            <h1 className="text-5xl font-bold">EduFlow</h1>
          </div>

          <p className="text-gray-400 mt-4 text-xl">
            Plateforme de gestion de projets étudiants
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4">Bienvenue</h2>

          <p className="text-gray-400 text-2xl">
            Choisissez votre rôle pour continuer
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-500"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-8 shadow-lg`}
              >
                {card.icon}
              </div>

              <h3 className="text-4xl font-bold mb-4">
                {card.title}
              </h3>

              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                {card.description}
              </p>

              <Link
                to={card.link}
                className={`flex items-center gap-3 font-semibold text-xl ${card.text}`}
              >
                Accéder
                <ArrowRight size={22} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}