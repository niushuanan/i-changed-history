import type { AlternatePresent } from "../game/schema";
import { getDeviationStage } from "../game/deviation";

export function ResultFrontPage({ result, deviation, reportId = "result-capture" }: { result: AlternatePresent; deviation: number; reportId?: string }) {
  const stage = getDeviationStage(deviation);
  return (
    <article id={reportId} className="result-front-page legacy-report" data-export-target="parallel-front-page">
      <header className="front-page__masthead">
        <span>身后历史报告 · 截至 2026</span>
        <h1>{result.worldName}</h1>
        <p>{result.frontPageHeadline}</p>
      </header>
      <figure className="front-page__scene legacy-report__scene">
        <img src="/assets/stage-2026.webp" alt="主角死后延伸至 2026 的平行世界" />
        <figcaption>{result.protagonistName}死后，历史没有停下</figcaption>
      </figure>
      <section className="legacy-report__death" aria-label="主角生命终点">
        <span>生命终点 · {result.deathScene.yearLabel}</span>
        <h2>{result.protagonistName}，{result.deathScene.age} 岁</h2>
        <small>{result.deathScene.place}</small>
        <p>{result.deathScene.finalMoment}</p>
        <blockquote>{result.deathScene.lastingLegacy}</blockquote>
      </section>
      <section className="front-page__scores" aria-label="世界线评估">
        <div><span>历史偏离度</span><strong>{deviation}</strong><small>{stage.label}</small></div>
        <div><span>历史可信度</span><strong>{result.plausibilityScore}</strong><small>{result.rewriteLevel}</small></div>
      </section>
      <section className="front-page__timeline">
        <h2>一个人的十二次决定</h2>
        <p className="legacy-report__summary">{result.lifespanSummary}</p>
        <ol>
          {result.historyTimeline.map((item) => (
            <li key={item.chapter}>
              <time>{item.yearLabel}</time><strong>{item.playerChoice}</strong><p>{item.consequence}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="legacy-report__afterlife">
        <h2>他死以后</h2>
        {result.posthumousChronicle.map((chapter) => (
          <article key={chapter.period}>
            <time>{chapter.period}</time><h3>{chapter.title}</h3><p>{chapter.narrative}</p><strong>{chapter.inheritedChange}</strong>
          </article>
        ))}
      </section>
      <section className="front-page__ordinary">
        <h2>普通人的 2026</h2>
        <ul>{result.ordinaryLife2026.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </section>
      <section className="front-page__causes">
        <h2>遗产如何穿过时代</h2>
        {result.causalChains.map((chain, index) => (
          <p key={`${chain.origin}-${index}`}><b>{chain.origin}</b><span>→</span>{chain.transformation}<span>→</span>{chain.payoff}</p>
        ))}
      </section>
      <section className="front-page__balance">
        <div><span>世界得到</span><strong>{result.greatestGain}</strong></div>
        <div><span>世界付出</span><strong>{result.hiddenPrice}</strong></div>
        <div><span>最大受益者</span><strong>{result.biggestBeneficiary}</strong></div>
        <div><span>付出最多的人</span><strong>{result.biggestLoser}</strong></div>
      </section>
      <footer>
        <p>{result.plausibilityReason}</p>
        <p className="legacy-report__closing">{result.closingPassage}</p>
        <blockquote>{result.shareLine}</blockquote>
      </footer>
    </article>
  );
}
