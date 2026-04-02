import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import {
  Difficulty,
  MiniTestConfig,
  PracticeQuestion,
  PracticeStats,
  QuestionType,
  Topic,
  TopicPerformance,
} from "@/types";

export const topicNameMap = Object.fromEntries(topics.map((topic) => [topic.slug, topic.name])) as Record<Topic, string>;

export const difficultyLabelMap: Record<Difficulty, string> = {
  easy: "Makkelijk",
  medium: "Gemiddeld",
  hard: "Moeilijk",
};

export const questionTypeLabelMap: Record<QuestionType, string> = {
  calculation: "Rekenvraag",
  theory: "Theorievraag",
  graph: "Grafiekvraag",
  open: "Open vraag",
};

export function getTopicMeta(topic: Topic) {
  return topics.find((item) => item.slug === topic);
}

export function getQuestionById(id: string) {
  return questions.find((question) => question.id === id);
}

export function getQuestionsByTopic(topic: Topic) {
  return questions.filter((question) => question.topic === topic);
}

export function filterQuestions(
  source: PracticeQuestion[],
  filters: {
    topic?: Topic | "all";
    difficulty?: Difficulty | "all";
    type?: QuestionType | "all";
    search?: string;
  },
) {
  return source.filter((question) => {
    const matchesTopic = !filters.topic || filters.topic === "all" || question.topic === filters.topic;
    const matchesDifficulty = !filters.difficulty || filters.difficulty === "all" || question.difficulty === filters.difficulty;
    const matchesType = !filters.type || filters.type === "all" || question.type === filters.type;
    const needle = filters.search?.trim().toLowerCase();
    const haystack = `${question.title} ${question.questionText} ${question.subtopic}`.toLowerCase();
    const matchesSearch = !needle || haystack.includes(needle);
    return matchesTopic && matchesDifficulty && matchesType && matchesSearch;
  });
}

export function getRandomQuestion(topic?: Topic) {
  const pool = topic ? getQuestionsByTopic(topic) : questions;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getSimilarQuestions(question: PracticeQuestion, limit = 3) {
  return questions
    .filter((item) => item.id !== question.id && item.topic === question.topic)
    .sort((a, b) => {
      const subtopicScoreA = a.subtopic === question.subtopic ? 1 : 0;
      const subtopicScoreB = b.subtopic === question.subtopic ? 1 : 0;
      return subtopicScoreB - subtopicScoreA;
    })
    .slice(0, limit);
}

export function generateMiniTest(config: MiniTestConfig) {
  let pool = questions;

  if (config.topic !== "mixed") {
    pool = pool.filter((question) => question.topic === config.topic);
  }

  if (config.difficulty !== "mixed") {
    pool = pool.filter((question) => question.difficulty === config.difficulty);
  }

  const allowedTypes: QuestionType[] = [];
  if (config.includeCalculations) allowedTypes.push("calculation", "graph");
  if (config.includeTheory) allowedTypes.push("theory", "open");
  if (allowedTypes.length) {
    pool = pool.filter((question) => allowedTypes.includes(question.type));
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.questionCount);
}

export function generateFullExam() {
  const sectionTopics: Topic[] = [
    "perfecte-concurrentie",
    "monopolie",
    "externaliteiten",
    "welvaartsdiagrammen",
    "speltheorie",
    "gedragseconomie",
    "importtarieven",
    "artikelen",
  ];

  return sectionTopics.map((topic) => ({
    topic,
    title: topicNameMap[topic],
    questions: getQuestionsByTopic(topic).slice(0, 3),
  }));
}

function emptyTopicPerformance(): TopicPerformance {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    flagged: 0,
    lastQuestionIds: [],
  };
}

export function createEmptyStats(): PracticeStats {
  return {
    byTopic: {
      "perfecte-concurrentie": emptyTopicPerformance(),
      monopolie: emptyTopicPerformance(),
      externaliteiten: emptyTopicPerformance(),
      welvaartsdiagrammen: emptyTopicPerformance(),
      speltheorie: emptyTopicPerformance(),
      gedragseconomie: emptyTopicPerformance(),
      importtarieven: emptyTopicPerformance(),
      artikelen: emptyTopicPerformance(),
    },
    byQuestion: {},
    miniTestsCompleted: 0,
    examsCompleted: 0,
  };
}

export function calculateAccuracy(correct: number, attempts: number) {
  if (!attempts) return 0;
  return Math.round((correct / attempts) * 100);
}

export function getWeakTopics(stats: PracticeStats) {
  return (Object.entries(stats.byTopic) as [Topic, TopicPerformance][])
    .filter(([, performance]) => performance.attempts > 0 && calculateAccuracy(performance.correct, performance.attempts) < 60)
    .map(([topic]) => topic);
}

export function getRecommendations(stats: PracticeStats) {
  const weakTopics = getWeakTopics(stats);
  const recommendations: string[] = [];

  if (weakTopics.length > 0) {
    recommendations.push(`Focus next on ${weakTopics.map((topic) => topicNameMap[topic]).join(" en ")}.`);
  }
  if (weakTopics.includes("monopolie") && weakTopics.includes("perfecte-concurrentie")) {
    recommendations.push("Herhaal het formuleoverzicht voor MR, MC, winstmaximalisatie en elasticiteit.");
  }
  if (weakTopics.includes("externaliteiten") && weakTopics.includes("importtarieven")) {
    recommendations.push("Oefen extra op welvaartsdiagrammen met deadweight loss, belastingen en tarieven.");
  }
  if (weakTopics.includes("gedragseconomie")) {
    recommendations.push("Plan een korte concept flash review voor adverse selection, moral hazard en nudging.");
  }

  const flaggedPriority = Object.entries(stats.byQuestion)
    .filter(([, performance]) => performance.flaggedCount >= 2)
    .map(([id]) => getQuestionById(id))
    .filter(Boolean)
    .slice(0, 3)
    .map((question) => question!.title);

  if (flaggedPriority.length) {
    recommendations.push(`Prioriteer vergelijkbare vragen als: ${flaggedPriority.join(", ")}.`);
  }

  return recommendations.length ? recommendations : ["Je resultaten zijn breed stabiel. Kies nu een gemengde mini-toets om transfer te oefenen."];
}

export function scoreMiniTest(questionIds: string[], answers: Record<string, "right" | "wrong" | undefined>) {
  const scored = questionIds.map((id) => ({
    question: getQuestionById(id)!,
    result: answers[id],
  }));
  const correct = scored.filter((entry) => entry.result === "right").length;
  const wrong = scored.filter((entry) => entry.result === "wrong").length;
  const total = scored.length;

  const byTopic = scored.reduce<Record<string, { total: number; correct: number }>>((acc, entry) => {
    const topic = entry.question.topic;
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0 };
    }
    acc[topic].total += 1;
    if (entry.result === "right") acc[topic].correct += 1;
    return acc;
  }, {});

  return {
    correct,
    wrong,
    total,
    percentage: total ? Math.round((correct / total) * 100) : 0,
    byTopic,
  };
}
