import { create } from "zustand";

import { createGame } from "../engine/createGame";
import {
    flipCard as flipCardEngine,
    hideUnmatchedCards,
} from "../engine/flipCard";

import type {
    MemoryGameState,
    MemoryMode,
    MemoryWinner,
    PlayerId,
} from "../types/memory";

interface MemoryActions {
    newGame: (pairCount?: number) => void;
    resetGame: () => void;
    flipCard: (cardId: string) => void;
    setGameMode: (mode: MemoryMode) => void;
}

interface MemoryPlayersState {
    gameMode: MemoryMode;
    currentPlayer: PlayerId;
    scores: Record<PlayerId, number>;
    winner: MemoryWinner;
}

export interface MemoryStore
    extends MemoryGameState, MemoryPlayersState, MemoryActions {
    isChecking: boolean;
}

const MISMATCH_DELAY = 1000;

let mismatchTimeout: ReturnType<typeof setTimeout> | null = null;

function clearMismatchTimeout() {
    if (mismatchTimeout !== null) {
        clearTimeout(mismatchTimeout);
        mismatchTimeout = null;
    }
}

function createInitialState(pairCount = 8): MemoryGameState {
    return {
        cards: createGame(pairCount),
        moves: 0,
        matches: 0,
        status: "playing",
    };
}

function getInitialScores(): Record<PlayerId, number> {
    return {
        player1: 0,
        player2: 0,
    };
}

function getWinner(scores: Record<PlayerId, number>): MemoryWinner {
    if (scores.player1 > scores.player2) return "player1";
    if (scores.player2 > scores.player1) return "player2";
    return "draw";
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
    ...createInitialState(),
    gameMode: "solo",
    currentPlayer: "player1",
    scores: getInitialScores(),
    winner: null,
    isChecking: false,

    newGame: (pairCount = 8) => {
        clearMismatchTimeout();

        set({
            ...createInitialState(pairCount),
            currentPlayer: "player1",
            scores: getInitialScores(),
            winner: null,
            isChecking: false,
        });
    },

    resetGame: () => {
        const pairCount = get().cards.length / 2;
        get().newGame(pairCount);
    },

    setGameMode: (mode) => {
        const state = get();

        if (state.gameMode === mode) return;

        const pairCount = state.cards.length / 2;

        clearMismatchTimeout();

        set({
            ...createInitialState(pairCount),
            gameMode: mode,
            currentPlayer: "player1",
            scores: getInitialScores(),
            winner: null,
            isChecking: false,
        });
    },

    flipCard: (cardId) => {
        const state = get();

        if (state.isChecking || state.status === "won") return;

        const gameState: MemoryGameState = {
            cards: state.cards,
            moves: state.moves,
            matches: state.matches,
            status: state.status,
        };

        const nextState = flipCardEngine(gameState, cardId);

        if (nextState === gameState) return;

        const faceUpUnmatchedCards = nextState.cards.filter(
            (card) => card.faceUp && !card.matched,
        );

        const hasMismatch = faceUpUnmatchedCards.length === 2;
        const hasNewMatch = nextState.matches > state.matches;

        if (hasNewMatch) {
            if (state.gameMode === "1v1") {
                const scores = {
                    ...state.scores,
                    [state.currentPlayer]:
                        state.scores[state.currentPlayer] + 1,
                };

                const newlyMatchedPairId = nextState.cards.find(
                    (card) =>
                        card.matched &&
                        !state.cards.find(
                            (previousCard) => previousCard.id === card.id,
                        )?.matched,
                )?.pairId;

                const cards = nextState.cards.map((card) =>
                    card.pairId === newlyMatchedPairId
                        ? {
                              ...card,
                              matchedBy: state.currentPlayer,
                          }
                        : card,
                );

                set({
                    ...nextState,
                    cards,
                    scores,
                    winner:
                        nextState.status === "won" ? getWinner(scores) : null,
                    isChecking: false,
                });

                return;
            }

            set({
                ...nextState,
                isChecking: false,
            });

            return;
        }

        set({
            ...nextState,
            isChecking: hasMismatch,
        });

        if (hasMismatch) {
            clearMismatchTimeout();

            mismatchTimeout = setTimeout(() => {
                const currentState = get();

                const currentGameState: MemoryGameState = {
                    cards: currentState.cards,
                    moves: currentState.moves,
                    matches: currentState.matches,
                    status: currentState.status,
                };

                const hiddenState = hideUnmatchedCards(currentGameState);

                set({
                    ...hiddenState,
                    currentPlayer:
                        currentState.gameMode === "1v1"
                            ? currentState.currentPlayer === "player1"
                                ? "player2"
                                : "player1"
                            : currentState.currentPlayer,
                    isChecking: false,
                });

                mismatchTimeout = null;
            }, MISMATCH_DELAY);
        }
    },
}));
