import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  Search,
  ClipboardCheck,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Messages() {
  const messages = [
    {
      name: "Prof. Dubois",
      initial: "P",
      title: "Rappel: Date limite projet React",
      text: "N'oubliez pas de soumettre votre projet avant le 15 mars...",
      time: "Il y a 2h",
      active: true,
    },

    {
      name: "Alice Martin",
      initial: "A",
      title: "Question sur le projet",
      text: "Bonjour, j'ai une question concernant les groupes...",
      time: "Hier",
      active: false,
    },
  ];

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

            <Link
              to="/professor"
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
            >
              <LayoutDashboard size={26} />
              Tableau de bord
            </Link>
                        <Link
  to="/evaluation"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
>
  <ClipboardCheck size={26} />
  Évaluation
</Link>

            <Link
              to="/projects"
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
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
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
            >
              <GraduationCap size={26} />
              Étudiants
            </Link>

            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-5 flex items-center justify-between text-2xl font-semibold shadow-lg">

              <div className="flex items-center gap-4">
                <MessageSquare size={26} />
                Messages
              </div>

              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm text-white">
                1
              </div>
            </div>
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

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-10 py-6 flex justify-between items-center">

          <h1 className="text-5xl font-bold">
            Messages
          </h1>

          <div className="flex items-center gap-8">

            <div className="relative">
              <Bell size={30} />

              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold">
                P
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  Prof. Dubois
                </h2>

                <p className="text-gray-400">
                  Professeur
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10">

          <div className="flex items-center justify-between mb-10">

            <div>
              <h2 className="text-6xl font-bold mb-4">
                Messages
              </h2>

              <p className="text-gray-400 text-2xl">
                Communiquez avec vos étudiants
              </p>
            </div>

            <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 py-5 rounded-2xl text-2xl font-semibold flex items-center gap-3">
              <Plus size={24} />
              Nouveau message
            </button>
          </div>

         {/* Onglets */}
<div className="flex gap-4 mb-8">
  <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 py-5 rounded-2xl text-2xl font-semibold">
    📢 Annonces
  </button>

  <button className="bg-white/[0.05] px-8 py-5 rounded-2xl text-2xl text-gray-400 hover:text-white transition">
    👥 Discussions de groupe
  </button>

  <button className="bg-white/[0.05] px-8 py-5 rounded-2xl text-2xl text-gray-400 hover:text-white transition">
    💬 Messages privés
  </button>
</div>

<div className="grid grid-cols-3 gap-8">

  {/* Conversations */}
  <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">

    <h3 className="text-3xl font-bold mb-6">
      Conversations
    </h3>

    <div className="space-y-4">

      <div className="bg-purple-500/20 rounded-2xl p-4">
        📢 Annonce générale
      </div>

      <div className="bg-white/[0.03] rounded-2xl p-4">
        👥 Groupe IA
      </div>

      <div className="bg-white/[0.03] rounded-2xl p-4">
        👥 Groupe Web
      </div>

      <div className="bg-white/[0.03] rounded-2xl p-4">
        👥 Groupe Mobile
      </div>

      <div className="bg-white/[0.03] rounded-2xl p-4">
        👤 Jean Dupont
      </div>

    </div>
  </div>

  {/* Discussion */}
  <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-6">

    <h3 className="text-3xl font-bold mb-6">
      📢 Annonce générale
    </h3>

    <div className="space-y-6 mb-8">

      <div className="bg-purple-500/10 rounded-2xl p-5">
        <p className="font-semibold text-xl">
          Prof. Dubois
        </p>

        <p className="text-gray-300 mt-3">
          N'oubliez pas la date limite du projet :
          vendredi 20 juin à 23h59.
        </p>
      </div>

      <div className="bg-blue-500/10 rounded-2xl p-5 ml-20">
        <p className="font-semibold text-xl">
          Groupe IA
        </p>

        <p className="text-gray-300 mt-3">
          Merci professeur, nous avons bien noté.
        </p>
      </div>

    </div>

    <div className="flex gap-4">

      <input
        type="text"
        placeholder="Écrire un message..."
        className="flex-1 bg-[#0B1220] border border-white/10 rounded-2xl p-4"
      />

      <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 rounded-2xl font-semibold">
        Envoyer
      </button>

    </div>

  </div>

</div>
        </div>
      </div>
    </div>
  );
}