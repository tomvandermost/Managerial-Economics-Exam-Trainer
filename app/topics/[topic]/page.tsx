import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionCard } from "@/components/question-card";
import { SiteLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { getQuestionsByTopic, getTopicMeta } from "@/lib/practice";
import { Topic } from "@/types";

export default async function TopicDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ topic: Topic }>;
  searchParams: Promise<{ difficulty?: string; type?: string }>;
}) {
  const { topic } = await params;
  const filters = await searchParams;
  const meta = getTopicMeta(topic);

  if (!meta) {
    notFound();
  }

  let topicQuestions = getQuestionsByTopic(topic);
  if (filters.difficulty) {
    topicQuestions = topicQuestions.filter((question) => question.difficulty === filters.difficulty);
  }
  if (filters.type) {
    topicQuestions = topicQuestions.filter((question) => question.type === filters.type);
  }

  return (
    <SiteLayout title={meta.name} description={meta.description}>
      <div className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-black/5 bg-white/75 p-6 shadow-panel">
            <h2 className="font-serif text-2xl">Subtopics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.subtopics.map((item) => (
                <Badge key={item} variant="muted">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white/75 p-6 shadow-panel">
            <h2 className="font-serif text-2xl">Filters</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {[
                ["Rekenvraag", "calculation"],
                ["Theorievraag", "theory"],
                ["Grafiekvraag", "graph"],
                ["Open vraag", "open"],
                ["Makkelijk", "easy"],
                ["Gemiddeld", "medium"],
                ["Moeilijk", "hard"],
              ].map(([label, value]) => (
                <Link
                  key={value}
                  href={`/topics/${topic}?${label === "Makkelijk" || label === "Gemiddeld" || label === "Moeilijk" ? `difficulty=${value}` : `type=${value}`}`}
                  className="rounded-full border border-black/10 bg-mist px-4 py-2 text-ink hover:bg-white"
                >
                  {label}
                </Link>
              ))}
              <Link href={`/topics/${topic}`} className="rounded-full border border-black/10 bg-white px-4 py-2 text-ink hover:bg-mist">
                Reset filters
              </Link>
            </div>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topicQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </section>
      </div>
    </SiteLayout>
  );
}
