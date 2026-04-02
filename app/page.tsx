import Link from "next/link";
import { SiteLayout } from "@/components/layout";
import { PerformanceSummary } from "@/components/performance-summary";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomQuestion } from "@/lib/practice";

const actions = [
  { title: "Oefenen per onderwerp", href: "/topics", text: "Kies een onderwerp, filter op type en werk systematisch door subtopics." },
  { title: "Willekeurige vraag", href: `/practice/${getRandomQuestion().id}`, text: "Start direct met een willekeurige examenvraag uit de volledige dataset." },
  { title: "Mini-toets genereren", href: "/mini-test", text: "Maak een korte set op maat met timed mode, markeringen en lokale opslag." },
  { title: "Volledig tentamen oefenen", href: "/exam", text: "Simuleer een 180-minuten sessie met secties, punten en review aan het eind." },
  { title: "Zwakke onderwerpen", href: "/dashboard", text: "Bekijk accuracy, terugkerende fouten en slimme aanbevelingen." },
  { title: "Formuleoverzicht", href: "/formulas", text: "Herhaal begrippen, symbolen en korte worked examples voor snelle revisie." },
];

export default function HomePage() {
  return (
    <SiteLayout
      title="Managerial Economics Exam Trainer"
      description="Een rustige, professionele oefenomgeving voor oude tentamenthema's: per onderwerp oefenen, willekeurige vragen trekken, mini-toetsen genereren, uitwerkingen stap voor stap openen en zwakke gebieden lokaal volgen."
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <Card key={action.href} className="h-full">
              <CardContent className="flex h-full flex-col gap-4">
                <div>
                  <h2 className="font-serif text-2xl">{action.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate">{action.text}</p>
                </div>
                <div className="mt-auto">
                  <Link href={action.href} className={buttonClassName("default", "w-full")}>
                    Open
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <PerformanceSummary />
      </div>
    </SiteLayout>
  );
}
