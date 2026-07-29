import { useState } from "react";
import { useGame } from "./hooks/useGame";
import { DEFAULT_PICKER_CONTEXT, SeedPickerScreen } from "./screens/SeedPickerScreen";
import { TimelineEventScreen } from "./screens/TimelineEventScreen";
import { ButterflyEchoScreen } from "./screens/ButterflyEchoScreen";
import { GeneratingScreen } from "./screens/GeneratingScreen";
import { ErrorScreen } from "./screens/ErrorScreen";
import { AlternatePresentScreen } from "./screens/AlternatePresentScreen";
import {
  disposePreparedReport,
  downloadPreparedReport,
  isMobileSavePlatform,
  prepareReportImage,
  sharePreparedReport,
} from "./services/share";
import type { ResultReportPage } from "./components/ResultFrontPage";
import { GameAnnouncement } from "./components/GameAnnouncement";
import { historyAssetForSeed, visualAssetForTurn } from "./data/visualAssets";
import "./styles/game.css";

const REPORT_SHARE_LINE = "我在《哎！我改变了历史？》走完了一条平行时间线。";

export function App() {
  const game = useGame();
  const { state } = game;
  const [pickerContext, setPickerContext] = useState(DEFAULT_PICKER_CONTEXT);
  const [announcementOpen, setAnnouncementOpen] = useState(() => state.phase === "selecting");
  const [isMobileSave] = useState(() => isMobileSavePlatform());

  const prepareResultImage = async (
    result: NonNullable<typeof state.result>,
    page: ResultReportPage,
  ) => {
    const target = document.getElementById("result-capture");
    if (!(target instanceof HTMLElement)) throw new Error("未找到可导出的报告。");
    return prepareReportImage(target, {
      worldName: result.worldName,
      shareLine: REPORT_SHARE_LINE,
      page,
    });
  };

  let screen: React.ReactNode;
  if (state.phase === "selecting") {
    screen = (
      <SeedPickerScreen
        context={pickerContext}
        muted={game.muted}
        unlockedSeedIds={state.unlockedSeedIds}
        onContextChange={setPickerContext}
        onSelect={game.selectSeed}
        onPlaySound={game.playSound}
        onShowAnnouncement={() => setAnnouncementOpen(true)}
        onToggleMute={game.toggleMute}
      />
    );
  } else if (state.phase === "event" && state.currentTurn) {
    screen = (
      <TimelineEventScreen
        turn={state.currentTurn}
        deviation={state.deviation}
        rollCount={state.rollCount}
        dynamicChoices={state.dynamicChoices}
        rollLoading={state.rollLoading}
        rollError={state.rollError}
        muted={game.muted}
        onChoose={game.choose}
        onPlaySound={game.playSound}
        onRoll={game.rollChoices}
        onExit={game.restart}
        sceneImage={state.currentTurn.chapter <= 2 && state.scenario
          ? historyAssetForSeed(state.scenario.seed)
          : visualAssetForTurn(state.currentTurn)}
      />
    );
  } else if (state.phase === "echo" && state.echo) {
    screen = (
      <ButterflyEchoScreen
        echo={state.echo}
        isFinal={state.currentTurn?.chapter === 4}
        onContinue={game.continueTimeline}
        onExit={game.restart}
        sceneImage={state.currentTurn
          ? state.currentTurn.chapter <= 2 && state.scenario
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
        isMobileSave={isMobileSave}
        onPrepare={prepareResultImage}
        onShare={sharePreparedReport}
        onDownload={downloadPreparedReport}
        onDispose={disposePreparedReport}
        onRestart={game.restart}
      />
    );
  } else {
    const latestPlayed = state.playedTurns[state.playedTurns.length - 1];
    const customCanonText = latestPlayed?.playerAuthored && (state.request?.kind === "next-turn" || Boolean(state.pendingTurn))
      ? latestPlayed.selectedChoiceLabel
      : undefined;
    const targetChapter = state.request?.kind === "next-turn"
      ? state.request.targetChapter
      : Math.min(4, (state.currentTurn?.chapter ?? 0) + 1);
    screen = (
      <GeneratingScreen
        chapter={targetChapter}
        ending={state.phase === "ending" || state.request?.kind === "ending"}
        customAction={Boolean(customCanonText)}
        customCanonText={customCanonText}
        draft={state.pendingTurn ?? game.generationDraft ?? undefined}
        progressStage={game.generationStage}
        ready={Boolean(state.pendingTurn)}
        onContinue={game.revealGeneratedTurn}
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
        {screen}
        {announcementOpen && state.phase === "selecting" ? (
          <GameAnnouncement onClose={() => setAnnouncementOpen(false)} />
        ) : null}
      </div>
    </div>
  );
}
