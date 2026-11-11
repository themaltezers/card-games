import { describe, expect, it } from "vitest";

import { createGame } from "../engine/createGame";

describe("createGame", () => {
    it("creates 16 cards for the default difficulty", () => {
        const cards = createGame();

        expect(cards).toHaveLength(16);
    });

    it("creates the requested number of pairs", () => {
        const cards = createGame(18);

        expect(cards).toHaveLength(36);
        expect(new Set(cards.map((card) => card.pairId)).size).toBe(18);
    });

    it("gives every card a unique id", () => {
        const cards = createGame(8);
        const ids = cards.map((card) => card.id);

        expect(new Set(ids).size).toBe(16);
    });

    it("creates exactly two cards per pair", () => {
        const cards = createGame(8);
        const pairCounts = new Map<string, number>();

        for (const card of cards) {
            pairCounts.set(card.pairId, (pairCounts.get(card.pairId) ?? 0) + 1);
        }

        for (const count of pairCounts.values()) {
            expect(count).toBe(2);
        }
    });

    it("starts every card face down and unmatched", () => {
        const cards = createGame(8);

        for (const card of cards) {
            expect(card.faceUp).toBe(false);
            expect(card.matched).toBe(false);
        }
    });

    it("initializes matchedBy to null for every card", () => {
        const cards = createGame(8);

        for (const card of cards) {
            expect(card.matchedBy).toBeNull();
        }
    });

    it("rejects invalid pair counts", () => {
        expect(() => createGame(0)).toThrow(RangeError);
        expect(() => createGame(-1)).toThrow(RangeError);
        expect(() => createGame(1.5)).toThrow(RangeError);
        expect(() => createGame(53)).toThrow(RangeError);
    });

    it("supports the maximum number of pairs", () => {
        const cards = createGame(52);

        expect(cards).toHaveLength(104);
    });
});
