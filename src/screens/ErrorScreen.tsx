import { ArrowCounterClockwise, HouseLine } from "@phosphor-icons/react";
import type { GameErrorState } from "../game/reducer";

export function ErrorScreen({ error, onRetry, onRestart }: { error: GameErrorState; onRetry: () => void; onRestart: () => void }) {
  const ending = error.retry.kind === "ending";
  return (
    <main className="error-screen">
      <span>{ending ? "结局暂未完成" : "推演中断"}</span>
      <h1>{ending ? "你的四次决定都已保存" : "这条时间线还没有断"}</h1>
      <p>{error.message}</p>
      <button className="primary-command" type="button" onClick={onRetry}>
        <ArrowCounterClockwise size={22} weight="bold" />{ending ? "继续生成结局" : "重新推演这一幕"}
      </button>
      <button className="secondary-command" type="button" onClick={onRestart}>
        <HouseLine size={20} />返回历史档案
      </button>
    </main>
  );
}
