import { ArrowRight } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";

export function ChoiceList({
  choices,
  onChoose,
}: {
  choices: TimelineTurn["choices"];
  onChoose: (id: "A" | "B" | "C") => void;
}) {
  return (
    <div className="choice-list" aria-label="你的选择">
      {choices.map((choice) => (
        <button key={choice.id} type="button" onClick={() => onChoose(choice.id)}>
          <span className="choice-list__id">{choice.id}</span>
          <span className="choice-list__copy"><strong>{choice.label}</strong><small>{choice.intent}</small>{choice.usesTravelerStrength && <em>你的优势</em>}</span>
          <ArrowRight size={20} weight="bold" />
        </button>
      ))}
    </div>
  );
}
