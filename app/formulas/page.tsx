import { FormulaSheet } from "@/components/formula-sheet";
import { SiteLayout } from "@/components/layout";

export default function FormulasPage() {
  return (
    <SiteLayout
      title="Formuleoverzicht"
      description="Compact overzicht van de belangrijkste formules en concepten uit Managerial Economics, inclusief symbolen, gebruiksmoment en korte voorbeelden."
    >
      <FormulaSheet />
    </SiteLayout>
  );
}
