import { useState, useEffect } from "react";
import {
  GraduationCap,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  Bell,
  LogOut,
  Search,
  ClipboardCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function SupervisorStudents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then(async res => {
        const projects = res.data;
        const membersByProject = await Promise.all(
          projects.map(p => api.get(`/projects/${p.id}/members`).then(r => ({ project: p, members: r.data })))
        );
        const studentsMap = {};
        membersByProject.forEach(({ project, members }) => {
          members.forEach(m => {
            const id = m.user_id;
            if (!studentsMap[id]) {
              studentsMap[id] = { ...m.user, projects: [project.titre] };
            } else {
              studentsMap[id].projects.push(project.titre);
            }
          });
        });
        setStudents(Object.values(studentsMap));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    `${s.prenom} ${s.nom} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">

      {/* Sidebar */}
      <div className="w-[280px] border-r border-white/10 bg-[#0B1220] flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">EduFlow</h1>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <Link to="/supervisor" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <LayoutDashboard size={18} /> Tableau de bord
            </Link>
            <Link to="/supervisor/evaluation" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <ClipboardCheck size={18} /> Évaluation
            </Link>
            <Link to="/supervisor/projects" className="p-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white transition">
              <FolderKanban size={18} /> Projets
            </Link>
            <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-xl p-3 flex items-center gap-3 text-sm font-semibold shadow-lg">
              <GraduationCap size={18} /> Étudiants
            </div>
            <Link to="/supervisor/messages" className="p-3 flex items-center justify-between text-sm text-gray-400 hover:text-white transition">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} /> Messages
              </div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">1</div>
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-red-400 text-sm hover:bg-red-500/20 transition">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <div className="border-b border-white/10 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Étudiants</h1>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "P"}
              </div>
              <div>
                <h2 className="text-sm font-semibold">{user?.prenom} {user?.nom}</h2>
                <p className="text-gray-400 text-xs">Professeur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Étudiants</h2>
              <p className="text-gray-400 text-sm">Liste de tous les étudiants</p>
            </div>
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 w-64">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-4 border-b border-white/10 text-sm font-semibold">
              <div>Nom</div>
              <div>Email</div>
              <div>Projets</div>
              <div>Actions</div>
            </div>

            {loading && (
              <div className="px-6 py-8 text-sm text-gray-400">Chargement...</div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="px-6 py-8 text-sm text-gray-400">Aucun étudiant trouvé.</div>
            )}

            {filtered.map((student, index) => (
              <div key={student.id || index} className="grid grid-cols-4 px-6 py-4 border-b border-white/10 items-center hover:bg-white/[0.03] transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                    {student.prenom?.[0] || "?"}
                  </div>
                  <span className="text-sm font-semibold">{student.prenom} {student.nom}</span>
                </div>
                <div className="text-gray-400 text-sm">{student.email}</div>
                <div>
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-xl text-xs">
                    {student.projects?.length || 0} projet{student.projects?.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <button className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition">Voir détails</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
