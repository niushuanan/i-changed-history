import type { AlternatePresent } from "../game/schema";

export type ResultReportPage = "biography" | "world";

function BiographyPage({ result }: { result: AlternatePresent }) {
  return (
    <article className="result-front-page biography-report">
      <header className="report-masthead">
        <span>穿越者列传 · 一生</span>
        <h1>{result.protagonistName}列传</h1>
        <p>{result.lifespanSummary}</p>
      </header>

      <section className="biography-death">
        <span>{result.deathScene.yearLabel} · {result.deathScene.age} 岁 · {result.deathScene.place}</span>
        <p>{result.deathScene.finalMoment}</p>
      </section>

      <section className="biography-prose">
        <div>
          <span>一生纪事</span>
          <p>{result.lifeStory}</p>
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

      <section className="world-report__ordinary" aria-label="2026，普通人的一天">
        <h2>2026，普通人的一天</h2>
        <p aria-label="2026普通人的一天">{result.ordinaryLife2026.join("；")}</p>
      </section>

      <footer className="world-report__closing">
        <p>{result.closingPassage}</p>
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
