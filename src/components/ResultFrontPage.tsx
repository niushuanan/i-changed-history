import type { AlternatePresent } from "../game/schema";

export type ResultReportPage = "biography" | "world";

function BiographyPage({ result }: { result: AlternatePresent }) {
  return (
    <article className="result-front-page biography-report">
      <header className="report-masthead">
        <span>穿越者列传 · 十二决</span>
        <h1>{result.protagonistName}列传</h1>
        <p>{result.lifespanSummary}</p>
      </header>

      <section className="biography-death">
        <span>{result.deathScene.yearLabel} · {result.deathScene.age} 岁 · {result.deathScene.place}</span>
        <p>{result.deathScene.finalMoment}</p>
      </section>

      <section className="biography-decisions" aria-label="一生十二次决定">
        <h2>一生十二决</h2>
        <ol>
          {result.historyTimeline.map((item) => (
            <li key={item.chapter}>
              <b>{String(item.chapter).padStart(2, "0")}</b>
              <time>{item.yearLabel}</time>
              <strong>{item.playerChoice}</strong>
              <p>{item.consequence}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="biography-prose">
        <div>
          <span>白话本纪</span>
          <p>{result.vernacularBiography}</p>
        </div>
        <div className="is-classical">
          <span>史臣曰 · 文言</span>
          <p>{result.classicalBiography}</p>
        </div>
      </section>
    </article>
  );
}

function WorldPage({ result }: { result: AlternatePresent }) {
  return (
    <article className="result-front-page world-report">
      <header className="report-masthead">
        <span>蝴蝶效应 · 截至 2026</span>
        <h1>{result.worldName}</h1>
        <p>{result.frontPageHeadline}</p>
      </header>

      <section className="world-report__opening">
        <strong>{result.protagonistName}没有活到 2026。</strong>
        <p>{result.deathScene.lastingLegacy}</p>
      </section>

      <ol className="world-report__eras" aria-label="遗产穿过四个时代">
        {result.posthumousChronicle.map((chapter, index) => (
          <li key={chapter.period}>
            <b>{index + 1}</b>
            <div><time>{chapter.period}</time><strong>{chapter.title}</strong></div>
            <p>{chapter.narrative}</p>
            <small>{chapter.inheritedChange}</small>
          </li>
        ))}
      </ol>

      <section className="world-report__ordinary">
        <h2>2026，普通人的一天</h2>
        <ul>{result.ordinaryLife2026.map((detail) => <li key={detail}>{detail}</li>)}</ul>
      </section>

      <footer className="world-report__closing">
        <p>{result.closingPassage}</p>
        <blockquote>{result.shareLine}</blockquote>
      </footer>
    </article>
  );
}

export function ResultFrontPage({
  result,
  page,
  reportId = "result-capture",
}: {
  result: AlternatePresent;
  page: ResultReportPage;
  reportId?: string;
}) {
  return (
    <div id={reportId} className={`result-report-capture is-${page}`} data-export-target="history-report">
      {page === "biography" ? <BiographyPage result={result} /> : <WorldPage result={result} />}
    </div>
  );
}
