import type { ReactNode, KeyboardEvent } from "react";
import type { CardSize } from "../types/cardTheme";
import { CARD_SIZES } from "../styles/cards";

interface CardSlotProps {
    children?: ReactNode;
    onClick?: () => void;
    label?: string;
    size?: CardSize;
    className?: string;
}

export default function CardSlot({
    children,
    onClick,
    label = "Emplacement vide",
    size = "md",
    className = "",
}: CardSlotProps) {
    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.();
        }
    }

    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick}
            onKeyDown={onClick ? handleKeyDown : undefined}
            aria-label={label}
            className={`
                flex aspect-[5/7] shrink-0 items-center justify-center
                rounded-lg border-2 border-dashed
                border-gray-400/50 bg-gray-500/10
                ${CARD_SIZES[size]}
                ${className}
            `}
        >
            {children}
        </div>
    );
}
