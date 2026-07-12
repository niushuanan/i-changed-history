import type { AlternatePresent } from "../game/schema";
import { getDeviationStage } from "../game/deviation";

export function ResultFrontPage({ result, deviation }: { result: AlternatePresent; deviation: number }) {
  const stage = getDeviationStage(deviation);
  return (
    <article id="result-capture" className="result-front-page" data-export-target="parallel-front-page">
      <header className="front-page__masthead">
        <span>平行世界 · 2026</span>
        <h1>{result.worldName}</h1>
        <p>{result.frontPageHeadline}</p>
      </header>

      <section className="front-page__scores" aria-label="世界线评估">
        <div><span>历史偏离度</span><strong>{deviation}</strong><small>{stage.label}</small></div>
        <div><span>历史可信度</span><strong>{result.plausibilityScore}</strong><small>{result.rewriteLevel}</small></div>
      </section>

      <section className="front-page__timeline">
        <h2>十一次选择，写成了第十二节点</h2>
        <ol>
          {result.historyTimeline.map((item) => (
            <li key={item.chapter}>
              <time>{item.yearLabel}</time>
              <strong>{item.playerChoice}</strong>
              <p>{item.consequence}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="front-page__ordinary">
        <h2>普通人的 2026</h2>
        <ul>{result.ordinaryLife2026.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </section>

      <section className="front-page__causes">
        <h2>三条因果链</h2>
        {result.causalChains.map((chain, index) => (
          <p key={`${chain.origin}-${index}`}><b>{chain.origin}</b><span>→</span>{chain.transformation}<span>→</span>{chain.payoff}</p>
        ))}
      </section>

      <section className="front-page__balance">
        <div><span>最大进步</span><strong>{result.greatestGain}</strong></div>
        <div><span>隐藏代价</span><strong>{result.hiddenPrice}</strong></div>
        <div><span>最大受益者</span><strong>{result.biggestBeneficiary}</strong></div>
        <div><span>付出最多的人</span><strong>{result.biggestLoser}</strong></div>
      </section>

      <footer>
        <p>{result.plausibilityReason}</p>
        <blockquote>{result.shareLine}</blockquote>
      </footer>
    </article>
  );
}
