import { ExamClient } from "@/components/exam-client";
import { SiteLayout } from "@/components/layout";

export default function ExamPage() {
  return (
    <SiteLayout
      title="Volledig tentamen oefenen"
      description="Simuleer een langere examenzitting in meerdere secties, met puntentotalen, optionele timer en review aan het eind."
    >
      <ExamClient />
    </SiteLayout>
  );
}
