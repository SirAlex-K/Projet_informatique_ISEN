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
                        <Link
  to="/evaluation"
  className="p-5 flex items-center gap-4 text-2xl text-gray-400 hover:text-white transition"
>
  <ClipboardCheck size={26} />
  Évaluation
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

          {/* MES PROJETS */}
<div className="space-y-8">

  <h2 className="text-4xl font-bold text-gray-300 mb-6">
    MES PROJETS ACTIFS
  </h2>

  <Link to="/project-details">

    <div className="bg-[#0B1220] border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500 transition">

      <div className="p-8 flex items-center justify-between">

        <div className="flex items-center gap-6">

          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center">
            <FolderKanban
              size={40}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-4xl font-bold mb-2">
              Projet Traitement de Signal & Audio Mixer
            </h2>

            <p className="text-gray-400 text-2xl">
              2 groupes configurés • 3 sujets déposés
            </p>

          </div>

        </div>

        <div className="text-gray-500 text-5xl">
          →
        </div>

      </div>

    </div>

  </Link>

  <Link to="/project-details">

    <div className="bg-[#0B1220] border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500 transition">

      <div className="p-8 flex items-center justify-between">

        <div className="flex items-center gap-6">

          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center">
            <FolderKanban
              size={40}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-4xl font-bold mb-2">
              Application React - EduFlow
            </h2>

            <p className="text-gray-400 text-2xl">
              3 groupes configurés • 9 étudiants
            </p>

          </div>

        </div>

        <div className="text-gray-500 text-5xl">
          →
        </div>

      </div>

    </div>

  </Link>

</div>
        </div>
      </div>
    </div>
  );
}