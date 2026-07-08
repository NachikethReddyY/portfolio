import type { ReactNode } from 'react';

type TerminalSequenceProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

type TerminalLineProps = {
  children: ReactNode;
  tone?: 'command' | 'success' | 'info' | 'muted';
  delay?: number;
};

const toneClasses = {
  command: 'text-primary-strong',
  success: 'text-accent',
  info: 'text-primary',
  muted: 'text-on-ink-soft',
};

export function TerminalSequence({
  children,
  className = '',
  label = 'Portfolio terminal readout',
}: TerminalSequenceProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={[
        'relative overflow-hidden rounded-none border border-[#00d2ff]/45 bg-terminal p-4 font-tech text-xs leading-6 text-on-ink sm:text-sm',
        className,
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between border-b border-[#00d2ff]/20 pb-2">
        <span className="text-on-ink-soft">portfolio.boot</span>
        <span className="text-primary-strong">live</span>
      </div>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

export function TerminalLine({ children, tone = 'muted', delay = 0 }: TerminalLineProps) {
  return (
    <div
      className={['terminal-line flex min-w-0 items-start gap-2', toneClasses[tone]].join(' ')}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden="true" className="shrink-0 text-accent">
        $
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
