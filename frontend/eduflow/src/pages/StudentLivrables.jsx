import { useState, useRef, useEffect } from "react";
import {
  GraduationCap, FolderKanban, MessageSquare, LayoutDashboard, Bell, LogOut,
  FileText, Star, Upload, CheckCircle, Clock, AlertCircle, X, File, Download,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

function StatusBadge({ uploaded }) {
  if (uploaded) return <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1 text-xs font-medium"><CheckCircle size={12} /> Rendu</span>;
  return <span className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-3 py-1 text-xs font-medium"><Clock size={12} /> À rendre</span>;
}

export default function StudentLivrables() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [livrables, setLivrables] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/auth/me/project");
      if (!data.project) return;
      setProject(data.project);
      const livRes = await api.get(`/projects/${data.project.id}/deliverables`);
      setLivrables(livRes.data);
    };
    load().catch(console.error);
  }, [user]);

  const handleUpload = async (file) => {
    if (!file || !project) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/projects/${project.id}/deliverables`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLivrables(prev => [res.data, ...prev]);
    } catch (e) { console.error(e); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deliverables/${id}`);
      setLivrables(prev => prev.filter(l => l.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleDownload = (livrable) => {
    const a = document.createElement("a");
    a.href = `http://localhost:3000/${livrable.chemin_fichier}`;
    a.download = livrable.nom_fichier;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-72 border-r border-white/[0.06]" : "w-0"} overflow-hidden flex-shrink-0 bg-[#0B1220] transition-[width] duration-300 ease-in-out`}>
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
              <Link to="/student" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <LayoutDashboard size={18} /> Tableau de bord
              </Link>
              <Link to="/student/kanban" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <FolderKanban size={18} /> Mon Projet
              </Link>
              <div className="relative bg-blue-600/90 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold shadow-lg shadow-blue-500/20">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full" />
                <FileText size={18} /> Livrables
              </div>
              <Link to="/student/notes" className="px-4 py-3 flex items-center gap-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <Star size={18} /> Notes
              </Link>
              <Link to="/student/chat" className="px-4 py-3 flex items-center justify-between text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3"><MessageSquare size={18} /> Chat du groupe</div>
              </Link>
            </div>
          </div>
          <div className="p-4 border-t border-white/[0.06]">
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm hover:bg-red-500/15 transition-all duration-200 w-full">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="border-b border-white/[0.06] px-8 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors flex-shrink-0">
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <div>
              <h1 className="text-2xl font-bold">Livrables</h1>
              <p className="text-gray-500 text-sm mt-0.5">Dépôt et suivi de vos rendus</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020817]" />
            </button>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                {user?.prenom?.[0] || "A"}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-gray-500 text-xs">{project?.titre || "Mon projet"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20"><CheckCircle size={18} /></div>
              <div>
                <p className="text-2xl font-bold">{livrables.length}</p>
                <p className="text-gray-400 text-xs mt-0.5">Fichiers déposés</p>
              </div>
            </div>
            <div className="bg-blue-500/[0.07] border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20"><Upload size={18} /></div>
              <div>
                <p className="text-2xl font-bold">{Math.round(livrables.reduce((s, l) => s + (l.taille || 0), 0) / 1024)}<span className="text-gray-500 text-base font-normal"> Ko</span></p>
                <p className="text-gray-400 text-xs mt-0.5">Taille totale</p>
              </div>
            </div>
          </div>

          {/* Upload zone */}
          {project && (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-8 ${dragOver ? "border-blue-500/60 bg-blue-500/[0.08]" : "border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleUpload(file); }}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <p className="text-blue-400 text-sm">Envoi en cours...</p>
              ) : (
                <>
                  <Upload size={24} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-400 text-sm">Glissez votre fichier ici ou <span className="text-blue-400">cliquez pour sélectionner</span></p>
                  <p className="text-gray-600 text-xs mt-1">PDF, DOCX, ZIP, images, etc.</p>
                </>
              )}
              <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} />
            </div>
          )}

          {/* Livrables list */}
          {livrables.length === 0 ? (
            <div className="text-center text-gray-600 py-16">Aucun livrable déposé pour le moment.</div>
          ) : (
            <div className="space-y-3">
              {livrables.map((livrable) => (
                <div key={livrable.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <File size={18} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{livrable.nom_fichier}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {livrable.uploader ? `${livrable.uploader.prenom} ${livrable.uploader.nom}` : "—"} · {new Date(livrable.uploaded_at).toLocaleDateString("fr-FR")} · {Math.round((livrable.taille || 0) / 1024)} Ko
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge uploaded={true} />
                    <button onClick={() => handleDownload(livrable)} className="flex items-center gap-1.5 text-gray-400 hover:text-blue-300 text-xs font-medium bg-white/[0.04] hover:bg-blue-500/15 border border-white/[0.08] hover:border-blue-500/30 px-2.5 py-1.5 rounded-lg transition-all duration-150">
                      <Download size={14} /> Télécharger
                    </button>
                    <button onClick={() => handleDelete(livrable.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
