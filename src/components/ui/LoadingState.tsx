type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading content' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="grid gap-4">
      <span className="sr-only">{label}</span>
      <div className="h-6 w-48 animate-pulse rounded-md border-2 border-ink bg-primary" />
      <div className="grid gap-3">
        <div className="h-24 animate-pulse rounded-lg border-2 border-ink bg-surface" />
        <div className="h-24 animate-pulse rounded-lg border-2 border-ink bg-surface" />
      </div>
    </div>
  );
}
