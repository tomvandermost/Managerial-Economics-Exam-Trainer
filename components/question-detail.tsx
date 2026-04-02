"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EconomicsDiagram } from "@/components/diagrams/economics-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleAccordion } from "@/components/ui/accordion";
import { difficultyLabelMap, getSimilarQuestions, questionTypeLabelMap, topicNameMap } from "@/lib/practice";
import { incrementFlag, loadStats, saveStats, updateStatsWithResult } from "@/lib/storage";
import { PracticeQuestion, QuestionPerformance } from "@/types";

export function QuestionDetail({ question }: { question: PracticeQuestion }) {
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionPerformance | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const similar = getSimilarQuestions(question);

  useEffect(() => {
    const stats = loadStats();
    setQuestionStats(stats.byQuestion[question.id] ?? null);
    setStatsLoaded(true);
  }, [question.id]);

  const markResult = (result: "right" | "wrong") => {
    const stats = loadStats();
    const next = updateStatsWithResult(stats, question, result);
    saveStats(next);
    setQuestionStats(next.byQuestion[question.id] ?? null);
    setFeedback(result === "right" ? "Opgeslagen als goed beantwoord." : "Opgeslagen als fout beantwoord.");
  };

  const flagQuestion = () => {
    const stats = loadStats();
    const next = incrementFlag(stats, question);
    saveStats(next);
    setQuestionStats(next.byQuestion[question.id] ?? null);
    setFeedback("Vraag gemarkeerd als moeilijk.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{topicNameMap[question.topic]}</Badge>
            <Badge variant="muted">{question.subtopic}</Badge>
            <Badge variant="muted">{difficultyLabelMap[question.difficulty]}</Badge>
            <Badge variant="muted">{questionTypeLabelMap[question.type]}</Badge>
          </div>
          <div>
            <h2 className="font-serif text-3xl">{question.title}</h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate">
              <span>Bron: {question.sourceExam}</span>
              <span>Jaar: {question.year}</span>
              <span>Punten: {question.points}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-mist/60 p-5 text-[15px] leading-7 text-ink">
            {question.questionText}
          </div>

          {question.hasDiagram ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink">Schematische diagramondersteuning</p>
              <EconomicsDiagram topic={question.topic} />
            </div>
          ) : null}

          <div className="grid gap-3">
            {question.hints.map((hint, index) => (
              <SimpleAccordion key={index} title={`Hint ${index + 1}`}>
                <p>{hint}</p>
              </SimpleAccordion>
            ))}
            <SimpleAccordion title="Toon stappenplan">
              <ol className="list-decimal space-y-2 pl-5">
                {question.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </SimpleAccordion>
            <SimpleAccordion title="Toon antwoordmodel">
              <p>{question.finalAnswer}</p>
            </SimpleAccordion>
            <SimpleAccordion title="Toon economische uitleg">
              <div className="space-y-4">
                <p>{question.explanation}</p>
                {question.formulas?.length ? (
                  <div>
                    <p className="font-semibold text-ink">Formules en concepten</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {question.formulas.map((formula) => (
                        <li key={formula}>{formula}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div>
                  <p className="font-semibold text-ink">Veelgemaakte fouten</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {question.commonMistakes.map((mistake) => (
                      <li key={mistake}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SimpleAccordion>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => markResult("right")}>Ik had dit goed</Button>
            <Button variant="secondary" onClick={() => markResult("wrong")}>
              Ik had dit fout
            </Button>
            <Button variant="outline" onClick={flagQuestion}>
              Markeer als moeilijk{questionStats?.flaggedCount ? ` (${questionStats.flaggedCount})` : ""}
            </Button>
            <Button variant="ghost" onClick={() => window.location.assign(`/practice/${similar[0]?.id ?? question.id}`)}>
              Probeer een vergelijkbare vraag
            </Button>
          </div>
          {statsLoaded ? (
            <div className="space-y-1 text-xs text-slate">
              <p>Voortgang wordt automatisch lokaal opgeslagen in je browser.</p>
              {feedback ? <p className="font-medium text-pine">{feedback}</p> : null}
              {questionStats ? (
                <p>
                  Deze vraag: {questionStats.correct}x goed, {questionStats.wrong}x fout, {questionStats.flaggedCount}x moeilijk gemarkeerd.
                </p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="font-serif text-2xl">Gerichte vervolgvragen</h3>
            <div className="space-y-3">
              {similar.map((item) => (
                <Link key={item.id} href={`/practice/${item.id}`} className="block rounded-xl border border-black/5 bg-mist/60 p-4 hover:bg-mist">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-slate">{item.subtopic}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <h3 className="font-serif text-2xl">Snel navigeren</h3>
            <div className="grid gap-2">
              <Link href={`/topics/${question.topic}`} className="rounded-xl bg-mist/60 px-4 py-3 text-sm text-ink hover:bg-mist">
                Terug naar onderwerp
              </Link>
              <Link href="/mini-test" className="rounded-xl bg-mist/60 px-4 py-3 text-sm text-ink hover:bg-mist">
                Start een mini-toets
              </Link>
              <Link href="/formulas" className="rounded-xl bg-mist/60 px-4 py-3 text-sm text-ink hover:bg-mist">
                Open formuleoverzicht
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
