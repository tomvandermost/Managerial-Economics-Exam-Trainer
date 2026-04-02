"use client";

import { PracticeQuestion } from "@/types";

const glossary: Record<string, string> = {
  ATC: "gemiddelde totale kosten",
  AVC: "gemiddelde variabele kosten",
  CS: "consumentensurplus",
  DWL: "deadweight loss, dus netto welvaartsverlies",
  ED: "externe schade",
  EMC: "externe marginale kosten",
  MC: "marginale kosten",
  MED: "marginale externe schade",
  MR: "marginale opbrengst",
  Nash: "een uitkomst waarin geen speler eenzijdig wil afwijken",
  PMB: "private marginale baat",
  PMC: "private marginale kosten",
  PS: "producentensurplus",
  SMB: "sociale marginale baat",
  SMC: "sociale marginale kosten",
  TC: "totale kosten",
  TR: "totale opbrengst",
};

const formulaHelp: Record<string, string> = {
  "TR = P x Q": "Totale opbrengst (TR) is prijs (P) maal hoeveelheid (Q). Deze formule gebruik je om omzet te berekenen.",
  "MR = dTR / dQ": "Marginale opbrengst (MR) laat zien hoeveel de totale opbrengst verandert als de hoeveelheid Q met 1 extra eenheid toeneemt.",
  "Winst = TR - TC": "Winst is totale opbrengst (TR) min totale kosten (TC). Hiermee bepaal je wat er na aftrek van alle kosten overblijft.",
  "MR = MC": "Bij winstmaximalisatie kiest een onderneming de hoeveelheid waarbij marginale opbrengst (MR) gelijk is aan marginale kosten (MC).",
  "P = MC als benchmark": "In de competitieve benchmark geldt prijs (P) gelijk aan marginale kosten (MC). Dat geeft het efficiënte vergelijkingspunt.",
  "Qd = Qs": "In marktevenwicht is gevraagde hoeveelheid (Qd) gelijk aan aangeboden hoeveelheid (Qs).",
  "Pc = Pp + t": "De consumentenprijs (Pc) is gelijk aan de producentenprijs (Pp) plus de belasting per eenheid (t). Dat is de belastingwig.",
  "Overheidsopbrengst = t x Q": "De belastingopbrengst is belasting per eenheid maal het aantal verhandelde eenheden.",
  "DWL = 0,5 x afname in Q x belastingwig": "Deadweight loss is de oppervlakte van een driehoek: een halve keer basis keer hoogte.",
  "E_d = %deltaQ / %deltaP": "De prijselasticiteit van de vraag laat zien hoe sterk de gevraagde hoeveelheid reageert op een prijsverandering.",
  "Shutdown-regel: produceer als P >= AVC": "Een firma produceert op korte termijn zolang de prijs minstens de gemiddelde variabele kosten dekt.",
  "Per markt geldt MR_i = MC": "Bij prijsdiscriminatie kies je per deelmarkt de hoeveelheid waarbij marginale opbrengst gelijk is aan marginale kosten.",
  "SMC = PMC + EMC": "Sociale marginale kosten (SMC) zijn private marginale kosten (PMC) plus externe marginale kosten (EMC).",
  "Markt: P = PMC": "Zonder ingrijpen kijkt de markt naar private marginale kosten, niet naar externe schade.",
  "Sociaal optimum: P = SMC": "Het sociale optimum houdt wel rekening met alle maatschappelijke kosten.",
  "Pigouviaanse belasting t = EMC": "Een Pigouviaanse belasting zet de externe schade om in een private kostenprikkel.",
  "MED = dED / dQ": "Marginale externe schade (MED) is de afgeleide van de externe schadefunctie naar de hoeveelheid.",
  "CS = 0,5 x basis x hoogte": "Consumentensurplus is in lineaire grafieken vaak de oppervlakte van een driehoek.",
  "Import = vraag - aanbod": "Import is het deel van de binnenlandse consumptie dat niet door binnenlandse producenten wordt geleverd.",
};

function explainAbbreviations(text: string) {
  const seen = new Set<string>();

  return text.replace(/\b[A-Z]{2,4}\b/g, (abbr) => {
    const explanation = glossary[abbr];

    if (!explanation || seen.has(abbr)) {
      return abbr;
    }

    seen.add(abbr);
    return `${abbr} (${explanation})`;
  });
}

function splitReasoning(text: string) {
  return text
    .replace(/\. (?=[A-ZÀ-ÖØ-Þ(])/g, ".\n")
    .replace(/; /g, ";\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => explainAbbreviations(line));
}

function getFormulaExplanation(formula: string) {
  return formulaHelp[formula] ?? explainAbbreviations(formula);
}

function usesDerivative(question: PracticeQuestion) {
  const haystack = [question.finalAnswer, question.explanation, ...(question.formulas ?? [])].join(" ");
  return /afgeleide|different|dTR\s*\/\s*dQ|dED\s*\/\s*dQ|MR\s*=|MED\s*=/.test(haystack);
}

function getInterpretation(question: PracticeQuestion) {
  return explainAbbreviations(question.explanation);
}

export function AnswerModel({ question }: { question: PracticeQuestion }) {
  const reasoningLines = splitReasoning(question.finalAnswer);
  const derivativeNote = usesDerivative(question)
    ? "Als hier een afgeleide wordt gebruikt, differentiëren we een functie naar Q om te zien hoe die verandert bij 1 extra eenheid output. Een constante verandert niet mee met Q, dus de afgeleide van een constante is 0."
    : null;

  return (
    <div className="space-y-5 text-[15px] leading-7 text-ink">
      <section className="space-y-2 rounded-2xl bg-mist/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Gegeven</p>
        <p>{question.questionText}</p>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Gevraagd</p>
        <p>{question.title}</p>
      </section>

      {question.formulas?.length ? (
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Stap 1: formule en uitleg</p>
          <div className="space-y-2">
            {question.formulas.map((formula) => (
              <div key={formula} className="rounded-2xl border border-black/5 bg-white/80 p-4">
                <p className="font-semibold text-ink">{formula}</p>
                <p className="mt-1 text-sm text-slate">{getFormulaExplanation(formula)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Stap 2: aanpak</p>
        <div className="space-y-3">
          {question.steps.map((step, index) => (
            <div key={`${question.id}-step-${index}`} className="rounded-2xl border border-black/5 bg-white/80 p-4">
              <p className="font-semibold text-ink">{`Stap ${index + 1}: ${explainAbbreviations(step)}`}</p>
              {question.hints[index] ? <p className="mt-1 text-sm text-slate">{explainAbbreviations(question.hints[index])}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Stap 3: uitwerken</p>
        <div className="space-y-2">
          {reasoningLines.map((line, index) => (
            <p key={`${question.id}-line-${index}`} className="rounded-2xl bg-white/70 p-4">
              {line}
            </p>
          ))}
        </div>
        {derivativeNote ? <p className="rounded-2xl border border-black/5 bg-mist/40 p-4 text-sm text-slate">{derivativeNote}</p> : null}
      </section>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">Stap 4: economische interpretatie</p>
        <p>{getInterpretation(question)}</p>
      </section>

      <section className="space-y-2 rounded-2xl bg-pine px-4 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Eindantwoord</p>
        <p className="font-medium">{explainAbbreviations(question.finalAnswer)}</p>
      </section>
    </div>
  );
}
