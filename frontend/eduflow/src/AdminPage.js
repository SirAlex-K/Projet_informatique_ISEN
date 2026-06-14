import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

const colors = {
  bg: "#0d1117", surface: "#161b27", surfaceHover: "#1c2333",
  border: "rgba(255,255,255,0.08)",
  purple: "#6c63ff", purpleDim: "rgba(108,99,255,0.15)", purpleBorder: "rgba(108,99,255,0.4)",
  text: "#ffffff", textMuted: "rgba(255,255,255,0.4)",
  green: "#10b981", greenDim: "rgba(16,185,129,0.15)",
  red: "#ef4444", redDim: "rgba(239,68,68,0.15)",
  amber: "#f59e0b", amberDim: "rgba(245,158,11,0.15)",
};

const ROLE_LABELS = { admin: "Admin", supervisor: "Encadrant", student: "Étudiant" };
const ROLE_COLORS = {
  admin: { bg: "rgba(239,68,68,0.15)", color: "#f87171", border: "rgba(239,68,68,0.4)" },
  supervisor: { bg: colors.purpleDim, color: "#a99fff", border: colors.purpleBorder },
  student: { bg: colors.amberDim, color: "#fbbf24", border: "rgba(245,158,11,0.4)" },
};

// Listes pour les menus déroulants — adapte ces valeurs si besoin
const CLASSE_OPTIONS = ["ISEN1A", "ISEN1B", "ISEN2A", "ISEN2B", "ISEN3A", "ISEN3B", "ISEN3C", "ISEN4A", "ISEN4B", "ISEN5A", "ISEN5B"];
const FORMATION_OPTIONS = ["Génie Informatique", "Génie Électronique", "Génie Industriel", "Génie Énergétique et Environnement", "Génie Civil et Construction Durable"];
const FORMATION_SHORT = {
  "Génie Informatique": "Info",
  "Génie Électronique": "Électro",
  "Génie Industriel": "Indus",
  "Génie Énergétique et Environnement": "Énergie",
  "Génie Civil et Construction Durable": "Civil",
};
const PROMO_OPTIONS = ["2025", "2026", "2027", "2028", "2029", "2030"];

const selectStyle = {
  width: "100%", boxSizing: "border-box", background: colors.bg,
  border: `0.5px solid ${colors.border}`, borderRadius: "8px",
  padding: "10px 12px", fontSize: "13px", color: colors.text,
  fontFamily: "inherit", outline: "none",
};

function Badge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.student;
  return <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", background: c.bg, color: c.color, border: `0.5px solid ${c.border}` }}>{ROLE_LABELS[role] || role}</span>;
}

function Avatar({ nom, prenom }) {
  const initials = `${(prenom || '')[0] || ''}${(nom || '')[0] || ''}`.toUpperCase();
  return <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: colors.purpleDim, border: `0.5px solid ${colors.purpleBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#a99fff", flexShrink: 0 }}>{initials}</div>;
}

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [filterRole, setFilterRole] = useState("tous");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", role: "student", classe: "", formation: "", promo: "" });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setEditUser(null); setForm({ nom: "", prenom: "", email: "", password: "", role: "student", classe: "", formation: "", promo: "" }); setFormError(""); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ nom: u.nom, prenom: u.prenom, email: u.email, password: "", role: u.role, classe: u.classe || "", formation: u.formation || "", promo: u.promo || "" }); setFormError(""); setShowModal(true); };

  const handleSave = async () => {
    if (!form.nom || !form.prenom || !form.email || (!editUser && !form.password)) { setFormError("Tous les champs obligatoires doivent être remplis"); return; }
    try {
      if (editUser) {
        const data = { nom: form.nom, prenom: form.prenom, email: form.email, role: form.role, classe: form.classe, formation: form.formation, promo: form.promo };
        if (form.password) data.password = form.password;
        await api.put(`/admin/users/${editUser.id}`, data);
      } else {
        await api.post('/admin/users', form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/admin/users/${id}`); setShowDeleteModal(null); fetchUsers(); }
    catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); };

  const filtered = users.filter(u => {
    const matchRole = filterRole === "tous" || u.role === filterRole;
    const matchSearch = `${u.nom} ${u.prenom}`.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = { total: users.length, supervisors: users.filter(u => u.role === 'supervisor').length, students: users.filter(u => u.role === 'student').length, admins: users.filter(u => u.role === 'admin').length };

  const tableColumns = "1.6fr 1.6fr 0.7fr 1.1fr 0.6fr 0.9fr 80px";

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Inter', sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: colors.surface, borderRight: `0.5px solid ${colors.border}`, display: "flex", flexDirection: "column", padding: "1.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 1.25rem", marginBottom: "2rem" }}>
          <div style={{ width: "32px", height: "32px", background: colors.purple, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-school" style={{ color: "#fff", fontSize: "17px" }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: "17px", fontWeight: 600, color: colors.text }}>EduFlow</span>
        </div>
        <div style={{ margin: "0 1rem 1.5rem", background: colors.purpleDim, border: `0.5px solid ${colors.purpleBorder}`, borderRadius: "8px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: colors.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: 600 }}>
            {(user.prenom || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#a99fff" }}>Administrateur</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>{user.email}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "0 0.75rem" }}>
          <button style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: colors.purpleDim, border: `0.5px solid ${colors.purpleBorder}`, color: "#a99fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            <i className="ti ti-users" style={{ fontSize: "16px" }} aria-hidden="true" />
            Utilisateurs
          </button>
        </nav>
        <div style={{ padding: "0 0.75rem" }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: "transparent", border: "0.5px solid transparent", color: colors.textMuted, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
            <i className="ti ti-logout" style={{ fontSize: "16px" }} aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: `0.5px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: colors.surface }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: colors.text }}>Gestion des utilisateurs</h1>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.textMuted }}>{users.length} utilisateurs au total</p>
          </div>
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "7px", background: colors.purple, border: "none", borderRadius: "8px", padding: "9px 16px", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <i className="ti ti-plus" style={{ fontSize: "15px" }} aria-hidden="true" />
            Ajouter un utilisateur
          </button>
        </div>

        <div style={{ flex: 1, padding: "1.5rem 2rem", overflowY: "auto" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
            {[
              { label: "Total", value: stats.total, icon: "ti-users", color: colors.purple },
              { label: "Encadrants", value: stats.supervisors, icon: "ti-user-check", color: "#a99fff" },
              { label: "Étudiants", value: stats.students, icon: "ti-user", color: colors.amber },
              { label: "Admins", value: stats.admins, icon: "ti-shield", color: colors.red },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{ background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${icon}`} style={{ fontSize: "18px", color }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: colors.text, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "1rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "280px" }}>
              <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "8px", padding: "8px 12px 8px 34px", fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none" }} />
              <i className="ti ti-search" aria-hidden="true" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: colors.textMuted, fontSize: "15px" }} />
            </div>
            {["tous", "supervisor", "student", "admin"].map(r => (
              <button key={r} onClick={() => setFilterRole(r)} style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", background: filterRole === r ? colors.purpleDim : colors.surface, border: filterRole === r ? `0.5px solid ${colors.purpleBorder}` : `0.5px solid ${colors.border}`, color: filterRole === r ? "#a99fff" : colors.textMuted }}>
                {r === "tous" ? "Tous" : r === "supervisor" ? "Encadrants" : r === "student" ? "Étudiants" : "Admins"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "10px 1.25rem", borderBottom: `0.5px solid ${colors.border}`, fontSize: "11px", fontWeight: 500, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Utilisateur</span>
              <span>Email</span>
              <span>Classe</span>
              <span>Formation</span>
              <span>Promo</span>
              <span>Rôle</span>
              <span></span>
            </div>
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: colors.textMuted }}>Chargement...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: colors.textMuted }}>Aucun utilisateur trouvé</div>
            ) : filtered.map((u, i) => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: tableColumns, padding: "12px 1.25rem", alignItems: "center", borderBottom: i < filtered.length - 1 ? `0.5px solid ${colors.border}` : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  <Avatar nom={u.nom} prenom={u.prenom} />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.prenom} {u.nom}</span>
                </div>
                <span style={{ fontSize: "12px", color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}>{u.email}</span>
                <span style={{ fontSize: "12px", color: u.role === "student" && u.classe ? colors.text : colors.textMuted }}>
                  {u.role === "student" ? (u.classe || "—") : "—"}
                </span>
                <span
                  title={u.role === "student" && u.formation ? u.formation : undefined}
                  style={{ fontSize: "12px", color: u.role === "student" && u.formation ? colors.text : colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}
                >
                  {u.role === "student" ? (FORMATION_SHORT[u.formation] || u.formation || "—") : "—"}
                </span>
                <span style={{ fontSize: "12px", color: u.role === "student" && u.promo ? colors.text : colors.textMuted }}>
                  {u.role === "student" ? (u.promo || "—") : "—"}
                </span>
                <Badge role={u.role} />
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button onClick={() => openEdit(u)} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-edit" style={{ fontSize: "14px" }} aria-hidden="true" />
                  </button>
                  <button onClick={() => setShowDeleteModal(u)} style={{ width: "28px", height: "28px", borderRadius: "6px", background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-trash" style={{ fontSize: "14px" }} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Ajout/Édition */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "420px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.text }}>{editUser ? "Modifier" : "Ajouter un utilisateur"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: "20px", padding: 0 }}><i className="ti ti-x" /></button>
            </div>
            {formError && <div style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.4)", borderRadius: "8px", padding: "8px 12px", marginBottom: "1rem", fontSize: "12px", color: "#ef4444" }}>{formError}</div>}
            {[
              { label: "Prénom *", key: "prenom", type: "text", placeholder: "Prénom" },
              { label: "Nom *", key: "nom", type: "text", placeholder: "Nom" },
              { label: "Email *", key: "email", type: "email", placeholder: "prenom.nom@junia.com" },
              { label: editUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe *", key: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", background: colors.bg, border: `0.5px solid ${colors.border}`, borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Rôle *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={selectStyle}>
                <option value="student">Étudiant</option>
                <option value="supervisor">Encadrant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Champs spécifiques aux étudiants — menus déroulants */}
            {form.role === "student" && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Classe</label>
                  <select value={form.classe} onChange={e => setForm({ ...form, classe: e.target.value })} style={selectStyle}>
                    <option value="">Sélectionner...</option>
                    {CLASSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Formation</label>
                  <select value={form.formation} onChange={e => setForm({ ...form, formation: e.target.value })} style={selectStyle}>
                    <option value="">Sélectionner...</option>
                    {FORMATION_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Promo</label>
                  <select value={form.promo} onChange={e => setForm({ ...form, promo: e.target.value })} style={selectStyle}>
                    <option value="">Sélectionner...</option>
                    {PROMO_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: colors.purple, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>{editUser ? "Enregistrer" : "Ajouter"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "360px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: colors.redDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <i className="ti ti-trash" style={{ fontSize: "22px", color: colors.red }} aria-hidden="true" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Supprimer l'utilisateur</h2>
            <p style={{ margin: "0 0 1.5rem", fontSize: "13px", color: colors.textMuted }}>
              Êtes-vous sûr de vouloir supprimer <strong style={{ color: colors.text }}>{showDeleteModal.prenom} {showDeleteModal.nom}</strong> ?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowDeleteModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={() => handleDelete(showDeleteModal.id)} style={{ flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: colors.red, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}