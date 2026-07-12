import { useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { dealHistorySeeds } from "./data/historySeeds";
import { useGame } from "./hooks/useGame";
import { SeedPickerScreen } from "./screens/SeedPickerScreen";
import { CustomSeedSheet } from "./screens/CustomSeedSheet";
import { CustomInterventionSheet } from "./screens/CustomInterventionSheet";
import { TimelineEventScreen } from "./screens/TimelineEventScreen";
import { ButterflyEchoScreen } from "./screens/ButterflyEchoScreen";
import { GeneratingScreen } from "./screens/GeneratingScreen";
import { ErrorScreen } from "./screens/ErrorScreen";
import { AlternatePresentScreen } from "./screens/AlternatePresentScreen";
import { saveFrontPage } from "./services/share";
import "./styles/game.css";

export function App() {
  const game = useGame();
  const { state } = game;
  const [seeds, setSeeds] = useState(() => dealHistorySeeds());
  const [customSeedOpen, setCustomSeedOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);

  const shuffle = () => {
    setSeeds((current) => dealHistorySeeds(current.map((seed) => seed.id)));
  };

  const saveResult = async () => {
    if (!state.result) throw new Error("结局头版尚未生成。");
    const target = document.getElementById("result-capture");
    if (!(target instanceof HTMLElement)) throw new Error("未找到可导出的头版。");
    return saveFrontPage(target, {
      worldName: state.result.worldName,
      shareLine: state.result.shareLine,
    });
  };

  let screen: React.ReactNode;
  if (state.phase === "selecting") {
    screen = (
      <SeedPickerScreen
        seeds={seeds}
        onShuffle={shuffle}
        onSelect={game.selectSeed}
        onCustom={() => setCustomSeedOpen(true)}
      />
    );
  } else if (state.phase === "event" && state.currentTurn) {
    screen = (
      <TimelineEventScreen
        turn={state.currentTurn}
        deviation={state.deviation}
        onChoose={game.choose}
        onCustom={() => setInterventionOpen(true)}
      />
    );
  } else if (state.phase === "echo" && state.echo) {
    screen = (
      <ButterflyEchoScreen
        echo={state.echo}
        isFinal={state.currentTurn?.chapter === 5}
        onContinue={game.continueTimeline}
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
      : Math.min(5, (state.currentTurn?.chapter ?? 0) + 1);
    screen = (
      <GeneratingScreen
        chapter={targetChapter}
        ending={state.phase === "ending" || state.request?.kind === "ending"}
        onCancel={game.restart}
      />
    );
  }

  return (
    <div className="app-stage">
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
        {customSeedOpen && state.phase === "selecting" && (
          <CustomSeedSheet
            onClose={() => setCustomSeedOpen(false)}
            onSubmit={(value) => {
              const result = game.submitCustomSeed(value);
              if (result.ok) setCustomSeedOpen(false);
              return result;
            }}
          />
        )}
        {interventionOpen && state.phase === "event" && (
          <CustomInterventionSheet
            onClose={() => setInterventionOpen(false)}
            onSubmit={(value, deviationClass) => {
              const result = game.intervene(value, deviationClass);
              if (result.ok) setInterventionOpen(false);
              return result;
            }}
          />
        )}
      </div>
    </div>
  );
}
