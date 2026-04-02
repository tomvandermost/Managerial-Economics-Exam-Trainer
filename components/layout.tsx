import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Onderwerpen" },
  { href: "/mini-test", label: "Mini-toets" },
  { href: "/exam", label: "Tentamenmodus" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/formulas", label: "Formules" },
];

const signatureOptions = ["Developed by TvdM", "Built with care by TvdM"];

export function SiteLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const signature = signatureOptions[Math.floor(Math.random() * signatureOptions.length)];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-[28px] border border-white/60 bg-ink px-6 py-5 text-white shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-white/65">Managerial Economics</p>
            <h1 className="font-serif text-3xl sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{description}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-8">
        <Card className="bg-white/70">
          <CardContent className="flex flex-col gap-2 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
            <span>Lokale exam trainer met voortgang in localStorage.</span>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <span>Gebouwd voor directe oefening per onderwerp, mini-toets en tentamenmodus.</span>
              <span className="text-xs tracking-wide text-slate/80">{signature}</span>
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
