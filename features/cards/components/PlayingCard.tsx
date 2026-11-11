import type { Card } from "../types/card";
import type { CardAppearance } from "../types/cardTheme";

import { CARD_SIZES, CARD_THEMES } from "../styles/cards";

import CardBack from "./CardBack";

interface PlayingCardProps extends CardAppearance {
    card: Card;
    onClick?: () => void;
    onDoubleClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}

const SUIT_SYMBOLS = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
};

const RANK_LABELS: Record<number, string> = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K",
};

export default function PlayingCard({
    card,
    size = "md",
    theme = "classic",
    backTheme = "red",
    onClick,
    onDoubleClick,
    selected = false,
    disabled = false,
    className = "",
}: PlayingCardProps) {
    if (!card.faceUp) {
        return (
            <CardBack
                size={size}
                theme={backTheme}
                onClick={onClick}
                selected={selected}
                disabled={disabled}
                className={className}
            />
        );
    }

    const isRed = card.suit === "hearts" || card.suit === "diamonds";

    const rank = RANK_LABELS[card.rank] ?? card.rank;
    const suit = SUIT_SYMBOLS[card.suit];

    return (
        <button
            type="button"
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            disabled={disabled || !onClick}
            aria-label={`${rank} of ${card.suit}`}
            aria-pressed={selected}
            className={`
                relative flex aspect-[5/7] shrink-0
                flex-col justify-between rounded-lg
                border p-2 shadow-md transition-transform
                ${CARD_SIZES[size]}
                ${CARD_THEMES[theme]}
                ${isRed ? "text-red-600" : ""}
                ${selected ? "-translate-y-2 ring-2 ring-blue-500" : ""}
                ${disabled ? "cursor-not-allowed opacity-60" : ""}
                ${className}
            `}
        >
            <span className="self-start text-lg font-bold leading-none">
                {rank}
            </span>

            <span className="self-center text-3xl">{suit}</span>

            <span className="rotate-180 self-end text-lg font-bold leading-none">
                {rank}
            </span>
        </button>
    );
}
