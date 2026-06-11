export default function GroupDetails() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <h1 className="text-5xl font-bold mb-8">
        Frontend - Groupe A
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* Infos Groupe */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Informations
          </h2>

          <p className="mb-3">
            👨‍🎓 Membres : 4
          </p>

          <p className="mb-6">
            📌 Sujet : Frontend
          </p>

          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">

            <div
              className="bg-gradient-to-r from-purple-500 to-purple-400 h-4 rounded-full"
              style={{ width: "80%" }}
            ></div>

          </div>

          <p className="text-green-400 font-semibold">
            80% terminé
          </p>

        </div>

        {/* Kanban */}
        <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-8">
            Avancement
          </h2>

          <div className="grid grid-cols-4 gap-4">

            <div>
              <h3 className="font-bold mb-4">
                À faire
              </h3>

              <div className="bg-[#0B1220] p-4 rounded-2xl">
                Tests
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-blue-400">
                En cours
              </h3>

              <div className="bg-[#0B1220] p-4 rounded-2xl">
                Frontend React
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-yellow-400">
                Révision
              </h3>

              <div className="bg-[#0B1220] p-4 rounded-2xl">
                Documentation
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-green-400">
                Terminé
              </h3>

              <div className="bg-[#0B1220] p-4 rounded-2xl">
                Cahier des charges
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Messages */}
      <div className="mt-10 bg-white/[0.03] border border-white/10 rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">
          Messages du groupe
        </h2>

        <div className="space-y-4 mb-8">

          <div className="bg-purple-500/20 p-4 rounded-2xl">
            <strong>Professeur :</strong>
            <br />
            Bonjour, où en êtes-vous ?
          </div>

          <div className="bg-blue-500/20 p-4 rounded-2xl">
            <strong>Groupe A :</strong>
            <br />
            Le frontend est terminé à 80%.
          </div>

        </div>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 bg-[#0B1220] border border-white/10 rounded-2xl p-4"
          />

          <button className="bg-gradient-to-r from-purple-500 to-purple-400 px-8 rounded-2xl">
            Envoyer
          </button>

        </div>

      </div>

    </div>
  );
}