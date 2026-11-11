import type { SolitaireState } from "../types/solitaire";
import { checkGameStatus } from "./solitaire";

export function checkWin(state: SolitaireState): boolean {
    return checkGameStatus(state) === "won";
}
