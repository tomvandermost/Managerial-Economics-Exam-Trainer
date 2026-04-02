"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SimpleAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-black/5 bg-mist/60">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span>{title}</span>
        <span className={cn("text-slate transition-transform", open && "rotate-45")}>+</span>
      </button>
      {open ? <div className="border-t border-black/5 px-4 py-4 text-sm leading-6 text-slate">{children}</div> : null}
    </div>
  );
}
