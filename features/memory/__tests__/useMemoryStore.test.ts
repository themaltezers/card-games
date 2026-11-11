import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMemoryStore } from "../stores/useMemoryStore";

describe("useMemoryStore", () => {
    beforeEach(() => {
        vi.useFakeTimers();

        useMemoryStore.getState().setGameMode("1v1");
        useMemoryStore.getState().newGame(2);
    });

    afterEach(() => {
        useMemoryStore.getState().resetGame();
        vi.useRealTimers();
    });

    function getPairCards(pairIndex = 0) {
        const cards = useMemoryStore.getState().cards;
        const pairIds = [...new Set(cards.map((card) => card.pairId))];

        return cards.filter((card) => card.pairId === pairIds[pairIndex]);
    }

    function getDifferentPairCards() {
        const cards = useMemoryStore.getState().cards;
        const pairIds = [...new Set(cards.map((card) => card.pairId))];

        return [
            cards.find((card) => card.pairId === pairIds[0])!,
            cards.find((card) => card.pairId === pairIds[1])!,
        ];
    }

    describe("1v1 mode", () => {
        it("starts with player 1 and zero points", () => {
            const state = useMemoryStore.getState();

            expect(state.gameMode).toBe("1v1");
            expect(state.currentPlayer).toBe("player1");
            expect(state.scores).toEqual({
                player1: 0,
                player2: 0,
            });
            expect(state.winner).toBeNull();
        });

        it("starts a game with the requested number of pairs", () => {
            useMemoryStore.getState().newGame(18);

            expect(useMemoryStore.getState().cards).toHaveLength(36);
        });

        it("flips the first card without incrementing moves", () => {
            const [first] = getPairCards();

            useMemoryStore.getState().flipCard(first.id);

            const state = useMemoryStore.getState();

            expect(
                state.cards.find((card) => card.id === first.id)?.faceUp,
            ).toBe(true);

            expect(state.moves).toBe(0);
        });

        it("awards one point when player 1 finds a pair", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const state = useMemoryStore.getState();

            expect(state.scores.player1).toBe(1);
            expect(state.scores.player2).toBe(0);
            expect(state.matches).toBe(1);
        });

        it("assigns the pair to player 1", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const matchedCards = useMemoryStore
                .getState()
                .cards.filter((card) => card.pairId === first.pairId);

            expect(
                matchedCards.every((card) => card.matchedBy === "player1"),
            ).toBe(true);
        });

        it("keeps the same player's turn after finding a pair", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            expect(useMemoryStore.getState().currentPlayer).toBe("player1");
        });

        it("passes the turn to player 2 after a mismatch", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            expect(useMemoryStore.getState().currentPlayer).toBe("player1");

            expect(useMemoryStore.getState().isChecking).toBe(true);

            vi.advanceTimersByTime(1000);

            expect(useMemoryStore.getState().currentPlayer).toBe("player2");

            expect(useMemoryStore.getState().isChecking).toBe(false);
        });

        it("assigns a pair to player 2 after player 1 misses", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            vi.advanceTimersByTime(1000);

            const pair = getPairCards(0);
            const pairFirst = pair.find((card) => card.id === first.id)!;
            const pairSecond = pair.find((card) => card.id !== first.id)!;

            flipCard(pairFirst.id);
            flipCard(pairSecond.id);

            const state = useMemoryStore.getState();

            expect(state.currentPlayer).toBe("player2");
            expect(state.scores.player2).toBe(1);

            expect(
                state.cards
                    .filter((card) => card.pairId === first.pairId)
                    .every((card) => card.matchedBy === "player2"),
            ).toBe(true);
        });

        it("passes the turn back to player 1 after player 2 misses", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            vi.advanceTimersByTime(1000);

            const playerTwoCards = getDifferentPairCards();

            flipCard(playerTwoCards[0].id);
            flipCard(playerTwoCards[1].id);

            vi.advanceTimersByTime(1000);

            expect(useMemoryStore.getState().currentPlayer).toBe("player1");
        });

        it("blocks interactions while checking a mismatch", () => {
            const [first, second] = getDifferentPairCards();

            const third = useMemoryStore
                .getState()
                .cards.find(
                    (card) => card.id !== first.id && card.id !== second.id,
                )!;

            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);
            flipCard(third.id);

            expect(
                useMemoryStore
                    .getState()
                    .cards.find((card) => card.id === third.id)?.faceUp,
            ).toBe(false);
        });

        it("hides mismatched cards after 1000ms", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            vi.advanceTimersByTime(999);

            expect(useMemoryStore.getState().isChecking).toBe(true);

            vi.advanceTimersByTime(1);

            const state = useMemoryStore.getState();

            expect(
                state.cards.find((card) => card.id === first.id)?.faceUp,
            ).toBe(false);

            expect(
                state.cards.find((card) => card.id === second.id)?.faceUp,
            ).toBe(false);

            expect(state.currentPlayer).toBe("player2");
        });

        it("keeps matched cards visible", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const state = useMemoryStore.getState();

            expect(
                state.cards.find((card) => card.id === first.id)?.faceUp,
            ).toBe(true);

            expect(
                state.cards.find((card) => card.id === second.id)?.faceUp,
            ).toBe(true);

            expect(
                state.cards.find((card) => card.id === first.id)?.matched,
            ).toBe(true);
        });

        it("declares player 1 the winner when all pairs are found", () => {
            useMemoryStore.getState().newGame(1);

            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const state = useMemoryStore.getState();

            expect(state.status).toBe("won");
            expect(state.winner).toBe("player1");
            expect(state.scores.player1).toBe(1);
        });

        it("does not award points when a player finds a mismatch", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const state = useMemoryStore.getState();

            expect(state.scores).toEqual({
                player1: 0,
                player2: 0,
            });

            expect(state.moves).toBe(1);
        });

        it("resets scores and turn when starting a new game", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            useMemoryStore.getState().newGame(8);

            const state = useMemoryStore.getState();

            expect(state.currentPlayer).toBe("player1");
            expect(state.scores).toEqual({
                player1: 0,
                player2: 0,
            });
            expect(state.winner).toBeNull();
            expect(state.moves).toBe(0);
            expect(state.gameMode).toBe("1v1");
        });

        it("cancels a pending mismatch when starting a new game", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            useMemoryStore.getState().newGame(8);
            vi.advanceTimersByTime(1000);

            const state = useMemoryStore.getState();

            expect(state.currentPlayer).toBe("player1");
            expect(state.isChecking).toBe(false);
            expect(state.scores.player1).toBe(0);
        });
    });

    describe("solo mode", () => {
        beforeEach(() => {
            useMemoryStore.getState().setGameMode("solo");
            useMemoryStore.getState().newGame(2);
        });

        it("switches to solo mode and resets the game", () => {
            const state = useMemoryStore.getState();

            expect(state.gameMode).toBe("solo");
            expect(state.currentPlayer).toBe("player1");
            expect(state.scores).toEqual({
                player1: 0,
                player2: 0,
            });
        });

        it("does not assign a player to matched cards", () => {
            const [first, second] = getPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            const state = useMemoryStore.getState();

            expect(state.matches).toBe(1);
            expect(
                state.cards
                    .filter((card) => card.pairId === first.pairId)
                    .every((card) => card.matchedBy === null),
            ).toBe(true);
        });

        it("does not change player after a mismatch", () => {
            const [first, second] = getDifferentPairCards();
            const { flipCard } = useMemoryStore.getState();

            flipCard(first.id);
            flipCard(second.id);

            vi.advanceTimersByTime(1000);

            expect(useMemoryStore.getState().currentPlayer).toBe("player1");
        });
    });

    describe("mode switching", () => {
        it("keeps the selected mode when starting a new game", () => {
            useMemoryStore.getState().newGame(8);

            expect(useMemoryStore.getState().gameMode).toBe("1v1");
        });

        it("preserves difficulty when switching modes", () => {
            useMemoryStore.getState().newGame(18);
            useMemoryStore.getState().setGameMode("solo");

            expect(useMemoryStore.getState().cards).toHaveLength(36);
        });

        it("does not reset the game when selecting the current mode", () => {
            const [first] = getPairCards();

            useMemoryStore.getState().flipCard(first.id);
            useMemoryStore.getState().setGameMode("1v1");

            expect(
                useMemoryStore
                    .getState()
                    .cards.find((card) => card.id === first.id)?.faceUp,
            ).toBe(true);
        });
    });
});
