import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = readFileSync(join(root, "src/data/historySeeds.ts"), "utf8");
const entries = [...source.matchAll(/moment\("([^"]+)",\s*(\d+),\s*"[^"]+",\s*"([^"]+)"/g)]
  .map(([, id, year, eventName]) => ({ id, year: Number(year), eventName }));
const output = join(root, "public/assets/history");
const staging = join(root, `public/assets/history.next-${process.pid}`);
const backup = join(root, `public/assets/history.previous-${process.pid}`);
const temporary = join(root, `tmp/history-images-${process.pid}`);
mkdirSync(output, { recursive: true });
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
mkdirSync(temporary, { recursive: true });

const pageTitles = {
  "dong-zhuo-lu-bu-190": "Dong Zhuo", "guandu-wuchao-200": "Battle of Guandu",
  "red-cliffs-208": "Battle of Red Cliffs", "feishui-383": "Battle of Fei River",
  "yiling-222": "Battle of Xiaoting", "jieting-228": "Battle of Jieting",
  "gaoping-tombs-249": "Incident at the Gaoping Tombs",
  "sui-unification-589": "Chen conquest by Sui", "xuanwu-gate-626": "Xuanwu Gate Incident",
  "wu-zetian-690": "Wu Zetian", "mawei-756": "Mawei courier station incident",
  "an-lushan-755": "An Lushan Rebellion", "chen-bridge-960": "Chen Bridge Incident",
  "wang-anshi-1069": "New Policies (Song dynasty)",
  "chanyuan-1004": "Chanyuan Treaty", "jingkang-1127": "Jingkang Incident",
  "yue-fei-1140": "Yue Fei", "diaoyu-1259": "Battle of Diaoyu Fortress",
  "xiangyang-1273": "Battle of Xiangyang (1267–1273)",
  "yamen-1279": "Battle of Yamen", "poyang-1363": "Battle of Lake Poyang",
  "jingnan-nanjing-1402": "Jingnan campaign",
  "zheng-he-1405": "Ming treasure voyages", "tumu-crisis-1449": "Tumu Crisis",
  "ningyuan-1626": "Battle of Ningyuan", "kangxi-aobai-1669": "Oboi",
  "shanhai-pass-1644": "Battle of Shanhai Pass", "koxinga-1661": "Siege of Fort Zeelandia",
  "macartney-1793": "Macartney Embassy", "humen-1839": "Destruction of opium at Humen",
  "teutoburg-9": "Battle of the Teutoburg Forest", "great-fire-rome-64": "Great Fire of Rome",
  "edict-milan-313": "Edict of Milan", "fall-rome-476": "Fall of the Western Roman Empire",
  "tours-732": "Battle of Tours", "charlemagne-800": "Charlemagne",
  "hastings-1066": "Battle of Hastings", "clermont-1095": "Council of Clermont",
  "fourth-crusade-1204": "Sack of Constantinople", "magna-carta-1215": "Magna Carta",
  "mongol-japan-1274": "Mongol invasions of Japan", "constantinople-1453": "Fall of Constantinople",
  "columbus-1492": "Christopher Columbus", "luther-1517": "Ninety-five Theses",
  "tenochtitlan-1521": "Fall of Tenochtitlan", "spanish-armada-1588": "Spanish Armada",
  "sekigahara-1600": "Battle of Sekigahara", "galileo-1610": "Sidereus Nuncius",
  "newton-principia-1687": "Philosophiæ Naturalis Principia Mathematica",
  "vienna-1683": "Battle of Vienna", "boston-tea-1773": "Boston Tea Party",
  "declaration-1776": "United States Declaration of Independence", "bastille-1789": "Storming of the Bastille",
  "trafalgar-1805": "Battle of Trafalgar", "waterloo-1815": "Battle of Waterloo",
  "origin-species-1859": "On the Origin of Species", "gettysburg-1863": "Battle of Gettysburg",
  "lincoln-emancipation-1862": "Emancipation Proclamation",
  "meiji-1868": "Meiji Restoration", "sarajevo-1914": "Assassination of Archduke Franz Ferdinand",
  "october-revolution-1917": "October Revolution",
  "wall-street-1929": "Wall Street Crash of 1929", "dunkirk-1940": "Dunkirk evacuation",
  "roosevelt-bank-holiday-1933": "Emergency Banking Act",
  "hitler-poland-1939": "Invasion of Poland", "stalin-moscow-1941": "Battle of Moscow",
  "normandy-1944": "Normandy landings",
  "cuban-missile-1962": "Cuban Missile Crisis", "berlin-wall-1989": "Fall of the Berlin Wall",
  "apollo-11-1969": "Apollo 11",
};

const missingTitles = entries.filter(({ id }) => !pageTitles[id]);
if (missingTitles.length) {
  throw new Error(`Missing Wikipedia page titles: ${missingTitles.map(({ id }) => id).join(", ")}`);
}

function curl(url, outputPath) {
  const args = ["-L", "--fail", "--silent", "--show-error", "--retry", "4", "--retry-all-errors",
    "--retry-delay", "2", "--connect-timeout", "15", "--max-time", "60", "-A",
    "IChangedHistoryPrototype/1.0 (local competition prototype)"];
  if (outputPath) args.push("-o", outputPath);
  args.push(url);
  return execFileSync("curl", args, outputPath ? undefined : { encoding: "utf8" });
}

function fallbackFor(year) {
  if (year >= 1914) return "tone-industry.webp";
  if (year >= 1750) return "tone-revolution.webp";
  if (year >= 1450) return "stage-early-modern.webp";
  return "tone-ancient.webp";
}

const params = new URLSearchParams({
  action: "query", titles: entries.map(({ id }) => pageTitles[id]).join("|"),
  prop: "pageimages|info", piprop: "thumbnail", pithumbsize: "1200", inprop: "url",
  redirects: "1", format: "json", origin: "*",
});
const payload = JSON.parse(curl(`https://en.wikipedia.org/w/api.php?${params}`));
const pages = new Map(Object.values(payload.query?.pages ?? {}).map((page) => [page.title, page]));
const redirects = new Map((payload.query?.redirects ?? []).map((item) => [item.from, item.to]));
const credits = ["# Historical Card Image Credits", "", "Event-specific images come from the exact English Wikipedia pages below. Cached cards retain a previously downloaded local image. Cards marked local fallback use the project's generated period artwork because the article had no suitable page image.", ""];
const failures = [];

for (const { id, year, eventName } of entries) {
  const title = pageTitles[id];
  const page = pages.get(title) ?? pages.get(redirects.get(title));
  const cached = join(output, `${id}.webp`);
  const target = join(staging, `${id}.webp`);
  if (existsSync(cached)) {
    copyFileSync(cached, target);
    credits.push(`- **${eventName}**: cached local image - \`${id}.webp\``);
    continue;
  }
  try {
    if (!page?.thumbnail?.source) throw new Error("no page image");
    const extension = basename(new URL(page.thumbnail.source).pathname).split(".").at(-1) || "jpg";
    if (extension.toLowerCase() === "gif") throw new Error("animated GIF page image");
    const input = join(temporary, `${id}.${extension}`);
    curl(page.thumbnail.source, input);
    execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", "900", "0", input, "-o", target]);
    credits.push(`- **${eventName}**: [${page.title}](${page.fullurl}) - [image](${page.thumbnail.source})`);
  } catch (error) {
    const fallback = fallbackFor(year);
    copyFileSync(join(root, "public/assets", fallback), target);
    failures.push({ id, eventName, reason: error instanceof Error ? error.message : String(error), fallback });
    credits.push(`- **${eventName}**: local fallback - \`${fallback}\``);
  }
  await new Promise((resolve) => setTimeout(resolve, 350));
}

writeFileSync(join(staging, "CREDITS.md"), `${credits.join("\n")}\n`);
writeFileSync(join(staging, "fallbacks.json"), `${JSON.stringify(failures, null, 2)}\n`);

rmSync(backup, { recursive: true, force: true });
renameSync(output, backup);
try {
  renameSync(staging, output);
  rmSync(backup, { recursive: true, force: true });
} catch (error) {
  renameSync(backup, output);
  throw error;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
console.log(JSON.stringify({ requested: entries.length, downloaded: entries.length - failures.length, fallbacks: failures.length }, null, 2));
