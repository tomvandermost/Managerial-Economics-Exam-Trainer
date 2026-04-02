import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variant === "default" ? "bg-pine/10 text-pine" : "bg-mist text-slate",
      )}
    >
      {children}
    </span>
  );
}
