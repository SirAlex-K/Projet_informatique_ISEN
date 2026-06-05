import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";

export default function Professor() {
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
  to="/evaluation"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
>
  <ClipboardCheck size={26} />
  Évaluation
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

      {/* Main */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b border-white/10 px-10 py-6 flex justify-between items-center">
          <h1 className="text-5xl font-bold">Tableau de bord</h1>

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

                <p className="text-gray-400">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          <h2 className="text-6xl font-bold mb-4">
            Tableau de bord
          </h2>

          <p className="text-gray-400 text-2xl mb-12">
            Vue d'ensemble de vos cours et étudiants
          </p>

          {/* Stats */}
          
          <div className="grid grid-cols-5 gap-8 mb-10">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
  <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center mb-8">
    <ClipboardCheck size={28} />
  </div>

  <h1 className="text-6xl font-bold">8</h1>

  <p className="text-gray-400 text-2xl mt-4">
    Évaluations réalisées
  </p>
</div>
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center mb-8">
                <FolderKanban size={28} />
              </div>

              <h1 className="text-6xl font-bold">2</h1>

              <p className="text-gray-400 text-2xl mt-4">
                Projets actifs
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8">
                <Users size={28} />
              </div>

              <h1 className="text-6xl font-bold">10</h1>

              <p className="text-gray-400 text-2xl mt-4">
                Étudiants
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center mb-8">
                <Users size={28} />
              </div>

              <h1 className="text-6xl font-bold">5/5</h1>

              <p className="text-gray-400 text-2xl mt-4">
                Groupes formés
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mb-8">
                <MessageSquare size={28} />
              </div>

              <h1 className="text-6xl font-bold">12</h1>

              <p className="text-gray-400 text-2xl mt-4">
                Messages
              </p>
            </div>
          </div>

          {/* Bottom */}
          
<div className="grid grid-cols-2 gap-8">
  
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <h2 className="text-4xl font-bold mb-8">
                Projets récents
              </h2>

              <div className="space-y-5">
                <div className="bg-white/[0.02] rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      Application React - EduFlow
                    </h3>

                    <p className="text-gray-400 text-xl mt-2">
                      Échéance: 15/03/2024
                    </p>
                  </div>

                  <ArrowRight />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
              <h2 className="text-4xl font-bold mb-8">
                Messages récents
              </h2>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex justify-between mb-3">
                  <h3 className="text-2xl font-semibold">
                    Prof. Dubois
                  </h3>

                  <span className="text-gray-400">
                    Il y a 2h
                  </span>
                </div>

                <p className="text-gray-300 text-xl">
                  Rappel: Date limite projet React
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}