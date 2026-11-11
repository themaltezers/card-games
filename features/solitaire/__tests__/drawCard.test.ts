import { describe, it, expect } from "vitest";

import { drawCard } from "../engine/drawCard";
import { createGame } from "../engine/createGame";
import { createCard } from "./testUtils";

describe("drawCard", () => {
    it("should draw the top card from the stock", () => {
        const state = {
            ...createGame(),
            stock: [
                createCard("hearts", 1, false),
                createCard("clubs", 2, false),
            ],
            waste: [],
        };

        const nextState = drawCard(state);

        expect(nextState.stock).toHaveLength(1);
        expect(nextState.waste).toHaveLength(1);
        expect(nextState.waste[0].rank).toBe(2);
        expect(nextState.waste[0].faceUp).toBe(true);
    });

    it("should increment the move counter", () => {
        const state = {
            ...createGame(),
            stock: [createCard("hearts", 1, false)],
            moves: 5,
        };

        const nextState = drawCard(state);

        expect(nextState.moves).toBe(6);
    });

    it("should recycle the waste when the stock is empty", () => {
        const state = {
            ...createGame(),
            stock: [],
            waste: [
                createCard("hearts", 5),
                createCard("clubs", 8),
                createCard("diamonds", 10),
            ],
        };

        const nextState = drawCard(state);

        expect(nextState.waste).toHaveLength(0);
        expect(nextState.stock).toHaveLength(3);

        expect(nextState.stock[0].rank).toBe(10);
        expect(nextState.stock[1].rank).toBe(8);
        expect(nextState.stock[2].rank).toBe(5);

        expect(nextState.stock.every((card) => !card.faceUp)).toBe(true);
    });

    it("should not change anything when stock and waste are empty", () => {
        const state = {
            ...createGame(),
            stock: [],
            waste: [],
        };

        const nextState = drawCard(state);

        expect(nextState).toBe(state);
    });

    it("should not mutate the original state", () => {
        const state = {
            ...createGame(),
            stock: [createCard("hearts", 1, false)],
            waste: [],
        };

        const originalStock = [...state.stock];
        const originalWaste = [...state.waste];

        drawCard(state);

        expect(state.stock).toEqual(originalStock);
        expect(state.waste).toEqual(originalWaste);
    });

    it("should not draw cards after winning", () => {
        const state = {
            ...createGame(),
            status: "won" as const,
        };

        const nextState = drawCard(state);

        expect(nextState).toBe(state);
    });
});
