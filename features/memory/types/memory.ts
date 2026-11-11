import type { Card } from "@/features/cards/types/card";

export type MemoryStatus = "playing" | "won";
export type PlayerId = "player1" | "player2";
export type MemoryWinner = PlayerId | "draw" | null;
export type MemoryMode = "solo" | "1v1";

export interface MemoryCard extends Card {
    pairId: string;
    matched: boolean;
    matchedBy: PlayerId | null;
}

export interface MemoryGameState {
    cards: MemoryCard[];
    moves: number;
    matches: number;
    status: MemoryStatus;
}
