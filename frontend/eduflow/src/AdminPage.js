import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserCheck, UserCircle, ShieldAlert,
  Plus, Search, Pencil, Trash2, X, LogOut, ChevronDown,
} from "lucide-react";
import api from "./services/api";

const AVATAR_COLORS = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600",
  "bg-orange-500", "bg-rose-600", "bg-cyan-600", "bg-indigo-500",
];

const ROLE_CONFIG = {
  admin:      { label: "Admin",      cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  supervisor: { label: "Encadrant",  cls: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  student:    { label: "Étudiant",   cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

function Badge({ role }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function Avatar({ nom, prenom, id }) {
  const initials = `${(prenom || "")[0] || ""}${(nom || "")[0] || ""}`.toUpperCase();
  const color = AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

const INPUT_CLS = "w-full bg-[#020817] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/40 transition";
const LABEL_CLS = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [formationOptions, setFormationOptions] = useState([]);
  const [promoOptions, setPromoOptions] = useState([]);
  const [classesByFormation, setClassesByFormation] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [filterRole, setFilterRole] = useState("tous");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", role: "student", classe: "", formation: "", promo: "" });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => { fetchUsers(); fetchOptions(); }, []);

  const fetchOptions = async () => {
    try {
      const res = await api.get("/admin/options");
      setFormationOptions(res.data.formations || []);
      setPromoOptions(res.data.promos || []);
      setClassesByFormation(res.data.classesByFormation || {});
    } catch {
      setFormationOptions(["ISEN", "HEI", "ISA"]);
      setPromoOptions(["2026", "2027"]);
      setClassesByFormation({ ISEN: ["CIR 1","CIR 2","CIR 3","CSI 1","CSI 2","CSI 3"], HEI: ["HEI 1","HEI 2","HEI 3"], ISA: ["ISA 1","ISA 2","ISA 3"] });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditUser(null);
    setForm({ nom: "", prenom: "", email: "", password: "", role: "student", classe: "", formation: "", promo: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ nom: u.nom, prenom: u.prenom, email: u.email, password: "", role: u.role, classe: u.classe || "", formation: u.formation || "", promo: u.promo || "" });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nom || !form.prenom || !form.email || (!editUser && !form.password)) {
      setFormError("Tous les champs obligatoires doivent être remplis");
      return;
    }
    try {
      if (editUser) {
        const data = { nom: form.nom, prenom: form.prenom, email: form.email, role: form.role, classe: form.classe, formation: form.formation, promo: form.promo };
        if (form.password) data.password = form.password;
        await api.put(`/admin/users/${editUser.id}`, data);
      } else {
        await api.post("/admin/users", form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/admin/users/${id}`); setShowDeleteModal(null); fetchUsers(); }
    catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); };

  const filtered = users.filter(u => {
    const matchRole   = filterRole === "tous" || u.role === filterRole;
    const matchSearch = `${u.nom?.toUpperCase()} ${u.prenom}`.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = [
    { label: "Utilisateurs",  value: users.length,                                  icon: Users,       color: "text-purple-400",  bg: "bg-purple-500/10" },
    { label: "Encadrants",    value: users.filter(u => u.role === "supervisor").length, icon: UserCheck,   color: "text-blue-400",    bg: "bg-blue-500/10" },
    { label: "Étudiants",     value: users.filter(u => u.role === "student").length, icon: UserCircle,  color: "text-amber-400",   bg: "bg-amber-500/10" },
    { label: "Admins",        value: users.filter(u => u.role === "admin").length,   icon: ShieldAlert, color: "text-red-400",     bg: "bg-red-500/10" },
  ];

  const FILTER_TABS = [
    { key: "tous",       label: "Tous" },
    { key: "student",    label: "Étudiants" },
    { key: "supervisor", label: "Encadrants" },
    { key: "admin",      label: "Admins" },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white flex font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0B1220] border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center font-black text-sm shadow-lg shadow-purple-500/20">
              PH
            </div>
            <div>
              <p className="text-base font-bold leading-tight">ProjectHub</p>
              <p className="text-gray-500 text-xs">Administrateur</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-300">
            <Users size={16} /> Utilisateurs
          </div>
        </nav>

        {/* Profile + logout */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(user.prenom || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{user.prenom} {user.nom?.toUpperCase()}</p>
              <p className="text-gray-600 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 bg-red-500/[0.06] border border-red-500/20 hover:bg-red-500/15 transition"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="border-b border-white/[0.06] bg-[#0B1220] px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold">Gestion des utilisateurs</h1>
            <p className="text-gray-500 text-xs mt-0.5">{users.length} utilisateurs au total</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 transition"
          >
            <Plus size={15} /> Ajouter un utilisateur
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-[#0B1220] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{value}</p>
                  <p className="text-gray-500 text-xs mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#0B1220] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500/40 transition w-64"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-[#0B1220] border border-white/[0.06] rounded-xl p-1">
              {FILTER_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterRole(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filterRole === key
                      ? "bg-purple-600 text-white shadow"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-600">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Table */}
          {(() => {
            const showStudentCols = filterRole === "tous" || filterRole === "student";
            const grid = showStudentCols
              ? "2fr 2fr 0.8fr 1.1fr 0.6fr 0.8fr 60px"
              : "2fr 2fr 0.8fr 60px";
            return (
              <div className="bg-[#0B1220] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid gap-4 px-6 py-3 border-b border-white/[0.06] text-[10px] font-bold text-gray-600 uppercase tracking-widest"
                  style={{ gridTemplateColumns: grid }}>
                  <span>Utilisateur</span>
                  <span>Email</span>
                  {showStudentCols && <span>Classe</span>}
                  {showStudentCols && <span>Formation</span>}
                  {showStudentCols && <span>Promo</span>}
                  <span>Rôle</span>
                  <span />
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 text-center text-gray-600 text-sm">Aucun utilisateur trouvé</div>
                ) : (
                  filtered.map((u, i) => (
                    <div
                      key={u.id}
                      className={`grid gap-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition ${i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                      style={{ gridTemplateColumns: grid }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar nom={u.nom?.toUpperCase()} prenom={u.prenom} id={u.id} />
                        <span className="text-sm font-semibold truncate">{u.prenom} {u.nom?.toUpperCase()}</span>
                      </div>
                      <span className="text-xs text-gray-500 truncate pr-2">{u.email}</span>
                      {showStudentCols && <span className="text-xs text-gray-400">{u.classe || "—"}</span>}
                      {showStudentCols && <span className="text-xs text-gray-400 truncate pr-2" title={u.formation}>{u.formation || "—"}</span>}
                      {showStudentCols && <span className="text-xs text-gray-400">{u.promo || "—"}</span>}
                      <Badge role={u.role} />
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => openEdit(u)}
                          className="w-7 h-7 rounded-lg border border-white/[0.08] text-gray-600 hover:text-purple-400 hover:border-purple-500/30 flex items-center justify-center transition"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(u)}
                          className="w-7 h-7 rounded-lg border border-white/[0.08] text-gray-600 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Modal Ajout / Édition ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1220] border border-white/[0.08] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.06]">
              <h2 className="text-base font-bold">{editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-500 hover:text-white transition">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Prénom *", key: "prenom", type: "text", placeholder: "Prénom" },
                  { label: "Nom *",    key: "nom",    type: "text", placeholder: "Nom" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className={LABEL_CLS}>{label}</label>
                    <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className={INPUT_CLS} />
                  </div>
                ))}
              </div>

              <div>
                <label className={LABEL_CLS}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="prenom.nom@junia.com" className={INPUT_CLS} />
              </div>

              <div>
                <label className={LABEL_CLS}>{editUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe *"}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={INPUT_CLS} />
              </div>

              <div>
                <label className={LABEL_CLS}>Rôle *</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    className={INPUT_CLS + " appearance-none pr-9 cursor-pointer"}
                  >
                    <option value="student">Étudiant</option>
                    <option value="supervisor">Encadrant</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                </div>
              </div>

              {form.role === "student" && (
                <>
                  <div>
                    <label className={LABEL_CLS}>Formation</label>
                    <div className="relative">
                      <select value={form.formation} onChange={e => setForm({ ...form, formation: e.target.value, classe: "" })} className={INPUT_CLS + " appearance-none pr-9 cursor-pointer"}>
                        <option value="">Sélectionner...</option>
                        {formationOptions.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Classe</label>
                    <div className="relative">
                      <select value={form.classe} onChange={e => setForm({ ...form, classe: e.target.value })} disabled={!form.formation} className={INPUT_CLS + " appearance-none pr-9 cursor-pointer disabled:opacity-40"}>
                        <option value="">{form.formation ? "Sélectionner..." : "Choisir une formation d'abord"}</option>
                        {(classesByFormation[form.formation] || []).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Promo</label>
                    <div className="relative">
                      <select value={form.promo} onChange={e => setForm({ ...form, promo: e.target.value })} className={INPUT_CLS + " appearance-none pr-9 cursor-pointer"}>
                        <option value="">Sélectionner...</option>
                        {promoOptions.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 transition">
                Annuler
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/20 transition">
                {editUser ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Suppression ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1220] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h2 className="text-base font-bold mb-1.5">Supprimer l'utilisateur</h2>
            <p className="text-gray-500 text-sm mb-6">
              Voulez-vous vraiment supprimer{" "}
              <span className="text-white font-semibold">{showDeleteModal.prenom} {showDeleteModal.nom?.toUpperCase()}</span> ?
              <br />Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-2.5 rounded-xl text-sm border border-white/[0.08] text-gray-500 hover:text-white transition">
                Annuler
              </button>
              <button onClick={() => handleDelete(showDeleteModal.id)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-500/20">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
