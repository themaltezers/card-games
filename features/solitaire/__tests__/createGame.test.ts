import { describe, it, expect } from "vitest";

import { createGame } from "../engine/createGame";
import { SUITS } from "@/features/cards/types/card";

describe("createGame", () => {
    it("should create exactly 52 cards", () => {
        const game = createGame();

        const allCards = [
            ...game.stock,
            ...game.waste,
            ...game.tableau.flat(),
            ...Object.values(game.foundations).flat(),
        ];

        expect(allCards).toHaveLength(52);
    });

    it("should create 7 tableau columns", () => {
        const game = createGame();

        expect(game.tableau).toHaveLength(7);
    });

    it("should distribute the correct number of cards per column", () => {
        const game = createGame();

        expect(game.tableau.map((column) => column.length)).toEqual([
            1, 2, 3, 4, 5, 6, 7,
        ]);
    });

    it("should leave 24 cards in the stock", () => {
        const game = createGame();

        expect(game.stock).toHaveLength(24);
    });

    it("should leave the waste empty", () => {
        const game = createGame();

        expect(game.waste).toEqual([]);
    });

    it("should have only the top card face up in each column", () => {
        const game = createGame();

        game.tableau.forEach((column) => {
            column.forEach((card, index) => {
                expect(card.faceUp).toBe(index === column.length - 1);
            });
        });
    });

    it("should initialize all foundations as empty", () => {
        const game = createGame();

        for (const suit of SUITS) {
            expect(game.foundations[suit]).toEqual([]);
        }
    });

    it("should initialize the game with zero moves", () => {
        const game = createGame();

        expect(game.moves).toBe(0);
    });

    it("should initialize the game with playing status", () => {
        const game = createGame();

        expect(game.status).toBe("playing");
    });

    it("should generate 52 unique card IDs", () => {
        const game = createGame();

        const allCards = [...game.stock, ...game.tableau.flat()];

        const ids = allCards.map((card) => card.id);

        expect(new Set(ids).size).toBe(52);
    });

    it("should contain every suit exactly 13 times", () => {
        const game = createGame();

        const allCards = [...game.stock, ...game.tableau.flat()];

        for (const suit of SUITS) {
            expect(allCards.filter((card) => card.suit === suit)).toHaveLength(
                13,
            );
        }
    });
});
