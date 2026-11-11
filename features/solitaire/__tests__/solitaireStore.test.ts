import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Card, CardRank, Suit } from "@/features/cards/types/card";

import { useSolitaireStore } from "../stores/useSolitaireStore";

function makeCard(suit: Suit, rank: CardRank): Card {
    return {
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: true,
    };
}

describe("useSolitaireStore - auto completion", () => {
    beforeEach(() => {
        vi.useRealTimers();

        useSolitaireStore.setState({
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
            isAutoCompleting: false,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("déclenche l'auto-complétion après un déplacement", () => {
        useSolitaireStore.setState({
            tableau: [[makeCard("hearts", 1)]],
        });

        useSolitaireStore.getState().moveTableauToFoundation(0);

        const state = useSolitaireStore.getState();

        expect(state.foundations.hearts).toHaveLength(1);
        expect(state.tableau[0]).toHaveLength(0);
    });

    it("ne déplace pas une carte qui ne peut pas rejoindre sa fondation", () => {
        useSolitaireStore.setState({
            tableau: [[makeCard("hearts", 3)]],
        });

        useSolitaireStore.getState().moveTableauToFoundation(0);

        const state = useSolitaireStore.getState();

        expect(state.foundations.hearts).toHaveLength(0);
        expect(state.tableau[0]).toHaveLength(1);
    });

    it("déclenche l'auto-complétion après une pioche qui vide le stock", () => {
        vi.useFakeTimers();

        useSolitaireStore.setState({
            stock: [makeCard("hearts", 1)],
            tableau: [[], [], [], [], [], [], []],
        });

        useSolitaireStore.getState().draw();

        expect(useSolitaireStore.getState().isAutoCompleting).toBe(true);

        return vi.advanceTimersByTimeAsync(200).then(() => {
            const state = useSolitaireStore.getState();

            expect(state.stock).toHaveLength(0);
            expect(state.waste).toHaveLength(0);
            expect(state.foundations.hearts).toHaveLength(1);
            expect(state.isAutoCompleting).toBe(false);
        });
    });

    it("range les cartes progressivement avec un délai de 200 ms", async () => {
        vi.useFakeTimers();

        useSolitaireStore.setState({
            stock: [makeCard("hearts", 1)],
            tableau: [[makeCard("hearts", 2)]],
        });

        useSolitaireStore.getState().draw();

        expect(useSolitaireStore.getState().isAutoCompleting).toBe(true);
        expect(useSolitaireStore.getState().foundations.hearts).toHaveLength(0);

        await vi.advanceTimersByTimeAsync(200);

        expect(useSolitaireStore.getState().foundations.hearts).toHaveLength(1);
        expect(useSolitaireStore.getState().isAutoCompleting).toBe(true);

        await vi.advanceTimersByTimeAsync(200);

        const state = useSolitaireStore.getState();

        expect(state.foundations.hearts).toHaveLength(2);
        expect(state.tableau[0]).toHaveLength(0);
        expect(state.isAutoCompleting).toBe(false);
    });

    it("annule l'ancienne auto-complétion lorsqu'une nouvelle partie démarre", async () => {
        vi.useFakeTimers();

        useSolitaireStore.setState({
            stock: [makeCard("hearts", 1)],
            tableau: [[makeCard("hearts", 2)]],
        });

        useSolitaireStore.getState().draw();

        expect(useSolitaireStore.getState().isAutoCompleting).toBe(true);

        useSolitaireStore.getState().newGame();

        expect(useSolitaireStore.getState().isAutoCompleting).toBe(false);

        await vi.advanceTimersByTimeAsync(1000);

        const state = useSolitaireStore.getState();

        expect(state.foundations.hearts).toHaveLength(0);
        expect(state.moves).toBe(0);
    });
});
