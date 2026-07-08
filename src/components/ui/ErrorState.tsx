type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({ title = 'Content fallback active', message }: ErrorStateProps) {
  return (
    <div className="rounded-lg border-2 border-ink bg-warning p-4 text-sm text-on-accent">
      <p className="font-bold">{title}</p>
      <p className="text-on-accent-soft mt-1 font-medium">{message}</p>
    </div>
  );
}
