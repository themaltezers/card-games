import { describe, it, expect } from "vitest";

import {
    canPlaceOnTableau,
    canPlaceOnFoundation,
    getTopCard,
    checkGameStatus,
    getFoundation,
} from "../engine/solitaire";

import { createGame } from "../engine/createGame";
import type { Card, Suit } from "@/features/cards/types/card";
import type { SolitaireState } from "../types/solitaire";

function createCard(suit: Suit, rank: Card["rank"], faceUp = true): Card {
    return {
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp,
    };
}

describe("canPlaceOnTableau", () => {
    it("should allow a card with opposite color and lower rank", () => {
        const redSeven = createCard("hearts", 7);
        const blackEight = createCard("clubs", 8);

        expect(canPlaceOnTableau(redSeven, blackEight)).toBe(true);
    });

    it("should reject cards with the same color", () => {
        const redSeven = createCard("hearts", 7);
        const redEight = createCard("diamonds", 8);

        expect(canPlaceOnTableau(redSeven, redEight)).toBe(false);
    });

    it("should reject cards with an incorrect rank", () => {
        const redSix = createCard("hearts", 6);
        const blackEight = createCard("clubs", 8);

        expect(canPlaceOnTableau(redSix, blackEight)).toBe(false);
    });

    it("should allow a king on an empty column", () => {
        const king = createCard("spades", 13);

        expect(canPlaceOnTableau(king, undefined)).toBe(true);
    });

    it("should reject a non-king on an empty column", () => {
        const queen = createCard("hearts", 12);

        expect(canPlaceOnTableau(queen, undefined)).toBe(false);
    });

    it("should reject a face-down target card", () => {
        const redSeven = createCard("hearts", 7);
        const blackEight = createCard("clubs", 8, false);

        expect(canPlaceOnTableau(redSeven, blackEight)).toBe(false);
    });
});

describe("canPlaceOnFoundation", () => {
    it("should allow an ace on an empty foundation", () => {
        const ace = createCard("hearts", 1);

        expect(canPlaceOnFoundation(ace, [])).toBe(true);
    });

    it("should reject a non-ace on an empty foundation", () => {
        const two = createCard("hearts", 2);

        expect(canPlaceOnFoundation(two, [])).toBe(false);
    });

    it("should allow the next card of the same suit", () => {
        const two = createCard("hearts", 2);
        const foundation = [createCard("hearts", 1)];

        expect(canPlaceOnFoundation(two, foundation)).toBe(true);
    });

    it("should reject a card from another suit", () => {
        const two = createCard("diamonds", 2);
        const foundation = [createCard("hearts", 1)];

        expect(canPlaceOnFoundation(two, foundation)).toBe(false);
    });

    it("should reject an incorrect rank", () => {
        const three = createCard("hearts", 3);
        const foundation = [createCard("hearts", 1)];

        expect(canPlaceOnFoundation(three, foundation)).toBe(false);
    });
});

describe("getTopCard", () => {
    it("should return the last card", () => {
        const cards = [
            createCard("hearts", 1),
            createCard("hearts", 2),
            createCard("hearts", 3),
        ];

        expect(getTopCard(cards)?.rank).toBe(3);
    });

    it("should return undefined for an empty pile", () => {
        expect(getTopCard([])).toBeUndefined();
    });
});

describe("checkGameStatus", () => {
    it("should return playing when foundations are incomplete", () => {
        const state = createGame();

        expect(checkGameStatus(state)).toBe("playing");
    });

    it("should return won when all 52 cards are in foundations", () => {
        const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

        const foundations = Object.fromEntries(
            suits.map((suit) => [
                suit,
                Array.from({ length: 13 }, (_, index) =>
                    createCard(suit, (index + 1) as Card["rank"]),
                ),
            ]),
        ) as SolitaireState["foundations"];

        const state: SolitaireState = {
            stock: [],
            waste: [],
            tableau: [[], [], [], [], [], [], []],
            foundations,
            moves: 52,
            status: "playing",
        };

        expect(checkGameStatus(state)).toBe("won");
    });
});

describe("getFoundation", () => {
    it("should return the foundation matching the suit", () => {
        const foundations: SolitaireState["foundations"] = {
            hearts: [createCard("hearts", 1)],
            diamonds: [],
            clubs: [],
            spades: [],
        };

        expect(getFoundation(foundations, "hearts")).toEqual([
            createCard("hearts", 1),
        ]);
    });
});
