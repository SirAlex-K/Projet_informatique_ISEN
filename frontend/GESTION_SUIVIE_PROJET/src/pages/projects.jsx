import {
  GraduationCap,
  Users,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  Plus,
  Lock,
} from "lucide-react";

import { Link } from "react-router-dom";


export default function Projects() {
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
              className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition cursor-pointer"
            >
              <LayoutDashboard size={26} />
              Tableau de bord
            </Link>

            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-5 flex items-center gap-4 text-2xl font-semibold shadow-lg">
              <FolderKanban size={26} />
              Projets
            </div>

           <Link
  to="/groups"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition cursor-pointer"
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
            Gestion des projets
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
                Gestion des projets
              </h2>

              <p className="text-gray-400 text-2xl">
                Créez et gérez vos projets étudiants
              </p>
            </div>

           <Link
  to="/new-project"
  className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 py-5 rounded-2xl text-2xl font-semibold shadow-lg flex items-center gap-3 hover:scale-105 transition"
>
  <Plus size={28} />
  Nouveau projet
</Link>
          </div>

          {/* Cards */}
          <div className="space-y-8">

            {/* Card 1 */}
            <div className="bg-white/[0.03] border border-purple-500/40 rounded-3xl p-8">

              <div className="flex justify-between items-start">

                <div>

                  <div className="flex items-center gap-4 mb-5">

                    <h2 className="text-4xl font-bold">
                      Application React - EduFlow
                    </h2>

                    <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl text-lg">
                      En cours
                    </span>

                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-lg">
                      Ouvert
                    </span>
                  </div>

                  <p className="text-gray-400 text-2xl mb-6">
                    Créer une application de gestion éducative avec React et TypeScript
                  </p>

                  <div className="flex gap-8 text-gray-400 text-xl">
                    <span>Échéance: 15/03/2024</span>
                    <span>9 étudiants</span>
                    <span>3 groupes</span>
                    <span>Encadrant: Dr. Marie Leclerc</span>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <Lock size={28} />
                </div>
              </div>

              <div className="border-t border-white/10 mt-8 pt-6 text-gray-400 text-xl">
                📈 Checkpoints (5)
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">

              <div className="flex justify-between items-start">

                <div>

                  <div className="flex items-center gap-4 mb-5">

                    <h2 className="text-4xl font-bold">
                      Base de données - Système de gestion
                    </h2>

                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-lg">
                      Validé
                    </span>

                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-lg">
                      Ouvert
                    </span>
                  </div>

                  <p className="text-gray-400 text-2xl mb-6">
                    Concevoir et implémenter une base de données relationnelle
                  </p>

                  <div className="flex gap-8 text-gray-400 text-xl">
                    <span>Échéance: 30/03/2024</span>
                    <span>6 étudiants</span>
                    <span>2 groupes</span>
                    <span>Encadrant: Dr. Jean Dupont</span>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400">
                  <Lock size={28} />
                </div>
              </div>

              <div className="border-t border-white/10 mt-8 pt-6 text-gray-400 text-xl">
                📈 Checkpoints (5)
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}