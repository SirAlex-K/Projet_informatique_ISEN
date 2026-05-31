import { useState } from "react";

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#0d1117",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Sora', 'Inter', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#161b27",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    background: "#6c63ff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#fff",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#fff",
    margin: "0 0 4px",
    textAlign: "center",
  },
  sub: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    margin: "0 0 2rem",
  },
  roleLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  roleRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginBottom: "1.5rem",
  },
  fieldWrapper: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    marginBottom: "6px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    width: "100%",
    background: "#0d1117",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "11px 40px 11px 14px",
    fontSize: "14px",
    color: "#fff",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.25)",
    fontSize: "16px",
    pointerEvents: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.25)",
    fontSize: "16px",
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
  forgot: {
    textAlign: "right",
    marginBottom: "1.25rem",
    marginTop: "-0.75rem",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#6c63ff",
    textDecoration: "none",
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    background: "#6c63ff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    marginTop: "0.5rem",
  },
};

function RoleButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(108,99,255,0.15)" : "#0d1117",
        border: active ? "0.5px solid #6c63ff" : "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px",
        color: active ? "#a99fff" : "rgba(255,255,255,0.4)",
        fontFamily: "inherit",
        fontSize: "13px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: "15px" }}>{icon}</span>
      {label}
    </button>
  );
}

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("professeur");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin({ email, role });
    }, 1000);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🎓</div>
          <span style={styles.logoText}>EduFlow</span>
        </div>

        <p style={styles.title}>Connexion</p>
        <p style={styles.sub}>Accédez à votre espace personnel</p>

        {/* Role selector */}
        <label style={styles.roleLabel}>Vous êtes</label>
        <div style={styles.roleRow}>
          <RoleButton
            label="Professeur"
            icon="✦"
            active={role === "professeur"}
            onClick={() => setRole("professeur")}
          />
          <RoleButton
            label="Étudiant"
            icon="◎"
            active={role === "etudiant"}
            onClick={() => setRole("etudiant")}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Adresse e-mail</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                placeholder="prenom.nom@eduflow.fr"
                required
                style={{
                  ...styles.input,
                  borderColor: emailFocus ? "#6c63ff" : "rgba(255,255,255,0.1)",
                }}
              />
              <span style={styles.inputIcon}>✉</span>
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                placeholder="••••••••"
                required
                style={{
                  ...styles.input,
                  borderColor: pwdFocus ? "#6c63ff" : "rgba(255,255,255,0.1)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={styles.forgot}>
            <span style={styles.forgotLink}>Mot de passe oublié ?</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: loading ? "#4a43b0" : "#6c63ff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Connexion en cours…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}