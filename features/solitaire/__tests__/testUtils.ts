import type { Card, CardRank, Suit } from "@/features/cards/types/card";

export function createCard(suit: Suit, rank: CardRank, faceUp = true): Card {
    return {
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp,
    };
}
