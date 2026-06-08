import { useState, useRef } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  FileText,
  Star,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  File,
} from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_LIVRABLES = [
  {
    id: 1,
    title: "Cahier des charges",
    desc: "Document complet décrivant le besoin, les fonctionnalités et les contraintes du projet.",
    deadline: "01/03/2024",
    status: "submitted",
    fileName: "CDC_Groupe3.pdf",
    grade: "16/20",
    comment: "Très bon travail, structure claire et bien détaillée.",
  },
  {
    id: 2,
    title: "Maquettes UI/UX",
    desc: "Wireframes et maquettes haute fidélité de l'interface utilisateur.",
    deadline: "15/03/2024",
    status: "submitted",
    fileName: "Maquettes_EduFlow_v2.fig",
    grade: "En attente",
    comment: null,
  },
  {
    id: 3,
    title: "MVP – Version bêta",
    desc: "Version fonctionnelle minimale de l'application avec les features principales.",
    deadline: "30/03/2024",
    status: "pending",
    fileName: null,
    grade: null,
    comment: null,
  },
  {
    id: 4,
    title: "Rendu final",
    desc: "Application complète, documentation technique et rapport de projet.",
    deadline: "15/04/2024",
    status: "upcoming",
    fileName: null,
    grade: null,
    comment: null,
  },
];

function StatusBadge({ status }) {
  if (status === "submitted")
    return (
      <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium">
        <CheckCircle size={12} /> Rendu
      </span>
    );
  if (status === "pending")
    return (
      <span className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-3 py-1 text-xs font-medium">
        <Clock size={12} /> À rendre
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 bg-white/5 text-gray-500 border border-white/10 rounded-full px-3 py-1 text-xs font-medium">
      <AlertCircle size={12} /> À venir
    </span>
  );
}

export default function Livrables() {
  const [livrables, setLivrables] = useState(INITIAL_LIVRABLES);
  const [dragOverId, setDragOverId] = useState(null);
  const fileRefs = useRef({});

  const handleUpload = (id, file) => {
    if (!file) return;
    setLivrables((prev) =>
      prev.map((l) => l.id === id ? { ...l, fileName: file.name, status: "submitted" } : l)
    );
  };

  const handleRemove = (id) => {
    setLivrables((prev) =>
      prev.map((l) => l.id === id ? { ...l, fileName: null, status: "pending" } : l)
    );
  };

  const submitted = livrables.filter((l) => l.status === "submitted").length;
  const pending = livrables.filter((l) => l.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/[0.06] bg-[#0B1220] flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">ProjectHub</h1>
                <p className="text-gray-500 text-xs">Étudiant</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <Link to="/etudiant" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <LayoutDashboard size={18} />
              Tableau de bord
            </Link>
            <Link to="/kanban" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <FolderKanban size={18} />
              Mon Projet
            </Link>
            <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
              <FileText size={18} />
              Livrables
            </div>
            <Link to="/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <Star size={18} />
              Notes
            </Link>
            <Link to="/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                Chat du groupe
              </div>
              <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">3</span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06]">
          <Link to="/login" className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200">
            <LogOut size={16} />
            Déconnexion
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Livrables</h1>
            <p className="text-gray-500 text-sm mt-0.5">Dépôt et suivi de vos rendus</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold">A</div>
              <div>
                <p className="text-sm font-semibold leading-tight">Aziz Diop</p>
                <p className="text-gray-500 text-xs">Groupe 3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold">{submitted}<span className="text-gray-500 text-base font-normal">/{livrables.length}</span></p>
                <p className="text-gray-400 text-xs mt-0.5">Rendus</p>
              </div>
            </div>
            <div className="bg-orange-500/[0.07] border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-gray-400 text-xs mt-0.5">En attente</p>
              </div>
            </div>
            <div className="bg-blue-500/[0.07] border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                <Star size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold">16<span className="text-gray-500 text-base font-normal">/20</span></p>
                <p className="text-gray-400 text-xs mt-0.5">Note moyenne</p>
              </div>
            </div>
          </div>

          {/* Livrables list */}
          <div className="space-y-4">
            {livrables.map((livrable, index) => (
              <div
                key={livrable.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      livrable.status === "submitted" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      livrable.status === "pending" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                      "bg-white/[0.05] text-gray-600 border border-white/10"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{livrable.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{livrable.desc}</p>
                      <p className="text-gray-600 text-xs mt-1.5">Échéance : {livrable.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    {livrable.grade && (
                      <span className={`text-sm font-bold ${livrable.grade === "En attente" ? "text-gray-500" : "text-green-400"}`}>
                        {livrable.grade}
                      </span>
                    )}
                    <StatusBadge status={livrable.status} />
                  </div>
                </div>

                {/* Comment */}
                {livrable.comment && (
                  <div className="mb-4 ml-12 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl px-4 py-2.5 text-blue-300 text-sm flex items-start gap-2">
                    <span>💬</span>
                    <span className="italic">{livrable.comment}</span>
                  </div>
                )}

                {/* Upload zone */}
                <div className="ml-12">
                  {livrable.status !== "upcoming" ? (
                    livrable.fileName ? (
                      <div className="bg-green-500/[0.07] border border-green-500/20 rounded-xl p-3.5 flex items-center gap-3">
                        <File size={16} className="text-green-400 flex-shrink-0" />
                        <span className="text-green-300 text-sm flex-1 font-medium">{livrable.fileName}</span>
                        <button
                          onClick={() => handleRemove(livrable.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragOverId === livrable.id
                            ? "border-blue-500/60 bg-blue-500/[0.08]"
                            : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setDragOverId(livrable.id); }}
                        onDragLeave={() => setDragOverId(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverId(null);
                          const file = e.dataTransfer.files[0];
                          if (file) handleUpload(livrable.id, file);
                        }}
                        onClick={() => fileRefs.current[livrable.id]?.click()}
                      >
                        <Upload size={22} className="mx-auto mb-2 text-gray-600" />
                        <p className="text-gray-400 text-sm">
                          Glissez votre fichier ici ou{" "}
                          <span className="text-blue-400 hover:text-blue-300 transition-colors">cliquez pour sélectionner</span>
                        </p>
                        <p className="text-gray-600 text-xs mt-1">PDF, DOCX, ZIP, etc.</p>
                        <input
                          ref={(el) => (fileRefs.current[livrable.id] = el)}
                          type="file"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && handleUpload(livrable.id, e.target.files[0])}
                        />
                      </div>
                    )
                  ) : (
                    <div className="border border-white/[0.04] rounded-xl p-4 text-center text-gray-700 text-sm">
                      Le dépôt sera disponible à l'approche de l'échéance
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}