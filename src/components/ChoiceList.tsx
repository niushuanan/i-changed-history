import { useEffect, useState } from "react";
import { ArrowRight, Eye } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import type { TravelerAbility } from "../game/profile";

export function ChoiceList({
  choices,
  previewMode,
  onChoose,
}: {
  choices: TimelineTurn["choices"];
  previewMode: TravelerAbility["previewMode"];
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
            <span className="choice-list__copy"><strong>{choice.label}</strong><small>{choice.actionSpec.actor} · {choice.actionSpec.deadline}</small></span>
            <ArrowRight size={19} weight="bold" />
          </button>
          {choice.usesTravelerStrength && revealed !== choice.id && (
            <button className="choice-insight" type="button" onClick={() => setRevealed(choice.id)} aria-label="预判这项行动的隐藏代价">
              <Eye size={14} weight="bold" /> 看见代价
            </button>
          )}
          {revealed === choice.id && (
            <div className="choice-forecast" aria-live="polite">
              {previewMode === "system" && <><span>结构变化：{choice.instantEcho.directResult}</span><span>制度代价：{choice.instantEcho.unexpectedCost}</span></>}
              {previewMode === "people" && <><span>被看见：{choice.instantEcho.beneficiary}</span><span>被忽略：{choice.instantEcho.payer}</span></>}
              {previewMode === "evidence" && <><span>即时结果：{choice.instantEcho.directResult}</span><span>执行缺口：{choice.instantEcho.unexpectedCost}</span></>}
              {previewMode === "care" && <><span>受益者：{choice.instantEcho.beneficiary}</span><span>承担者：{choice.instantEcho.payer}</span></>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
