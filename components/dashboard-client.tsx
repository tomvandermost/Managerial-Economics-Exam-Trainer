"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateAccuracy, getRecommendations, topicNameMap } from "@/lib/practice";
import { loadStats } from "@/lib/storage";
import { questions } from "@/data/questions";
import { PracticeStats, Topic } from "@/types";

export function DashboardClient() {
  const [stats, setStats] = useState<PracticeStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const flaggedQuestions = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byQuestion)
      .filter(([, performance]) => performance.flaggedCount > 0)
      .sort((a, b) => b[1].flaggedCount - a[1].flaggedCount)
      .map(([id, performance]) => ({
        question: questions.find((item) => item.id === id),
        flaggedCount: performance.flaggedCount,
        wrong: performance.wrong,
      }))
      .filter((item) => item.question)
      .slice(0, 8);
  }, [stats]);

  if (!stats) return null;

  const recommendations = getRecommendations(stats);
  const topicEntries = Object.entries(stats.byTopic) as [Topic, PracticeStats["byTopic"][Topic]][];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <p className="text-sm text-slate">Beantwoorde vragen</p>
            <p className="mt-2 font-serif text-4xl">{topicEntries.reduce((sum, [, topic]) => sum + topic.attempts, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate">Mini-toetsen voltooid</p>
            <p className="mt-2 font-serif text-4xl">{stats.miniTestsCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate">Tentamens voltooid</p>
            <p className="mt-2 font-serif text-4xl">{stats.examsCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-slate">Gemiddelde topic-accuracy</p>
            <p className="mt-2 font-serif text-4xl">
              {Math.round(topicEntries.reduce((sum, [, topic]) => sum + calculateAccuracy(topic.correct, topic.attempts), 0) / topicEntries.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5">
            <h2 className="font-serif text-2xl">Accuracy per onderwerp</h2>
            {topicEntries.map(([topic, performance]) => {
              const accuracy = calculateAccuracy(performance.correct, performance.attempts);
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{topicNameMap[topic]}</span>
                    <span className="text-slate">
                      {accuracy}% · niveau-inschatting {performance.attempts === 0 ? "nog geen data" : performance.correct > performance.wrong ? "redelijk beheerst" : "extra oefening nodig"}
                    </span>
                  </div>
                  <Progress value={accuracy || 4} />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-2xl">Slimme aanbevelingen</h2>
            <div className="space-y-3 text-sm leading-6 text-slate">
              {recommendations.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-2xl">Meest gemarkeerde vragen</h2>
            <div className="space-y-3">
              {flaggedQuestions.length ? (
                flaggedQuestions.map((item) => (
                  <Link key={item.question!.id} href={`/practice/${item.question!.id}`} className="block rounded-xl bg-mist/60 p-4 hover:bg-mist">
                    <p className="font-semibold text-ink">{item.question!.title}</p>
                    <p className="mt-1 text-sm text-slate">
                      {topicNameMap[item.question!.topic]} · {item.flaggedCount}x moeilijk gemarkeerd · {item.wrong}x fout
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate">Nog geen gemarkeerde vragen.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-serif text-2xl">Terugkerende fouten</h2>
            <div className="space-y-3">
              {Object.entries(stats.byQuestion)
                .filter(([, performance]) => performance.wrong > 0)
                .sort((a, b) => b[1].wrong - a[1].wrong)
                .slice(0, 6)
                .map(([id, performance]) => {
                  const question = questions.find((item) => item.id === id);
                  if (!question) return null;
                  return (
                    <Link key={id} href={`/practice/${id}`} className="block rounded-xl bg-mist/60 p-4 hover:bg-mist">
                      <p className="font-semibold text-ink">{question.title}</p>
                      <p className="mt-1 text-sm text-slate">{performance.wrong} keer fout beantwoord</p>
                    </Link>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
