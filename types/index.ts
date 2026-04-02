export type Topic =
  | "perfecte-concurrentie"
  | "monopolie"
  | "externaliteiten"
  | "welvaartsdiagrammen"
  | "speltheorie"
  | "gedragseconomie"
  | "importtarieven"
  | "artikelen";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "calculation" | "theory" | "graph" | "open";

export interface InteractiveGraphRegion {
  id: string;
  label: string;
  points: string;
  labelX: number;
  labelY: number;
}

export interface InteractiveGraphLine {
  id: string;
  points?: string;
  path?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  label?: string;
  labelX?: number;
  labelY?: number;
  dashed?: boolean;
  tone?: "demand" | "private" | "social" | "guide";
}

export interface InteractiveGraphText {
  id: string;
  x: number;
  y: number;
  text: string;
  tone?: "default" | "muted";
  anchor?: "start" | "middle" | "end";
}

export interface InteractiveGraphPrompt {
  id: string;
  questionText: string;
  correctRegions: string[];
  definitionNL: string;
  explanationNL: string;
}

export interface InteractiveGraphExerciseData {
  id: string;
  title: string;
  contextNL: string;
  regions: InteractiveGraphRegion[];
  lines: InteractiveGraphLine[];
  texts: InteractiveGraphText[];
  prompts: InteractiveGraphPrompt[];
}

export interface PracticeQuestion {
  id: string;
  title: string;
  topic: Topic;
  subtopic: string;
  difficulty: Difficulty;
  type: QuestionType;
  sourceExam: string;
  year: string;
  points: number;
  questionText: string;
  hints: string[];
  steps: string[];
  finalAnswer: string;
  explanation: string;
  commonMistakes: string[];
  formulas?: string[];
  tags?: string[];
  hasDiagram?: boolean;
  interactiveGraphExercise?: InteractiveGraphExerciseData;
}

export interface TopicMeta {
  slug: Topic;
  name: string;
  description: string;
  subtopics: string[];
}

export interface FormulaItem {
  id: string;
  section: string;
  title: string;
  formula?: string;
  symbols?: string[];
  whenToUse: string;
  example: string;
}

export interface TopicPerformance {
  attempts: number;
  correct: number;
  wrong: number;
  flagged: number;
  lastQuestionIds: string[];
}

export interface QuestionPerformance {
  attempts: number;
  correct: number;
  wrong: number;
  flaggedCount: number;
  lastResult?: "right" | "wrong";
}

export interface PracticeStats {
  byTopic: Record<Topic, TopicPerformance>;
  byQuestion: Record<string, QuestionPerformance>;
  miniTestsCompleted: number;
  examsCompleted: number;
}

export interface MiniTestConfig {
  questionCount: 5 | 10 | 15;
  topic: Topic | "mixed";
  difficulty: Difficulty | "mixed";
  includeCalculations: boolean;
  includeTheory: boolean;
  timedMode: boolean;
}
