import { ClockCounterClockwise } from "@phosphor-icons/react";

const PHRASES = ["校对因果账本", "重排贸易与权力", "追踪普通人的生活", "抵达另一个 2026"];

export function GeneratingScreen({ chapter, ending, onCancel }: { chapter: number; ending: boolean; onCancel: () => void }) {
  return (
    <main className="generating-screen" aria-live="polite">
      <ClockCounterClockwise size={48} weight="thin" />
      <span>{ending ? "正在印刷 2026 头版" : `正在推演第 ${chapter} 节点`}</span>
      <h1>{ending ? "把十一次选择写进 2026" : PHRASES[Math.min(chapter - 1, PHRASES.length - 1)]}</h1>
      <div className="generating-rule" aria-hidden="true"><i /></div>
      <p>{PHRASES[(chapter + 1) % PHRASES.length]}……</p>
      <button className="text-command" type="button" onClick={onCancel}>放弃本局</button>
    </main>
  );
}
