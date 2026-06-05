import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Students() {

  const students = [
    {
      name: "Alice Martin",
      email: "alice.martin@edu.fr",
      initial: "A",
    },

    {
      name: "Bob Durand",
      email: "bob.durand@edu.fr",
      initial: "B",
    },

    {
      name: "Claire Moreau",
      email: "claire.moreau@edu.fr",
      initial: "C",
    },

    {
      name: "David Petit",
      email: "david.petit@edu.fr",
      initial: "D",
    },

    {
      name: "Emma Bernard",
      email: "emma.bernard@edu.fr",
      initial: "E",
    },

    {
      name: "François Rousseau",
      email: "francois.rousseau@edu.fr",
      initial: "F",
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

<div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-5 flex items-center gap-4 text-2xl font-semibold shadow-lg">
  <GraduationCap size={26} />
  Étudiants
</div>

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

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-10 py-6 flex justify-between items-center">

          <h1 className="text-5xl font-bold">
            Étudiants
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

          {/* Top */}
          <div className="flex justify-between items-center mb-10">

            <div>
              <h2 className="text-6xl font-bold mb-4">
                Étudiants
              </h2>

              <p className="text-gray-400 text-2xl">
                Liste de tous les étudiants
              </p>
            </div>

            {/* Search */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-5 flex items-center gap-4 w-[420px]">
              <Search className="text-gray-400" />

              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                className="bg-transparent outline-none text-2xl w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">

            {/* Head */}
            <div className="grid grid-cols-4 px-8 py-6 border-b border-white/10 text-2xl font-semibold">
              <div>Nom</div>
              <div>Email</div>
              <div>Projets</div>
              <div>Actions</div>
            </div>

            {/* Rows */}
            {students.map((student, index) => (

              <div
                key={index}
                className="grid grid-cols-4 px-8 py-6 border-b border-white/10 items-center hover:bg-white/[0.03] transition"
              >

                {/* User */}
                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
                    {student.initial}
                  </div>

                  <span className="text-2xl font-semibold">
                    {student.name}
                  </span>
                </div>

                {/* Email */}
                <div className="text-gray-400 text-2xl">
                  {student.email}
                </div>

                {/* Projects */}
                <div>
                  <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-xl text-lg">
                    2 projets
                  </span>
                </div>

                {/* Action */}
                <div>
                  <button className="text-purple-400 text-2xl font-semibold hover:text-purple-300 transition">
                    Voir détails
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}