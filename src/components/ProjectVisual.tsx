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
    accent: 'bg-primary',
    accentText: 'text-primary-strong',
    border: 'border-primary',
    fill: 'fill-primary',
    soft: 'bg-primary/20',
    stroke: 'stroke-primary',
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
      className="relative min-h-72 overflow-hidden bg-terminal p-4"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#00d2ff]/30 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-danger" />
          <span className="size-3 rounded-full bg-warning" />
          <span className="size-3 rounded-full bg-success" />
        </div>
        <span className="shrink-0 font-tech text-[0.68rem] text-muted">{status}</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
        <div className="text-on-ink min-w-0 sm:border-r sm:border-[#00d2ff]/24 sm:pr-4">
          <div className="mb-4 flex min-w-0 items-center justify-between gap-3 font-tech text-[0.66rem]">
            <span className="text-on-ink-soft min-w-0 break-all">~/nachiketh/{repoSlug}</span>
            <span className={['shrink-0', tone.accentText].join(' ')}>main</span>
          </div>
          <div className="space-y-2 font-tech text-[0.66rem] leading-5">
            {terminalRows.map((row, index) => (
              <div key={row} className="flex min-w-0 items-center gap-2 border-b border-bg/10 pb-1 last:border-b-0">
                <span className={index === 0 ? tone.accentText : 'text-muted'}>
                  {index === 0 ? '$' : '>'}
                </span>
                <span className="text-on-ink min-w-0 break-words">{row}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 border-y border-[#00d2ff]/24 py-3">
            {['ui', 'api', 'ai'].map((label, index) => (
              <div key={label} className="border-r border-[#00d2ff]/20 px-2 last:border-r-0">
                <span className="text-on-ink-soft block font-tech text-[0.6rem] uppercase">{label}</span>
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

        <div className="grid content-start gap-4">
          <div className={['border-b pb-3', tone.border].join(' ')}>
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
              <path d="M14 112H190M18 14V112" className="stroke-primary/45" strokeWidth="2" />
              <path d="M18 82H190M18 52H190M18 22H190" className="stroke-primary/15" strokeWidth="1.5" />
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
          <div className="grid grid-cols-2 border-y border-[#00d2ff]/24 py-3">
            <div className="border-r border-[#00d2ff]/20 px-3">
              <span className="font-tech text-[0.6rem] uppercase text-muted">scope</span>
              <span className="block font-tech text-[0.68rem] text-ink">full stack</span>
            </div>
            <div className="px-3">
              <span className="font-tech text-[0.6rem] uppercase text-muted">mode</span>
              <span className={['block font-tech text-[0.68rem]', tone.accentText].join(' ')}>
                shipped
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
