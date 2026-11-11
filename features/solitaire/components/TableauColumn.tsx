import type { Card } from "@/features/cards/types/card";
import PlayingCard from "@/features/cards/components/PlayingCard";
import CardSlot from "@/features/cards/components/CardSlot";
import CardStack from "@/features/cards/components/CardStack";

interface TableauColumnProps {
    cards: Card[];
    columnIndex: number;
    selectedIndex: number | null;
    onCardClick: (cardIndex: number) => void;
    onCardDoubleClick: (cardIndex: number) => void;
    onEmptyClick: () => void;
}

export default function TableauColumn({
    cards,
    columnIndex,
    selectedIndex,
    onCardClick,
    onCardDoubleClick,
    onEmptyClick,
}: TableauColumnProps) {
    if (cards.length === 0) {
        return (
            <CardSlot
                label={`Colonne ${columnIndex + 1} vide`}
                onClick={onEmptyClick}
            />
        );
    }

    return (
        <CardStack direction="vertical" overlap={26} className="items-center">
            {cards.map((card, index) => (
                <PlayingCard
                    key={card.id}
                    card={card}
                    selected={selectedIndex === index}
                    onClick={() => onCardClick(index)}
                    onDoubleClick={() => onCardDoubleClick(index)}
                />
            ))}
        </CardStack>
    );
}
