import { getDeviationStage } from "../game/deviation";
import { JUMP_LABELS, TOTAL_NODE_COUNT, type DecisionChapter } from "../game/timelinePlan";

export function TimelineProgress({ chapter, deviation }: { chapter: DecisionChapter; deviation: number }) {
  const stage = getDeviationStage(deviation);
  return (
    <div className="timeline-progress">
      <div className="timeline-progress__now"><span>节点 {chapter}/{TOTAL_NODE_COUNT}</span><strong>{JUMP_LABELS[chapter - 1]}</strong></div>
      <ol aria-label="十二节点时间线">
        {JUMP_LABELS.map((name, index) => {
          const value = index + 1;
          return (
            <li
              key={name}
              className={value === chapter ? "is-current" : value < chapter ? "is-complete" : ""}
              aria-current={value === chapter ? "step" : undefined}
            >
              <span>{value}</span><small>{name}</small>
            </li>
          );
        })}
      </ol>
      <div className="deviation-readout" aria-label={`历史偏离度 ${deviation}，${stage.label}`}>
        <span>历史偏离度</span><strong>{deviation}</strong><small>{stage.label}</small>
      </div>
    </div>
  );
}
