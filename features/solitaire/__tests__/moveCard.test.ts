import { describe, it, expect } from "vitest";
import type { Card } from "@/features/cards/types/card";

import {
    moveWasteToTableau,
    moveTableauToTableau,
    moveWasteToFoundation,
    moveTableauToFoundation,
    moveFoundationToTableau,
} from "../engine/moveCard";

import { createGame } from "../engine/createGame";
import { createCard } from "./testUtils";

describe("moveWasteToTableau", () => {
    it("should move a valid card from waste to tableau", () => {
        const seven = createCard("hearts", 7);
        const eight = createCard("clubs", 8);

        const state = {
            ...createGame(),
            waste: [seven],
            tableau: [[eight], [], [], [], [], [], []],
        };

        const nextState = moveWasteToTableau(state, 0);

        expect(nextState.waste).toHaveLength(0);
        expect(nextState.tableau[0]).toEqual([eight, seven]);
        expect(nextState.moves).toBe(1);
    });

    it("should allow a king on an empty column", () => {
        const king = createCard("spades", 13);

        const state = {
            ...createGame(),
            waste: [king],
            tableau: [[], [], [], [], [], [], []],
        };

        const nextState = moveWasteToTableau(state, 0);

        expect(nextState.tableau[0]).toEqual([king]);
        expect(nextState.waste).toHaveLength(0);
    });

    it("should reject a non-king on an empty column", () => {
        const queen = createCard("hearts", 12);

        const state = {
            ...createGame(),
            waste: [queen],
            tableau: [[], [], [], [], [], [], []],
        };

        expect(moveWasteToTableau(state, 0)).toBe(state);
    });

    it("should reject an invalid target column", () => {
        const king = createCard("spades", 13);

        const state = {
            ...createGame(),
            waste: [king],
        };

        expect(moveWasteToTableau(state, 10)).toBe(state);
    });

    it("should reject a move when waste is empty", () => {
        const state = {
            ...createGame(),
            waste: [],
        };

        expect(moveWasteToTableau(state, 0)).toBe(state);
    });
});

describe("moveTableauToTableau", () => {
    it("should move a valid group of cards", () => {
        const seven = createCard("hearts", 7);
        const six = createCard("clubs", 6);
        const eight = createCard("spades", 8);

        const state = {
            ...createGame(),
            tableau: [[seven, six], [eight], [], [], [], [], []],
        };

        const nextState = moveTableauToTableau(state, 0, 0, 1);

        expect(nextState.tableau[0]).toEqual([]);
        expect(nextState.tableau[1]).toEqual([eight, seven, six]);
        expect(nextState.moves).toBe(1);
    });

    it("should reject a group with an invalid internal sequence", () => {
        const eight = createCard("spades", 8);
        const seven = createCard("clubs", 7);
        const nine = createCard("hearts", 9);

        const state = {
            ...createGame(),
            tableau: [[eight, seven], [nine], [], [], [], [], []],
        };

        expect(moveTableauToTableau(state, 0, 0, 1)).toBe(state);
    });

    it("should reveal the previous card after moving a group", () => {
        const hiddenCard = createCard("hearts", 10, false);
        const queen = createCard("spades", 12);
        const king = createCard("hearts", 13);

        const state = {
            ...createGame(),
            tableau: [[hiddenCard, queen], [king], [], [], [], [], []],
        };

        const nextState = moveTableauToTableau(state, 0, 1, 1);

        expect(nextState.tableau[0][0].faceUp).toBe(true);
    });

    it("should allow a king on an empty column", () => {
        const king = createCard("hearts", 13);

        const state = {
            ...createGame(),
            tableau: [[king], [], [], [], [], [], []],
        };

        const nextState = moveTableauToTableau(state, 0, 0, 1);

        expect(nextState.tableau[0]).toEqual([]);
        expect(nextState.tableau[1]).toEqual([king]);
    });

    it("should reject a non-king on an empty column", () => {
        const queen = createCard("hearts", 12);

        const state = {
            ...createGame(),
            tableau: [[queen], [], [], [], [], [], []],
        };

        expect(moveTableauToTableau(state, 0, 0, 1)).toBe(state);
    });

    it("should reject moving to the same column", () => {
        const king = createCard("hearts", 13);

        const state = {
            ...createGame(),
            tableau: [[king], [], [], [], [], [], []],
        };

        expect(moveTableauToTableau(state, 0, 0, 0)).toBe(state);
    });

    it("should reject an invalid source index", () => {
        const state = createGame();

        expect(moveTableauToTableau(state, 0, 10, 1)).toBe(state);
    });

    it("should reject a group containing a face-down card", () => {
        const hiddenCard = createCard("hearts", 7, false);
        const six = createCard("clubs", 6);

        const state = {
            ...createGame(),
            tableau: [
                [hiddenCard, six],
                [createCard("spades", 8)],
                [],
                [],
                [],
                [],
                [],
            ],
        };

        expect(moveTableauToTableau(state, 0, 0, 1)).toBe(state);
    });
});

describe("moveWasteToFoundation", () => {
    it("should move an ace to an empty foundation", () => {
        const ace = createCard("hearts", 1);

        const state = {
            ...createGame(),
            waste: [ace],
        };

        const nextState = moveWasteToFoundation(state);

        expect(nextState.waste).toHaveLength(0);
        expect(nextState.foundations.hearts).toEqual([ace]);
        expect(nextState.moves).toBe(1);
    });

    it("should move the next card of the same suit", () => {
        const ace = createCard("hearts", 1);
        const two = createCard("hearts", 2);

        const state = {
            ...createGame(),
            waste: [two],
            foundations: {
                ...createGame().foundations,
                hearts: [ace],
            },
        };

        const nextState = moveWasteToFoundation(state);

        expect(nextState.foundations.hearts).toEqual([ace, two]);
    });

    it("should reject a non-ace on an empty foundation", () => {
        const two = createCard("hearts", 2);

        const state = {
            ...createGame(),
            waste: [two],
        };

        expect(moveWasteToFoundation(state)).toBe(state);
    });

    it("should reject a card from another suit", () => {
        const ace = createCard("hearts", 1);
        const two = createCard("clubs", 2);

        const state = {
            ...createGame(),
            waste: [two],
            foundations: {
                ...createGame().foundations,
                hearts: [ace],
            },
        };

        expect(moveWasteToFoundation(state)).toBe(state);
    });

    it("should do nothing when waste is empty", () => {
        const state = {
            ...createGame(),
            waste: [],
        };

        expect(moveWasteToFoundation(state)).toBe(state);
    });
});

describe("moveTableauToFoundation", () => {
    it("should move an ace to its foundation", () => {
        const ace = createCard("hearts", 1);

        const state = {
            ...createGame(),
            tableau: [[ace], [], [], [], [], [], []],
        };

        const nextState = moveTableauToFoundation(state, 0);

        expect(nextState.tableau[0]).toHaveLength(0);
        expect(nextState.foundations.hearts).toEqual([ace]);
        expect(nextState.moves).toBe(1);
    });

    it("should reveal the previous card after moving to foundation", () => {
        const hiddenCard = createCard("clubs", 2, false);
        const ace = createCard("hearts", 1);

        const state = {
            ...createGame(),
            tableau: [[hiddenCard, ace], [], [], [], [], [], []],
        };

        const nextState = moveTableauToFoundation(state, 0);

        expect(nextState.tableau[0][0].faceUp).toBe(true);
    });

    it("should reject a card that is not at the top", () => {
        const ace = createCard("hearts", 1);
        const two = createCard("hearts", 2);

        const state = {
            ...createGame(),
            tableau: [[ace, two], [], [], [], [], [], []],
        };

        expect(moveTableauToFoundation(state, 0)).toBe(state);
    });

    it("should reject an invalid column", () => {
        const state = createGame();

        expect(moveTableauToFoundation(state, 10)).toBe(state);
    });

    it("should declare victory when all 52 cards reach foundations", () => {
        const king = createCard("hearts", 13);

        const state = {
            ...createGame(),
            tableau: [[king], [], [], [], [], [], []],
            foundations: {
                hearts: Array.from({ length: 12 }, (_, index) =>
                    createCard("hearts", (index + 1) as Card["rank"]),
                ),
                diamonds: Array.from({ length: 13 }, (_, index) =>
                    createCard("diamonds", (index + 1) as Card["rank"]),
                ),
                clubs: Array.from({ length: 13 }, (_, index) =>
                    createCard("clubs", (index + 1) as Card["rank"]),
                ),
                spades: Array.from({ length: 13 }, (_, index) =>
                    createCard("spades", (index + 1) as Card["rank"]),
                ),
            },
        };

        const nextState = moveTableauToFoundation(state, 0);

        expect(nextState.status).toBe("won");
    });
});

describe("moveFoundationToTableau", () => {
    it("should move the top card of a foundation to a valid tableau column", () => {
        const six = createCard("hearts", 6);
        const seven = createCard("clubs", 7);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                hearts: [six],
            },
            tableau: [[seven], [], [], [], [], [], []],
        };

        const nextState = moveFoundationToTableau(state, "hearts", 0);

        expect(nextState.foundations.hearts).toHaveLength(0);
        expect(nextState.tableau[0]).toEqual([seven, six]);
        expect(nextState.moves).toBe(1);
    });

    it("should move a king to an empty tableau column", () => {
        const king = createCard("spades", 13);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                spades: [king],
            },
            tableau: [[], [], [], [], [], [], []],
        };

        const nextState = moveFoundationToTableau(state, "spades", 0);

        expect(nextState.foundations.spades).toHaveLength(0);
        expect(nextState.tableau[0]).toEqual([king]);
        expect(nextState.moves).toBe(1);
    });

    it("should reject a non-king on an empty column", () => {
        const queen = createCard("hearts", 12);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                hearts: [queen],
            },
            tableau: [[], [], [], [], [], [], []],
        };

        expect(moveFoundationToTableau(state, "hearts", 0)).toBe(state);
    });

    it("should reject a card with the wrong color or rank", () => {
        const six = createCard("hearts", 6);
        const seven = createCard("diamonds", 7);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                hearts: [six],
            },
            tableau: [[seven], [], [], [], [], [], []],
        };

        expect(moveFoundationToTableau(state, "hearts", 0)).toBe(state);
    });

    it("should only retrieve the top card of a foundation", () => {
        const six = createCard("hearts", 6);
        const seven = createCard("hearts", 7);
        const eight = createCard("clubs", 8);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                hearts: [six, seven],
            },
            tableau: [[eight], [], [], [], [], [], []],
        };

        const nextState = moveFoundationToTableau(state, "hearts", 0);

        expect(nextState.foundations.hearts).toEqual([six]);
        expect(nextState.tableau[0]).toEqual([eight, seven]);
    });

    it("should reject an empty foundation", () => {
        const state = createGame();

        expect(moveFoundationToTableau(state, "hearts", 0)).toBe(state);
    });

    it("should reject an invalid target column", () => {
        const king = createCard("spades", 13);

        const state = {
            ...createGame(),
            foundations: {
                ...createGame().foundations,
                spades: [king],
            },
        };

        expect(moveFoundationToTableau(state, "spades", 10)).toBe(state);
    });

    it("should reject a move after the game is won", () => {
        const king = createCard("spades", 13);

        const state = {
            ...createGame(),
            status: "won" as const,
            foundations: {
                ...createGame().foundations,
                spades: [king],
            },
        };

        expect(moveFoundationToTableau(state, "spades", 0)).toBe(state);
    });
});
