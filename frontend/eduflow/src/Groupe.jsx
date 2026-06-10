import { useState } from "react";
import {
  GraduationCap,
  Users,
  UserPlus,
  Check,
  CheckCircle,
  ArrowRight,
  Lock,
  Sparkles,
  BookOpen,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Utilisateur courant ─────────────────────────────────────────────
const CURRENT_USER = { name: "Aziz Diop", initial: "A", color: "bg-blue-500" };

// ─── Groupes (données initiales) ─────────────────────────────────────
const INITIAL_GROUPS = [
  {
    id: 1,
    name: "Groupe 1",
    capacity: 4,
    subjectId: 3, // a déjà choisi un sujet
    members: [
      { name: "Léa Martin", initial: "L", color: "bg-purple-500" },
      { name: "Tom Bernard", initial: "T", color: "bg-green-500" },
    ],
  },
  {
    id: 2,
    name: "Groupe 2",
    capacity: 4,
    subjectId: null,
    members: [{ name: "Camille Roy", initial: "C", color: "bg-orange-500" }],
  },
  { id: 3, name: "Groupe 3", capacity: 4, subjectId: null, members: [] },
  {
    id: 4,
    name: "Groupe 4",
    capacity: 4,
    subjectId: 5, // a déjà choisi un sujet
    members: [
      { name: "Hugo Lefevre", initial: "H", color: "bg-pink-500" },
      { name: "Sarah Benali", initial: "S", color: "bg-cyan-500" },
      { name: "Marc Petit", initial: "M", color: "bg-yellow-500" },
      { name: "Inès Faure", initial: "I", color: "bg-red-500" },
    ],
  },
  {
    id: 5,
    name: "Groupe 5",
    capacity: 4,
    subjectId: null,
    members: [{ name: "Lucas Girard", initial: "L", color: "bg-indigo-500" }],
  },
  { id: 6, name: "Groupe 6", capacity: 4, subjectId: null, members: [] },
];

// ─── Sujets proposés ─────────────────────────────────────────────────
const SUBJECTS = [
  {
    id: 1,
    title: "Plateforme de gestion de projet",
    desc: "Une application collaborative avec kanban, livrables et suivi de notes pour les groupes étudiants.",
    difficulty: "Intermédiaire",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 2,
    title: "Application mobile de covoiturage",
    desc: "Un service de covoiturage entre étudiants du campus avec géolocalisation et messagerie.",
    difficulty: "Avancé",
    tags: ["React Native", "Firebase", "Maps API"],
  },
  {
    id: 3,
    title: "Site e-commerce éco-responsable",
    desc: "Une boutique en ligne mettant en avant des produits durables, avec panier et paiement.",
    difficulty: "Intermédiaire",
    tags: ["Next.js", "Stripe", "Tailwind"],
  },
  {
    id: 4,
    title: "Tableau de bord IoT temps réel",
    desc: "Visualisation en direct de capteurs connectés avec graphiques et alertes configurables.",
    difficulty: "Avancé",
    tags: ["Vue", "MQTT", "InfluxDB"],
  },
  {
    id: 5,
    title: "Réseau social de partage de notes",
    desc: "Une plateforme pour partager, noter et commenter des fiches de révision entre étudiants.",
    difficulty: "Débutant",
    tags: ["React", "Express", "MongoDB"],
  },
  {
    id: 6,
    title: "Générateur de quiz par IA",
    desc: "Un outil qui crée automatiquement des quiz à partir d'un cours grâce à un modèle de langage.",
    difficulty: "Intermédiaire",
    tags: ["Python", "React", "OpenAI API"],
  },
];

const DIFFICULTY_STYLES = {
  "Débutant": "bg-green-500/10 text-green-400 border-green-500/20",
  "Intermédiaire": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Avancé": "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

// ─── Avatar simple ───────────────────────────────────────────────────
function MemberAvatar({ member, ring = "ring-[#020817]" }) {
  return (
    <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ${ring}`}>
      {member.initial}
    </div>
  );
}

// ─── Indicateur d'étapes ─────────────────────────────────────────────
function StepIndicator({ step }) {
  // step : 1 = choix du groupe, 2 = choix du sujet, 3 = terminé
  const steps = [
    { n: 1, label: "Choisir un groupe" },
    { n: 2, label: "Choisir un sujet" },
  ];
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                done
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : active
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-white/[0.03] border-white/10 text-gray-600"
              }`}>
                {done ? <Check size={14} strokeWidth={3} /> : s.n}
              </div>
              <span className={`text-sm font-medium ${active || done ? "text-white" : "text-gray-600"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${step > s.n ? "bg-green-500/40" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Groupe() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [myGroupId, setMyGroupId] = useState(null);

  const myGroup = groups.find((g) => g.id === myGroupId) || null;
  const mySubjectId = myGroup?.subjectId ?? null;
  const mySubject = SUBJECTS.find((s) => s.id === mySubjectId) || null;
  const step = myGroupId === null ? 1 : mySubjectId ? 3 : 2;

  // Quel groupe (autre que le mien) a déjà pris ce sujet ?
  const takenBy = (subjectId) =>
    groups.find((g) => g.subjectId === subjectId && g.id !== myGroupId) || null;

  // ─── Actions ───────────────────────────────────────────────────
  const joinGroup = (groupId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: [...g.members, { ...CURRENT_USER, isMe: true }] }
          : g
      )
    );
    setMyGroupId(groupId);
  };

  const leaveGroup = () => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === myGroupId
          ? { ...g, members: g.members.filter((m) => !m.isMe) }
          : g
      )
    );
    setMyGroupId(null);
  };

  const chooseSubject = (subjectId) => {
    if (takenBy(subjectId)) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === myGroupId ? { ...g, subjectId } : g))
    );
  };

  const resetSubject = () => {
    setGroups((prev) =>
      prev.map((g) => (g.id === myGroupId ? { ...g, subjectId: null } : g))
    );
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex flex-col">
      {/* En-tête */}
      <header className="border-b border-white/[0.06] px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ProjectHub</h1>
            <p className="text-gray-500 text-xs">Espace étudiant · Formation des groupes</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/[0.08] rounded-xl px-4 py-2 transition-all duration-200"
        >
          <LogOut size={15} />
          Déconnexion
        </Link>
      </header>

      {/* Contenu centré */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Intro */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Bienvenue, Aziz 👋</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Avant d'accéder à votre projet, rejoignez un groupe puis choisissez le sujet sur lequel vous travaillerez.
            </p>
          </div>

          {/* Étapes */}
          <div className="flex justify-center mb-10">
            <StepIndicator step={step} />
          </div>

          {/* ── ÉTAPE 1 : choix du groupe ────────────────────────── */}
          {myGroupId === null && (
            <>
              <div className="mb-6 text-center">
                <h3 className="text-lg font-bold mb-1">Choisis ton groupe</h3>
                <p className="text-gray-500 text-sm">Rejoins l'un des groupes disponibles (4 membres maximum).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {groups.map((g) => {
                  const isFull = g.members.length >= g.capacity;
                  const groupSubject = SUBJECTS.find((s) => s.id === g.subjectId);
                  const emptySlots = g.capacity - g.members.length;
                  return (
                    <div
                      key={g.id}
                      className={`bg-white/[0.02] border rounded-2xl p-5 transition-all duration-200 ${
                        isFull ? "border-white/[0.06] opacity-70" : "border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                            <Users size={16} className="text-blue-300" />
                          </div>
                          <h3 className="text-base font-bold">{g.name}</h3>
                        </div>
                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 border ${
                          isFull
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-white/[0.05] text-gray-400 border-white/10"
                        }`}>
                          {g.members.length}/{g.capacity}
                        </span>
                      </div>

                      {/* Membres */}
                      <div className="flex items-center -space-x-2 mb-4 h-8">
                        {g.members.map((m, i) => (
                          <MemberAvatar key={i} member={m} />
                        ))}
                        {Array.from({ length: emptySlots }).map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="w-8 h-8 rounded-full border-2 border-dashed border-white/15 ring-2 ring-[#020817]"
                          />
                        ))}
                        {g.members.length === 0 && (
                          <span className="ml-3 text-gray-600 text-xs italic">Aucun membre</span>
                        )}
                      </div>

                      {/* Sujet déjà pris ? */}
                      {groupSubject ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                          <BookOpen size={12} className="flex-shrink-0" />
                          <span className="truncate">Sujet : {groupSubject.title}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
                          <BookOpen size={12} className="flex-shrink-0" />
                          <span>Sujet non choisi</span>
                        </div>
                      )}

                      {/* Bouton rejoindre */}
                      <button
                        onClick={() => !isFull && joinGroup(g.id)}
                        disabled={isFull}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                          isFull
                            ? "bg-white/[0.03] text-gray-600 border border-white/[0.06] cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        }`}
                      >
                        {isFull ? (
                          <>
                            <Lock size={14} /> Complet
                          </>
                        ) : (
                          <>
                            <UserPlus size={15} /> Rejoindre
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── ÉTAPE 2 / 3 : dans un groupe ─────────────────────── */}
          {myGroup && (
            <>
              {/* Bandeau "tu es dans le groupe" */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tu fais partie du</p>
                    <p className="text-base font-bold">{myGroup.name}</p>
                  </div>
                  <div className="flex items-center -space-x-2 ml-2">
                    {myGroup.members.map((m, i) => (
                      <MemberAvatar key={i} member={m} ring="ring-[#0a1020]" />
                    ))}
                  </div>
                </div>
                <button
                  onClick={leaveGroup}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/[0.08] rounded-xl px-4 py-2 transition-all duration-200"
                >
                  <LogOut size={14} />
                  Quitter le groupe
                </button>
              </div>

              {/* Sujet choisi → récapitulatif */}
              {mySubject ? (
                <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-green-500/20">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1">Sujet validé</p>
                        <h3 className="text-lg font-bold">{mySubject.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xl leading-relaxed">{mySubject.desc}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className={`text-xs font-medium rounded-full px-2.5 py-1 border ${DIFFICULTY_STYLES[mySubject.difficulty]}`}>
                            {mySubject.difficulty}
                          </span>
                          {mySubject.tags.map((t) => (
                            <span key={t} className="text-xs text-gray-400 bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-1">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={resetSubject}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 border border-white/[0.08] hover:border-blue-500/30 hover:bg-blue-500/[0.08] rounded-xl px-4 py-2 transition-all duration-200 flex-shrink-0"
                    >
                      <RefreshCw size={14} />
                      Changer de sujet
                    </button>
                  </div>

                  {/* Entrer dans le projet */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-end">
                    <Link
                      to="/etudiant"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-200 shadow-lg shadow-blue-500/20"
                    >
                      Entrer dans le projet
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Choix du sujet */
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-1">Choisissez votre sujet</h3>
                    <p className="text-gray-500 text-sm">Un sujet ne peut être choisi que par un seul groupe.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SUBJECTS.map((s) => {
                      const owner = takenBy(s.id);
                      const taken = Boolean(owner);
                      return (
                        <div
                          key={s.id}
                          className={`bg-white/[0.02] border rounded-2xl p-5 flex flex-col transition-all duration-200 ${
                            taken
                              ? "border-white/[0.06] opacity-60"
                              : "border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-base font-bold leading-snug">{s.title}</h3>
                            <span className={`text-xs font-medium rounded-full px-2.5 py-1 border flex-shrink-0 ${DIFFICULTY_STYLES[s.difficulty]}`}>
                              {s.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>

                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {s.tags.map((t) => (
                              <span key={t} className="text-xs text-gray-400 bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-1">
                                {t}
                              </span>
                            ))}
                          </div>

                          <button
                            onClick={() => !taken && chooseSubject(s.id)}
                            disabled={taken}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                              taken
                                ? "bg-white/[0.03] text-gray-600 border border-white/[0.06] cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            }`}
                          >
                            {taken ? (
                              <>
                                <Lock size={14} /> Pris par {owner.name}
                              </>
                            ) : (
                              <>
                                Choisir ce sujet <ArrowRight size={15} />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}