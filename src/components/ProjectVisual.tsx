type ProjectVisualProps = {
  title: string;
  status: string;
};

const tones = [
  {
    accent: 'bg-primary',
    accentText: 'text-primary-strong',
    border: 'border-primary',
    fill: 'fill-primary',
    soft: 'bg-primary/25',
    stroke: 'stroke-primary',
  },
  {
    accent: 'bg-accent',
    accentText: 'text-accent',
    border: 'border-accent',
    fill: 'fill-accent',
    soft: 'bg-accent/30',
    stroke: 'stroke-accent',
  },
  {
    accent: 'bg-violet',
    accentText: 'text-violet',
    border: 'border-violet',
    fill: 'fill-violet',
    soft: 'bg-violet/20',
    stroke: 'stroke-violet',
  },
];

function hashTitle(title: string) {
  return Array.from(title).reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function ProjectVisual({ title, status }: ProjectVisualProps) {
  const hash = hashTitle(title);
  const tone = tones[hash % tones.length];
  const repoSlug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 24) || 'project';
  const graphValues = [66, 38, 74, 52, 84, 46, 70, 58].map(
    (value, index) => Math.min(92, value + ((hash + index * 11) % 12)),
  );
  const graphPoints = graphValues
    .map((value, index) => `${18 + index * 24},${112 - value}`)
    .join(' ');
  const terminalRows = [
    `git switch ${repoSlug}`,
    'pnpm typecheck --strict',
    'sanity query project.preview',
    'scan routes / api / auth',
    'preview deploy ready',
  ];

  return (
    <div
      aria-label={`${title} interface preview`}
      className="relative min-h-72 overflow-hidden rounded-lg border-2 border-ink bg-surface p-3"
    >
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-danger" />
          <span className="size-3 rounded-full bg-warning" />
          <span className="size-3 rounded-full bg-success" />
        </div>
        <span className="font-tech text-[0.68rem] text-muted">{status}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
        <div className="text-on-ink min-w-0 rounded-md border-2 border-ink bg-terminal p-3">
          <div className="mb-4 flex items-center justify-between gap-3 font-tech text-[0.66rem]">
            <span className="text-on-ink-soft truncate">~/nachiketh/{repoSlug}</span>
            <span className={tone.accentText}>main</span>
          </div>
          <div className="space-y-2 font-tech text-[0.66rem] leading-5">
            {terminalRows.map((row, index) => (
              <div key={row} className="flex min-w-0 items-center gap-2 border-b border-bg/10 pb-1 last:border-b-0">
                <span className={index === 0 ? tone.accentText : 'text-muted'}>
                  {index === 0 ? '$' : '>'}
                </span>
                <span className="text-on-ink truncate">{row}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {['ui', 'api', 'ai'].map((label, index) => (
              <div key={label} className="rounded-md border border-bg/25 px-2 py-2">
                <span className="text-on-ink-soft block font-tech text-[0.6rem]">{label}</span>
                <span
                  className={[
                    'mt-2 block h-1.5 rounded-full',
                    index === 1 ? tone.accent : 'bg-bg/35',
                  ].join(' ')}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className={['rounded-md border-2 bg-bg p-3', tone.border].join(' ')}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-tech text-[0.66rem] font-bold text-ink">runtime map</span>
              <span className={['font-tech text-[0.66rem]', tone.accentText].join(' ')}>
                {88 + (hash % 9)}%
              </span>
            </div>
            <svg
              className="mt-3 h-32 w-full"
              viewBox="0 0 204 126"
              role="img"
              aria-label={`${title} terminal graph wireframe`}
            >
              <path d="M14 112H190M18 14V112" className="stroke-ink/45" strokeWidth="2" />
              <path d="M18 82H190M18 52H190M18 22H190" className="stroke-ink/15" strokeWidth="1.5" />
              <polyline
                points={graphPoints}
                fill="none"
                className={tone.stroke}
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {graphValues.map((value, index) => (
                <circle
                  key={`${value}-${index}`}
                  cx={18 + index * 24}
                  cy={112 - value}
                  r={index % 2 === 0 ? 4 : 3}
                  className={tone.fill}
                />
              ))}
              <text x="22" y="106" className="fill-muted font-tech text-[8px]">
                api
              </text>
              <text x="138" y="24" className="fill-muted font-tech text-[8px]">
                model
              </text>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={['rounded-md border-2 border-ink px-3 py-2', tone.soft].join(' ')}>
              <span className="font-tech text-[0.6rem] text-muted">scope</span>
              <span className="block truncate font-tech text-[0.68rem] text-ink">full stack</span>
            </div>
            <div className="rounded-md border-2 border-ink bg-surface px-3 py-2">
              <span className="font-tech text-[0.6rem] text-muted">mode</span>
              <span className="block truncate font-tech text-[0.68rem] text-ink">shipped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
