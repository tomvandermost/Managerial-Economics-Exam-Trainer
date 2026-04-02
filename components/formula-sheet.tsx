import { formulas } from "@/data/formulas";
import { Card, CardContent } from "@/components/ui/card";

export function FormulaSheet() {
  const grouped = formulas.reduce<Record<string, typeof formulas>>((acc, item) => {
    acc[item.section] = [...(acc[item.section] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([section, items]) => (
        <section key={section} className="space-y-4">
          <h2 className="font-serif text-3xl">{section}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {items?.map((item) => (
              <Card key={item.id}>
                <CardContent className="space-y-3">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  {item.formula ? <p className="rounded-xl bg-mist/60 px-4 py-3 font-mono text-sm text-ink">{item.formula}</p> : null}
                  {item.symbols?.length ? (
                    <ul className="list-disc pl-5 text-sm leading-6 text-slate">
                      {item.symbols.map((symbol) => (
                        <li key={symbol}>{symbol}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-sm leading-6 text-slate">
                    <span className="font-semibold text-ink">Wanneer gebruiken:</span> {item.whenToUse}
                  </p>
                  <p className="text-sm leading-6 text-slate">
                    <span className="font-semibold text-ink">Kort voorbeeld:</span> {item.example}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
