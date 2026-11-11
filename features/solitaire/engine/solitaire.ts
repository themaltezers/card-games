import type { Card, Suit } from "@/features/cards/types/card";
import { getCardColor } from "@/features/cards/types/card";
import type { SolitaireState } from "../types/solitaire";

/**
 * Vérifie si une carte peut être placée sur une autre
 * dans une colonne du tableau.
 *
 * Règles :
 * - Couleurs alternées
 * - Valeur décroissante de 1
 * - Un roi peut être placé sur une colonne vide
 */
export function canPlaceOnTableau(
    card: Card,
    target: Card | undefined,
): boolean {
    if (!target) {
        return card.rank === 13;
    }

    return (
        target.faceUp &&
        getCardColor(card.suit) !== getCardColor(target.suit) &&
        card.rank === target.rank - 1
    );
}

/**
 * Vérifie si une carte peut être placée
 * dans une fondation.
 *
 * Règles :
 * - Un as commence une fondation
 * - Les cartes suivantes doivent être de la même couleur
 *   (même symbole) et dans l'ordre croissant
 */
export function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
    if (foundation.length === 0) {
        return card.rank === 1;
    }

    const topCard = foundation[foundation.length - 1];

    return card.suit === topCard.suit && card.rank === topCard.rank + 1;
}

/**
 * Retourne la dernière carte d'une pile.
 */
export function getTopCard(cards: Card[]): Card | undefined {
    return cards[cards.length - 1];
}

/**
 * Vérifie si la partie est terminée.
 */
export function checkGameStatus(state: SolitaireState): "playing" | "won" {
    const totalCardsInFoundations = Object.values(state.foundations).reduce(
        (total, foundation) => total + foundation.length,
        0,
    );

    return totalCardsInFoundations === 52 ? "won" : "playing";
}

/**
 * Retourne la fondation correspondant à une couleur de carte.
 */
export function getFoundation(
    foundations: SolitaireState["foundations"],
    suit: Suit,
): Card[] {
    return foundations[suit];
}
