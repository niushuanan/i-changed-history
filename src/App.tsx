import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useGame } from "./hooks/useGame";
import { SeedPickerScreen } from "./screens/SeedPickerScreen";
import { TimelineEventScreen } from "./screens/TimelineEventScreen";
import { ButterflyEchoScreen } from "./screens/ButterflyEchoScreen";
import { GeneratingScreen } from "./screens/GeneratingScreen";
import { ErrorScreen } from "./screens/ErrorScreen";
import { AlternatePresentScreen } from "./screens/AlternatePresentScreen";
import { saveFrontPage } from "./services/share";
import { historyAssetForSeed, visualAssetForTurn } from "./data/visualAssets";
import "./styles/game.css";

export function App() {
  const game = useGame();
  const { state } = game;

  const saveResult = async (result: NonNullable<typeof state.result>) => {
    const target = document.getElementById("result-capture");
    if (!(target instanceof HTMLElement)) throw new Error("未找到可导出的头版。");
    return saveFrontPage(target, {
      worldName: result.worldName,
      shareLine: result.shareLine,
    });
  };

  let screen: React.ReactNode;
  if (state.phase === "selecting") {
    screen = <SeedPickerScreen onSelect={game.selectSeed} />;
  } else if (state.phase === "event" && state.currentTurn) {
    screen = (
      <TimelineEventScreen
        turn={state.currentTurn}
        deviation={state.deviation}
        onChoose={game.choose}
        onCustomAction={game.submitCustomAction}
        onExit={game.restart}
        sceneImage={state.currentTurn.chapter <= 3 && state.scenario
          ? historyAssetForSeed(state.scenario.seed)
          : visualAssetForTurn(state.currentTurn)}
      />
    );
  } else if (state.phase === "echo" && state.echo) {
    screen = (
      <ButterflyEchoScreen
        echo={state.echo}
        isFinal={state.currentTurn?.chapter === 12}
        onContinue={game.continueTimeline}
        onExit={game.restart}
        sceneImage={state.currentTurn
          ? state.currentTurn.chapter <= 3 && state.scenario
            ? historyAssetForSeed(state.scenario.seed)
            : visualAssetForTurn(state.currentTurn)
          : undefined}
      />
    );
  } else if (state.phase === "error" && state.error) {
    screen = <ErrorScreen error={state.error} onRetry={game.retry} onRestart={game.restart} />;
  } else if (state.phase === "result" && state.result) {
    screen = (
      <AlternatePresentScreen
        result={state.result}
        deviation={state.deviation}
        onSave={saveResult}
        onRestart={game.restart}
      />
    );
  } else {
    const targetChapter = state.request?.kind === "next-turn"
      ? state.request.targetChapter
      : Math.min(12, (state.currentTurn?.chapter ?? 0) + 1);
    screen = (
      <GeneratingScreen
        chapter={targetChapter}
        ending={state.phase === "ending" || state.request?.kind === "ending"}
        customAction={state.phase === "adjudicating" || state.request?.kind === "custom-action"}
        progressStage={game.generationStage}
        onCancel={game.restart}
      />
    );
  }

  return (
    <div
      className="app-stage"
      onPointerDownCapture={() => { void game.startExperience(); }}
      onKeyDownCapture={() => { void game.startExperience(); }}
    >
      <div className="mobile-prototype game-shell">
        <button
          className="sound-toggle icon-button"
          type="button"
          onClick={game.toggleMute}
          aria-label={game.muted ? "打开配乐" : "静音配乐"}
          title={game.muted ? "打开配乐" : "静音配乐"}
        >
          {game.muted ? <SpeakerSlash size={21} weight="bold" /> : <SpeakerHigh size={21} weight="bold" />}
        </button>
        {screen}
      </div>
    </div>
  );
}
