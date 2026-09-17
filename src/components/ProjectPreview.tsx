import type { CaseStudy } from "../content/types";
const commands: Record<
  string,
  { file: string; command: string; lines: string[] }
> = {
  "model-shelf": {
    file: "model-shelf / registry",
    command: "ms search qwen",
    lines: [
      "FORMAT       MODEL                 QUANT",
      "gguf         Qwen3-14B-GGUF         Q4_K_M",
      "mlx          Qwen3-14B-4bit         4bit",
      "safetensors  Qwen3-14B              —",
      "",
      "One model registry. Multiple runtimes.",
    ],
  },
  "qwen3-distill": {
    file: "qwen3-distill / training",
    command: "training/train_mlx.sh",
    lines: [
      "qwen3-distill/",
      "├── data/",
      "│   ├── train.jsonl",
      "│   └── train_tooluse.jsonl",
      "├── training/",
      "└── adapters/",
    ],
  },
  keel: {
    file: "keel / tasks.md",
    command: "keel doctor",
    lines: [
      "- [ ] Review parser edge cases",
      "      status:todo  priority:p2",
      "      category:work  +ai",
      "",
      "      - [ ] Draft acceptance criteria",
      "",
      "A Markdown ledger. A terminal interface.",
    ],
  },
  voxscribe: {
    file: "voxscribe / config",
    command: "voxscribe",
    lines: [
      "Transcribe        Ctrl+Shift+S",
      "Smart Write       Ctrl+Shift+D",
      "",
      "[whisper]",
      'model_path = "base.en"',
      'device = "auto"',
      'compute_type = "int8"',
    ],
  },
};
export function ProjectPreview({ project }: { project: CaseStudy }) {
  const snippet = commands[project.slug];
  if (snippet)
    return (
      <div
        className={`project-terminal terminal-${project.slug}`}
        aria-label={`${project.name} README-based project illustration`}
      >
        <div className="terminal-chrome">
          <span />
          <span />
          <span />
          <code>{snippet.file}</code>
        </div>
        <div className="terminal-content">
          <p>
            <span>❯</span> {snippet.command}
          </p>
          <pre>{snippet.lines.join("\n")}</pre>
        </div>
        <small>From the project documentation</small>
      </div>
    );
  if (project.slug === "coreml-workshop")
    return (
      <div
        className="coreml-preview"
        aria-label="On-device image classification workshop illustration"
      >
        <div className="phone-preview">
          <div className="phone-notch" />
          <span>Image classification</span>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path
              d="M51 30C35 18 15 34 20 58S44 90 51 77C60 92 83 73 83 53S63 23 51 30Z"
              fill="#d8df65"
            />
            <path
              d="M51 30C50 12 62 9 70 13C67 25 58 26 51 30Z"
              fill="#72c69c"
            />
          </svg>
          <strong>Photo → model → label</strong>
          <div className="phone-home" />
        </div>
        <span className="preview-side-note">
          SwiftUI
          <br />
          Core ML
          <br />
          Vision
        </span>
      </div>
    );
  if (project.slug === "memworker")
    return (
      <div
        className="memory-preview"
        aria-label="MemWorker prototype workflow illustration"
      >
        <span>MemWorker / prototype</span>
        <strong>
          Less admin.
          <br />
          More time to care.
        </strong>
        <div>
          <span>Session notes</span>
          <span>Client memory</span>
          <span>CANS workflow</span>
        </div>
      </div>
    );
  return (
    <div className="repository-preview">
      <div>
        <span className="repo-bracket">{"{ }"}</span>
        <span>Project notes</span>
      </div>
      <strong>{project.name}</strong>
      <p>{project.stack.slice(0, 3).join(" · ")}</p>
      <span className="repository-preview-line" />
    </div>
  );
}
