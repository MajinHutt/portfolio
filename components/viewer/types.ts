export type ViewerMode = "shaded" | "wireframe" | "clay";

export const VIEWER_MODES: { value: ViewerMode; label: string }[] = [
  { value: "shaded", label: "Shaded" },
  { value: "wireframe", label: "Wireframe" },
  { value: "clay", label: "Clay" },
];
