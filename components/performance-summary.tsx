"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateAccuracy, getRecommendations, topicNameMap } from "@/lib/practice";
import { loadStats } from "@/lib/storage";
import { PracticeStats, Topic } from "@/types";

export function PerformanceSummary() {
  const [stats, setStats] = useState<PracticeStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  if (!stats) {
    return null;
  }

  const entries = Object.entries(stats.byTopic) as [Topic, PracticeStats["byTopic"][Topic]][];
  const topRecommendations = getRecommendations(stats).slice(0, 2);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <Card>
        <CardContent className="space-y-5">
          <div>
            <h2 className="font-serif text-2xl">Voortgang per onderwerp</h2>
            <p className="mt-2 text-sm text-slate">Accuracy, oefenvolume en signaal van zwakke gebieden op basis van je lokale voortgang.</p>
          </div>
          <div className="space-y-4">
            {entries.map(([topic, performance]) => {
              const accuracy = calculateAccuracy(performance.correct, performance.attempts);
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{topicNameMap[topic]}</span>
                    <span className="text-slate">{accuracy}% accuraat · {performance.attempts} pogingen</span>
                  </div>
                  <Progress value={accuracy || 4} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-serif text-2xl">Aanbevolen volgende stap</h2>
          <div className="space-y-3 text-sm leading-6 text-slate">
            {topRecommendations.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
