import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { difficultyLabelMap, questionTypeLabelMap, topicNameMap } from "@/lib/practice";
import { PracticeQuestion } from "@/types";

export function QuestionCard({ question }: { question: PracticeQuestion }) {
  return (
    <Link href={`/practice/${question.id}`} className="block">
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-xl">
        <CardContent className="flex h-full flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{topicNameMap[question.topic]}</Badge>
            <Badge variant="muted">{questionTypeLabelMap[question.type]}</Badge>
            <Badge variant="muted">{difficultyLabelMap[question.difficulty]}</Badge>
          </div>
          <div>
            <h3 className="font-semibold text-ink">{question.title}</h3>
            <p className="mt-2 text-sm text-slate">{question.subtopic}</p>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-slate">{question.questionText}</p>
          <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-wide text-slate">
            <span>{question.sourceExam}</span>
            <span>{question.points} punten</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
