export default function GroupDetails() {
return ( <div className="min-h-screen bg-[#020817] text-white p-10">

  <div className="flex justify-between items-center mb-10">

    <div>
      <h1 className="text-5xl font-bold mb-3">
        Frontend React - Groupe A
      </h1>

      <p className="text-gray-400 text-xl">
        Projet EduFlow
      </p>
    </div>

    <div className="bg-purple-500/20 px-6 py-3 rounded-2xl">
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

  </div>

  {/* Kanban */}
  <div className="grid grid-cols-4 gap-6 mb-10">

    <div>
      <h2 className="text-xl font-bold mb-4">
        À faire
      </h2>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5">
        Documentation API
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold text-blue-400 mb-4">
        En cours
      </h2>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5">
        Frontend React
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold text-yellow-400 mb-4">
        En révision
      </h2>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5">
        Design UI
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold text-green-400 mb-4">
        Terminé
      </h2>

      <div className="bg-[#0B1220] border border-white/10 rounded-2xl p-5">
        Cahier des charges
      </div>
    </div>

  </div>

  {/* Chat */}
  <div className="bg-[#0B1220] border border-white/10 rounded-3xl p-8">

    <h2 className="text-3xl font-bold mb-8">
      Conversation Professeur ↔ Groupe
    </h2>

    <div className="space-y-6 mb-8">

      <div className="bg-purple-500/20 rounded-2xl p-5 w-fit max-w-[70%]">
        Bonjour Groupe A, où en êtes-vous ?
      </div>

      <div className="bg-blue-500/20 rounded-2xl p-5 ml-auto w-fit max-w-[70%]">
        Le frontend est terminé à 80%.
      </div>

      <div className="bg-purple-500/20 rounded-2xl p-5 w-fit max-w-[70%]">
        Très bien. Continuez ainsi.
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
