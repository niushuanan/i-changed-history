import { execFile, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  shouldRefreshHistoryImage,
  validateHistoryImageManifest,
} from "./history-image-policy.mjs";

const execFileAsync = promisify(execFile);

const root = fileURLToPath(new URL("..", import.meta.url));
const source = readFileSync(join(root, "src/data/historySeeds.ts"), "utf8");
const entries = [...source.matchAll(/moment\("([^"]+)",\s*(-?\d+),\s*"[^"]+",\s*"([^"]+)"/g)]
  .map(([, id, year, eventName]) => ({ id, year: Number(year), eventName }));
const output = join(root, "public/assets/history");
mkdirSync(output, { recursive: true });
const manifestPath = join(output, "manifest.json");
const previousManifest = existsSync(manifestPath)
  ? new Map(JSON.parse(readFileSync(manifestPath, "utf8")).map((item) => [item.id, item]))
  : new Map();

const pageTitles = {
  "dong-zhuo-lu-bu-190": "Dong Zhuo", "guandu-wuchao-200": "Battle of Guandu",
  "red-cliffs-208": "Battle of Red Cliffs", "feishui-383": "Battle of Fei River",
  "yiling-222": "Battle of Xiaoting", "jieting-228": "Battle of Jieting",
  "gaoping-tombs-249": "Incident at the Gaoping Tombs", "sui-unification-589": "Chen conquest by Sui",
  "xuanwu-gate-626": "Xuanwu Gate Incident", "wu-zetian-690": "Wu Zetian",
  "mawei-756": "Mawei courier station incident", "an-lushan-755": "An Lushan Rebellion",
  "chen-bridge-960": "Chen Bridge Incident", "wang-anshi-1069": "New Policies (Song dynasty)",
  "chanyuan-1004": "Chanyuan Treaty", "jingkang-1127": "Jingkang Incident",
  "yue-fei-1140": "Yue Fei", "diaoyu-1259": "Battle of Diaoyu Fortress",
  "xiangyang-1273": "Battle of Xiangyang (1267–1273)", "yamen-1279": "Battle of Yamen",
  "poyang-1363": "Battle of Lake Poyang", "jingnan-nanjing-1402": "Jingnan campaign",
  "zheng-he-1405": "Ming treasure voyages", "tumu-crisis-1449": "Tumu Crisis",
  "ningyuan-1626": "Battle of Ningyuan", "kangxi-aobai-1669": "Oboi",
  "shanhai-pass-1644": "Battle of Shanhai Pass", "koxinga-1661": "Siege of Fort Zeelandia",
  "macartney-1793": "Macartney Embassy", "humen-1839": "Destruction of opium at Humen",
  "great-fire-rome-64": "Great Fire of Rome", "fall-rome-476": "Fall of the Western Roman Empire",
  "constantinople-1453": "Fall of Constantinople", "columbus-1492": "Christopher Columbus",
  "luther-1517": "Ninety-five Theses", "galileo-1610": "Sidereus Nuncius",
  "newton-principia-1687": "Philosophiæ Naturalis Principia Mathematica",
  "bastille-1789": "Storming of the Bastille", "waterloo-1815": "Battle of Waterloo",
  "origin-species-1859": "On the Origin of Species", "lincoln-emancipation-1862": "Emancipation Proclamation",
  "sarajevo-1914": "Assassination of Archduke Franz Ferdinand", "october-revolution-1917": "October Revolution",
  "roosevelt-bank-holiday-1933": "Emergency Banking Act", "hitler-poland-1939": "Invasion of Poland",
  "stalin-moscow-1941": "Battle of Moscow", "normandy-1944": "Normandy landings",
  "cuban-missile-1962": "Cuban Missile Crisis", "berlin-wall-1989": "Fall of the Berlin Wall",
  "apollo-11-1969": "Apollo 11",
  "east-zhou-770bc": "King Ping of Zhou", "shang-yang-356bc": "Shang Yang",
  "changping-260bc": "Battle of Changping", "qin-unification-221bc": "Qin's wars of unification",
  "daze-uprising-209bc": "Dazexiang uprising", "han-founded-202bc": "Emperor Gaozu of Han",
  "zhang-qian-138bc": "Zhang Qian", "mobei-119bc": "Battle of Mobei",
  "wang-mang-9": "Wang Mang", "kunyang-25": "Battle of Kunyang",
  "yellow-turban-184": "Yellow Turban Rebellion", "shu-fall-263": "Conquest of Shu by Wei",
  "jin-unification-280": "Conquest of Wu by Jin", "northern-wei-439": "Northern Wei",
  "xiaowen-luoyang-494": "Emperor Xiaowen of Northern Wei", "grand-canal-605": "Grand Canal (China)",
  "tang-founded-618": "Emperor Gaozu of Tang", "tang-fall-907": "Tang dynasty",
  "jin-founded-1115": "Jin dynasty (1115–1234)", "yuan-name-1271": "Yuan dynasty",
  "ming-founded-1368": "Ming dynasty", "beijing-capital-1421": "Forbidden City",
  "longqing-trade-1567": "Haijin", "tiangong-kaiwu-1637": "Tiangong Kaiwu",
  "nerchinsk-1689": "Treaty of Nerchinsk", "hundred-days-1898": "Hundred Days' Reform",
  "wuchang-1911": "Wuchang Uprising", "may-fourth-1919": "May Fourth Movement",
  "suez-nationalization-1956": "Suez Crisis",
  "web-public-domain-1993": "World Wide Web",
  "marathon-490bc": "Battle of Marathon", "alexander-gaugamela-331bc": "Battle of Gaugamela",
  "caesar-rubicon-49bc": "Crossing the Rubicon", "edict-milan-313": "Edict of Milan",
  "charlemagne-800": "Charlemagne", "magna-carta-1215": "Magna Carta",
  "black-death-1347": "Black Death", "gutenberg-bible-1455": "Gutenberg Bible",
  "circumnavigation-1522": "Magellan expedition", "watt-patent-1769": "Watt steam engine",
  "declaration-1776": "United States Declaration of Independence", "jenner-vaccine-1796": "Edward Jenner",
  "meiji-1868": "Meiji Restoration", "wright-flight-1903": "Wright Flyer",
  "un-charter-1945": "Charter of the United Nations", "india-independence-1947": "Indian Independence Act 1947",
  "sputnik-1957": "Sputnik 1", "oil-crisis-1973": "1973 oil crisis",
  "chernobyl-1986": "Chernobyl disaster", "soviet-dissolution-1991": "Dissolution of the Soviet Union",
};

// Some event articles deliberately have no lead image. In those cases, use a
// participant or ruler whose portrait is specific to the same event instead
// of falling back to generic period artwork.
const imagePageTitles = {
  "sui-unification-589": "Emperor Wen of Sui",
  "mawei-756": "Yang Guifei",
  "chen-bridge-960": "Emperor Taizu of Song",
  "jingkang-1127": "Emperor Qinzong",
  "diaoyu-1259": "Möngke Khan",
  "xiangyang-1273": "Kublai Khan",
  "poyang-1363": "Hongwu Emperor",
  "longqing-trade-1567": "Longqing Emperor",
  "wuchang-1911": "Li Yuanhong",
};

// Some article lead images are logos or modern screenshots rather than the
// historical hardware behind the card. Prefer a specific Commons file when
// an article-level override still cannot provide an event-accurate scene.
const imageFileTitles = {
  "suez-nationalization-1956": "File:Nasser cheered by supporters in 1956.jpg",
  "web-public-domain-1993": "File:First Web Server.jpg",
};

const missingTitles = entries.filter(({ id }) => !pageTitles[id]);
if (entries.length !== 100 || missingTitles.length) {
  throw new Error(`Expected 100 mapped moments; found ${entries.length}. Missing: ${missingTitles.map(({ id }) => id).join(", ")}`);
}

const chunks = (items, size = 40) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
const userAgent = "IChangedHistoryPrototype/2.1 (local competition prototype)";

function curlArguments(url, maxTime) {
  return [
    "-L", "--fail", "--silent", "--show-error", "--retry", "4", "--retry-all-errors",
    "--retry-delay", "1", "--connect-timeout", "15", "--max-time", String(maxTime),
    "-A", userAgent, url,
  ];
}

function requestJson(url) {
  return JSON.parse(execFileSync("curl", curlArguments(url, 60), {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  }));
}

async function curlDownload(url, outputPath) {
  const args = curlArguments(url, 90);
  args.splice(args.length - 1, 0, "-o", outputPath);
  await execFileAsync("curl", args, { maxBuffer: 2 * 1024 * 1024 });
}

async function downloadFile(url, sourceUrl, outputPath) {
  try {
    await curlDownload(url, outputPath);
  } catch (directError) {
    rmSync(outputPath, { force: true });
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(sourceUrl)}&w=900&output=jpg`;
    try {
      await curlDownload(proxyUrl, outputPath);
    } catch (proxyError) {
      throw new AggregateError([directError, proxyError], "Wikimedia direct and image-proxy downloads both failed");
    }
  }
}

function apiUrl(host, parameters) {
  const params = new URLSearchParams({ action: "query", redirects: "1", format: "json", origin: "*", ...parameters });
  return `https://${host}/w/api.php?${params}`;
}

const articles = new Map();
const imageArticles = new Map();
const articleErrors = new Map();
for (const batch of chunks(entries)) {
  const titles = [...new Set(batch.flatMap(({ id }) => [pageTitles[id], imagePageTitles[id]].filter(Boolean)))];
  try {
    const payload = requestJson(apiUrl("en.wikipedia.org", {
      titles: titles.join("|"), prop: "pageimages|info", piprop: "name", inprop: "url",
    }));
    const aliases = new Map([
      ...(payload.query?.normalized ?? []).map(({ from, to }) => [from, to]),
      ...(payload.query?.redirects ?? []).map(({ from, to }) => [from, to]),
    ]);
    const pages = new Map(Object.values(payload.query?.pages ?? {}).map((page) => [page.title, page]));
    const resolvePage = (requested) => {
      let title = requested;
      for (let hop = 0; hop < 3 && aliases.has(title); hop += 1) title = aliases.get(title);
      return pages.get(title);
    };
    for (const entry of batch) {
      articles.set(entry.id, resolvePage(pageTitles[entry.id]));
      imageArticles.set(entry.id, resolvePage(imagePageTitles[entry.id] ?? pageTitles[entry.id]));
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    for (const entry of batch) articleErrors.set(entry.id, reason);
  }
}

const fileTitles = [...new Set(entries.map(({ id }) => (
  imageFileTitles[id] ?? (imageArticles.get(id)?.pageimage ? `File:${imageArticles.get(id).pageimage}` : undefined)
)).filter(Boolean))];
const files = new Map();
for (const batch of chunks(fileTitles)) {
  try {
    const payload = requestJson(apiUrl("commons.wikimedia.org", {
      titles: batch.join("|"), prop: "imageinfo|info", iiprop: "url|extmetadata", iiurlwidth: "900", inprop: "url",
    }));
    const aliases = new Map([
      ...(payload.query?.normalized ?? []).map(({ from, to }) => [from, to]),
      ...(payload.query?.redirects ?? []).map(({ from, to }) => [from, to]),
    ]);
    const pages = new Map(Object.values(payload.query?.pages ?? {}).map((page) => [page.title, page]));
    for (const requested of batch) {
      let title = requested;
      for (let hop = 0; hop < 3 && aliases.has(title); hop += 1) title = aliases.get(title);
      files.set(requested, pages.get(title));
    }
  } catch {
    // Each missing file below records a concrete fallback reason.
  }
}

function plain(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const fallbackCredits = {
  "tone-ancient.webp": {
    filePage: "https://commons.wikimedia.org/wiki/File:Audran.jpg",
    artist: "Gerard Audran after Charles Le Brun",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
  "tone-print.webp": {
    filePage: "https://commons.wikimedia.org/wiki/File:Gutenberg.press.jpg",
    artist: "Wikimedia Commons contributor",
    license: "Public domain dedication",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  "tone-revolution.webp": {
    filePage: "https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Delacroix_-_Liberty_Leading_the_People_(28th_July_1830)_-_WGA6177.jpg",
    artist: "Eugène Delacroix",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
  "tone-industry.webp": {
    filePage: "https://commons.wikimedia.org/wiki/File:Rain_Steam_and_Speed_the_Great_Western_Railway.jpg",
    artist: "J. M. W. Turner",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
};

function fallbackFor(year) {
  if (year >= 1914) return "tone-industry.webp";
  if (year >= 1750) return "tone-revolution.webp";
  if (year >= 1450) return "tone-print.webp";
  return "tone-ancient.webp";
}

function articleUrlFor(entry, article) {
  return article?.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitles[entry.id].replaceAll(" ", "_"))}`;
}

function commonsAttribution(entry, article, image, metadata) {
  const attribution = {
    articleUrl: articleUrlFor(entry, article),
    filePage: image?.descriptionurl ?? "",
    artist: plain(metadata.Artist?.value ?? metadata.Credit?.value ?? ""),
    license: plain(metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value ?? ""),
    licenseUrl: metadata.LicenseUrl?.value ?? image?.descriptionurl ?? "",
    sourceUrl: image?.url ?? "",
    fallback: null,
  };
  validateHistoryImageManifest([{ id: entry.id, ...attribution }], [entry.id]);
  return attribution;
}

function localFallbackAttribution(entry, article, asset, reason) {
  const credit = fallbackCredits[asset];
  const sourceAsset = `/assets/${asset}`;
  return {
    articleUrl: articleUrlFor(entry, article),
    filePage: credit.filePage,
    artist: credit.artist,
    license: credit.license,
    licenseUrl: credit.licenseUrl,
    sourceUrl: sourceAsset,
    fallback: {
      sourceAsset,
      sourceCredits: "/assets/CREDITS.md",
      reason,
    },
  };
}

const manifest = [];
let downloaded = 0;
let cached = 0;

async function processEntry(entry) {
  const article = articles.get(entry.id);
  const imageArticle = imageArticles.get(entry.id);
  const requestedFileTitle = imageFileTitles[entry.id]
    ?? (imageArticle?.pageimage ? `File:${imageArticle.pageimage}` : undefined);
  const file = requestedFileTitle ? files.get(requestedFileTitle) : undefined;
  const image = file?.imageinfo?.[0];
  const metadata = image?.extmetadata ?? {};
  const target = join(output, `${entry.id}.webp`);
  const previous = previousManifest.get(entry.id);
  let attribution;
  if (!shouldRefreshHistoryImage(existsSync(target), previous)) {
    attribution = previous;
  } else {
    const temporary = `${target}.tmp-${process.pid}`;
    const input = `${target}.source-${process.pid}`;
    try {
      if (!image?.thumburl && !image?.url) {
        const lookupError = articleErrors.get(entry.id);
        throw new Error(lookupError ? `article lookup failed: ${lookupError}` : "article has no reusable Commons image");
      }
      attribution = commonsAttribution(entry, article, image, metadata);
      const canonicalFileName = file.title.replace(/^File:/, "");
      const reusableImageUrl = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(canonicalFileName)}?width=900`;
      await downloadFile(reusableImageUrl, image.url, input);
      await sharp(input).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary);
      renameSync(temporary, target);
    } catch (error) {
      rmSync(temporary, { force: true });
      const asset = fallbackFor(entry.year);
      await sharp(join(root, "public/assets", asset)).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary);
      renameSync(temporary, target);
      attribution = localFallbackAttribution(entry, article, asset, error instanceof Error ? error.message : String(error));
    } finally {
      rmSync(input, { force: true });
    }
  }
  return {
    cached: shouldRefreshHistoryImage(existsSync(target), previous) ? 0 : 1,
    downloaded: previous === attribution ? 0 : 1,
    manifestEntry: {
      id: entry.id,
      articleUrl: attribution.articleUrl,
      filePage: attribution.filePage,
      artist: attribution.artist,
      license: attribution.license,
      licenseUrl: attribution.licenseUrl,
      sourceUrl: attribution.sourceUrl,
      fallback: attribution.fallback,
    },
  };
}

// Two concurrent downloads stay comfortably below the requested cap of four
// and avoid Wikimedia's burst rate limit during a cold 100-image refresh.
for (const batch of chunks(entries, 2)) {
  const results = await Promise.all(batch.map(processEntry));
  for (const result of results) {
    manifest.push(result.manifestEntry);
    downloaded += result.downloaded;
    cached += result.cached;
  }
}

validateHistoryImageManifest(manifest, entries.map(({ id }) => id));

function creditsFrom(items) {
  const lines = [
    "# Historical Card Image Credits", "",
    "Generated from `manifest.json`. Wikimedia attribution and license fields are retained from Commons metadata; fallback cards use local period artwork.", "",
  ];
  for (const item of items) {
    const eventName = entries.find(({ id }) => id === item.id)?.eventName ?? item.id;
    if (item.fallback) {
      lines.push(`- **${eventName}**: local fallback [source asset](${item.fallback.sourceAsset}) · [source credits](${item.fallback.sourceCredits}) · ${item.artist} · [${item.license}](${item.licenseUrl}) · ${item.fallback.reason}`);
    } else {
      lines.push(`- **${eventName}**: [article](${item.articleUrl}) · [source file](${item.filePage}) · ${item.artist} · [${item.license}](${item.licenseUrl})`);
    }
  }
  return `${lines.join("\n")}\n`;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(join(output, "CREDITS.md"), creditsFrom(manifest));
rmSync(join(output, "fallbacks.json"), { force: true });
console.log(JSON.stringify({ requested: entries.length, downloaded, cached, fallbacks: manifest.filter(({ fallback }) => fallback).length }, null, 2));
