"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InteractiveGraphExerciseData } from "@/types";

type ExerciseMode = "learn" | "exam";

function sortRegionIds(regionIds: string[]) {
  return [...regionIds].sort((a, b) => a.localeCompare(b));
}

function arraysEqual(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

export function InteractiveGraphExercise({ exercise }: { exercise: InteractiveGraphExerciseData }) {
  const [mode, setMode] = useState<ExerciseMode>("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const currentPrompt = exercise.prompts[currentIndex];
  const sortedSelected = useMemo(() => sortRegionIds(selectedRegions), [selectedRegions]);
  const sortedCorrect = useMemo(() => sortRegionIds(currentPrompt.correctRegions), [currentPrompt.correctRegions]);
  const isExactMatch = arraysEqual(sortedSelected, sortedCorrect);

  const selectedSet = new Set(selectedRegions);
  const correctSet = new Set(currentPrompt.correctRegions);
  const score = Object.values(results).filter(Boolean).length;

  const resetCurrentPrompt = () => {
    setSelectedRegions([]);
    setSubmitted(false);
  };

  const toggleRegion = (regionId: string) => {
    if (submitted) return;
    setSelectedRegions((current) =>
      current.includes(regionId) ? current.filter((id) => id !== regionId) : [...current, regionId],
    );
  };

  const checkAnswer = () => {
    setSubmitted(true);
    setResults((current) => ({ ...current, [currentPrompt.id]: isExactMatch }));
  };

  const goToNextQuestion = () => {
    if (currentIndex === exercise.prompts.length - 1) {
      setCurrentIndex(0);
      setResults({});
    } else {
      setCurrentIndex((value) => value + 1);
    }
    setSelectedRegions([]);
    setSubmitted(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate">Interactieve oefening</p>
            <h3 className="font-serif text-2xl text-ink">{exercise.title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-slate">{exercise.contextNL}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={mode === "learn" ? "default" : "outline"} onClick={() => setMode("learn")}>
              Leerstand
            </Button>
            <Button variant={mode === "exam" ? "default" : "outline"} onClick={() => setMode("exam")}>
              Tentamenstand
            </Button>
          </div>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1.45fr_0.8fr]">
          <div className="rounded-2xl border border-black/5 bg-mist/30 p-4 sm:p-6">
            <svg viewBox="0 0 420 300" className="h-auto min-h-[420px] w-full">
              {exercise.texts.map((text) => (
                <text
                  key={text.id}
                  x={text.x}
                  y={text.y}
                  textAnchor={text.anchor ?? "start"}
                  className={cn("fill-ink text-[12px]", text.tone === "muted" && "fill-slate")}
                >
                  {text.text}
                </text>
              ))}

              {exercise.lines.map((line) => {
                const strokeClass =
                  line.tone === "demand"
                    ? "stroke-amber-700"
                    : line.tone === "private"
                      ? "stroke-pine"
                      : line.tone === "social"
                        ? "stroke-ink"
                        : "stroke-slate";

                return (
                  <g key={line.id}>
                    {line.points ? (
                      <polyline
                        points={line.points}
                        fill="none"
                        className={cn(strokeClass)}
                        strokeWidth={line.tone === "guide" ? 1.6 : 3}
                        strokeDasharray={line.dashed ? "6 6" : undefined}
                      />
                    ) : line.path ? (
                      <path
                        d={line.path}
                        fill="none"
                        className={cn(strokeClass)}
                        strokeWidth={line.tone === "guide" ? 1.6 : 3}
                        strokeDasharray={line.dashed ? "6 6" : undefined}
                      />
                    ) : (
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        className={cn(strokeClass)}
                        strokeWidth={line.tone === "guide" ? 1.6 : 3}
                        strokeDasharray={line.dashed ? "6 6" : undefined}
                      />
                    )}
                    {line.label ? (
                      <text x={line.labelX} y={line.labelY} className="fill-slate text-[11px]">
                        {line.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {exercise.regions.map((region) => {
                const isSelected = selectedSet.has(region.id);
                const isCorrect = correctSet.has(region.id);
                const fillClass = submitted
                  ? isSelected && isCorrect
                    ? "fill-emerald-500/70 stroke-emerald-700"
                    : isSelected && !isCorrect
                      ? "fill-rose-500/70 stroke-rose-700"
                      : !isSelected && isCorrect
                        ? "fill-amber-400/75 stroke-amber-700"
                        : "fill-white/70 stroke-slate/40"
                  : isSelected
                    ? "fill-pine/35 stroke-pine"
                    : "fill-white/65 stroke-slate/40 hover:fill-mist";

                return (
                  <g key={region.id}>
                    <polygon
                      points={region.points}
                      onClick={() => toggleRegion(region.id)}
                      className={cn(
                        "cursor-pointer stroke-[1.5] transition duration-150",
                        !submitted && "origin-center hover:stroke-pine active:scale-[0.985]",
                        fillClass,
                      )}
                    />
                    <text
                      x={region.labelX}
                      y={region.labelY}
                      textAnchor="middle"
                      className="pointer-events-none fill-ink text-[14px] font-semibold"
                    >
                      {region.label}
                    </text>
                    <title>Gebied {region.label}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-mist/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-ink">
                  Vraag {currentIndex + 1} van {exercise.prompts.length}
                </p>
                <p className="text-sm text-slate">
                  Jouw score: {score}/{exercise.prompts.length}
                </p>
              </div>
              <p className="mt-4 font-serif text-xl text-ink">{currentPrompt.questionText}</p>
              <p className="mt-3 text-sm leading-6 text-slate">
                {mode === "learn"
                  ? "Klik op een of meer vlakken en controleer daarna direct je antwoord."
                  : "Werk zoals in een tentamensituatie: kies de vlakken en controleer pas daarna je uitkomst."}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate">
                Geselecteerd: {sortedSelected.length ? sortedSelected.join(" + ") : "Nog niets"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button onClick={checkAnswer} disabled={submitted || selectedRegions.length === 0}>
                Controleer antwoord
              </Button>
              <Button variant="outline" onClick={resetCurrentPrompt}>
                Reset
              </Button>
              <Button variant="secondary" onClick={goToNextQuestion} disabled={!submitted}>
                {currentIndex === exercise.prompts.length - 1 ? "Opnieuw beginnen" : "Volgende vraag"}
              </Button>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/80 p-5 text-sm leading-6 text-slate">
              <p className="font-semibold text-ink">Legenda</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p><span className="font-medium text-emerald-700">Groen</span>: correct geselecteerd</p>
                <p><span className="font-medium text-rose-700">Rood</span>: fout geselecteerd</p>
                <p><span className="font-medium text-amber-700">Oranje</span>: gemist maar wel correct</p>
                <p><span className="font-medium text-slate">Grijs</span>: niet relevant voor deze vraag</p>
              </div>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-black/5 bg-white/90 p-5">
                <p className={cn("font-semibold", isExactMatch ? "text-emerald-700" : "text-rose-700")}>
                  {isExactMatch ? "Helemaal goed." : "Nog niet helemaal goed."}
                </p>
                <p className="mt-3 text-sm text-slate">
                  Correcte combinatie: <span className="font-semibold text-ink">{sortedCorrect.join(" + ")}</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-ink">{currentPrompt.definitionNL}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{currentPrompt.explanationNL}</p>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
