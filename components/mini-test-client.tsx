"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonClassName } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import { generateMiniTest, getRecommendations, scoreMiniTest, topicNameMap } from "@/lib/practice";
import { clearMiniTestState, loadMiniTestState, loadStats, saveMiniTestState, saveStats, updateStatsWithResult } from "@/lib/storage";
import { Difficulty, MiniTestConfig, Topic } from "@/types";

type MiniTestSession = {
  config: MiniTestConfig;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, "right" | "wrong" | undefined>;
  flagged: string[];
  startedAt: number;
};

const defaultConfig: MiniTestConfig = {
  questionCount: 5,
  topic: "mixed",
  difficulty: "mixed",
  includeCalculations: true,
  includeTheory: true,
  timedMode: false,
};

export function MiniTestClient() {
  const [config, setConfig] = useState<MiniTestConfig>(defaultConfig);
  const [session, setSession] = useState<MiniTestSession | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const saved = loadMiniTestState<MiniTestSession>();
    if (saved) {
      setSession(saved);
    }
  }, []);

  useEffect(() => {
    if (session) {
      saveMiniTestState(session);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.config.timedMode) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [session?.config.timedMode]);

  const generatedQuestions = useMemo(() => {
    if (!session) return [];
    return session.questionIds.map((id) => questions.find((question) => question.id === id)!).filter(Boolean);
  }, [session]);

  const currentQuestion = session ? generatedQuestions[session.currentIndex] : null;
  const total = generatedQuestions.length;
  const timerValue = session && session.config.timedMode ? Math.max(0, session.config.questionCount * 6 * 60 - Math.floor((now - session.startedAt) / 1000)) : null;

  const startSession = () => {
    const selection = generateMiniTest(config);
    const nextSession: MiniTestSession = {
      config,
      questionIds: selection.map((item) => item.id),
      currentIndex: 0,
      answers: {},
      flagged: [],
      startedAt: Date.now(),
    };
    setSubmitted(false);
    setNow(Date.now());
    setSession(nextSession);
  };

  const updateAnswer = (result: "right" | "wrong") => {
    if (!session || !currentQuestion) return;
    setSession({
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: result,
      },
    });
  };

  const toggleFlag = () => {
    if (!session || !currentQuestion) return;
    const flagged = session.flagged.includes(currentQuestion.id)
      ? session.flagged.filter((id) => id !== currentQuestion.id)
      : [...session.flagged, currentQuestion.id];
    setSession({ ...session, flagged });
  };

  const submitSession = () => {
    if (!session) return;
    const stats = loadStats();
    let nextStats = structuredClone(stats);

    generatedQuestions.forEach((question) => {
      const result = session.answers[question.id];
      if (!result) return;
      nextStats = updateStatsWithResult(nextStats, question, result, session.flagged.includes(question.id));
    });

    nextStats.miniTestsCompleted += 1;
    saveStats(nextStats);
    clearMiniTestState();
    setSubmitted(true);
  };

  const summary = session ? scoreMiniTest(session.questionIds, session.answers) : null;
  const recommendationSource = submitted ? getRecommendations(loadStats()) : [];

  if (!session) {
    return (
      <Card>
        <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl">Mini-toets genereren</h2>
            <p className="text-sm leading-6 text-slate">
              Stel je oefenset samen op onderwerp, moeilijkheid en vraagtype. Onvoltooide sessies worden automatisch in
              localStorage bewaard.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate">
              <span>Aantal vragen</span>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink"
                value={config.questionCount}
                onChange={(event) => setConfig({ ...config, questionCount: Number(event.target.value) as 5 | 10 | 15 })}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate">
              <span>Onderwerp</span>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink"
                value={config.topic}
                onChange={(event) => setConfig({ ...config, topic: event.target.value as Topic | "mixed" })}
              >
                <option value="mixed">Gemengd</option>
                {topics.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate">
              <span>Moeilijkheid</span>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink"
                value={config.difficulty}
                onChange={(event) => setConfig({ ...config, difficulty: event.target.value as Difficulty | "mixed" })}
              >
                <option value="mixed">Mix</option>
                <option value="easy">Makkelijk</option>
                <option value="medium">Gemiddeld</option>
                <option value="hard">Moeilijk</option>
              </select>
            </label>
            <div className="rounded-xl border border-black/10 bg-white p-4 text-sm text-slate">
              <p className="font-semibold text-ink">Beschikbaar</p>
              <p className="mt-2">{questions.length} exam-style vragen in de lokale dataset.</p>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm text-ink">
              <input
                type="checkbox"
                checked={config.includeCalculations}
                onChange={(event) => setConfig({ ...config, includeCalculations: event.target.checked })}
              />
              Alleen reken- en grafiekvragen opnemen
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm text-ink">
              <input
                type="checkbox"
                checked={config.includeTheory}
                onChange={(event) => setConfig({ ...config, includeTheory: event.target.checked })}
              />
              Theorie- en open vragen opnemen
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm text-ink sm:col-span-2">
              <input
                type="checkbox"
                checked={config.timedMode}
                onChange={(event) => setConfig({ ...config, timedMode: event.target.checked })}
              />
              Timed mode inschakelen
            </label>
            <div className="sm:col-span-2">
              <Button className="w-full" onClick={startSession}>
                Genereer mini-toets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitted && summary) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-3xl">Resultaat mini-toets</h2>
            <p className="text-sm text-slate">
              Score: {summary.correct} van {summary.total} goed ({summary.percentage}%).
            </p>
            <Progress value={summary.percentage || 4} />
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="font-serif text-2xl">Prestatie per onderwerp</h3>
              <div className="space-y-3 text-sm text-slate">
                {Object.entries(summary.byTopic).map(([topic, result]) => (
                  <div key={topic} className="rounded-xl bg-mist/60 p-4">
                    <p className="font-semibold text-ink">{topicNameMap[topic as Topic]}</p>
                    <p className="mt-1">
                      {result.correct} goed van {result.total}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4">
              <h3 className="font-serif text-2xl">Aanbevolen revisie</h3>
              <div className="space-y-3 text-sm leading-6 text-slate">
                {recommendationSource.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => window.location.reload()}>Nieuwe mini-toets</Button>
                <Button variant="outline" onClick={() => setSession(null)}>
                  Terug naar generator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate">
              Vraag {session.currentIndex + 1} van {total}
            </p>
            <h2 className="font-serif text-2xl">{currentQuestion?.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            {timerValue !== null ? <Badge>{Math.floor(timerValue / 60)}:{String(timerValue % 60).padStart(2, "0")}</Badge> : null}
            <Badge variant="muted">{currentQuestion ? topicNameMap[currentQuestion.topic] : ""}</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6">
          <p className="text-[15px] leading-7 text-ink">{currentQuestion?.questionText}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => updateAnswer("right")}>Ik had dit goed</Button>
            <Button variant="secondary" onClick={() => updateAnswer("wrong")}>
              Ik had dit fout
            </Button>
            <Button variant="outline" onClick={toggleFlag}>
              {session.flagged.includes(currentQuestion!.id) ? "Moeilijk gemarkeerd" : "Markeer als moeilijk"}
            </Button>
            <Link href={`/practice/${currentQuestion?.id}`} className={buttonClassName("ghost")}>
              Open volledige uitwerking
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={session.currentIndex === 0}
              onClick={() => setSession({ ...session, currentIndex: session.currentIndex - 1 })}
            >
              Vorige
            </Button>
            <Button
              variant="outline"
              disabled={session.currentIndex === total - 1}
              onClick={() => setSession({ ...session, currentIndex: session.currentIndex + 1 })}
            >
              Volgende
            </Button>
            <Button onClick={submitSession}>Toets indienen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
