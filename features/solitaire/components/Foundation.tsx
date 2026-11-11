import type { Card, Suit } from "@/features/cards/types/card";
import PlayingCard from "@/features/cards/components/PlayingCard";
import CardSlot from "@/features/cards/components/CardSlot";

interface FoundationProps {
    suit: Suit;
    cards: Card[];
    onClick: () => void;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
};

export default function Foundation({ suit, cards, onClick }: FoundationProps) {
    const topCard = cards[cards.length - 1];

    return (
        <div>
            {topCard ? (
                <PlayingCard card={topCard} onClick={onClick} />
            ) : (
                <CardSlot label={`Fondation ${suit}`} onClick={onClick}>
                    <span
                        className={`text-3xl ${
                            suit === "hearts" || suit === "diamonds"
                                ? "text-red-500/50"
                                : "text-white/50"
                        }`}
                    >
                        {SUIT_SYMBOLS[suit]}
                    </span>
                </CardSlot>
            )}
        </div>
    );
}
