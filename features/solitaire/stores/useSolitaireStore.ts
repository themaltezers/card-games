import { create } from "zustand";

import type { SolitaireState } from "../types/solitaire";

import { createGame } from "../engine/createGame";
import { drawCard as drawCardEngine } from "../engine/drawCard";
import { autoCompleteStep } from "../engine/autoCompleteGame";

import {
    moveWasteToTableau as moveWasteToTableauEngine,
    moveTableauToTableau as moveTableauToTableauEngine,
    moveWasteToFoundation as moveWasteToFoundationEngine,
    moveTableauToFoundation as moveTableauToFoundationEngine,
} from "../engine/moveCard";

const AUTO_COMPLETE_DELAY = 200;

interface SolitaireActions {
    isAutoCompleting: boolean;
    newGame: () => void;
    draw: () => void;
    moveWasteToTableau: (targetColumn: number) => void;
    moveTableauToTableau: (
        sourceColumn: number,
        cardIndex: number,
        targetColumn: number,
    ) => void;
    moveWasteToFoundation: () => void;
    moveTableauToFoundation: (sourceColumn: number) => void;
}

export type SolitaireStore = SolitaireState & SolitaireActions;

const initialState: SolitaireState = {
    stock: [],
    waste: [],
    foundations: {
        hearts: [],
        diamonds: [],
        clubs: [],
        spades: [],
    },
    tableau: [],
    moves: 0,
    status: "playing",
};

function wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const useSolitaireStore = create<SolitaireStore>((set, get) => {
    let autoCompleteRunId = 0;

    // Récupère uniquement les données du jeu, sans les actions Zustand.
    function getGameState(): SolitaireState {
        const { stock, waste, foundations, tableau, moves, status } = get();

        return {
            stock,
            waste,
            foundations,
            tableau,
            moves,
            status,
        };
    }

    async function playAutoComplete(runId: number) {
        let currentState = getGameState();
        let nextState = autoCompleteStep(currentState);

        if (nextState === currentState) return;

        set({ isAutoCompleting: true });

        while (nextState !== currentState) {
            await wait(AUTO_COMPLETE_DELAY);

            if (runId !== autoCompleteRunId) return;

            // Le nouvel état ne contient plus les propriétés du store.
            set(nextState);

            currentState = nextState;
            nextState = autoCompleteStep(currentState);
        }

        if (runId === autoCompleteRunId) {
            set({ isAutoCompleting: false });
        }
    }

    function applyGameAction(
        action: (state: SolitaireState) => SolitaireState,
    ) {
        if (get().isAutoCompleting) return;

        const currentState = getGameState();
        const nextState = action(currentState);

        if (nextState === currentState) return;

        set(nextState);

        void playAutoComplete(++autoCompleteRunId);
    }

    return {
        ...initialState,
        isAutoCompleting: false,

        newGame: () => {
            autoCompleteRunId++;

            set({
                ...createGame(),
                isAutoCompleting: false,
            });
        },

        draw: () => {
            applyGameAction(drawCardEngine);
        },

        moveWasteToTableau: (targetColumn) => {
            applyGameAction((state) =>
                moveWasteToTableauEngine(state, targetColumn),
            );
        },

        moveTableauToTableau: (sourceColumn, cardIndex, targetColumn) => {
            applyGameAction((state) =>
                moveTableauToTableauEngine(
                    state,
                    sourceColumn,
                    cardIndex,
                    targetColumn,
                ),
            );
        },

        moveWasteToFoundation: () => {
            applyGameAction(moveWasteToFoundationEngine);
        },

        moveTableauToFoundation: (sourceColumn) => {
            applyGameAction((state) =>
                moveTableauToFoundationEngine(state, sourceColumn),
            );
        },
    };
});
