const artwork: Record<string, string> = {
  vscode: "apps/vscode.png",
  ghostty: "apps/ghostty.png",
  xcode: "apps/xcode.png",
  orbstack: "apps/orbstack.png",
  codex: "apps/codex.png",
  finder: "apps/finder.png",
  swiftui: "apps/swiftui.png",
  foundationmodels: "apps/foundationmodels.png",
  coreml: "apps/coreml.png",
  mlx: "apps/mlx.png",
  lmstudio: "apps/lmstudio.png",
};
const abbreviations: Record<string, string> = {
  mlx: "MLX",
  swiftui: "SwiftUI",
  coreml: "ML",
  vision: "Vision",
  foundationmodels: "FM",
};
const symbols = new Set([
  "ollama",
  "typescript",
  "tailwindcss",
  "react",
  "python",
  "nodedotjs",
  "postgresql",
  "swift",
  "git",
  "docker",
  "nextdotjs",
  "express",
  "drizzle",
  "claudecode",
  "supabase",
  "tanstack",
  "prisma",
  "vite",
  "expo",
  "go",
  "mongodb",
  "mysql",
  "javascript",
  "html5",
  "css",
]);
export function AppIcon({ id }: { id: string }) {
  const source = artwork[id] ?? (symbols.has(id) ? id + ".svg" : null);
  return (
    <span
      className={
        "app-icon app-icon--" +
        id +
        " " +
        (artwork[id] ? "app-icon--native" : "")
      }
      aria-hidden="true"
    >
      {id === "vision" ? (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 16s4-8 13-8 13 8 13 8-4 8-13 8S3 16 3 16Z" />
          <circle cx="16" cy="16" r="4" />
        </svg>
      ) : source ? (
        <img src={"/icons/" + source} alt="" width="64" height="64" />
      ) : (
        <span className="app-icon-monogram">{abbreviations[id] ?? "</>"}</span>
      )}
    </span>
  );
}
export const projectedApps = [
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "nodedotjs", name: "Node.js" },
  { id: "drizzle", name: "Drizzle" },
  { id: "react", name: "React" },
  { id: "swift", name: "Swift" },
  { id: "express", name: "Express" },
  { id: "mlx", name: "MLX" },
  { id: "claudecode", name: "Claude Code" },
  { id: "codex", name: "Codex" },
];
export const additionalTools = [
  { id: "ollama", name: "Ollama" },
  { id: "lmstudio", name: "LM Studio" },
  { id: "tailwindcss", name: "Tailwind CSS" },
  { id: "tanstack", name: "TanStack" },
  { id: "prisma", name: "Prisma" },
  { id: "swiftui", name: "SwiftUI" },
  { id: "coreml", name: "Core ML" },
  { id: "vision", name: "Vision" },
  { id: "foundationmodels", name: "Foundation Models" },
  { id: "vite", name: "Vite" },
  { id: "expo", name: "Expo" },
  { id: "mysql", name: "MySQL" },
  { id: "javascript", name: "JavaScript" },
  { id: "html5", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "nextdotjs", name: "Next.js" },
  { id: "express", name: "Express" },
  { id: "drizzle", name: "Drizzle" },
  { id: "supabase", name: "Supabase" },
  { id: "git", name: "Git" },
  { id: "docker", name: "Docker" },
  { id: "mlx", name: "MLX" },
  { id: "vscode", name: "VS Code" },
  { id: "ghostty", name: "Ghostty" },
  { id: "xcode", name: "Xcode" },
  { id: "orbstack", name: "OrbStack" },
  { id: "claudecode", name: "Claude Code" },
  { id: "codex", name: "Codex" },
];
