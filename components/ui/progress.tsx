export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-mist">
      <div className="h-2 rounded-full bg-pine transition-all" style={{ width: `${Math.max(4, Math.min(value, 100))}%` }} />
    </div>
  );
}
