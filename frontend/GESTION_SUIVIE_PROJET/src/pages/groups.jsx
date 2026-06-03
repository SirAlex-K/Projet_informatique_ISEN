import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Groups() {
  const groups = [
    {
      id: 1,
      progress: 50,
      members: "2/4",
      students: [
        {
          name: "Alice Martin",
          initial: "A",
          checkpoints: "3/5 checkpoints",
          width: "70%",
        },
        {
          name: "Bob Durand",
          initial: "B",
          checkpoints: "2/5 checkpoints",
          width: "45%",
        },
      ],
    },

    {
      id: 2,
      progress: 67,
      members: "3/4",
      students: [
        {
          name: "Claire Moreau",
          initial: "C",
          checkpoints: "4/5 checkpoints",
          width: "55%",
        },

        {
          name: "David Petit",
          initial: "D",
          checkpoints: "1/5 checkpoints",
          width: "15%",
        },

        {
          name: "Emma Bernard",
          initial: "E",
          checkpoints: "5/5 checkpoints",
          width: "70%",
        },
      ],
    },

    {
      id: 3,
      progress: 0,
      members: "0/4",
      students: [],
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
              to="/projects"
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
            >
              <FolderKanban size={26} />
              Projets
            </Link>

            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-5 flex items-center gap-4 text-2xl font-semibold shadow-lg">
              <Users size={26} />
              Groupes
            </div>

            <Link
              to="/students"
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
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

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-10 py-6 flex justify-between items-center">

          <h1 className="text-5xl font-bold">
            Gestion des groupes
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

          <h2 className="text-6xl font-bold mb-4">
            Gestion des groupes
          </h2>

          <p className="text-gray-400 text-2xl mb-10">
            Composition, progression et déplacement des étudiants
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mb-10">

            <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 py-5 rounded-2xl text-2xl font-semibold">
              Application React - EduFlow
            </button>

            <Link
  to="/database-groups"
  className="bg-white/[0.05] px-8 py-5 rounded-2xl text-2xl text-gray-400 hover:text-white transition"
>
  Base de données - Système de gestion
</Link>
          </div>

          {/* Groups */}
          <div className="space-y-8">

            {groups.map((group, index) => (

              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-8"
              >

                {/* Header */}
                <div className="flex justify-between mb-6">

                  <div>
                    <h3 className="text-4xl font-bold mb-2">
                      Groupe {group.id}
                    </h3>

                    <p className="text-gray-400 text-2xl">
                      {group.members} membres
                    </p>
                  </div>

                  <div className="text-right">
                    <h3 className="text-5xl font-bold text-purple-500">
                      {group.progress}%
                    </h3>

                    <p className="text-gray-400 text-2xl">
                      progression moyenne
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${group.progress}%` }}
                  ></div>
                </div>

                {/* Students */}
                {group.students.length > 0 ? (

                  <div className="space-y-5">

                    {group.students.map((student, idx) => (

                      <div
                        key={idx}
                        className="bg-white/[0.02] rounded-2xl p-5 flex items-center justify-between"
                      >

                        <div className="flex items-center gap-5 flex-1">

                          <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
                            {student.initial}
                          </div>

                          <div className="flex-1">

                            <div className="flex justify-between mb-3">

                              <h4 className="text-2xl font-semibold">
                                {student.name}
                              </h4>

                              <p className="text-gray-400 text-xl">
                                {student.checkpoints}
                              </p>
                            </div>

                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                style={{ width: student.width }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <button className="ml-6 border border-purple-500/40 text-purple-400 px-5 py-3 rounded-xl flex items-center gap-2 text-xl hover:bg-purple-500/10 transition">
                          Déplacer
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                ) : (

                  <div className="bg-white/[0.02] rounded-2xl p-8 text-center text-gray-400 text-2xl">
                    Aucun membre dans ce groupe
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}