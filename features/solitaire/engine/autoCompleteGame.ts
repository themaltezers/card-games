import type { SolitaireState } from "../types/solitaire";
import type { Card } from "@/features/cards/types/card";

import { canPlaceOnFoundation, checkGameStatus } from "./solitaire";

function moveToFoundation(
    state: SolitaireState,
    card: Card,
    source: "waste" | number,
): SolitaireState {
    const nextFoundations = {
        ...state.foundations,
        [card.suit]: [...state.foundations[card.suit], card],
    };

    const nextWaste =
        source === "waste" ? state.waste.slice(0, -1) : state.waste;

    const nextTableau =
        typeof source === "number"
            ? state.tableau.map((column, index) =>
                  index === source ? column.slice(0, -1) : column,
              )
            : state.tableau;

    const nextState: SolitaireState = {
        ...state,
        waste: nextWaste,
        tableau: nextTableau,
        foundations: nextFoundations,
        moves: state.moves + 1,
    };

    return {
        ...nextState,
        status: checkGameStatus(nextState),
    };
}

function canAutoComplete(state: SolitaireState): boolean {
    return (
        state.status !== "won" &&
        state.stock.length === 0 &&
        !state.tableau.some((column) => column.some((card) => !card.faceUp))
    );
}

/**
 * Effectue un seul déplacement automatique vers une fondation.
 * Retourne le même état si aucun déplacement n'est possible.
 */
export function autoCompleteStep(state: SolitaireState): SolitaireState {
    if (!canAutoComplete(state)) return state;

    // Priorité à la carte visible de la défausse.
    const wasteCard = state.waste[state.waste.length - 1];

    if (
        wasteCard &&
        canPlaceOnFoundation(wasteCard, state.foundations[wasteCard.suit])
    ) {
        return moveToFoundation(state, wasteCard, "waste");
    }

    // Puis on vérifie les cartes supérieures du tableau.
    for (
        let columnIndex = 0;
        columnIndex < state.tableau.length;
        columnIndex++
    ) {
        const column = state.tableau[columnIndex];
        const topCard = column[column.length - 1];

        if (
            topCard &&
            canPlaceOnFoundation(topCard, state.foundations[topCard.suit])
        ) {
            return moveToFoundation(state, topCard, columnIndex);
        }
    }

    return state;
}

/**
 * Version instantanée : utile pour les tests et les simulations.
 */
export function autoCompleteGame(state: SolitaireState): SolitaireState {
    let currentState = state;

    while (true) {
        const nextState = autoCompleteStep(currentState);

        if (nextState === currentState) return currentState;

        currentState = nextState;
    }
}
