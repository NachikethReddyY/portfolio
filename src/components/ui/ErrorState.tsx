type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({ title = 'Content fallback active', message }: ErrorStateProps) {
  return (
    <div className="rounded-none border border-[#00d2ff]/45 bg-terminal p-4 text-sm text-ink shadow-[5px_5px_0_#243a56]">
      <p className="font-bold">{title}</p>
      <p className="mt-1 font-medium text-muted">{message}</p>
    </div>
  );
}
