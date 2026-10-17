// app/theme.ts
// Three.js ne comprend pas var(--x) : les couleurs de la scène 3D
// sont donc définies ici en hex.

export const CATEGORY_COLORS: Record<string, string> = {
  "AI & Large Language Models": "#3e7a5f",
  "Machine Learning & Data Engineering": "#5b8db8",
  "Distributed Systems & Architecture": "#c75f6b",
  "Algorithms & Optimization": "#9a7bb5",
  "Full-Stack Software Engineering": "#d98c5f",
};

// Couleurs de la grille 3D (équivalents hex de --border et d'une teinte plus claire)
export const GRID_COLORS = {
  main: "#c9d6cd",
  secondary: "#e3ebe5",
};