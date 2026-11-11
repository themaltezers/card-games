"use client";

import { useState } from "react";

import { SUITS } from "@/features/cards/types/card";
import type { Suit } from "@/features/cards/types/card";

import { useSolitaireStore } from "../stores/useSolitaireStore";

import GameHeader from "./GameHeader";
import Stock from "./Stock";
import Waste from "./Waste";
import Foundation from "./Foundation";
import Tableau from "./Tableau";

type Selection =
    | { type: "waste" }
    | {
          type: "tableau";
          columnIndex: number;
          cardIndex: number;
      }
    | {
          type: "foundation";
          suit: Suit;
      }
    | null;

export default function SolitaireBoard() {
    const stock = useSolitaireStore((state) => state.stock);
    const waste = useSolitaireStore((state) => state.waste);
    const foundations = useSolitaireStore((state) => state.foundations);
    const tableau = useSolitaireStore((state) => state.tableau);
    const moves = useSolitaireStore((state) => state.moves);
    const status = useSolitaireStore((state) => state.status);

    const draw = useSolitaireStore((state) => state.draw);
    const newGame = useSolitaireStore((state) => state.newGame);

    const moveWasteToTableau = useSolitaireStore(
        (state) => state.moveWasteToTableau,
    );

    const moveTableauToTableau = useSolitaireStore(
        (state) => state.moveTableauToTableau,
    );

    const moveWasteToFoundation = useSolitaireStore(
        (state) => state.moveWasteToFoundation,
    );

    const moveTableauToFoundation = useSolitaireStore(
        (state) => state.moveTableauToFoundation,
    );

    const moveFoundationToTableau = useSolitaireStore(
        (state) => state.moveFoundationToTableau,
    );

    const [selection, setSelection] = useState<Selection>(null);

    function clearSelectionAfterMove(action: () => void) {
        const previousMoves = useSolitaireStore.getState().moves;

        action();

        const nextMoves = useSolitaireStore.getState().moves;

        if (nextMoves > previousMoves) {
            setSelection(null);
        }
    }

    function handleTableauCardClick(columnIndex: number, cardIndex: number) {
        const column = tableau[columnIndex];
        const card = column[cardIndex];

        if (!card.faceUp) return;

        if (!selection) {
            setSelection({
                type: "tableau",
                columnIndex,
                cardIndex,
            });
            return;
        }

        // Clic sur la même carte : désélection.
        if (
            selection.type === "tableau" &&
            selection.columnIndex === columnIndex &&
            selection.cardIndex === cardIndex
        ) {
            setSelection(null);
            return;
        }

        // Déplacement depuis la défausse.
        if (selection.type === "waste") {
            if (cardIndex !== column.length - 1) return;

            clearSelectionAfterMove(() => moveWasteToTableau(columnIndex));
            return;
        }

        // Déplacement depuis une fondation.
        if (selection.type === "foundation") {
            if (cardIndex !== column.length - 1) return;

            clearSelectionAfterMove(() =>
                moveFoundationToTableau(selection.suit, columnIndex),
            );
            return;
        }

        // Sélection d'une autre carte dans la même colonne.
        if (selection.columnIndex === columnIndex) {
            setSelection({
                type: "tableau",
                columnIndex,
                cardIndex,
            });
            return;
        }

        // Déplacement vers une autre colonne.
        if (cardIndex !== column.length - 1) return;

        clearSelectionAfterMove(() =>
            moveTableauToTableau(
                selection.columnIndex,
                selection.cardIndex,
                columnIndex,
            ),
        );
    }

    function handleTableauCardDoubleClick(
        columnIndex: number,
        cardIndex: number,
    ) {
        const column = tableau[columnIndex];

        // Seule la dernière carte de la colonne peut rejoindre une fondation.
        if (cardIndex !== column.length - 1) return;

        const card = column[cardIndex];

        if (!card.faceUp) return;

        clearSelectionAfterMove(() => moveTableauToFoundation(columnIndex));
    }

    function handleWasteDoubleClick() {
        if (waste.length === 0) return;

        clearSelectionAfterMove(moveWasteToFoundation);
    }

    function handleEmptyColumnClick(columnIndex: number) {
        if (!selection) return;

        if (selection.type === "waste") {
            clearSelectionAfterMove(() => moveWasteToTableau(columnIndex));
            return;
        }

        if (selection.type === "foundation") {
            clearSelectionAfterMove(() =>
                moveFoundationToTableau(selection.suit, columnIndex),
            );
            return;
        }

        clearSelectionAfterMove(() =>
            moveTableauToTableau(
                selection.columnIndex,
                selection.cardIndex,
                columnIndex,
            ),
        );
    }

    function handleWasteClick() {
        if (waste.length === 0) return;

        setSelection((current) =>
            current?.type === "waste" ? null : { type: "waste" },
        );
    }

    function handleFoundationClick(suit: Suit) {
        // Aucune sélection : on sélectionne la fondation.
        if (!selection) {
            if (foundations[suit].length === 0) return;

            setSelection({ type: "foundation", suit });
            return;
        }

        // Changer de fondation sélectionnée ou désélectionner.
        if (selection.type === "foundation") {
            if (selection.suit === suit) {
                setSelection(null);
            } else if (foundations[suit].length > 0) {
                setSelection({ type: "foundation", suit });
            }

            return;
        }

        // Déplacement de la défausse vers sa fondation.
        if (selection.type === "waste") {
            if (waste[waste.length - 1]?.suit !== suit) return;

            clearSelectionAfterMove(moveWasteToFoundation);
            return;
        }

        // Déplacement du tableau vers sa fondation.
        const sourceColumn = tableau[selection.columnIndex];

        if (selection.cardIndex !== sourceColumn.length - 1) return;

        if (sourceColumn[selection.cardIndex]?.suit !== suit) return;

        clearSelectionAfterMove(() =>
            moveTableauToFoundation(selection.columnIndex),
        );
    }

    function handleNewGame() {
        newGame();
        setSelection(null);
    }

    return (
        <main className="min-h-screen bg-emerald-950 px-4 py-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <GameHeader moves={moves} onNewGame={handleNewGame} />

                <div className="overflow-x-auto pb-4">
                    <div className="flex min-w-[720px] flex-col gap-10">
                        <section className="grid grid-cols-7 items-start gap-3">
                            <Stock
                                count={stock.length}
                                onDraw={() => {
                                    draw();
                                    setSelection(null);
                                }}
                            />

                            <div
                                className={
                                    selection?.type === "waste"
                                        ? "rounded-lg ring-2 ring-blue-400"
                                        : ""
                                }
                            >
                                <Waste
                                    cards={waste}
                                    onSelect={handleWasteClick}
                                    onDoubleClick={handleWasteDoubleClick}
                                />
                            </div>

                            <div />

                            {SUITS.map((suit) => (
                                <Foundation
                                    key={suit}
                                    suit={suit}
                                    cards={foundations[suit]}
                                    isSelected={
                                        selection?.type === "foundation" &&
                                        selection.suit === suit
                                    }
                                    onClick={() => handleFoundationClick(suit)}
                                />
                            ))}
                        </section>

                        <Tableau
                            columns={tableau}
                            selectedColumn={
                                selection?.type === "tableau"
                                    ? selection.columnIndex
                                    : null
                            }
                            selectedIndex={
                                selection?.type === "tableau"
                                    ? selection.cardIndex
                                    : null
                            }
                            onCardClick={handleTableauCardClick}
                            onCardDoubleClick={handleTableauCardDoubleClick}
                            onEmptyClick={handleEmptyColumnClick}
                        />
                    </div>
                </div>

                {status === "won" && (
                    <div className="text-center text-2xl font-bold text-yellow-300">
                        Félicitations, tu as gagné !
                    </div>
                )}
            </div>
        </main>
    );
}
