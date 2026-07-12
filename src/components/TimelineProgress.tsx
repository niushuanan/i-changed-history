import { getDeviationStage } from "../game/deviation";

const CHAPTERS = ["裂缝", "余震", "新秩序", "世界线", "此刻"];

export function TimelineProgress({ chapter, deviation }: { chapter: number; deviation: number }) {
  const stage = getDeviationStage(deviation);
  return (
    <div className="timeline-progress">
      <ol aria-label="五幕时间线">
        {CHAPTERS.map((name, index) => {
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
