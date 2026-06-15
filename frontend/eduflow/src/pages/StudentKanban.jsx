import { useState, useEffect } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard, Bell, LogOut,
  FileText, Star, UserPlus, X, Check, Crown, GripVertical, Circle, Plus, Trash2,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const COLS = [
  { id: "todo",     label: "À faire",  color: "border-gray-500", dot: "bg-gray-400" },
  { id: "en_cours", label: "En cours", color: "border-blue-500",  dot: "bg-blue-400" },
  { id: "done",     label: "Terminé",  color: "border-green-500", dot: "bg-green-400" },
];

const COLORS = ["from-blue-500 to-blue-600","from-purple-500 to-purple-600","from-orange-400 to-orange-500","from-green-500 to-green-600","from-pink-500 to-pink-600","from-teal-500 to-teal-600"];

function getMemberColor(userId) { return COLORS[userId % COLORS.length]; }
function getInitials(m) { return `${m.prenom?.[0] || ""}${m.nom?.[0] || ""}`.toUpperCase(); }

function Avatar({ member, size = "sm", showTooltip = false }) {
  if (!member) return null;
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className="relative group/avatar">
      <div className={`${sz} rounded-full bg-gradient-to-br ${getMemberColor(member.id)} flex items-center justify-center font-bold text-white flex-shrink-0`}>
        {getInitials(member)}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1a2235] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {member.prenom} {member.nom}
        </div>
      )}
    </div>
  );
}

function AssignModal({ task, members, onClose, onSave }) {
  const [selected, setSelected] = useState(task.assigned_to ? new Set([task.assigned_to]) : new Set());
  const toggle = (id) => { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const selectedId = [...selected][0] || null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0d1526] border border-white/[0.08] rounded-2xl w-full max-w-sm mx-4 shadow-2xl shadow-black/60">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Assigner un membre</p>
            <h2 className="text-base font-bold text-white leading-snug">{task.titre}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-2">
          {members.map(m => {
            const active = selected.has(m.id);
            return (
              <button key={m.id} onClick={() => toggle(m.id)} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 text-left ${active ? "bg-blue-600/15 border-blue-500/40 text-white" : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.05] hover:text-white hover:border-white/10"}`}>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getMemberColor(m.id)} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>{getInitials(m)}</div>
                <span className="text-sm font-medium">{m.prenom} {m.nom}</span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${active ? "bg-blue-500 border-blue-500" : "border-white/20"}`}>
                  {active && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white text-sm font-medium hover:bg-white/[0.04] transition-all">Annuler</button>
          <button onClick={() => { onSave(task.id, selectedId); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">Confirmer</button>
        </div>
      </div>
    </div>
  );
}

function AddTaskModal({ colId, colLabel, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const handleSubmit = () => { if (!title.trim()) return; onAdd(colId, title.trim(), desc.trim()); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0d1526] border border-white/[0.08] rounded-2xl w-full max-w-sm mx-4 shadow-2xl shadow-black/60">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Nouvelle tâche · {colLabel}</p>
            <h2 className="text-base font-bold text-white">Ajouter une carte</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Titre <span className="text-red-400">*</span></label>
            <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} placeholder="ex. Maquette UI"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04] transition-all" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Description</label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Détails de la tâche…"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.04] transition-all resize-none" />
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white text-sm font-medium hover:bg-white/[0.04] transition-all">Annuler</button>
          <button onClick={handleSubmit} disabled={!title.trim()} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">Créer la tâche</button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, members, colDot, onAssignClick, onDelete, isLeader, onDragStart, onDragEnd, isDragging }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const assignee = members.find(m => m.id === task.assigned_to);
  const handleDeleteClick = e => { e.stopPropagation(); if (confirmDelete) { onDelete(task.id); } else { setConfirmDelete(true); } };
  const handleCancelDelete = e => { e.stopPropagation(); setConfirmDelete(false); };
  return (
    <div draggable={!confirmDelete} onDragStart={e => !confirmDelete && onDragStart(e, task)} onDragEnd={onDragEnd}
      onMouseLeave={() => setConfirmDelete(false)}
      className={`bg-[#0d1526] border rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-lg hover:shadow-black/30 transition-all duration-200 group ${isDragging ? "opacity-40 scale-95" : "opacity-100"} ${confirmDelete ? "border-red-500/40 bg-red-500/[0.04]" : "border-white/[0.06] hover:border-white/[0.12]"}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Circle size={7} className={`flex-shrink-0 fill-current ${colDot.replace("bg-", "text-")}`} />
          <h3 className="text-sm font-semibold text-white truncate">{task.titre}</h3>
        </div>
        {isLeader && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {confirmDelete ? (
              <>
                <button onClick={handleCancelDelete} className="text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-all">Annuler</button>
                <button onClick={handleDeleteClick} className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all">Confirmer</button>
              </>
            ) : (
              <button onClick={handleDeleteClick} title="Supprimer" className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"><Trash2 size={13} /></button>
            )}
          </div>
        )}
        {!isLeader && <GripVertical size={14} className="text-gray-700 flex-shrink-0 mt-0.5" />}
      </div>
      <p className="text-gray-500 text-xs mb-4 leading-relaxed">{task.description}</p>
      <div className="flex items-center justify-between">
        <div>
          {assignee ? (
            <div className="ring-2 ring-[#0d1526] rounded-full inline-block">
              <Avatar member={assignee} size="sm" showTooltip />
            </div>
          ) : <span className="text-gray-600 text-xs italic">Non assigné</span>}
        </div>
        {!confirmDelete && (
          <button onClick={() => onAssignClick(task)}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 bg-white/[0.03] hover:bg-blue-500/10 border border-white/[0.06] hover:border-blue-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-150">
            <UserPlus size={13} /> Assigner
          </button>
        )}
      </div>
    </div>
  );
}

function Column({ col, tasks, members, onAssignClick, onAddClick, onDeleteTask, isLeader, onDragStart, onDragEnd, onDragOver, onDrop, isDragOver, draggedTaskId }) {
  return (
    <div className="flex-1 min-w-[220px] max-w-[300px] flex flex-col">
      <div className={`border-t-2 ${col.color} pt-3 mb-4`}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${col.dot}`} />
            <span className="text-sm font-semibold text-white">{col.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-white/[0.06] text-gray-400 text-xs flex items-center justify-center font-medium">{tasks.length}</span>
            {isLeader && (
              <button onClick={() => onAddClick(col)} title="Ajouter une tâche"
                className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 flex items-center justify-center transition-all border border-white/[0.06] hover:border-blue-500/30">
                <Plus size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div onDragOver={e => onDragOver(e, col.id)} onDrop={e => onDrop(e, col.id)}
        className={`space-y-3 flex-1 rounded-xl p-1 -m-1 transition-all duration-200 ${isDragOver ? "bg-white/[0.04] ring-2 ring-blue-500/30" : ""}`}>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} members={members} colDot={col.dot} onAssignClick={onAssignClick} onDelete={onDeleteTask}
            isLeader={isLeader} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggedTaskId === task.id} />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-white/[0.06] rounded-xl p-8 flex flex-col items-center justify-center text-gray-700 text-sm gap-2">
            <Plus size={20} /> Déposer ici
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentKanban() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [addTaskTarget, setAddTaskTarget] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectsRes = await api.get("/projects");
        const myProject = projectsRes.data.find(p => p.members?.some(m => m.user_id === user?.id));
        if (!myProject) { setLoading(false); return; }
        setProject(myProject);
        const [tasksRes, membersRes] = await Promise.all([
          api.get(`/projects/${myProject.id}/tasks`),
          api.get(`/projects/${myProject.id}/members`),
        ]);
        setTasks(tasksRes.data);
        setMembers(membersRes.data.map(m => m.user).filter(Boolean));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const myMembership = project?.members?.find(m => m.user_id === user?.id);
  const isLeader = myMembership?.role_in_project === "lead";

  const handleAddTask = async (colId, titre, description) => {
    if (!project) return;
    try {
      const res = await api.post(`/projects/${project.id}/tasks`, { titre, description, statut: colId });
      setTasks(prev => [...prev, res.data]);
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) { console.error(e); }
  };

  const handleAssignSave = async (taskId, userId) => {
    try {
      await api.put(`/tasks/${taskId}`, { assigned_to: userId || null });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigned_to: userId || null } : t));
    } catch (e) { console.error(e); }
  };

  const handleDragStart = (e, task) => { setDraggedItem(task); };
  const handleDragEnd = () => { setDraggedItem(null); setDragOverCol(null); };
  const handleDragOver = (e, colId) => { e.preventDefault(); if (dragOverCol !== colId) setDragOverCol(colId); };

  const handleDrop = async (e, toColId) => {
    e.preventDefault(); setDragOverCol(null);
    if (!draggedItem || draggedItem.statut === toColId) { setDraggedItem(null); return; }
    const task = draggedItem;
    setDraggedItem(null);
    try {
      await api.put(`/tasks/${task.id}/move`, { statut: toColId, position: 0 });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, statut: toColId } : t));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-72 border-r border-white/[0.06]" : "w-0"} overflow-hidden flex-shrink-0 bg-[#0B1220] transition-[width] duration-300 ease-in-out`}>
        <div className="w-72 h-full flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><GraduationCap size={20} /></div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">EduFlow</h1>
                  <p className="text-gray-500 text-xs">Étudiant</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <Link to="/student" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><LayoutDashboard size={18} /> Tableau de bord</Link>
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <FolderKanban size={18} /> Mon Projet
              </div>
              <Link to="/student/livrables" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><FileText size={18} /> Livrables</Link>
              <Link to="/student/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><Star size={18} /> Notes</Link>
              <Link to="/student/chat" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200"><MessageSquare size={18} /> Chat du groupe</Link>
            </div>
          </div>
          <div className="p-4 space-y-3 border-t border-white/[0.06]">
            <p className="text-gray-600 text-xs uppercase tracking-wider px-1">{project?.titre || "Mon groupe"}</p>
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-1">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getMemberColor(m.id)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{getInitials(m)}</div>
                <p className="text-xs text-gray-300 truncate font-medium">{m.prenom} {m.nom}</p>
              </div>
            ))}
            <button onClick={() => { logout(); navigate("/"); }} className="mt-2 flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200 w-full">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Mon Projet</h1>
              <p className="text-gray-500 text-sm mt-0.5">{project?.titre || "Aucun projet"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getMemberColor(user?.id || 0)} flex items-center justify-center text-sm font-bold relative`}>
                {user?.prenom?.[0] || "E"}
                {isLeader && <Crown size={10} className="absolute -top-1 -right-1 text-yellow-400" />}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-500 text-xs">{isLeader ? "Chef de groupe" : "Membre"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tip banner */}
        <div className="mx-8 mt-5 mb-0 flex items-center gap-2.5 bg-blue-500/[0.06] border border-blue-500/15 rounded-xl px-4 py-2.5">
          <UserPlus size={14} className="text-blue-400 flex-shrink-0" />
          <p className="text-blue-300 text-xs">
            <span className="font-semibold">Astuce :</span> glissez-déposez une carte pour changer son statut, ou survolez-la pour assigner un membre.
          </p>
        </div>

        {loading && <div className="flex-1 flex items-center justify-center text-gray-400">Chargement...</div>}

        {!loading && !project && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Vous n'êtes assigné à aucun projet pour le moment.
          </div>
        )}

        {!loading && project && (
          <div className="flex-1 overflow-x-auto p-8">
            <div className="flex gap-5 min-w-max">
              {COLS.map(col => (
                <Column
                  key={col.id} col={col} isLeader={isLeader}
                  tasks={tasks.filter(t => t.statut === col.id)}
                  members={members}
                  onAddClick={col => setAddTaskTarget(col)}
                  onAssignClick={setActiveTask}
                  onDeleteTask={handleDeleteTask}
                  onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver} onDrop={handleDrop}
                  isDragOver={dragOverCol === col.id}
                  draggedTaskId={draggedItem?.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeTask && <AssignModal task={activeTask} members={members} onClose={() => setActiveTask(null)} onSave={handleAssignSave} />}
      {addTaskTarget && <AddTaskModal colId={addTaskTarget.id} colLabel={addTaskTarget.label} onClose={() => setAddTaskTarget(null)} onAdd={handleAddTask} />}
    </div>
  );
}
