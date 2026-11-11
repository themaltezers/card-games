import { SUITS } from "@/features/cards/types/card";
import type { CardRank } from "@/features/cards/types/card";
import type { MemoryCard } from "../types/memory";

export function createGame(pairCount = 8): MemoryCard[] {
    if (!Number.isInteger(pairCount) || pairCount < 1 || pairCount > 52) {
        throw new RangeError("pairCount must be an integer between 1 and 52");
    }

    const availableCards = SUITS.flatMap((suit) =>
        Array.from({ length: 13 }, (_, index) => ({
            suit,
            rank: (index + 1) as CardRank,
        })),
    );

    const shuffledFaces = [...availableCards].sort(() => Math.random() - 0.5);

    const selectedFaces = shuffledFaces.slice(0, pairCount);

    const cards: MemoryCard[] = selectedFaces.flatMap((face, index) => {
        const pairId = `pair-${index}`;

        return [
            {
                id: `${pairId}-a`,
                ...face,
                pairId,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
            {
                id: `${pairId}-b`,
                ...face,
                pairId,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
        ];
    });

    return cards.sort(() => Math.random() - 0.5);
}
