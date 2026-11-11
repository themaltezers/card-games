import type { Card, CardRank } from "../types/card";
import { SUITS } from "../types/card";

export function createDeck(): Card[] {
    const deck: Card[] = [];

    for (const suit of SUITS) {
        for (let rank = 1; rank <= 13; rank++) {
            deck.push({
                id: `${suit}-${rank}`,
                suit,
                rank: rank as CardRank,
                faceUp: false,
            });
        }
    }

    return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}
