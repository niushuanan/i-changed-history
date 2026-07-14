import { useEffect, useState } from "react";
import { ArrowRight, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";

export function ChoiceList({
  choices,
  onChoose,
}: {
  choices: TimelineTurn["choices"];
  onChoose: (id: "A" | "B" | "C") => void;
}) {
  const [pendingChoice, setPendingChoice] = useState<TimelineTurn["choices"][number] | null>(null);

  useEffect(() => {
    if (!pendingChoice) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPendingChoice(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [pendingChoice]);

  const choose = (choice: TimelineTurn["choices"][number]) => {
    if (choice.displayLabel !== choice.label) {
      setPendingChoice(choice);
      return;
    }
    onChoose(choice.id);
  };

  return (
    <>
      <div className="choice-list" aria-label="你的选择">
        {choices.map((choice) => (
          <div className="choice-item" key={choice.id}>
            <button
              className="choice-action"
              type="button"
              aria-label={`${choice.id}${choice.label}`}
              onClick={() => choose(choice)}
            >
              <span className="choice-list__id">{choice.id}</span>
              <span className="choice-list__copy"><strong>{choice.displayLabel}</strong></span>
              <ArrowRight size={19} weight="bold" />
            </button>
          </div>
        ))}
      </div>
      {pendingChoice ? (
        <div className="choice-confirmation-backdrop" onMouseDown={() => setPendingChoice(null)}>
          <section
            aria-label="确认完整决定"
            aria-modal="true"
            className="choice-confirmation"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <span>完整决定</span>
              <button type="button" aria-label="关闭完整决定" onClick={() => setPendingChoice(null)}>
                <X size={20} weight="bold" />
              </button>
            </header>
            <p>{pendingChoice.label}</p>
            <button
              className="choice-confirmation__commit"
              type="button"
              onClick={() => {
                const choiceId = pendingChoice.id;
                setPendingChoice(null);
                onChoose(choiceId);
              }}
            >
              执行这项决定
              <ArrowRight size={20} weight="bold" />
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
