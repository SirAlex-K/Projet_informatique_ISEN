export default function GroupDetails() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">

        <div>
          <h1 className="text-5xl font-bold mb-2">
            Frontend React - Groupe A
          </h1>

          <p className="text-gray-400 text-xl">
            Projet EduFlow
          </p>
        </div>

        <div className="bg-purple-500/20 text-purple-300 px-6 py-3 rounded-2xl font-semibold">
          4 membres
        </div>

      </div>

      {/* Progression */}
      <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Progression du groupe
        </h2>

        <div className="w-full bg-gray-700 rounded-full h-5">

          <div
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-5 rounded-full"
            style={{ width: "80%" }}
          ></div>

        </div>

        <p className="mt-4 text-green-400 text-2xl font-semibold">
          80% terminé
        </p>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4 mt-8">

          <div className="bg-[#020817] border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400">À faire</p>
            <h3 className="text-3xl font-bold">1</h3>
          </div>

          <div className="bg-[#020817] border border-white/10 rounded-2xl p-5">
            <p className="text-blue-400">En cours</p>
            <h3 className="text-3xl font-bold">1</h3>
          </div>

          <div className="bg-[#020817] border border-white/10 rounded-2xl p-5">
            <p className="text-yellow-400">Révision</p>
            <h3 className="text-3xl font-bold">1</h3>
          </div>

          <div className="bg-[#020817] border border-white/10 rounded-2xl p-5">
            <p className="text-green-400">Terminées</p>
            <h3 className="text-3xl font-bold">4</h3>
          </div>

        </div>

      </div>

      {/* Kanban */}
      <div className="grid grid-cols-4 gap-6 mb-32">

        {/* À faire */}
        <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-5">

          <h2 className="text-xl font-bold mb-5">
            À faire
          </h2>

          <div className="space-y-3">

            <div className="bg-[#020817] border border-white/10 rounded-xl p-4">
              Documentation API
            </div>

          </div>

        </div>

        {/* En cours */}
        <div className="bg-[#0B1220] border border-blue-500/20 rounded-3xl p-5">

          <h2 className="text-xl font-bold text-blue-400 mb-5">
            En cours
          </h2>

          <div className="space-y-3">

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              Frontend React
            </div>

          </div>

        </div>

        {/* Révision */}
        <div className="bg-[#0B1220] border border-yellow-500/20 rounded-3xl p-5">

          <h2 className="text-xl font-bold text-yellow-400 mb-5">
            En révision
          </h2>

          <div className="space-y-3">

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              Design UI
            </div>

          </div>

        </div>

        {/* Terminé */}
        <div className="bg-[#0B1220] border border-green-500/20 rounded-3xl p-5">

          <h2 className="text-xl font-bold text-green-400 mb-5">
            Terminé
          </h2>

          <div className="space-y-3">

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              Cahier des charges
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              Analyse fonctionnelle
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              Architecture
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              Wireframes
            </div>

          </div>

        </div>

      </div>

      {/* Séparateur */}
      <div className="border-t border-white/10 mb-16"></div>

      {/* Conversation */}
      <div className="bg-gradient-to-br from-[#0B1220] to-[#111827] border border-white/10 rounded-[32px] p-10 shadow-xl">

        <h2 className="text-3xl font-bold mb-8">
          Conversation Professeur ↔ Groupe
        </h2>

        <div className="space-y-6 mb-10">

          <div className="bg-purple-500/20 rounded-2xl p-5 w-fit max-w-[70%]">
            Bonjour Groupe A, où en êtes-vous ?
          </div>

          <div className="bg-blue-500/20 rounded-2xl p-5 ml-auto w-fit max-w-[70%]">
            Le frontend est terminé à 80%.
          </div>

          <div className="bg-purple-500/20 rounded-2xl p-5 w-fit max-w-[70%]">
            Très bien, continuez ainsi.
          </div>

        </div>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 bg-[#020817] border border-white/10 rounded-2xl p-4"
          />

          <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 rounded-2xl font-semibold">
            Envoyer
          </button>

        </div>

      </div>

    </div>
  );
}