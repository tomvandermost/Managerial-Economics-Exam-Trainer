import { MiniTestClient } from "@/components/mini-test-client";
import { SiteLayout } from "@/components/layout";

export default function MiniTestPage() {
  return (
    <SiteLayout
      title="Mini-toets genereren"
      description="Stel een korte oefentoets samen op onderwerp, moeilijkheid en vraagtype. De voortgang blijft lokaal bewaard als je tussendoor stopt."
    >
      <MiniTestClient />
    </SiteLayout>
  );
}
