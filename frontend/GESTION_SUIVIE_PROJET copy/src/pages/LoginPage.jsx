import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Temporaire pour la démo
    navigate("/professor");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-[400px] bg-[#161616] rounded-2xl p-8 shadow-2xl border border-white/5">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            🎓
          </div>
          <h1 className="text-white text-3xl font-bold">
            EduFlow
          </h1>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-bold">
            Connexion
          </h2>

          <p className="text-gray-400 mt-2">
            Accédez à votre espace personnel
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-400 text-sm mb-2">
            ADRESSE E-MAIL
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom.nom@junia.com"
            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Mot de passe */}
        <div className="mb-3">
          <label className="block text-gray-400 text-sm mb-2">
            MOT DE PASSE
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Mot de passe oublié */}
        <div className="text-right mb-6">
          <button className="text-indigo-500 text-sm hover:text-indigo-400">
            Mot de passe oublié ?
          </button>
        </div>

        {/* Bouton */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}