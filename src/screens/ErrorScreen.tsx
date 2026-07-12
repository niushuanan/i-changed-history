import { ArrowCounterClockwise, HouseLine } from "@phosphor-icons/react";
import type { GameErrorState } from "../game/reducer";

export function ErrorScreen({ error, onRetry, onRestart }: { error: GameErrorState; onRetry: () => void; onRestart: () => void }) {
  return (
    <main className="error-screen">
      <span>推演中断</span>
      <h1>这条时间线还没有断</h1>
      <p>{error.message}</p>
      <button className="primary-command" type="button" onClick={onRetry}>
        <ArrowCounterClockwise size={22} weight="bold" />重新推演这一幕
      </button>
      <button className="secondary-command" type="button" onClick={onRestart}>
        <HouseLine size={20} />返回历史档案
      </button>
    </main>
  );
}
