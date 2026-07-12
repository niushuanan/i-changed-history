import { useEffect, useState } from "react";
import { ArrowRight, Butterfly, TrendUp } from "@phosphor-icons/react";
import type { EchoState } from "../game/reducer";
import { getDeviationStage } from "../game/deviation";

const ECHO_DELAY_MS = import.meta.env.MODE === "test" ? 0 : 1_800;

export function ButterflyEchoScreen({
  echo,
  isFinal,
  onContinue,
  onExit,
}: {
  echo: EchoState;
  isFinal: boolean;
  onContinue: () => void;
  onExit: () => void;
}) {
  const [ready, setReady] = useState(ECHO_DELAY_MS === 0);
  const stage = getDeviationStage(echo.nextDeviation);

  useEffect(() => {
    if (ECHO_DELAY_MS === 0) return undefined;
    const timer = window.setTimeout(() => setReady(true), ECHO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="echo-screen">
      <button className="echo-screen__exit text-command" type="button" onClick={onExit}>退出本次推演</button>
      <div className="echo-screen__mark"><Butterfly size={38} weight="fill" /></div>
      <span className="echo-screen__kicker">选择已落笔</span>
      <h1>蝴蝶效应</h1>
      <p className="echo-screen__choice">{echo.choiceLabel}</p>

      <section className="echo-consequences">
        <div><span>直接结果</span><strong>{echo.directResult}</strong></div>
        <div className="is-cost"><span>意外代价</span><strong>{echo.unexpectedCost}</strong></div>
      </section>
      <dl className="echo-people">
        <div><dt>谁获益</dt><dd>{echo.beneficiary}</dd></div>
        <div><dt>谁付出</dt><dd>{echo.payer}</dd></div>
      </dl>
      <div className="echo-deviation">
        <TrendUp size={24} weight="bold" />
        <span>本步 +{echo.stepImpact}</span>
        <strong>{echo.nextDeviation}</strong>
        <small>{stage.label}</small>
      </div>
      <button className="primary-command" type="button" disabled={!ready} onClick={onContinue}>
        {isFinal ? "查看平行世界" : "继续时间线"}<ArrowRight size={22} weight="bold" />
      </button>
    </main>
  );
}
