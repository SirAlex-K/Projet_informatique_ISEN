import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center">
      <div className="bg-[#0B1220] p-10 rounded-3xl border border-white/10 w-[450px]">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          EduFlow
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Connexion à la plateforme
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl bg-[#020817] border border-white/10 text-white mb-4"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-4 rounded-xl bg-[#020817] border border-white/10 text-white mb-6"
        />

        <button
          onClick={() => navigate("/professor")}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-xl font-semibold"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}