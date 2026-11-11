export type CardSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CardTheme = "classic" | "minimal" | "dark";

export type CardBackTheme = "blue" | "red" | "black" | "green";

export interface CardAppearance {
    size?: CardSize;
    theme?: CardTheme;
    backTheme?: CardBackTheme;
}
