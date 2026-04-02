import { DashboardClient } from "@/components/dashboard-client";
import { SiteLayout } from "@/components/layout";

export default function DashboardPage() {
  return (
    <SiteLayout
      title="Zwakke onderwerpen"
      description="Bekijk je accuracy per onderwerp, vaak fout beantwoorde vragen, markeringen als moeilijk en slimme lokale aanbevelingen."
    >
      <DashboardClient />
    </SiteLayout>
  );
}
