"use client";

import { useMemoryStore } from "../stores/useMemoryStore";
import MemoryCard from "./MemoryCard";

export default function MemoryBoard() {
    const cards = useMemoryStore((state) => state.cards);
    const isChecking = useMemoryStore((state) => state.isChecking);
    const flipCard = useMemoryStore((state) => state.flipCard);

    const pairCount = cards.length / 2;

    const columns = pairCount <= 8 ? 4 : pairCount <= 18 ? 6 : 8;

    return (
        <div
            className="mx-auto grid w-full max-w-5xl gap-2 sm:gap-3 md:gap-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
        >
            {cards.map((card) => (
                <MemoryCard
                    key={card.id}
                    card={card}
                    disabled={isChecking}
                    onClick={flipCard}
                />
            ))}
        </div>
    );
}
