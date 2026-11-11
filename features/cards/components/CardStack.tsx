import { Children, type ReactNode } from "react";

interface CardStackProps {
    children: ReactNode;
    direction?: "vertical" | "horizontal";
    overlap?: number;
    className?: string;
}

export default function CardStack({
    children,
    direction = "vertical",
    overlap = 24,
    className = "",
}: CardStackProps) {
    const cards = Children.toArray(children);

    return (
        <div
            className={`
                flex
                ${direction === "vertical" ? "flex-col" : "flex-row"}
                ${className}
            `}
        >
            {cards.map((child, index) => (
                <div
                    key={index}
                    className="relative shrink-0"
                    style={{
                        marginTop:
                            direction === "vertical" && index > 0
                                ? -overlap
                                : 0,
                        marginLeft:
                            direction === "horizontal" && index > 0
                                ? -overlap
                                : 0,
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
