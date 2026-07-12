import { useEffect, useState } from "react";
import { ArrowRight, Eye } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";

const MODE_LABELS = { nudge: "微调", reform: "改制", rupture: "断裂" } as const;

export function ChoiceList({
  choices,
  abilityTitle,
  onChoose,
}: {
  choices: TimelineTurn["choices"];
  abilityTitle: string;
  onChoose: (id: "A" | "B" | "C") => void;
}) {
  const [revealed, setRevealed] = useState<"A" | "B" | "C" | null>(null);
  useEffect(() => setRevealed(null), [choices]);

  return (
    <div className="choice-list" aria-label="你的选择">
      {choices.map((choice) => (
        <div className={`choice-item ${choice.usesTravelerStrength ? "is-tailored" : ""}`} key={choice.id}>
          <button className="choice-action" type="button" onClick={() => onChoose(choice.id)}>
            <span className="choice-list__id">{choice.id}</span>
            <span className="choice-list__copy"><small>{MODE_LABELS[choice.deviationClass]}</small><strong>{choice.label}</strong>{choice.usesTravelerStrength && <em>{abilityTitle}</em>}</span>
            <ArrowRight size={19} weight="bold" />
          </button>
          {choice.usesTravelerStrength && revealed !== choice.id && (
            <button className="choice-insight" type="button" onClick={() => setRevealed(choice.id)} aria-label={`用${abilityTitle}预判代价`}>
              <Eye size={14} weight="bold" /> 看见代价
            </button>
          )}
          {revealed === choice.id && (
            <div className="choice-forecast" aria-live="polite">
              <span>受益：{choice.instantEcho.beneficiary}</span>
              <span>代价：{choice.instantEcho.unexpectedCost}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
