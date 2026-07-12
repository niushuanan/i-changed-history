import type { TimelineTurn } from "../game/schema";

const METRICS: Array<[keyof TimelineTurn["metrics"], string]> = [
  ["stability", "稳定"],
  ["prosperity", "繁荣"],
  ["freedom", "自由"],
  ["cost", "代价"],
];

export function WorldMetrics({ metrics }: { metrics: TimelineTurn["metrics"] }) {
  return (
    <dl className="world-metrics" aria-label="世界指标">
      {METRICS.map(([key, label]) => (
        <div key={key}>
          <dt>{label}</dt><dd>{metrics[key]}</dd>
          <span aria-hidden="true"><i style={{ width: `${metrics[key]}%` }} /></span>
        </div>
      ))}
    </dl>
  );
}
