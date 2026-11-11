import CardBack from "@/features/cards/components/CardBack";
import CardSlot from "@/features/cards/components/CardSlot";

interface StockProps {
    count: number;
    onDraw: () => void;
}

export default function Stock({ count, onDraw }: StockProps) {
    return (
        <div className="relative">
            {count > 0 ? (
                <CardBack onClick={onDraw} />
            ) : (
                <CardSlot label="Reprendre la défausse" onClick={onDraw}>
                    <span className="text-2xl text-white/60">↻</span>
                </CardSlot>
            )}
        </div>
    );
}
