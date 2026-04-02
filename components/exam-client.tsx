"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateFullExam, scoreMiniTest, topicNameMap } from "@/lib/practice";
import { loadStats, saveStats } from "@/lib/storage";

export function ExamClient() {
  const sections = useMemo(() => generateFullExam(), []);
  const flatQuestions = sections.flatMap((section) => section.questions);
  const [answers, setAnswers] = useState<Record<string, "right" | "wrong" | undefined>>({});
  const [hideAnswers, setHideAnswers] = useState(true);
  const [timerOn, setTimerOn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!timerOn) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [timerOn]);

  const timeLeft = timerOn ? Math.max(0, 180 * 60 - Math.floor((now - startedAt) / 1000)) : null;

  if (submitted) {
    const summary = scoreMiniTest(
      flatQuestions.map((item) => item.id),
      answers,
    );
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3">
            <h2 className="font-serif text-3xl">Review scherm</h2>
            <p className="text-sm text-slate">
              Je self-assessmentscore is {summary.correct} van {summary.total} vragen ({summary.percentage}%).
            </p>
          </CardContent>
        </Card>
        {sections.map((section) => (
          <Card key={section.topic}>
            <CardContent className="space-y-3">
              <h3 className="font-serif text-2xl">{section.title}</h3>
              {section.questions.map((question) => (
                <div key={question.id} className="rounded-xl bg-mist/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-ink">{question.title}</p>
                    <Badge>{answers[question.id] === "right" ? "Goed" : answers[question.id] === "wrong" ? "Fout" : "Open"}</Badge>
                  </div>
                  <Link href={`/practice/${question.id}`} className="mt-2 inline-block text-sm text-pine hover:underline">
                    Open uitwerking
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-3xl">Volledig tentamen oefenen</h2>
            <p className="mt-2 text-sm leading-6 text-slate">
              Exam-style layout met secties, puntentotalen, optionele timer van 180 minuten en antwoordcontrole pas aan
              het eind.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {timeLeft !== null ? <Badge>{Math.floor(timeLeft / 60)} min resterend</Badge> : <Badge variant="muted">Timer uit</Badge>}
            <Button variant="outline" onClick={() => setTimerOn((value) => !value)}>
              {timerOn ? "Timer uitzetten" : "Timer aanzetten"}
            </Button>
            <Button variant="outline" onClick={() => setHideAnswers((value) => !value)}>
              {hideAnswers ? "Antwoorden zichtbaar maken" : "Antwoorden verbergen"}
            </Button>
            <Button
              onClick={() => {
                const stats = loadStats();
                saveStats({ ...stats, examsCompleted: stats.examsCompleted + 1 });
                setSubmitted(true);
              }}
            >
              Tentamen afronden
            </Button>
          </div>
        </CardContent>
      </Card>
      {sections.map((section, index) => (
        <Card key={section.topic}>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate">Sectie {index + 1}</p>
                <h3 className="font-serif text-2xl">{section.title}</h3>
              </div>
              <Badge>{section.questions.reduce((total, question) => total + question.points, 0)} punten</Badge>
            </div>
            <div className="space-y-4">
              {section.questions.map((question, questionIndex) => (
                <div key={question.id} className="rounded-2xl bg-mist/60 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-slate">Vraag {questionIndex + 1} · {topicNameMap[question.topic]}</p>
                      <h4 className="mt-1 font-semibold text-ink">{question.title}</h4>
                    </div>
                    <Badge variant="muted">{question.points} punten</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink">{question.questionText}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => setAnswers({ ...answers, [question.id]: "right" })}>
                      Zelf beoordeeld: goed
                    </Button>
                    <Button variant="outline" onClick={() => setAnswers({ ...answers, [question.id]: "wrong" })}>
                      Zelf beoordeeld: fout
                    </Button>
                    <Link href={`/practice/${question.id}`} className={buttonClassName("ghost")}>
                      Open losse uitwerking
                    </Link>
                  </div>
                  {!hideAnswers ? <p className="mt-4 text-sm leading-6 text-slate">{question.finalAnswer}</p> : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
