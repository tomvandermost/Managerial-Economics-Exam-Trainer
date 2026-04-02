import { Topic } from "@/types";

export function EconomicsDiagram({ topic }: { topic: Topic }) {
  if (topic === "speltheorie") {
    return (
      <svg viewBox="0 0 320 220" className="h-56 w-full rounded-2xl bg-white">
        <rect x="40" y="40" width="240" height="140" fill="#f8faf9" stroke="#cfd9d4" />
        <line x1="160" y1="40" x2="160" y2="180" stroke="#cfd9d4" />
        <line x1="40" y1="110" x2="280" y2="110" stroke="#cfd9d4" />
        <text x="95" y="78" fill="#1f2a37" fontSize="16">4,4</text>
        <text x="205" y="78" fill="#1f2a37" fontSize="16">1,5</text>
        <text x="95" y="148" fill="#1f2a37" fontSize="16">5,1</text>
        <text x="205" y="148" fill="#1f2a37" fontSize="16">2,2</text>
        <text x="118" y="28" fill="#5d6b75" fontSize="12">Links</text>
        <text x="210" y="28" fill="#5d6b75" fontSize="12">Rechts</text>
        <text x="8" y="92" fill="#5d6b75" fontSize="12">Boven</text>
        <text x="8" y="162" fill="#5d6b75" fontSize="12">Onder</text>
      </svg>
    );
  }

  const isExternality = topic === "externaliteiten";
  const isMonopoly = topic === "monopolie";
  const isTrade = topic === "importtarieven";

  return (
    <svg viewBox="0 0 360 240" className="h-60 w-full rounded-2xl bg-white">
      <line x1="40" y1="20" x2="40" y2="205" stroke="#5d6b75" strokeWidth="2" />
      <line x1="40" y1="205" x2="330" y2="205" stroke="#5d6b75" strokeWidth="2" />
      <line x1="60" y1="60" x2="290" y2="180" stroke="#32584f" strokeWidth="3" />
      <line x1="70" y1="175" x2="285" y2="70" stroke="#8e6f4c" strokeWidth="3" />
      {isMonopoly ? <line x1="90" y1="198" x2="270" y2="40" stroke="#1f2a37" strokeWidth="2" strokeDasharray="7 5" /> : null}
      {isExternality ? <line x1="80" y1="185" x2="295" y2="80" stroke="#1f2a37" strokeWidth="2" strokeDasharray="7 5" /> : null}
      {isTrade ? <rect x="155" y="110" width="52" height="62" fill="#32584f" fillOpacity="0.18" stroke="#32584f" /> : null}
      <text x="290" y="186" fill="#32584f" fontSize="14">
        {isExternality ? "SMC" : "Aanbod / MC"}
      </text>
      <text x="285" y="72" fill="#8e6f4c" fontSize="14">
        Vraag
      </text>
      {isMonopoly ? (
        <text x="270" y="42" fill="#1f2a37" fontSize="14">
          MR
        </text>
      ) : null}
      {isTrade ? (
        <text x="150" y="104" fill="#1f2a37" fontSize="13">
          Tarief
        </text>
      ) : null}
    </svg>
  );
}
