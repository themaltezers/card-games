"use client";

import { useMemoryStore } from "../stores/useMemoryStore";

import type { MemoryMode, PlayerId } from "../types/memory";

const DIFFICULTIES = [
    { label: "Facile", pairs: 8 },
    { label: "Moyen", pairs: 18 },
    { label: "Difficile", pairs: 32 },
];

export default function GameHeader() {
    const moves = useMemoryStore((state) => state.moves);
    const matches = useMemoryStore((state) => state.matches);
    const status = useMemoryStore((state) => state.status);
    const cards = useMemoryStore((state) => state.cards);
    const newGame = useMemoryStore((state) => state.newGame);

    const gameMode = useMemoryStore((state) => state.gameMode);
    const setGameMode = useMemoryStore((state) => state.setGameMode);
    const currentPlayer = useMemoryStore((state) => state.currentPlayer);
    const scores = useMemoryStore((state) => state.scores);
    const winner = useMemoryStore((state) => state.winner);

    const pairCount = cards.length / 2;

    const winnerLabel =
        winner === "draw"
            ? "Match nul !"
            : winner === "player1"
              ? "Le joueur 1 gagne !"
              : "Le joueur 2 gagne !";

    return (
        <header className="flex w-full flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Memory
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Retrouve toutes les paires de cartes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => newGame(pairCount)}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                    Nouvelle partie
                </button>
            </div>

            {/* Sélecteur de mode */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Mode de jeu
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                    <ModeButton
                        label="Solo"
                        active={gameMode === "solo"}
                        onClick={() => setGameMode("solo")}
                    />

                    <ModeButton
                        label="1 contre 1"
                        active={gameMode === "1v1"}
                        onClick={() => setGameMode("1v1")}
                    />
                </div>
            </div>

            {/* Scores du 1v1 */}
            {gameMode === "1v1" && (
                <div className="grid grid-cols-2 gap-3">
                    <PlayerScore
                        player="player1"
                        score={scores.player1}
                        active={currentPlayer === "player1" && status !== "won"}
                    />

                    <PlayerScore
                        player="player2"
                        score={scores.player2}
                        active={currentPlayer === "player2" && status !== "won"}
                    />
                </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Coups" value={moves} />

                <Stat
                    label="Paires trouvées"
                    value={`${matches} / ${pairCount}`}
                />

                <div className="col-span-2 rounded-xl border p-3 sm:col-span-1">
                    <p className="text-xs text-gray-500">Difficulté</p>

                    <div className="mt-2 flex flex-wrap gap-1">
                        {DIFFICULTIES.map((difficulty) => (
                            <button
                                key={difficulty.pairs}
                                type="button"
                                onClick={() => newGame(difficulty.pairs)}
                                aria-pressed={pairCount === difficulty.pairs}
                                className={`
                                    rounded-md px-2 py-1 text-xs font-medium
                                    transition
                                    ${
                                        pairCount === difficulty.pairs
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                `}
                            >
                                {difficulty.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tour actuel */}
            {gameMode === "1v1" && status === "playing" && (
                <div className="rounded-xl border p-3 text-center">
                    <p className="text-sm text-gray-500">Au tour de</p>
                    <p
                        className={`mt-1 font-bold ${
                            currentPlayer === "player1"
                                ? "text-blue-600"
                                : "text-red-600"
                        }`}
                    >
                        Joueur {currentPlayer === "player1" ? "1" : "2"}
                    </p>
                </div>
            )}

            {/* Fin de partie */}
            {status === "won" && (
                <div
                    role="status"
                    className="rounded-xl border border-green-300 bg-green-50 p-4 text-center text-green-900"
                >
                    <p className="text-xl font-bold">
                        {gameMode === "solo"
                            ? "Bravo, tu as gagné !"
                            : winnerLabel}
                    </p>

                    <p className="mt-1 text-sm">
                        {gameMode === "solo"
                            ? `Toutes les paires trouvées en ${moves} coups.`
                            : `Score final : ${scores.player1} - ${scores.player2}`}
                    </p>

                    <button
                        type="button"
                        onClick={() => newGame(pairCount)}
                        className="mt-3 rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Rejouer
                    </button>
                </div>
            )}
        </header>
    );
}

function ModeButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`
                rounded-lg px-4 py-2.5 text-sm font-semibold transition
                ${
                    active
                        ? "bg-white text-gray-950 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                }
            `}
        >
            {label}
        </button>
    );
}

function PlayerScore({
    player,
    score,
    active,
}: {
    player: PlayerId;
    score: number;
    active: boolean;
}) {
    const isPlayer1 = player === "player1";

    return (
        <div
            className={`
                rounded-xl border-2 p-3 transition
                ${isPlayer1 ? "border-blue-500" : "border-red-500"}
                ${active ? "bg-gray-50 shadow-sm" : "opacity-70"}
            `}
        >
            <div className="flex items-center justify-between gap-2">
                <p
                    className={`text-sm font-semibold ${
                        isPlayer1 ? "text-blue-600" : "text-red-600"
                    }`}
                >
                    Joueur {isPlayer1 ? "1" : "2"}
                </p>

                {active && (
                    <span className="text-xs text-gray-500">À jouer</span>
                )}
            </div>

            <p className="mt-1 text-2xl font-bold tabular-nums">
                {score}
                <span className="ml-1 text-xs font-normal text-gray-500">
                    paire(s)
                </span>
            </p>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
        </div>
    );
}
