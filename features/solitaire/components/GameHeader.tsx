interface GameHeaderProps {
    moves: number;
    onNewGame: () => void;
}

export default function GameHeader({ moves, onNewGame }: GameHeaderProps) {
    return (
        <header className="flex w-full items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Solitaire</h1>
                <p className="text-sm text-white/60">Klondike</p>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-white">Coups : {moves}</span>

                <button
                    type="button"
                    onClick={onNewGame}
                    className="rounded-lg bg-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/25"
                >
                    Nouvelle partie
                </button>
            </div>
        </header>
    );
}
