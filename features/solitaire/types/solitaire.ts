import type { Card, Suit } from "@/features/cards/types/card";

export type GameStatus = "playing" | "won";

export type Foundations = Record<Suit, Card[]>;

export interface SolitaireState {
    stock: Card[];
    waste: Card[];
    foundations: Foundations;
    tableau: Card[][];
    moves: number;
    status: GameStatus;
}
