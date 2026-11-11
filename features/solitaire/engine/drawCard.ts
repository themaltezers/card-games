import type { SolitaireState } from "../types/solitaire";

export function drawCard(state: SolitaireState): SolitaireState {
    // Impossible de jouer après une victoire
    if (state.status === "won") {
        return state;
    }

    // Stock vide : on recycle la défausse
    if (state.stock.length === 0) {
        if (state.waste.length === 0) {
            return state;
        }

        return {
            ...state,
            stock: [...state.waste].reverse().map((card) => ({
                ...card,
                faceUp: false,
            })),
            waste: [],
            moves: state.moves + 1,
        };
    }

    // On récupère la carte au sommet du stock
    const card = state.stock[state.stock.length - 1];

    return {
        ...state,
        stock: state.stock.slice(0, -1),
        waste: [
            ...state.waste,
            {
                ...card,
                faceUp: true,
            },
        ],
        moves: state.moves + 1,
    };
}
