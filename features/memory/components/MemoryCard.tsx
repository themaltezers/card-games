"use client";

import type { MemoryCard as MemoryCardType } from "../types/memory";

interface MemoryCardProps {
    card: MemoryCardType;
    disabled?: boolean;
    onClick: (cardId: string) => void;
}

const SUIT_SYMBOLS = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
} as const;

const RANK_LABELS: Record<number, string> = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K",
};

export default function MemoryCard({
    card,
    disabled = false,
    onClick,
}: MemoryCardProps) {
    const isVisible = card.faceUp || card.matched;
    const isRed = card.suit === "hearts" || card.suit === "diamonds";

    const rank = RANK_LABELS[card.rank] ?? card.rank;

    const matchedColor =
        card.matchedBy === "player1"
            ? "border-blue-700 bg-blue-600 text-white"
            : card.matchedBy === "player2"
              ? "border-red-700 bg-red-600 text-white"
              : "border-black/10 bg-white";

    return (
        <button
            type="button"
            onClick={() => onClick(card.id)}
            disabled={disabled || isVisible}
            aria-label={
                isVisible
                    ? `${rank} ${card.suit}${card.matched ? ", paire trouvée" : ""}`
                    : "Carte cachée"
            }
            aria-pressed={isVisible}
            className="
                group relative aspect-[5/7] w-full
                [perspective:1000px]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                focus-visible:ring-offset-4
                disabled:cursor-default
            "
        >
            <span
                className={`
                    absolute inset-0 block
                    transition-transform duration-500
                    [transform-style:preserve-3d]
                    ${isVisible ? "[transform:rotateY(180deg)]" : ""}
                `}
            >
                {/* Dos */}
                <span
                    aria-hidden="true"
                    className="
                        absolute inset-0 flex items-center justify-center
                        overflow-hidden rounded-xl border-2 border-white/30
                        bg-gradient-to-br from-blue-700 to-blue-950
                        shadow-lg
                        [backface-visibility:hidden]
                    "
                >
                    <span className="absolute inset-2 rounded-lg border border-white/30" />
                    <span className="text-3xl font-bold text-white/70">✦</span>
                </span>

                {/* Face */}
                <span
                    aria-hidden="true"
                    className={`
                        absolute inset-0 flex flex-col justify-between
                        rounded-xl border p-2 shadow-lg
                        [backface-visibility:hidden]
                        [transform:rotateY(180deg)]
                        ${
                            card.matched
                                ? matchedColor
                                : `border-black/10 bg-white ${
                                      isRed ? "text-red-600" : "text-gray-950"
                                  }`
                        }
                        ${
                            card.matched && !card.matchedBy
                                ? "ring-2 ring-green-500"
                                : ""
                        }
                    `}
                >
                    <span className="flex flex-col items-start text-sm font-bold leading-none">
                        <span>{rank}</span>
                        <span>{SUIT_SYMBOLS[card.suit]}</span>
                    </span>

                    <span className="text-center text-3xl">
                        {SUIT_SYMBOLS[card.suit]}
                    </span>

                    <span className="flex rotate-180 flex-col items-start text-sm font-bold leading-none">
                        <span>{rank}</span>
                        <span>{SUIT_SYMBOLS[card.suit]}</span>
                    </span>
                </span>
            </span>
        </button>
    );
}
