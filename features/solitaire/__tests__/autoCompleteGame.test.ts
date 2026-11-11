import { describe, it, expect } from "vitest";

import type { Card, CardRank, Suit } from "@/features/cards/types/card";

import type { SolitaireState } from "../types/solitaire";
import { autoCompleteGame } from "../engine/autoCompleteGame";

function makeCard(suit: Suit, rank: CardRank): Card {
    return {
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: true,
    };
}

function makeState(overrides: Partial<SolitaireState> = {}): SolitaireState {
    return {
        stock: [],
        waste: [],
        foundations: {
            hearts: [],
            diamonds: [],
            clubs: [],
            spades: [],
        },
        tableau: [[], [], [], [], [], [], []],
        moves: 0,
        status: "playing",
        ...overrides,
    };
}

describe("autoCompleteGame", () => {
    it("ne fait rien si la pioche contient encore des cartes", () => {
        const state = makeState({
            stock: [makeCard("hearts", 1)],
            tableau: [[makeCard("clubs", 1)]],
        });

        expect(autoCompleteGame(state)).toBe(state);
    });

    it("ne fait rien si une carte du tableau est encore cachée", () => {
        const state = makeState({
            tableau: [
                [
                    { ...makeCard("hearts", 1), faceUp: false },
                    makeCard("clubs", 1),
                ],
            ],
        });

        expect(autoCompleteGame(state)).toBe(state);
    });

    it("déplace un As de la défausse vers sa fondation", () => {
        const state = makeState({
            waste: [makeCard("hearts", 1)],
        });

        const result = autoCompleteGame(state);

        expect(result.waste).toHaveLength(0);
        expect(result.foundations.hearts).toHaveLength(1);
        expect(result.foundations.hearts[0].rank).toBe(1);
        expect(result.moves).toBe(1);
    });

    it("déplace la carte supérieure d'une colonne vers sa fondation", () => {
        const state = makeState({
            tableau: [[makeCard("hearts", 1)]],
        });

        const result = autoCompleteGame(state);

        expect(result.tableau[0]).toHaveLength(0);
        expect(result.foundations.hearts).toHaveLength(1);
        expect(result.moves).toBe(1);
    });

    it("recommence après un déplacement pour débloquer les cartes suivantes", () => {
        const state = makeState({
            tableau: [[makeCard("hearts", 1)]],
            waste: [makeCard("hearts", 2)],
        });

        const result = autoCompleteGame(state);

        expect(result.foundations.hearts).toHaveLength(2);
        expect(result.foundations.hearts.map((card) => card.rank)).toEqual([
            1, 2,
        ]);
        expect(result.moves).toBe(2);
    });

    it("ne déplace pas une carte qui ne peut pas rejoindre sa fondation", () => {
        const state = makeState({
            tableau: [[makeCard("hearts", 3)]],
        });

        const result = autoCompleteGame(state);

        expect(result).toBe(state);
    });

    it("termine la partie lorsque les 52 cartes sont rangées", () => {
        const foundations = {
            hearts: Array.from({ length: 12 }, (_, i) =>
                makeCard("hearts", (i + 1) as CardRank),
            ),
            diamonds: Array.from({ length: 12 }, (_, i) =>
                makeCard("diamonds", (i + 1) as CardRank),
            ),
            clubs: Array.from({ length: 12 }, (_, i) =>
                makeCard("clubs", (i + 1) as CardRank),
            ),
            spades: Array.from({ length: 12 }, (_, i) =>
                makeCard("spades", (i + 1) as CardRank),
            ),
        };

        const state = makeState({
            foundations,
            tableau: [
                [makeCard("clubs", 13)],
                [makeCard("diamonds", 13)],
                [makeCard("spades", 13)],
            ],
            waste: [makeCard("hearts", 13)],
        });

        const result = autoCompleteGame(state);

        expect(result.status).toBe("won");
        expect(
            Object.values(result.foundations).reduce(
                (total, foundation) => total + foundation.length,
                0,
            ),
        ).toBe(52);
        expect(result.moves).toBe(4);
    });

    it("ne modifie pas l'état original", () => {
        const state = makeState({
            tableau: [[makeCard("hearts", 1)]],
        });

        autoCompleteGame(state);

        expect(state.tableau[0]).toHaveLength(1);
        expect(state.foundations.hearts).toHaveLength(0);
        expect(state.moves).toBe(0);
    });
});
