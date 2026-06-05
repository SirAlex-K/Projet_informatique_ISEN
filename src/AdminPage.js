import { useState } from "react";

const INITIAL_USERS = [
  { id: 1, nom: "Marie Leclerc", email: "m.leclerc@eduflow.fr", role: "professeur", classe: "Terminale S", statut: "actif" },
  { id: 2, nom: "Théo Martin", email: "t.martin@eduflow.fr", role: "etudiant", classe: "Terminale S", statut: "actif" },
  { id: 3, nom: "Amélie Durand", email: "a.durand@eduflow.fr", role: "etudiant", classe: "Terminale S", statut: "actif" },
  { id: 4, nom: "Jean Dupont", email: "j.dupont@eduflow.fr", role: "professeur", classe: "Première", statut: "inactif" },
  { id: 5, nom: "Clara Fontaine", email: "c.fontaine@eduflow.fr", role: "etudiant", classe: "Terminale S", statut: "actif" },
];

const CLASSES = ["Terminale S", "Terminale L", "Première", "Seconde"];

const colors = {
  bg: "#0d1117",
  surface: "#161b27",
  surfaceHover: "#1c2333",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.15)",
  purple: "#6c63ff",
  purpleDim: "rgba(108,99,255,0.15)",
  purpleBorder: "rgba(108,99,255,0.4)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.4)",
  textDim: "rgba(255,255,255,0.2)",
  green: "#10b981",
  greenDim: "rgba(16,185,129,0.15)",
  red: "#ef4444",
  redDim: "rgba(239,68,68,0.15)",
  amber: "#f59e0b",
  amberDim: "rgba(245,158,11,0.15)",
};

function Badge({ role }) {
  const isProf = role === "professeur";
  return (
    <span style={{
      fontSize: "11px", fontWeight: 500, padding: "3px 10px",
      borderRadius: "20px",
      background: isProf ? colors.purpleDim : colors.amberDim,
      color: isProf ? "#a99fff" : "#fbbf24",
      border: `0.5px solid ${isProf ? colors.purpleBorder : "rgba(245,158,11,0.4)"}`,
    }}>
      {isProf ? "Professeur" : "Étudiant"}
    </span>
  );
}

function StatutBadge({ statut }) {
  const isActif = statut === "actif";
  return (
    <span style={{
      fontSize: "11px", fontWeight: 500, padding: "3px 10px",
      borderRadius: "20px",
      background: isActif ? colors.greenDim : "rgba(255,255,255,0.06)",
      color: isActif ? colors.green : colors.textMuted,
      border: `0.5px solid ${isActif ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)"}`,
      display: "flex", alignItems: "center", gap: "5px", width: "fit-content",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActif ? colors.green : colors.textMuted, display: "inline-block" }} />
      {isActif ? "Actif" : "Inactif"}
    </span>
  );
}

function Avatar({ nom }) {
  const initials = nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: "34px", height: "34px", borderRadius: "50%",
      background: colors.purpleDim, border: `0.5px solid ${colors.purpleBorder}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "12px", fontWeight: 600, color: "#a99fff", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [filterRole, setFilterRole] = useState("tous");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nom: "", email: "", role: "etudiant", classe: "Terminale S", statut: "actif" });
  const [activeNav, setActiveNav] = useState("utilisateurs");

  const openAdd = () => {
    setEditUser(null);
    setForm({ nom: "", email: "", role: "etudiant", classe: "Terminale S", statut: "actif" });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ nom: user.nom, email: user.email, role: user.role, classe: user.classe, statut: user.statut });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nom || !form.email) return;
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    } else {
      setUsers([...users, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setShowDeleteModal(null);
  };

  const handleToggleStatut = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, statut: u.statut === "actif" ? "inactif" : "actif" } : u));
  };

  const filtered = users.filter(u => {
    const matchRole = filterRole === "tous" || u.role === filterRole;
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    profs: users.filter(u => u.role === "professeur").length,
    etudiants: users.filter(u => u.role === "etudiant").length,
    actifs: users.filter(u => u.statut === "actif").length,
  };

  const navItems = [
    { key: "utilisateurs", label: "Utilisateurs", icon: "ti-users" },
    { key: "classes", label: "Classes", icon: "ti-school" },
    { key: "parametres", label: "Paramètres", icon: "ti-settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, fontFamily: "'Inter', sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px", flexShrink: 0, background: colors.surface,
        borderRight: `0.5px solid ${colors.border}`,
        display: "flex", flexDirection: "column", padding: "1.5rem 0",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 1.25rem", marginBottom: "2rem" }}>
          <div style={{ width: "32px", height: "32px", background: colors.purple, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-school" style={{ color: "#fff", fontSize: "17px" }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: "17px", fontWeight: 600, color: colors.text }}>EduFlow</span>
        </div>

        {/* Admin badge */}
        <div style={{ margin: "0 1rem 1.5rem", background: colors.purpleDim, border: `0.5px solid ${colors.purpleBorder}`, borderRadius: "8px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: colors.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: 600 }}>A</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#a99fff" }}>Administrateur</div>
            <div style={{ fontSize: "10px", color: colors.textMuted }}>admin@eduflow.fr</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 0.75rem" }}>
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px", marginBottom: "4px",
                background: activeNav === key ? colors.purpleDim : "transparent",
                border: activeNav === key ? `0.5px solid ${colors.purpleBorder}` : "0.5px solid transparent",
                color: activeNav === key ? "#a99fff" : colors.textMuted,
                fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <i className={`ti ${icon}`} style={{ fontSize: "16px" }} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        {/* Déconnexion */}
        <div style={{ padding: "0 0.75rem" }}>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 12px", borderRadius: "8px",
            background: "transparent", border: "0.5px solid transparent",
            color: colors.textMuted, fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
          }}>
            <i className="ti ti-logout" style={{ fontSize: "16px" }} aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{
          padding: "1.25rem 2rem", borderBottom: `0.5px solid ${colors.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: colors.surface,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: colors.text }}>Gestion des utilisateurs</h1>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: colors.textMuted }}>{users.length} utilisateurs au total</p>
          </div>
          <button
            onClick={openAdd}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: colors.purple, border: "none", borderRadius: "8px",
              padding: "9px 16px", color: "#fff", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: "15px" }} aria-hidden="true" />
            Ajouter un utilisateur
          </button>
        </div>

        <div style={{ flex: 1, padding: "1.5rem 2rem", overflowY: "auto" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
            {[
              { label: "Total", value: stats.total, icon: "ti-users", color: colors.purple },
              { label: "Professeurs", value: stats.profs, icon: "ti-user-check", color: "#a99fff" },
              { label: "Étudiants", value: stats.etudiants, icon: "ti-user", color: colors.amber },
              { label: "Actifs", value: stats.actifs, icon: "ti-circle-check", color: colors.green },
            ].map(({ label, value, icon, color }) => (
              <div key={label} style={{
                background: colors.surface, border: `0.5px solid ${colors.border}`,
                borderRadius: "12px", padding: "1rem 1.25rem",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
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
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: colors.surface, border: `0.5px solid ${colors.border}`,
                  borderRadius: "8px", padding: "8px 12px 8px 34px",
                  fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none",
                }}
              />
              <i className="ti ti-search" aria-hidden="true" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: colors.textMuted, fontSize: "15px" }} />
            </div>
            {["tous", "professeur", "etudiant"].map(r => (
              <button key={r} onClick={() => setFilterRole(r)} style={{
                padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                background: filterRole === r ? colors.purpleDim : colors.surface,
                border: filterRole === r ? `0.5px solid ${colors.purpleBorder}` : `0.5px solid ${colors.border}`,
                color: filterRole === r ? "#a99fff" : colors.textMuted,
              }}>
                {r === "tous" ? "Tous" : r === "professeur" ? "Professeurs" : "Étudiants"}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: colors.surface, border: `0.5px solid ${colors.border}`, borderRadius: "12px", overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 80px",
              padding: "10px 1.25rem", borderBottom: `0.5px solid ${colors.border}`,
              fontSize: "11px", fontWeight: 500, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              <span>Utilisateur</span>
              <span>Email</span>
              <span>Rôle</span>
              <span>Classe</span>
              <span>Statut</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: colors.textMuted, fontSize: "13px" }}>
                Aucun utilisateur trouvé
              </div>
            ) : (
              filtered.map((user, i) => (
                <div key={user.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 80px",
                  padding: "12px 1.25rem", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? `0.5px solid ${colors.border}` : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar nom={user.nom} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: colors.text }}>{user.nom}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: colors.textMuted }}>{user.email}</span>
                  <Badge role={user.role} />
                  <span style={{ fontSize: "12px", color: colors.textMuted }}>{user.classe}</span>
                  <div onClick={() => handleToggleStatut(user.id)} style={{ cursor: "pointer" }}>
                    <StatutBadge statut={user.statut} />
                  </div>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button onClick={() => openEdit(user)} style={{
                      width: "28px", height: "28px", borderRadius: "6px",
                      background: "transparent", border: `0.5px solid ${colors.border}`,
                      color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <i className="ti ti-edit" style={{ fontSize: "14px" }} aria-hidden="true" />
                    </button>
                    <button onClick={() => setShowDeleteModal(user)} style={{
                      width: "28px", height: "28px", borderRadius: "6px",
                      background: "transparent", border: `0.5px solid ${colors.border}`,
                      color: colors.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <i className="ti ti-trash" style={{ fontSize: "14px" }} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Ajout/Édition */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: colors.surface, border: `0.5px solid ${colors.border}`,
            borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "420px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: colors.text }}>
                {editUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: "20px", padding: 0, lineHeight: 1 }}>
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            {[
              { label: "Nom complet", key: "nom", type: "text", placeholder: "Ex: Marie Leclerc" },
              { label: "Adresse e-mail", key: "email", type: "email", placeholder: "prenom.nom@eduflow.fr" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: colors.bg, border: `0.5px solid ${colors.border}`,
                    borderRadius: "8px", padding: "10px 12px",
                    fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Rôle</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{
                  width: "100%", background: colors.bg, border: `0.5px solid ${colors.border}`,
                  borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none",
                }}>
                  <option value="etudiant">Étudiant</option>
                  <option value="professeur">Professeur</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: colors.textMuted, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Classe</label>
                <select value={form.classe} onChange={e => setForm({ ...form, classe: e.target.value })} style={{
                  width: "100%", background: colors.bg, border: `0.5px solid ${colors.border}`,
                  borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: colors.text, fontFamily: "inherit", outline: "none",
                }}>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", fontFamily: "inherit",
              }}>
                Annuler
              </button>
              <button onClick={handleSave} style={{
                flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                background: colors.purple, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}>
                {editUser ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: colors.surface, border: `0.5px solid ${colors.border}`,
            borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "360px", textAlign: "center",
          }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: colors.redDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <i className="ti ti-trash" style={{ fontSize: "22px", color: colors.red }} aria-hidden="true" />
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600, color: colors.text }}>Supprimer l'utilisateur</h2>
            <p style={{ margin: "0 0 1.5rem", fontSize: "13px", color: colors.textMuted }}>
              Êtes-vous sûr de vouloir supprimer <strong style={{ color: colors.text }}>{showDeleteModal.nom}</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowDeleteModal(null)} style={{
                flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px",
                background: "transparent", border: `0.5px solid ${colors.border}`, color: colors.textMuted, cursor: "pointer", fontFamily: "inherit",
              }}>Annuler</button>
              <button onClick={() => handleDelete(showDeleteModal.id)} style={{
                flex: 1, padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                background: colors.red, border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
