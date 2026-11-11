import { describe, expect, it } from "vitest";

import { flipCard, hideUnmatchedCards } from "../engine/flipCard";
import type { MemoryGameState } from "../types/memory";

function createTestState(): MemoryGameState {
    return {
        cards: [
            {
                id: "hearts-1-a",
                pairId: "hearts-1",
                suit: "hearts",
                rank: 1,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
            {
                id: "hearts-1-b",
                pairId: "hearts-1",
                suit: "hearts",
                rank: 1,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
            {
                id: "spades-2-a",
                pairId: "spades-2",
                suit: "spades",
                rank: 2,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
            {
                id: "spades-2-b",
                pairId: "spades-2",
                suit: "spades",
                rank: 2,
                faceUp: false,
                matched: false,
                matchedBy: null,
            },
        ],
        moves: 0,
        matches: 0,
        status: "playing",
    };
}

describe("flipCard", () => {
    it("flips the first card without incrementing moves", () => {
        const state = createTestState();

        const result = flipCard(state, "hearts-1-a");

        expect(result.cards[0].faceUp).toBe(true);
        expect(result.moves).toBe(0);
    });

    it("increments moves after flipping two cards", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "spades-2-a");

        expect(second.moves).toBe(1);
        expect(second.cards[0].faceUp).toBe(true);
        expect(second.cards[2].faceUp).toBe(true);
    });

    it("marks matching cards as matched", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "hearts-1-b");

        expect(second.cards[0].matched).toBe(true);
        expect(second.cards[1].matched).toBe(true);
        expect(second.matches).toBe(1);
        expect(second.moves).toBe(1);

        // L'attribution du joueur est gérée par le store.
        expect(second.cards[0].matchedBy).toBe(null);
        expect(second.cards[1].matchedBy).toBe(null);
    });

    it("does not allow flipping an already face-up card", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const result = flipCard(first, "hearts-1-a");

        expect(result).toBe(first);
    });

    it("does not allow flipping a third card before resolving a mismatch", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "spades-2-a");
        const third = flipCard(second, "hearts-1-b");

        expect(third).toBe(second);
    });

    it("ignores unknown card ids", () => {
        const state = createTestState();

        expect(flipCard(state, "unknown")).toBe(state);
    });

    it("hides unmatched cards after the delay", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "spades-2-a");
        const result = hideUnmatchedCards(second);

        expect(result.cards[0].faceUp).toBe(false);
        expect(result.cards[2].faceUp).toBe(false);
        expect(result.moves).toBe(1);
    });

    it("keeps matched cards visible when hiding unmatched cards", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "hearts-1-b");
        const result = hideUnmatchedCards(second);

        expect(result.cards[0].faceUp).toBe(true);
        expect(result.cards[1].faceUp).toBe(true);
        expect(result.cards[0].matched).toBe(true);
        expect(result.cards[0].matchedBy).toBe(null);
    });

    it("detects victory when the last pair is found", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "hearts-1-b");
        const third = flipCard(second, "spades-2-a");
        const fourth = flipCard(third, "spades-2-b");

        expect(fourth.status).toBe("won");
        expect(fourth.matches).toBe(2);
    });

    it("does not allow flipping cards after victory", () => {
        const state = createTestState();

        const first = flipCard(state, "hearts-1-a");
        const second = flipCard(first, "hearts-1-b");
        const third = flipCard(second, "spades-2-a");
        const won = flipCard(third, "spades-2-b");

        expect(flipCard(won, "hearts-1-a")).toBe(won);
    });
});
