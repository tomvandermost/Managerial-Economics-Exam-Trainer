import { SiteLayout } from "@/components/layout";
import { TopicCard } from "@/components/topic-card";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";

export default function TopicsPage() {
  return (
    <SiteLayout
      title="Oefenen per onderwerp"
      description="Kies een onderwerp uit de cursus, bekijk de belangrijkste subtopics en open direct gerichte examenvragen."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.slug}
            topic={topic}
            questionCount={questions.filter((question) => question.topic === topic.slug).length}
          />
        ))}
      </div>
    </SiteLayout>
  );
}
