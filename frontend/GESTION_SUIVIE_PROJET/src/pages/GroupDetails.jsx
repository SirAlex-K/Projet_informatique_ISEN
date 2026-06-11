export default function GroupDetails() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-3xl p-8 mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Frontend React - Groupe A
        </h1>

        <p className="text-gray-400 text-xl mb-6">
          Projet EduFlow
        </p>

        <div className="flex flex-wrap gap-4">

          <div className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-2xl">
            👥 4 membres
          </div>

          <div className="bg-green-500/20 text-green-300 px-5 py-3 rounded-2xl">
            🚀 80% terminé
          </div>

          <div className="bg-blue-500/20 text-blue-300 px-5 py-3 rounded-2xl">
            📌 Frontend
          </div>

        </div>

      </div>

      {/* Progression */}
      <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-10">

        <div className="flex justify-between mb-5">
          <h2 className="text-3xl font-bold">
            Progression du groupe
          </h2>

          <span className="text-green-400 text-2xl font-bold">
            80%
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-5">

          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-5 rounded-full"
            style={{ width: "80%" }}
          ></div>

        </div>

      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-6 shadow-lg">
          <p className="text-gray-400">À faire</p>
          <h3 className="text-4xl font-bold mt-2">1</h3>
        </div>

        <div className="bg-[#0B1220] border border-blue-500/20 rounded-3xl p-6 shadow-lg">
          <p className="text-blue-400">En cours</p>
          <h3 className="text-4xl font-bold mt-2">1</h3>
        </div>

        <div className="bg-[#0B1220] border border-yellow-500/20 rounded-3xl p-6 shadow-lg">
          <p className="text-yellow-400">Révision</p>
          <h3 className="text-4xl font-bold mt-2">1</h3>
        </div>

        <div className="bg-[#0B1220] border border-green-500/20 rounded-3xl p-6 shadow-lg">
          <p className="text-green-400">Terminées</p>
          <h3 className="text-4xl font-bold mt-2">4</h3>
        </div>

      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-5 min-h-[300px]">
          <h2 className="font-bold text-xl mb-5">
            À faire
          </h2>

          <div className="bg-gradient-to-r from-[#111827] to-[#1e293b] border border-white/10 rounded-2xl p-4">
            Documentation API
          </div>
        </div>

        <div className="bg-[#0B1220] border border-blue-500/20 rounded-3xl p-5 min-h-[300px]">
          <h2 className="font-bold text-xl text-blue-400 mb-5">
            En cours
          </h2>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            Frontend React
          </div>
        </div>

        <div className="bg-[#0B1220] border border-yellow-500/20 rounded-3xl p-5 min-h-[300px]">
          <h2 className="font-bold text-xl text-yellow-400 mb-5">
            Révision
          </h2>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
            Design UI
          </div>
        </div>

        <div className="bg-[#0B1220] border border-green-500/20 rounded-3xl p-5 min-h-[300px]">
          <h2 className="font-bold text-xl text-green-400 mb-5">
            Terminé
          </h2>

          <div className="space-y-3">

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              Cahier des charges
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              Analyse fonctionnelle
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              Architecture
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              Wireframes
            </div>

          </div>
        </div>

      </div>

      {/* Membres */}
      <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-12">

        <h2 className="text-3xl font-bold mb-6">
          Membres du groupe
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-[#020817] p-5 rounded-2xl border border-white/10">
            👤 Alice Martin
          </div>

          <div className="bg-[#020817] p-5 rounded-2xl border border-white/10">
            👤 Bob Durand
          </div>

          <div className="bg-[#020817] p-5 rounded-2xl border border-white/10">
            👤 Claire Moreau
          </div>

          <div className="bg-[#020817] p-5 rounded-2xl border border-white/10">
            👤 David Petit
          </div>

        </div>

      </div>

      {/* Conversation */}
      <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-white/10 rounded-[32px] p-10">

        <h2 className="text-3xl font-bold mb-8">
          Conversation Professeur ↔ Groupe
        </h2>

        <div className="space-y-6 mb-8">

          <div className="max-w-[70%] bg-purple-500/20 rounded-3xl px-6 py-4">
            Bonjour Groupe A, où en êtes-vous ?
          </div>

          <div className="max-w-[70%] ml-auto bg-blue-500/20 rounded-3xl px-6 py-4">
            Le frontend est terminé à 80%.
          </div>

          <div className="max-w-[70%] bg-purple-500/20 rounded-3xl px-6 py-4">
            Très bien. Continuez ainsi.
          </div>

        </div>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 bg-[#020817] border border-white/10 rounded-2xl p-4 outline-none"
          />

          <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 rounded-2xl font-semibold">
            Envoyer
          </button>

        </div>

      </div>

    </div>
  );
}