import type { MemoryGameState } from "../types/memory";

export function flipCard(
    state: MemoryGameState,
    cardId: string,
): MemoryGameState {
    if (state.status === "won") {
        return state;
    }

    const card = state.cards.find((item) => item.id === cardId);

    if (!card || card.faceUp || card.matched) {
        return state;
    }

    const faceUpCards = state.cards.filter(
        (item) => item.faceUp && !item.matched,
    );

    // Deux cartes sont déjà retournées : on attend leur résolution.
    if (faceUpCards.length >= 2) {
        return state;
    }

    const cards = state.cards.map((item) =>
        item.id === cardId ? { ...item, faceUp: true } : item,
    );

    const updatedFaceUpCards = cards.filter(
        (item) => item.faceUp && !item.matched,
    );

    // Première carte retournée : aucun mouvement complet pour l'instant.
    if (updatedFaceUpCards.length < 2) {
        return {
            ...state,
            cards,
        };
    }

    const [firstCard, secondCard] = updatedFaceUpCards;

    // Les deux cartes correspondent.
    if (firstCard.pairId === secondCard.pairId) {
        const matchedCards = cards.map((item) =>
            item.id === firstCard.id || item.id === secondCard.id
                ? { ...item, matched: true }
                : item,
        );

        const matches = state.matches + 1;

        const isWon = matchedCards.every((item) => item.matched);

        return {
            ...state,
            cards: matchedCards,
            moves: state.moves + 1,
            matches,
            status: isWon ? "won" : "playing",
        };
    }

    // Mauvaise paire : les deux cartes restent visibles temporairement.
    return {
        ...state,
        cards,
        moves: state.moves + 1,
    };
}

export function hideUnmatchedCards(state: MemoryGameState): MemoryGameState {
    if (state.status === "won") {
        return state;
    }

    const hasUnmatchedPair =
        state.cards.filter((card) => card.faceUp && !card.matched).length === 2;

    if (!hasUnmatchedPair) {
        return state;
    }

    return {
        ...state,
        cards: state.cards.map((card) =>
            card.faceUp && !card.matched ? { ...card, faceUp: false } : card,
        ),
    };
}
