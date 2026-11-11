import { createDeck, shuffleDeck } from "@/features/cards/utils/createDeck";
import type { Foundations, SolitaireState } from "../types/solitaire";

export function createGame(): SolitaireState {
    const deck = shuffleDeck(createDeck());

    const tableau = Array.from({ length: 7 }, (_, columnIndex) => {
        const column = deck.splice(0, columnIndex + 1);

        return column.map((card, cardIndex) => ({
            ...card,
            faceUp: cardIndex === columnIndex,
        }));
    });

    const foundations: Foundations = {
        hearts: [],
        diamonds: [],
        clubs: [],
        spades: [],
    };

    return {
        stock: deck,
        waste: [],
        foundations,
        tableau,
        moves: 0,
        status: "playing",
    };
}
