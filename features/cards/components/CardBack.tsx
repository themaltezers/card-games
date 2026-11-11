import Image from "next/image";

import type { CardSize, CardBackTheme } from "../types/cardTheme";

import { CARD_SIZES } from "../styles/cards";

interface CardBackProps {
    size?: CardSize;
    theme?: CardBackTheme;
    onClick?: () => void;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}

const CARD_BACK_IMAGES: Record<CardBackTheme, string> = {
    blue: "/cards/backs/red.png",
    red: "/cards/backs/red.png",
    black: "/cards/backs/red.png",
    green: "/cards/backs/red.png",
};

export default function CardBack({
    size = "md",
    theme = "red",
    onClick,
    selected = false,
    disabled = false,
    className = "",
}: CardBackProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || !onClick}
            aria-label="Face cachée"
            className={`
                relative aspect-[5/7] shrink-0 overflow-hidden
                rounded-lg transition-transform
                ${CARD_SIZES[size]}
                ${selected ? "-translate-y-2 ring-2 ring-blue-500" : ""}
                ${disabled ? "cursor-not-allowed opacity-60" : ""}
                ${className}
            `}
        >
            <Image
                src={CARD_BACK_IMAGES[theme]}
                alt=""
                fill
                sizes="(max-width: 768px) 80px, 128px"
                className="object-cover"
                draggable={false}
            />
        </button>
    );
}
