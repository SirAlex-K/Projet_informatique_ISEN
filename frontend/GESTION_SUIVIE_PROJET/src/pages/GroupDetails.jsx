export default function GroupDetails() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">

      <h1 className="text-5xl font-bold mb-4">
        Frontend React - Groupe E
      </h1>

      <div className="mb-10">
        <p className="mb-2">Progression</p>

        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>

        <p className="mt-2">75%</p>
      </div>

      <div className="grid grid-cols-5 gap-6">

        <div>
          <h2 className="text-xl font-bold mb-4">
            À faire
          </h2>

          <div className="bg-white/[0.03] rounded-2xl p-4">
            Documentation
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            En cours
          </h2>

          <div className="bg-blue-500/20 rounded-2xl p-4">
            Frontend React
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            En révision
          </h2>

          <div className="bg-yellow-500/20 rounded-2xl p-4">
            Base de données
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Terminé
          </h2>

          <div className="bg-green-500/20 rounded-2xl p-4">
            Cahier des charges
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4">

          <h2 className="text-xl font-bold mb-4">
            Messages
          </h2>

          <div className="space-y-4 mb-6">

            <div className="bg-purple-500/10 rounded-xl p-3">
              <strong>Prof :</strong>
              <br />
              Bonjour, où en êtes-vous ?
            </div>

            <div className="bg-blue-500/10 rounded-xl p-3">
              <strong>Groupe :</strong>
              <br />
              Le frontend est terminé à 75%.
            </div>

          </div>

          <input
            type="text"
            placeholder="Écrire un message..."
            className="w-full bg-[#0B1220] border border-white/10 rounded-xl p-3 mb-3"
          />

          <button className="w-full bg-purple-500 rounded-xl p-3">
            Envoyer
          </button>

        </div>

      </div>
    </div>
  );
}