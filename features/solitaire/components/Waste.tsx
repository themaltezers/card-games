import type { Card } from "@/features/cards/types/card";
import PlayingCard from "@/features/cards/components/PlayingCard";
import CardSlot from "@/features/cards/components/CardSlot";

interface WasteProps {
    cards: Card[];
    onSelect: () => void;
    onDoubleClick: () => void;
}

export default function Waste({ cards, onSelect, onDoubleClick }: WasteProps) {
    const topCard = cards[cards.length - 1];

    return (
        <div>
            {topCard ? (
                <PlayingCard
                    card={topCard}
                    onClick={onSelect}
                    onDoubleClick={onDoubleClick}
                />
            ) : (
                <CardSlot label="Défausse vide" />
            )}
        </div>
    );
}
