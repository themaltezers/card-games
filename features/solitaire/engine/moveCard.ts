import type { SolitaireState } from "../types/solitaire";
import type { Suit } from "@/features/cards/types/card";

import {
    canPlaceOnTableau,
    canPlaceOnFoundation,
    checkGameStatus,
} from "./solitaire";

/**
 * Finalise un déplacement valide :
 * - Incrémente le nombre de coups
 * - Vérifie si la partie est gagnée
 */
function finalizeMove(state: SolitaireState): SolitaireState {
    const nextState = {
        ...state,
        moves: state.moves + 1,
    };

    return {
        ...nextState,
        status: checkGameStatus(nextState),
    };
}

/**
 * Déplace la carte au sommet de la défausse
 * vers une colonne du tableau.
 */
export function moveWasteToTableau(
    state: SolitaireState,
    targetColumn: number,
): SolitaireState {
    if (state.status === "won") return state;

    if (
        !Number.isInteger(targetColumn) ||
        targetColumn < 0 ||
        targetColumn >= state.tableau.length
    ) {
        return state;
    }

    const card = state.waste[state.waste.length - 1];

    if (!card || !card.faceUp) return state;

    const target = state.tableau[targetColumn];
    const targetCard = target[target.length - 1];

    if (!canPlaceOnTableau(card, targetCard)) {
        return state;
    }

    const nextState: SolitaireState = {
        ...state,
        waste: state.waste.slice(0, -1),
        tableau: state.tableau.map((column, index) =>
            index === targetColumn ? [...column, card] : column,
        ),
    };

    return finalizeMove(nextState);
}

/**
 * Déplace une carte ou un groupe de cartes
 * d'une colonne vers une autre.
 */
export function moveTableauToTableau(
    state: SolitaireState,
    sourceColumn: number,
    cardIndex: number,
    targetColumn: number,
): SolitaireState {
    if (state.status === "won") return state;

    if (
        !Number.isInteger(sourceColumn) ||
        !Number.isInteger(targetColumn) ||
        !Number.isInteger(cardIndex) ||
        sourceColumn < 0 ||
        targetColumn < 0 ||
        sourceColumn >= state.tableau.length ||
        targetColumn >= state.tableau.length ||
        cardIndex < 0 ||
        sourceColumn === targetColumn
    ) {
        return state;
    }

    const source = state.tableau[sourceColumn];
    const target = state.tableau[targetColumn];

    if (cardIndex >= source.length) return state;

    const movingCards = source.slice(cardIndex);

    // Toutes les cartes déplacées doivent être visibles.
    if (movingCards.some((card) => !card.faceUp)) {
        return state;
    }

    // Vérifie que le groupe respecte les règles du Solitaire.
    const isValidSequence = movingCards.every((card, index) => {
        if (index === 0) return true;

        return canPlaceOnTableau(card, movingCards[index - 1]);
    });

    if (!isValidSequence) return state;

    const targetCard = target[target.length - 1];

    if (!canPlaceOnTableau(movingCards[0], targetCard)) {
        return state;
    }

    // Retire les cartes de la colonne source.
    const newSource = source.slice(0, cardIndex);

    // Retourne la nouvelle carte au sommet si elle était cachée.
    if (newSource.length > 0) {
        const topCard = newSource[newSource.length - 1];

        if (!topCard.faceUp) {
            newSource[newSource.length - 1] = {
                ...topCard,
                faceUp: true,
            };
        }
    }

    const nextState: SolitaireState = {
        ...state,
        tableau: state.tableau.map((column, index) => {
            if (index === sourceColumn) return newSource;

            if (index === targetColumn) {
                return [...column, ...movingCards];
            }

            return column;
        }),
    };

    return finalizeMove(nextState);
}

/**
 * Déplace la carte au sommet de la défausse
 * vers sa fondation correspondante.
 */
export function moveWasteToFoundation(state: SolitaireState): SolitaireState {
    if (state.status === "won") return state;

    const card = state.waste[state.waste.length - 1];

    if (!card || !card.faceUp) return state;

    const foundation = state.foundations[card.suit];

    if (!canPlaceOnFoundation(card, foundation)) {
        return state;
    }

    const nextState: SolitaireState = {
        ...state,
        waste: state.waste.slice(0, -1),
        foundations: {
            ...state.foundations,
            [card.suit]: [...foundation, card],
        },
    };

    return finalizeMove(nextState);
}

/**
 * Déplace la carte au sommet d'une colonne
 * vers sa fondation correspondante.
 */
export function moveTableauToFoundation(
    state: SolitaireState,
    sourceColumn: number,
): SolitaireState {
    if (state.status === "won") return state;

    if (
        !Number.isInteger(sourceColumn) ||
        sourceColumn < 0 ||
        sourceColumn >= state.tableau.length
    ) {
        return state;
    }

    const source = state.tableau[sourceColumn];
    const card = source[source.length - 1];

    if (!card || !card.faceUp) return state;

    const foundation = state.foundations[card.suit];

    if (!canPlaceOnFoundation(card, foundation)) {
        return state;
    }

    const newSource = source.slice(0, -1);

    // Retourne la carte précédente si nécessaire.
    if (newSource.length > 0) {
        const topCard = newSource[newSource.length - 1];

        if (!topCard.faceUp) {
            newSource[newSource.length - 1] = {
                ...topCard,
                faceUp: true,
            };
        }
    }

    const nextState: SolitaireState = {
        ...state,
        tableau: state.tableau.map((column, index) =>
            index === sourceColumn ? newSource : column,
        ),
        foundations: {
            ...state.foundations,
            [card.suit]: [...foundation, card],
        },
    };

    return finalizeMove(nextState);
}

/**
 * Récupère la carte au sommet d'une fondation
 * pour la déplacer vers une colonne du tableau.
 */
export function moveFoundationToTableau(
    state: SolitaireState,
    suit: Suit,
    targetColumn: number,
): SolitaireState {
    if (state.status === "won") return state;

    if (
        !Number.isInteger(targetColumn) ||
        targetColumn < 0 ||
        targetColumn >= state.tableau.length
    ) {
        return state;
    }

    const foundation = state.foundations[suit];
    const card = foundation[foundation.length - 1];

    // Une fondation vide ne peut rien fournir.
    if (!card || !card.faceUp) return state;

    const target = state.tableau[targetColumn];
    const targetCard = target[target.length - 1];

    if (!canPlaceOnTableau(card, targetCard)) {
        return state;
    }

    const nextState: SolitaireState = {
        ...state,
        foundations: {
            ...state.foundations,
            [suit]: foundation.slice(0, -1),
        },
        tableau: state.tableau.map((column, index) =>
            index === targetColumn ? [...column, card] : column,
        ),
    };

    return finalizeMove(nextState);
}
