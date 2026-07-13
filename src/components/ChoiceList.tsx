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
        <div className="choice-item" key={choice.id}>
          <button className="choice-action" type="button" onClick={() => onChoose(choice.id)}>
            <span className="choice-list__id">{choice.id}</span>
            <span className="choice-list__copy"><strong>{choice.label}</strong></span>
            <ArrowRight size={19} weight="bold" />
          </button>
        </div>
      ))}
    </div>
  );
}
