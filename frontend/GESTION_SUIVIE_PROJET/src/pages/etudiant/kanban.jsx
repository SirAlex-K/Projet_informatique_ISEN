import { useState } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  FileText,
  Star,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_COLUMNS = {
  todo: {
    id: "todo",
    title: "À faire",
    dotColor: "#6b7280",
    borderColor: "border-t-gray-500",
    badgeBg: "bg-gray-500/10 text-gray-400",
    items: [
      { id: "1", title: "Maquette UI", desc: "Créer les wireframes Figma", assignee: "LM", avatarColor: "bg-purple-500" },
      { id: "2", title: "Documentation API", desc: "Documenter les endpoints REST", assignee: "TB", avatarColor: "bg-green-500" },
    ],
  },
  inprogress: {
    id: "inprogress",
    title: "En cours",
    dotColor: "#3b82f6",
    borderColor: "border-t-blue-500",
    badgeBg: "bg-blue-500/10 text-blue-400",
    items: [
      { id: "3", title: "Frontend React", desc: "Développer les composants", assignee: "AD", avatarColor: "bg-blue-500" },
    ],
  },
  review: {
    id: "review",
    title: "En révision",
    dotColor: "#eab308",
    borderColor: "border-t-yellow-500",
    badgeBg: "bg-yellow-500/10 text-yellow-400",
    items: [
      { id: "4", title: "Base de données", desc: "Schéma PostgreSQL", assignee: "CR", avatarColor: "bg-orange-500" },
    ],
  },
  done: {
    id: "done",
    title: "Terminé",
    dotColor: "#22c55e",
    borderColor: "border-t-green-500",
    badgeBg: "bg-green-500/10 text-green-400",
    items: [
      { id: "5", title: "Cahier des charges", desc: "Rédiger le CDC complet", assignee: "AD", avatarColor: "bg-blue-500" },
    ],
  },
};

function Sidebar() {
  return (
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
          <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
            <FolderKanban size={18} />
            Mon Projet
          </div>
          <Link to="/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
            <FileText size={18} />
            Livrables
          </Link>
          <Link to="/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
            <Star size={18} />
            Notes
          </Link>
          <Link to="/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} />
              Chat du groupe
            </div>
            <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white font-bold">3</span>
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
  );
}

export default function Kanban() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (item, fromColId) => setDraggedItem({ item, fromColId });
  const handleDragOver = (e, colId) => { e.preventDefault(); setDragOverCol(colId); };
  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = (e, toColId) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedItem || draggedItem.fromColId === toColId) { setDraggedItem(null); return; }
    const { item, fromColId } = draggedItem;
    setColumns((prev) => ({
      ...prev,
      [fromColId]: { ...prev[fromColId], items: prev[fromColId].items.filter((i) => i.id !== item.id) },
      [toColId]: { ...prev[toColId], items: [...prev[toColId].items, item] },
    }));
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold">Mon Projet</h1>
            <p className="text-gray-500 text-sm mt-0.5">Application React – ProjectHub · Groupe 3</p>
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

        {/* Kanban Board */}
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="flex gap-5 h-full" style={{ minWidth: "max-content" }}>
            {Object.values(columns).map((col) => (
              <div
                key={col.id}
                className={`w-[280px] flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.06] border-t-2 ${col.borderColor} transition-all duration-200 ${
                  dragOverCol === col.id ? "bg-white/[0.04] shadow-xl scale-[1.01]" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dotColor }} />
                    <h3 className="text-sm font-bold">{col.title}</h3>
                  </div>
                  <span className={`w-6 h-6 rounded-full ${col.badgeBg} flex items-center justify-center text-xs font-bold`}>
                    {col.items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 px-3 pb-3 space-y-2.5 overflow-y-auto">
                  {col.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item, col.id)}
                      className={`bg-[#0d1117] border border-white/[0.07] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-white/20 hover:bg-[#0f1520] hover:shadow-lg transition-all duration-200 ${
                        draggedItem?.item.id === item.id ? "opacity-40 scale-95" : "opacity-100"
                      }`}
                    >
                      <h4 className="text-sm font-semibold mb-1.5">{item.title}</h4>
                      <p className="text-gray-500 text-xs mb-4 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-full ${item.avatarColor} flex items-center justify-center text-xs font-bold shadow-sm`}>
                          {item.assignee}
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full opacity-70" style={{ backgroundColor: col.dotColor }} />
                      </div>
                    </div>
                  ))}

                  {col.items.length === 0 && (
                    <div className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 flex flex-col items-center justify-center text-gray-700 text-sm gap-2">
                      <Plus size={20} />
                      Déposer ici
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