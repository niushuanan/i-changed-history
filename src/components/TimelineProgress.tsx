import { SignOut } from "@phosphor-icons/react";
import { getDeviationStage } from "../game/deviation";
import { JUMP_LABELS, TOTAL_NODE_COUNT, type DecisionChapter } from "../game/timelinePlan";

export function TimelineProgress({
  chapter,
  deviation,
  onExit,
}: {
  chapter: DecisionChapter;
  deviation: number;
  onExit: () => void;
}) {
  const stage = getDeviationStage(deviation);
  return (
    <header className="timeline-progress">
      <button className="timeline-exit" type="button" onClick={onExit} aria-label="退出本次推演" title="退出本次推演">
        <SignOut size={16} weight="bold" />
      </button>
      <div className="timeline-progress__now">
        <span>{chapter}/{TOTAL_NODE_COUNT} · {JUMP_LABELS[chapter - 1]}</span>
        <strong>改写 {deviation}% · {stage.label}</strong>
      </div>
      <ol aria-label="十二节点时间线">
        {JUMP_LABELS.map((name, index) => {
          const value = index + 1;
          return (
            <li key={name} className={value === chapter ? "is-current" : value < chapter ? "is-complete" : ""} aria-current={value === chapter ? "step" : undefined}>
              <span>{value}</span><small>{name}</small>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
