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
  UserPlus,
  X,
  Check,
  Crown,
  GripVertical,
  Circle,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Membres du groupe ───────────────────────────────────────────────
const MEMBERS = [
  { id: "AD", name: "Aziz Diop",    color: "from-blue-500 to-blue-600",     ring: "ring-blue-500",   isLeader: true },
  { id: "LM", name: "Léa Martin",   color: "from-purple-500 to-purple-600", ring: "ring-purple-500", isLeader: false },
  { id: "CR", name: "Chloé Renard", color: "from-orange-400 to-orange-500", ring: "ring-orange-400", isLeader: false },
  { id: "TB", name: "Tom Bernard",  color: "from-green-500 to-green-600",   ring: "ring-green-500",  isLeader: false },
];

const MEMBER_MAP = Object.fromEntries(MEMBERS.map((m) => [m.id, m]));

// ─── Données initiales ───────────────────────────────────────────────
const INITIAL_COLUMNS = [
  {
    id: "todo",
    label: "À faire",
    color: "border-gray-500",
    dot: "bg-gray-400",
    tasks: [
      { id: 1, title: "Maquette UI",       desc: "Créer les wireframes Figma",   assignees: ["LM"] },
      { id: 2, title: "Documentation API", desc: "Documenter les endpoints REST", assignees: ["TB"] },
    ],
  },
  {
    id: "inprogress",
    label: "En cours",
    color: "border-blue-500",
    dot: "bg-blue-400",
    tasks: [
      { id: 3, title: "Frontend React", desc: "Développer les composants", assignees: ["AD"] },
    ],
  },
  {
    id: "review",
    label: "En révision",
    color: "border-yellow-500",
    dot: "bg-yellow-400",
    tasks: [
      { id: 4, title: "Base de données", desc: "Schéma PostgreSQL", assignees: ["CR"] },
    ],
  },
  {
    id: "done",
    label: "Terminé",
    color: "border-green-500",
    dot: "bg-green-400",
    tasks: [
      { id: 5, title: "Cahier des charges", desc: "Rédiger le CDC complet", assignees: ["AD"] },
    ],
  },
];

// ─── Avatar ──────────────────────────────────────────────────────────
function Avatar({ id, size = "sm", showTooltip = false }) {
  const m = MEMBER_MAP[id];
  if (!m) return null;
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className="relative group/avatar">
      <div className={`${sz} rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center font-bold text-white flex-shrink-0`}>
        {id}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a2235] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {m.name}
          {m.isLeader && <span className="ml-1 text-yellow-400">👑</span>}
        </div>
      )}
    </div>
  );
}

// ─── Modal d'assignation ─────────────────────────────────────────────
function AssignModal({ task, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(task.assignees));

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1526] border border-white/[0.08] rounded-2xl w-full max-w-sm mx-4 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Assigner les membres</p>
            <h2 className="text-base font-bold text-white leading-snug">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Membres */}
        <div className="p-4 space-y-2">
          {MEMBERS.map((m) => {
            const active = selected.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 text-left ${
                  active
                    ? "bg-blue-600/15 border-blue-500/40 text-white"
                    : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.05] hover:text-white hover:border-white/10"
                }`}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {m.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{m.name}</span>
                    {m.isLeader && <Crown size={12} className="text-yellow-400 flex-shrink-0" />}
                  </div>
                  {m.isLeader && <p className="text-xs text-gray-600">Chef de groupe</p>}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  active ? "bg-blue-500 border-blue-500" : "border-white/20"
                }`}>
                  {active && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white text-sm font-medium hover:bg-white/[0.04] transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => { onSave(task.id, [...selected]); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ajout de tâche (leader uniquement) ─────────────────────────
function AddTaskModal({ colId, colLabel, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(colId, { title: title.trim(), desc: desc.trim(), assignees: [...selected] });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0d1526] border border-white/[0.08] rounded-2xl w-full max-w-sm mx-4 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
              Nouvelle tâche · {colLabel}
            </p>
            <h2 className="text-base font-bold text-white">Ajouter une carte</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="ex. Maquette UI"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Détails de la tâche…"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04] transition-all resize-none"
            />
          </div>

          {/* Assignation rapide */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Assigner (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {MEMBERS.map((m) => {
                const active = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    title={m.name}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      active
                        ? "bg-blue-600/20 border-blue-500/50 text-white"
                        : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-white/15 hover:text-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                      {m.id}
                    </div>
                    {m.name.split(" ")[0]}
                    {active && <Check size={11} className="text-blue-400" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white text-sm font-medium hover:bg-white/[0.04] transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            Créer la tâche
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Carte tâche (draggable) ─────────────────────────────────────────
function TaskCard({ task, colDot, onAssignClick, onDelete, isLeader, onDragStart, onDragEnd, isDragging }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div
      draggable={!confirmDelete}
      onDragStart={(e) => !confirmDelete && onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onMouseLeave={() => setConfirmDelete(false)}
      className={`bg-[#0d1526] border rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-black/30 transition-all duration-200 group ${
        isDragging ? "opacity-40 scale-95" : "opacity-100"
      } ${
        confirmDelete
          ? "border-red-500/40 bg-red-500/[0.04]"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Circle size={7} className={`flex-shrink-0 fill-current ${colDot.replace("bg-", "text-")}`} />
          <h3 className="text-sm font-semibold text-white truncate">{task.title}</h3>
        </div>

        {/* Bouton suppression (leader uniquement) */}
        {isLeader && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {confirmDelete ? (
              <>
                <button
                  onClick={handleCancelDelete}
                  className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all"
                >
                  Confirmer
                </button>
              </>
            ) : (
              <button
                onClick={handleDeleteClick}
                title="Supprimer la tâche"
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}

        {!isLeader && <GripVertical size={14} className="text-gray-700 flex-shrink-0 mt-0.5" />}
      </div>

      <p className="text-gray-500 text-xs mb-4 leading-relaxed">{task.desc}</p>

      <div className="flex items-center justify-between">
        {/* Avatars */}
        <div className="flex items-center -space-x-2">
          {task.assignees.length > 0 ? (
            task.assignees.map((id) => (
              <div key={id} className="ring-2 ring-[#0d1526] rounded-full">
                <Avatar id={id} size="sm" showTooltip />
              </div>
            ))
          ) : (
            <span className="text-gray-600 text-xs italic">Non assigné</span>
          )}
        </div>

        {/* Bouton assigner */}
        {!confirmDelete && (
          <button
            onClick={() => onAssignClick(task)}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 bg-white/[0.03] hover:bg-blue-500/10 border border-white/[0.06] hover:border-blue-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-150"
          >
            <UserPlus size={13} />
            Assigner
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Colonne (zone de dépôt) ─────────────────────────────────────────
function Column({ col, onAssignClick, onAddClick, onDeleteTask, isLeader, onDragStart, onDragEnd, onDragOver, onDrop, isDragOver, draggedTaskId }) {
  return (
    <div className="flex-1 min-w-[220px] max-w-[300px] flex flex-col">
      <div className={`border-t-2 ${col.color} pt-3 mb-4`}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${col.dot}`} />
            <span className="text-sm font-semibold text-white">{col.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white/[0.06] text-gray-400 text-xs flex items-center justify-center font-medium">
              {col.tasks.length}
            </span>
            {isLeader && (
              <button
                onClick={() => onAddClick(col)}
                title="Ajouter une tâche"
                className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 flex items-center justify-center transition-all border border-white/[0.06] hover:border-blue-500/30"
              >
                <Plus size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => onDragOver(e, col.id)}
        onDrop={(e) => onDrop(e, col.id)}
        className={`space-y-3 flex-1 rounded-xl p-1 -m-1 transition-all duration-200 ${
          isDragOver ? "bg-white/[0.04] ring-2 ring-blue-500/30" : ""
        }`}
      >
        {col.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            colDot={col.dot}
            onAssignClick={onAssignClick}
            onDelete={onDeleteTask}
            isLeader={isLeader}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTaskId === task.id}
          />
        ))}

        {col.tasks.length === 0 && (
          <div className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 flex flex-col items-center justify-center text-gray-700 text-sm gap-2">
            <Plus size={20} />
            Déposer ici
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────
export default function Kanban() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [activeTask, setActiveTask] = useState(null);
  const [addTaskTarget, setAddTaskTarget] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Vrai si l'utilisateur connecté est chef de groupe
  const isLeader = MEMBERS.find((m) => m.id === "AD")?.isLeader ?? false;

  // ─── Assignation ───────────────────────────────────────────────
  const handleSave = (taskId, newAssignees) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === taskId ? { ...t, assignees: newAssignees } : t
        ),
      }))
    );
  };

  // ─── Ajout de tâche ────────────────────────────────────────────
  const handleAddTask = (colId, newTask) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, tasks: [...col.tasks, { ...newTask, id: Date.now() }] }
          : col
      )
    );
  };

  // ─── Suppression de tâche ──────────────────────────────────────
  const handleDeleteTask = (taskId) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
  };

  // ─── Drag & Drop ───────────────────────────────────────────────
  const handleDragStart = (e, task) => {
    const fromCol = columns.find((c) => c.tasks.some((t) => t.id === task.id));
    setDraggedItem({ task, fromColId: fromCol?.id });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleDrop = (e, toColId) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedItem || draggedItem.fromColId === toColId) {
      setDraggedItem(null);
      return;
    }
    const { task, fromColId } = draggedItem;
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromColId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
        }
        if (col.id === toColId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      })
    );
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar (repliable) */}
      <div
        className={`${
          sidebarOpen ? "w-72 border-r border-white/[0.06]" : "w-0"
        } overflow-hidden flex-shrink-0 bg-[#0B1220] transition-[width] duration-300 ease-in-out`}
      >
        <div className="w-72 h-full flex flex-col justify-between">
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
                <LayoutDashboard size={18} /> Tableau de bord
              </Link>
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <FolderKanban size={18} /> Mon Projet
              </div>
              <Link to="/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <FileText size={18} /> Livrables
              </Link>
              <Link to="/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <Star size={18} /> Notes
              </Link>
              <Link to="/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} /> Chat du groupe
                </div>
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">3</span>
              </Link>
            </div>
          </div>

          {/* Membres */}
          <div className="p-4 space-y-3 border-t border-white/[0.06]">
            <p className="text-gray-600 text-xs uppercase tracking-wider px-1">Groupe 3</p>
            {MEMBERS.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-1">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {m.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate font-medium">{m.name}</p>
                </div>
                {m.isLeader && <Crown size={12} className="text-yellow-400 flex-shrink-0" />}
              </div>
            ))}
            <Link to="/login" className="mt-2 flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200">
              <LogOut size={16} /> Déconnexion
            </Link>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Mon Projet</h1>
              <p className="text-gray-500 text-sm mt-0.5">Application React – ProjectHub · Groupe 3</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold relative">
                A
                <Crown size={10} className="absolute -top-1 -right-1 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Aziz Diop</p>
                <p className="text-gray-500 text-xs">Chef de groupe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tip banner */}
        <div className="mx-8 mt-5 mb-0 flex items-center gap-2.5 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl px-4 py-2.5">
          <UserPlus size={14} className="text-blue-400 flex-shrink-0" />
          <p className="text-blue-300 text-xs">
            <span className="font-semibold">Astuce :</span> glissez-déposez une carte pour changer son statut, ou survolez-la pour assigner des membres.
          </p>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-8">
          <div className="flex gap-5 min-w-max">
            {columns.map((col) => (
              <Column
                key={col.id}
                col={col}
                isLeader={isLeader}
                onAddClick={(col) => setAddTaskTarget(col)}
                onAssignClick={setActiveTask}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOverCol === col.id}
                draggedTaskId={draggedItem?.task.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal assignation */}
      {activeTask && (
        <AssignModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSave={handleSave}
        />
      )}

      {/* Modal ajout de tâche */}
      {addTaskTarget && (
        <AddTaskModal
          colId={addTaskTarget.id}
          colLabel={addTaskTarget.label}
          onClose={() => setAddTaskTarget(null)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
}