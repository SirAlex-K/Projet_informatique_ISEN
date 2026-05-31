import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin')           navigate('/admin');
      else if (user.role === 'supervisor') navigate('/supervisor');
      else if (user.role === 'student')    navigate('/student');
      else navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "#161b27", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "2.5rem 2rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ width: "38px", height: "38px", background: "#6c63ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-school" style={{ color: "#fff", fontSize: "20px" }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#fff", letterSpacing: "-0.3px" }}>EduFlow</span>
        </div>

        <p style={{ fontSize: "22px", fontWeight: 600, color: "#fff", margin: "0 0 4px", textAlign: "center" }}>Connexion</p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 0 2rem" }}>Accédez à votre espace personnel</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.4)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1.25rem", fontSize: "13px", color: "#ef4444", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.4)", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Adresse e-mail</label>
          <div style={{ position: "relative" }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} onKeyDown={handleKeyDown} placeholder="prenom.nom@junia.com"
              style={{ width: "100%", boxSizing: "border-box", background: "#0d1117", border: `0.5px solid ${emailFocus ? "#6c63ff" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "11px 40px 11px 14px", fontSize: "14px", color: "#fff", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }} />
            <i className="ti ti-mail" aria-hidden="true" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", fontSize: "16px", pointerEvents: "none" }} />
          </div>
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.4)", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Mot de passe</label>
          <div style={{ position: "relative" }}>
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} onKeyDown={handleKeyDown} placeholder="••••••••"
              style={{ width: "100%", boxSizing: "border-box", background: "#0d1117", border: `0.5px solid ${pwdFocus ? "#6c63ff" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "11px 40px 11px 14px", fontSize: "14px", color: "#fff", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }} />
            <button onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer" : "Afficher"} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex", alignItems: "center" }}>
              <i className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`} style={{ fontSize: "16px" }} />
            </button>
          </div>
        </div>

        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "12px", color: "#6c63ff", cursor: "pointer" }}>Mot de passe oublié ?</span>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: loading ? "#4a43b0" : "#6c63ff", border: "none", borderRadius: "10px", padding: "13px", color: "#fff", fontFamily: "inherit", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
          {loading ? "Connexion en cours…" : "Se connecter"}
        </button>
      </div>
    </div>
  );
}
