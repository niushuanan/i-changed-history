import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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
  "prc-founded-1949": "Proclamation of the People's Republic of China",
  "reform-opening-1978": "Chinese economic reform",
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

const missingTitles = entries.filter(({ id }) => !pageTitles[id]);
if (entries.length !== 100 || missingTitles.length) {
  throw new Error(`Expected 100 mapped moments; found ${entries.length}. Missing: ${missingTitles.map(({ id }) => id).join(", ")}`);
}

const chunks = (items, size = 40) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
const headers = { "User-Agent": "IChangedHistoryPrototype/2.0 (local competition prototype)" };

async function requestJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

function apiUrl(host, parameters) {
  const params = new URLSearchParams({ action: "query", redirects: "1", format: "json", origin: "*", ...parameters });
  return `https://${host}/w/api.php?${params}`;
}

const articles = new Map();
const articleErrors = new Map();
for (const batch of chunks(entries)) {
  const titles = batch.map(({ id }) => pageTitles[id]);
  try {
    const payload = await requestJson(apiUrl("en.wikipedia.org", {
      titles: titles.join("|"), prop: "pageimages|info", piprop: "name", inprop: "url",
    }));
    const aliases = new Map([
      ...(payload.query?.normalized ?? []).map(({ from, to }) => [from, to]),
      ...(payload.query?.redirects ?? []).map(({ from, to }) => [from, to]),
    ]);
    const pages = new Map(Object.values(payload.query?.pages ?? {}).map((page) => [page.title, page]));
    for (const entry of batch) {
      let title = pageTitles[entry.id];
      for (let hop = 0; hop < 3 && aliases.has(title); hop += 1) title = aliases.get(title);
      articles.set(entry.id, pages.get(title));
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    for (const entry of batch) articleErrors.set(entry.id, reason);
  }
}

const fileTitles = [...new Set(entries.map(({ id }) => articles.get(id)?.pageimage).filter(Boolean).map((name) => `File:${name}`))];
const files = new Map();
for (const batch of chunks(fileTitles)) {
  try {
    const payload = await requestJson(apiUrl("commons.wikimedia.org", {
      titles: batch.join("|"), prop: "imageinfo|info", iiprop: "url|extmetadata", iiurlwidth: "1400", inprop: "url",
    }));
    for (const page of Object.values(payload.query?.pages ?? {})) files.set(page.title, page);
  } catch {
    // Each missing file below records a concrete fallback reason.
  }
}

function plain(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function fallbackFor(year) {
  if (year >= 1914) return "tone-industry.webp";
  if (year >= 1750) return "tone-revolution.webp";
  if (year >= 1450) return "stage-early-modern.webp";
  return "tone-ancient.webp";
}

const manifest = [];
let downloaded = 0;
let cached = 0;
for (const entry of entries) {
  const article = articles.get(entry.id);
  const file = article?.pageimage ? files.get(`File:${article.pageimage}`) : undefined;
  const image = file?.imageinfo?.[0];
  const metadata = image?.extmetadata ?? {};
  const target = join(output, `${entry.id}.webp`);
  const previous = previousManifest.get(entry.id);
  let fallback = previous?.fallback ?? null;
  if (existsSync(target)) {
    cached += 1;
  } else {
    const temporary = `${target}.tmp-${process.pid}`;
    try {
      if (!image?.thumburl && !image?.url) {
        const lookupError = articleErrors.get(entry.id);
        throw new Error(lookupError ? `article lookup failed: ${lookupError}` : "article has no reusable Commons image");
      }
      const response = await fetch(image.thumburl ?? image.url, { headers });
      if (!response.ok) throw new Error(`image HTTP ${response.status}`);
      await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary);
      renameSync(temporary, target);
      downloaded += 1;
      fallback = null;
    } catch (error) {
      rmSync(temporary, { force: true });
      const asset = fallbackFor(entry.year);
      await sharp(join(root, "public/assets", asset)).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 82 }).toFile(temporary);
      renameSync(temporary, target);
      fallback = { asset, reason: error instanceof Error ? error.message : String(error) };
    }
  }
  manifest.push({
    id: entry.id,
    articleUrl: article?.fullurl ?? previous?.articleUrl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitles[entry.id].replaceAll(" ", "_"))}`,
    filePage: image?.descriptionurl ?? file?.fullurl ?? previous?.filePage ?? "",
    artist: plain(metadata.Artist?.value ?? metadata.Credit?.value ?? previous?.artist ?? ""),
    license: plain(metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value ?? previous?.license ?? ""),
    licenseUrl: metadata.LicenseUrl?.value ?? previous?.licenseUrl ?? "",
    sourceUrl: image?.url ?? image?.thumburl ?? previous?.sourceUrl ?? "",
    fallback,
  });
}

function creditsFrom(items) {
  const lines = [
    "# Historical Card Image Credits", "",
    "Generated from `manifest.json`. Wikimedia attribution and license fields are retained from Commons metadata; fallback cards use local period artwork.", "",
  ];
  for (const item of items) {
    const eventName = entries.find(({ id }) => id === item.id)?.eventName ?? item.id;
    if (item.fallback) {
      lines.push(`- **${eventName}**: local fallback \`${item.fallback.asset}\` (${item.fallback.reason})`);
    } else {
      const artist = item.artist || "artist not stated";
      const license = item.license || "license metadata unavailable";
      lines.push(`- **${eventName}**: [article](${item.articleUrl}) · [source file](${item.filePage || item.sourceUrl || item.articleUrl}) · ${artist} · [${license}](${item.licenseUrl || item.filePage || item.articleUrl})`);
    }
  }
  return `${lines.join("\n")}\n`;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(join(output, "CREDITS.md"), creditsFrom(manifest));
rmSync(join(output, "fallbacks.json"), { force: true });
console.log(JSON.stringify({ requested: entries.length, downloaded, cached, fallbacks: manifest.filter(({ fallback }) => fallback).length }, null, 2));
