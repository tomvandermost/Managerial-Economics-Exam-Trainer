import { notFound } from "next/navigation";
import { QuestionDetail } from "@/components/question-detail";
import { SiteLayout } from "@/components/layout";
import { getQuestionById } from "@/lib/practice";

export default async function PracticeQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = getQuestionById(id);

  if (!question) {
    notFound();
  }

  return (
    <SiteLayout
      title={question.title}
      description="Werk de vraag uit, open hints stap voor stap, bekijk het antwoordmodel en sla je eigen self-assessment lokaal op."
    >
      <QuestionDetail question={question} />
    </SiteLayout>
  );
}
