import type { CardSize, CardTheme, CardBackTheme } from "../types/cardTheme";

export const CARD_SIZES: Record<CardSize, string> = {
    xs: "w-12",
    sm: "w-14",
    md: "w-20",
    lg: "w-24",
    xl: "w-32",
};

export const CARD_THEMES: Record<CardTheme, string> = {
    classic: "bg-white border-gray-300 text-gray-950",
    minimal: "bg-gray-100 border-transparent text-gray-950 shadow-none",
    dark: "bg-gray-900 border-gray-700 text-white",
};

export const CARD_BACK_THEMES: Record<CardBackTheme, string> = {
    blue: "bg-blue-900 border-blue-300",
    red: "bg-red-900 border-red-300",
    black: "bg-gray-950 border-gray-500",
    green: "bg-green-900 border-green-300",
};
