import type { Card } from "@/features/cards/types/card";
import TableauColumn from "./TableauColumn";

interface TableauProps {
    columns: Card[][];
    selectedColumn: number | null;
    selectedIndex: number | null;
    onCardClick: (columnIndex: number, cardIndex: number) => void;
    onCardDoubleClick: (columnIndex: number, cardIndex: number) => void;
    onEmptyClick: (columnIndex: number) => void;
}

export default function Tableau({
    columns,
    selectedColumn,
    selectedIndex,
    onCardClick,
    onCardDoubleClick,
    onEmptyClick,
}: TableauProps) {
    return (
        <div className="flex min-w-max items-start justify-center gap-3">
            {columns.map((cards, columnIndex) => (
                <TableauColumn
                    key={columnIndex}
                    cards={cards}
                    columnIndex={columnIndex}
                    selectedIndex={
                        selectedColumn === columnIndex ? selectedIndex : null
                    }
                    onCardClick={(cardIndex) =>
                        onCardClick(columnIndex, cardIndex)
                    }
                    onCardDoubleClick={(cardIndex) =>
                        onCardDoubleClick(columnIndex, cardIndex)
                    }
                    onEmptyClick={() => onEmptyClick(columnIndex)}
                />
            ))}
        </div>
    );
}
