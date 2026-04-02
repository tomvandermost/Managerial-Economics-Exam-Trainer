import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopicMeta } from "@/types";

export function TopicCard({ topic, questionCount }: { topic: TopicMeta; questionCount: number }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl text-ink">{topic.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate">{topic.description}</p>
          </div>
          <Badge>{questionCount} vragen</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {topic.subtopics.slice(0, 3).map((item) => (
            <Badge key={item} variant="muted">
              {item}
            </Badge>
          ))}
        </div>
        <div className="mt-auto">
          <Link href={`/topics/${topic.slug}`} className={buttonClassName("default", "w-full")}>
            Open onderwerp
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
