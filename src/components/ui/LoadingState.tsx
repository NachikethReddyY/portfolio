type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading content' }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" className="grid gap-4">
      <span className="sr-only">{label}</span>
      <div className="h-6 w-48 animate-pulse rounded-none border border-[#00d2ff]/45 bg-terminal" />
      <div className="grid gap-3">
        <div className="h-24 animate-pulse rounded-none border border-[#00d2ff]/24 bg-surface" />
        <div className="h-24 animate-pulse rounded-none border border-[#00d2ff]/24 bg-surface" />
      </div>
    </div>
  );
}
