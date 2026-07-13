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
        <p className="echo-screen__status">{echo.source === "custom_action" ? "你写下的结果已经发生" : "这件事已经发生"}</p>
        <h1>{echo.directResult}</h1>
        <p className="echo-screen__choice">你刚才选择了：{echo.choiceLabel}</p>
        {echo.canonStatus && <p className="echo-screen__ruling">它会这样传开：{echo.causalMechanism}</p>}
        <p className="echo-screen__cost">代价是：{echo.unexpectedCost}</p>
        <dl className="echo-people">
          <div><dt>受益者</dt><dd>{echo.beneficiary}</dd></div>
          <div><dt>承担者</dt><dd>{echo.payer}</dd></div>
        </dl>
        <button className="echo-continue" type="button" disabled={!ready} onClick={onContinue}>
          {isFinal ? "查看最终历史" : "看看接下来发生什么"}<ArrowRight size={20} weight="bold" />
        </button>
      </section>
    </main>
  );
}
