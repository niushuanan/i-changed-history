import { useEffect, useState } from "react";
import { ArrowRight, SignOut } from "@phosphor-icons/react";
import type { EchoState } from "../game/reducer";

const ECHO_DELAY_MS = import.meta.env.MODE === "test" ? 0 : 1_200;

export function ButterflyEchoScreen({
  echo,
  isFinal,
  onContinue,
  onExit,
  sceneImage,
}: {
  echo: EchoState;
  isFinal: boolean;
  onContinue: () => void;
  onExit: () => void;
  sceneImage?: string;
}) {
  const [ready, setReady] = useState(ECHO_DELAY_MS === 0);

  useEffect(() => {
    if (ECHO_DELAY_MS === 0) return undefined;
    const timer = window.setTimeout(() => setReady(true), ECHO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="echo-screen">
      {sceneImage && <img className="echo-screen__art" src={sceneImage} alt="" />}
      <button className="echo-screen__exit" type="button" onClick={onExit} aria-label="退出本次推演"><SignOut size={17} weight="bold" /></button>
      <section className="echo-verdict">
        <span>因果回响 · {echo.source === "custom_action" ? "玩家写入正史 · " : ""}偏离 +{echo.stepImpact}</span>
        <h1>世界已回应</h1>
        <p className="echo-screen__choice">你选择：{echo.choiceLabel}</p>
        {echo.canonStatus && <p className="echo-screen__ruling">{echo.canonStatus} · {echo.personalityLens} · {echo.causalMechanism}</p>}
        <strong>{echo.directResult}</strong>
        <p className="echo-screen__cost">但 {echo.unexpectedCost}</p>
        <dl className="echo-people">
          <div><dt>获益</dt><dd>{echo.beneficiary}</dd></div>
          <div><dt>付出</dt><dd>{echo.payer}</dd></div>
        </dl>
        <button className="echo-continue" type="button" disabled={!ready} onClick={onContinue}>
          {isFinal ? "查看平行世界" : "继续推演"}<ArrowRight size={20} weight="bold" />
        </button>
      </section>
    </main>
  );
}
