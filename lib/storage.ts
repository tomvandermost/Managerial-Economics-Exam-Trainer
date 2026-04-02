"use client";

import { createEmptyStats } from "@/lib/practice";
import { PracticeQuestion, PracticeStats } from "@/types";

const STATS_KEY = "managerial-economics-stats";
const MINI_TEST_KEY = "managerial-economics-mini-test";

export function loadStats(): PracticeStats {
  if (typeof window === "undefined") return createEmptyStats();
  const raw = window.localStorage.getItem(STATS_KEY);
  if (!raw) return createEmptyStats();
  try {
    return JSON.parse(raw) as PracticeStats;
  } catch {
    return createEmptyStats();
  }
}

export function saveStats(stats: PracticeStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStatsWithResult(
  current: PracticeStats,
  question: PracticeQuestion,
  result: "right" | "wrong",
  flagged = false,
): PracticeStats {
  const next = structuredClone(current);
  const topicStats = next.byTopic[question.topic];
  topicStats.attempts += 1;
  if (result === "right") {
    topicStats.correct += 1;
  } else {
    topicStats.wrong += 1;
  }
  topicStats.lastQuestionIds = [question.id, ...topicStats.lastQuestionIds.filter((id) => id !== question.id)].slice(0, 6);
  if (flagged) topicStats.flagged += 1;

  const questionStats = next.byQuestion[question.id] ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
    flaggedCount: 0,
  };
  questionStats.attempts += 1;
  if (result === "right") {
    questionStats.correct += 1;
  } else {
    questionStats.wrong += 1;
  }
  questionStats.lastResult = result;
  if (flagged) questionStats.flaggedCount += 1;
  next.byQuestion[question.id] = questionStats;
  return next;
}

export function incrementFlag(current: PracticeStats, question: PracticeQuestion) {
  const next = structuredClone(current);
  next.byTopic[question.topic].flagged += 1;
  const questionStats = next.byQuestion[question.id] ?? {
    attempts: 0,
    correct: 0,
    wrong: 0,
    flaggedCount: 0,
  };
  questionStats.flaggedCount += 1;
  next.byQuestion[question.id] = questionStats;
  return next;
}

export function saveMiniTestState(state: object) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MINI_TEST_KEY, JSON.stringify(state));
}

export function loadMiniTestState<T>() {
  if (typeof window === "undefined") return null as T | null;
  const raw = window.localStorage.getItem(MINI_TEST_KEY);
  if (!raw) return null as T | null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null as T | null;
  }
}

export function clearMiniTestState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MINI_TEST_KEY);
}
