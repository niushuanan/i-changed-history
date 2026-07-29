import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const OUTPUT_DIR = path.join(ROOT, "design/posters/2026-07-29");

const WIDTH = 3508;
const HEIGHT = 4961;
const SAFE_LEFT = 228;
const SAFE_RIGHT = 3280;
const SAFE_TOP = 546;
const SAFE_BOTTOM = 4266;

const asset = (relativePath) => path.join(ROOT, relativePath);
const svg = (markup) => Buffer.from(markup);

const palette = {
  coal: "#090907",
  ivory: "#eee3c8",
  paper: "#d4c8aa",
  brass: "#b99a58",
  yellow: "#d7a928",
  red: "#c72a22",
  vermilion: "#e13c2f",
  teal: "#3f8f87",
  muted: "#9b927e",
};

const fontStack = "'PingFang SC','Songti SC','STSong','Noto Serif CJK SC',serif";
const sansStack = "'PingFang SC','Helvetica Neue',Arial,sans-serif";

function baseTextSvg({
  width = WIDTH,
  height = HEIGHT,
  body = "",
  defs = "",
  background = "transparent",
}) {
  return svg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>${defs}</defs>
      <rect width="100%" height="100%" fill="${background}"/>
      ${body}
    </svg>
  `);
}

async function coverImage(relativePath, width, height, options = {}) {
  const pipeline = sharp(asset(relativePath))
    .resize(width, height, { fit: "cover", position: options.position ?? "centre" });

  if (options.modulate) pipeline.modulate(options.modulate);
  if (options.tint) pipeline.tint(options.tint);
  if (options.blur) pipeline.blur(options.blur);

  return pipeline.png().toBuffer();
}

async function containImage(relativePath, width, height) {
  return sharp(asset(relativePath))
    .resize(width, height, { fit: "contain" })
    .png()
    .toBuffer();
}

async function rotatedImage(input, angle, background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  return sharp(input).rotate(angle, { background }).png().toBuffer();
}

async function softShadow(width, height, radius = 46, opacity = 0.72) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: opacity },
    },
  }).blur(radius).png().toBuffer();
}

function safeZoneMatte() {
  return baseTextSvg({
    defs: `
      <linearGradient id="topMatte" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#050504" stop-opacity=".94"/>
        <stop offset=".76" stop-color="#050504" stop-opacity=".84"/>
        <stop offset="1" stop-color="#050504" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomMatte" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#050504" stop-opacity=".96"/>
        <stop offset=".78" stop-color="#050504" stop-opacity=".88"/>
        <stop offset="1" stop-color="#050504" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="leftMatte" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#050504" stop-opacity=".9"/>
        <stop offset=".72" stop-color="#050504" stop-opacity=".76"/>
        <stop offset="1" stop-color="#050504" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="rightMatte" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stop-color="#050504" stop-opacity=".9"/>
        <stop offset=".72" stop-color="#050504" stop-opacity=".76"/>
        <stop offset="1" stop-color="#050504" stop-opacity="0"/>
      </linearGradient>
    `,
    body: `
      <rect width="${WIDTH}" height="${SAFE_TOP}" fill="url(#topMatte)"/>
      <rect y="${SAFE_BOTTOM}" width="${WIDTH}" height="${HEIGHT - SAFE_BOTTOM}" fill="url(#bottomMatte)"/>
      <rect width="${SAFE_LEFT}" height="${HEIGHT}" fill="url(#leftMatte)"/>
      <rect x="${SAFE_RIGHT}" width="${WIDTH - SAFE_RIGHT}" height="${HEIGHT}" fill="url(#rightMatte)"/>
    `,
  });
}

async function buildCard({
  frame,
  icon,
  eyebrow,
  title,
  description,
  accent,
  width = 900,
  height = 1350,
}) {
  const frameBuffer = await sharp(asset(frame))
    .resize(width, height, { fit: "fill" })
    .png()
    .toBuffer();
  const iconBuffer = await containImage(icon, 270, 270);
  const copy = baseTextSvg({
    width,
    height,
    body: `
      <text x="${width / 2}" y="260" text-anchor="middle" fill="${accent}" font-family="${sansStack}" font-size="52" font-weight="800" letter-spacing="12">${eyebrow}</text>
      <line x1="230" x2="${width - 230}" y1="320" y2="320" stroke="${accent}" stroke-width="3" opacity=".7"/>
      <text x="${width / 2}" y="800" text-anchor="middle" fill="${palette.ivory}" font-family="${fontStack}" font-size="106" font-weight="800">${title}</text>
      <text x="${width / 2}" y="900" text-anchor="middle" fill="${palette.paper}" font-family="${fontStack}" font-size="42" letter-spacing="5">${description}</text>
      <path d="M${width / 2 - 52} 1042 h104" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="${width / 2}" cy="1042" r="14" fill="${accent}"/>
    `,
  });

  return sharp(frameBuffer)
    .composite([
      { input: iconBuffer, left: Math.round((width - 270) / 2), top: 380 },
      { input: copy, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function titleLayers({ tagline, subline, accent = palette.vermilion }) {
  const wordmark = await containImage("public/assets/brand/history-wordmark.png", 2740, 625);
  const copy = baseTextSvg({
    body: `
      <text x="${WIDTH / 2}" y="1350" text-anchor="middle" fill="${palette.ivory}" font-family="${fontStack}" font-size="126" font-weight="800" letter-spacing="8">${tagline}</text>
      <rect x="1175" y="1410" width="1158" height="8" rx="4" fill="${accent}" opacity=".95"/>
      <text x="${WIDTH / 2}" y="1515" text-anchor="middle" fill="${palette.paper}" font-family="${sansStack}" font-size="47" font-weight="500" letter-spacing="5">${subline}</text>
    `,
  });

  return [
    { input: wordmark, left: 384, top: 590 },
    { input: copy, left: 0, top: 0 },
  ];
}

async function posterOne() {
  const background = await coverImage("public/assets/picker/archive-stage-v2.webp", WIDTH, HEIGHT, {
    modulate: { brightness: 0.68, saturation: 0.82 },
  });

  const ancient = await rotatedImage(
    await coverImage("public/assets/history/qin-unification-221bc.webp", 1120, 1640, {
      modulate: { brightness: 0.72, saturation: 0.72 },
      position: "centre",
    }),
    -7,
  );
  const print = await rotatedImage(
    await coverImage("public/assets/history/gutenberg-bible-1455.webp", 1080, 1570, {
      modulate: { brightness: 0.68, saturation: 0.58 },
    }),
    3,
  );
  const moon = await rotatedImage(
    await coverImage("public/assets/history/apollo-11-1969.webp", 1080, 1570, {
      modulate: { brightness: 0.72, saturation: 0.64 },
    }),
    9,
  );

  const portalGlow = baseTextSvg({
    defs: `
      <radialGradient id="glow">
        <stop offset="0" stop-color="${palette.vermilion}" stop-opacity=".74"/>
        <stop offset=".38" stop-color="#7b261e" stop-opacity=".42"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=".32"/>
        <stop offset=".42" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".74"/>
      </linearGradient>
      <filter id="redGlow"><feGaussianBlur stdDeviation="22"/></filter>
    `,
    body: `
      <ellipse cx="${WIDTH / 2}" cy="2780" rx="1160" ry="1480" fill="url(#glow)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>
      <path d="M650 3250 C1030 2980 1250 2920 1690 2830 C2120 2745 2570 2460 2920 2030" fill="none" stroke="${palette.vermilion}" stroke-width="18" opacity=".62" filter="url(#redGlow)"/>
      <path d="M580 2180 C1120 2340 1380 2520 1710 2810 C2070 3120 2400 3290 2980 3430" fill="none" stroke="${palette.brass}" stroke-width="7" opacity=".5"/>
    `,
  });

  const card = await rotatedImage(
    await sharp(asset("public/assets/cards/frame-regular-v2.webp"))
      .resize(1510, 2265, { fit: "fill" })
      .png()
      .toBuffer(),
    -8,
  );
  const cardShadow = await softShadow(1690, 2445, 65, 0.7);
  const seal = baseTextSvg({
    width: 1510,
    height: 2265,
    body: `
      <circle cx="755" cy="1060" r="240" fill="#531d18" stroke="${palette.brass}" stroke-width="14"/>
      <circle cx="755" cy="1060" r="170" fill="none" stroke="${palette.vermilion}" stroke-width="8" opacity=".85"/>
      <circle cx="705" cy="1010" r="34" fill="${palette.ivory}"/>
      <circle cx="805" cy="1010" r="34" fill="${palette.ivory}"/>
      <circle cx="705" cy="1110" r="34" fill="${palette.ivory}"/>
      <circle cx="805" cy="1110" r="34" fill="${palette.ivory}"/>
      <text x="755" y="1495" text-anchor="middle" fill="${palette.ivory}" font-family="${fontStack}" font-size="92" font-weight="800" letter-spacing="12">命运待定</text>
    `,
  });
  const sealRotated = await rotatedImage(seal, -8);

  const traveler = baseTextSvg({
    body: `
      <g fill="#050504" stroke="${palette.brass}" stroke-width="7" opacity=".96">
        <circle cx="1754" cy="3750" r="88"/>
        <path d="M1635 3910 Q1754 3810 1873 3910 L1955 4280 H1553 Z"/>
      </g>
      <path d="M1754 3865 V4230" stroke="${palette.vermilion}" stroke-width="10" opacity=".8"/>
    `,
  });

  const footer = baseTextSvg({
    body: `
      <text x="${WIDTH / 2}" y="4090" text-anchor="middle" fill="${palette.ivory}" font-family="${fontStack}" font-size="72" font-weight="700" letter-spacing="7">四次选择 · 改写一生 · 改变 2026</text>
      <text x="${WIDTH / 2}" y="4210" text-anchor="middle" fill="${palette.teal}" font-family="${sansStack}" font-size="42" font-weight="700" letter-spacing="4">历史穿越 × 随机抽取 × 蝴蝶效应</text>
    `,
  });

  const title = await titleLayers({
    tagline: "命运只翻开一张",
    subline: "100 个真实历史现场 · 随机抽一个开局",
  });

  await sharp(background)
    .composite([
      { input: ancient, left: 210, top: 1850, blend: "screen" },
      { input: print, left: 1210, top: 1730, blend: "screen" },
      { input: moon, left: 2240, top: 1840, blend: "screen" },
      { input: portalGlow, left: 0, top: 0 },
      { input: cardShadow, left: 885, top: 1760 },
      { input: card, left: 910, top: 1680 },
      { input: sealRotated, left: 910, top: 1680 },
      { input: traveler, left: 0, top: 0 },
      ...title,
      { input: footer, left: 0, top: 0 },
      { input: safeZoneMatte(), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUTPUT_DIR, "poster-01-destiny-flip-a3.png"));
}

async function posterTwo() {
  const background = await coverImage("public/assets/picker/archive-stage-v2.webp", WIDTH, HEIGHT, {
    modulate: { brightness: 0.58, saturation: 0.68 },
  });

  const table = baseTextSvg({
    defs: `
      <radialGradient id="tableLight">
        <stop offset="0" stop-color="#4e3b22" stop-opacity=".62"/>
        <stop offset=".65" stop-color="#17130e" stop-opacity=".22"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="threadGlow"><feGaussianBlur stdDeviation="8"/></filter>
    `,
    body: `
      <ellipse cx="${WIDTH / 2}" cy="2860" rx="1520" ry="1680" fill="url(#tableLight)"/>
      <path d="M310 3290 C980 2700 1320 2980 1755 2490 C2210 1980 2660 2540 3190 1990" fill="none" stroke="${palette.vermilion}" stroke-width="14" opacity=".44" filter="url(#threadGlow)"/>
      <path d="M310 3290 C980 2700 1320 2980 1755 2490 C2210 1980 2660 2540 3190 1990" fill="none" stroke="${palette.vermilion}" stroke-width="5" opacity=".9"/>
      <g fill="${palette.vermilion}">
        <circle cx="310" cy="3290" r="18"/><circle cx="1755" cy="2490" r="18"/><circle cx="3190" cy="1990" r="18"/>
      </g>
    `,
  });

  const regularCard = await rotatedImage(await buildCard({
    frame: "public/assets/cards/frame-regular-v2.webp",
    icon: "public/assets/cards/choice-regular.png",
    eyebrow: "A · 循史",
    title: "照史推进",
    description: "顺着历史走",
    accent: palette.yellow,
  }), -8);
  const radicalCard = await buildCard({
    frame: "public/assets/cards/frame-radical-v2.webp",
    icon: "public/assets/cards/choice-radical.png",
    eyebrow: "B · 破局",
    title: "改写规则",
    description: "真正改变历史",
    accent: palette.vermilion,
    width: 950,
    height: 1425,
  });
  const surrealCard = await rotatedImage(await buildCard({
    frame: "public/assets/cards/frame-surreal-v2.webp",
    icon: "public/assets/cards/choice-surreal.png",
    eyebrow: "C · 天外",
    title: "让奇迹降临",
    description: "把不可能打出来",
    accent: palette.teal,
  }), 8);

  const leftShadow = await softShadow(1020, 1490, 55, 0.78);
  const centerShadow = await softShadow(1070, 1545, 68, 0.86);
  const rightShadow = await softShadow(1020, 1490, 55, 0.78);

  const roll = baseTextSvg({
    body: `
      <g transform="translate(1230 3610)">
        <rect width="1048" height="214" rx="30" fill="#3b0e0b" stroke="${palette.brass}" stroke-width="6"/>
        <path d="M180 107 a80 80 0 1 1 55 76" fill="none" stroke="${palette.ivory}" stroke-width="16" stroke-linecap="round"/>
        <path d="M233 168 l12 52 45-27" fill="${palette.ivory}"/>
        <text x="615" y="137" text-anchor="middle" fill="${palette.ivory}" font-family="${sansStack}" font-size="86" font-weight="900" letter-spacing="10">ROLL × 3</text>
      </g>
      <text x="${WIDTH / 2}" y="3995" text-anchor="middle" fill="${palette.paper}" font-family="${fontStack}" font-size="62" font-weight="700" letter-spacing="5">不满意，就把这一手洗掉重来</text>
      <text x="${WIDTH / 2}" y="4180" text-anchor="middle" fill="${palette.teal}" font-family="${sansStack}" font-size="42" font-weight="700" letter-spacing="4">按住读牌 · 上划选择 · 每幕最多换三次</text>
    `,
  });

  const title = await titleLayers({
    tagline: "三张牌，三种命运",
    subline: "循史 · 破局 · 天外 —— 选择你要写进正史的一张",
    accent: palette.yellow,
  });

  await sharp(background)
    .composite([
      { input: table, left: 0, top: 0 },
      { input: leftShadow, left: 140, top: 2100 },
      { input: rightShadow, left: 2350, top: 2100 },
      { input: centerShadow, left: 1220, top: 1935 },
      { input: regularCard, left: 100, top: 1980 },
      { input: surrealCard, left: 2310, top: 1980 },
      { input: radicalCard, left: 1279, top: 1880 },
      ...title,
      { input: roll, left: 0, top: 0 },
      { input: safeZoneMatte(), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUTPUT_DIR, "poster-02-roguelike-table-a3.png"));
}

async function maskedWing(relativePath, width, height, pathData, mirror = false) {
  const image = await coverImage(relativePath, width, height, {
    modulate: { brightness: 0.86, saturation: 0.86 },
  });
  const mask = baseTextSvg({
    width,
    height,
    body: `<path d="${pathData}" fill="#fff" transform="${mirror ? `translate(${width} 0) scale(-1 1)` : ""}"/>`,
  });
  return sharp(image)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function posterThree() {
  const background = await coverImage("public/assets/picker/archive-stage-v2.webp", WIDTH, HEIGHT, {
    modulate: { brightness: 0.72, saturation: 0.52 },
  });

  const wingPath = "M810 80 C330 120 70 540 140 990 C210 1440 530 1700 930 1790 C815 1450 865 1150 1110 870 C890 700 800 420 810 80 Z";
  const leftUpper = await maskedWing("public/assets/history/qin-unification-221bc.webp", 1260, 1860, wingPath);
  const rightUpper = await maskedWing("public/assets/history/apollo-11-1969.webp", 1260, 1860, wingPath, true);
  const leftLower = await maskedWing("public/assets/history/gutenberg-bible-1455.webp", 1160, 1500, wingPath);
  const rightLower = await maskedWing("public/assets/stage-2026.webp", 1160, 1500, wingPath, true);

  const butterflyInk = baseTextSvg({
    defs: `
      <filter id="inkGlow"><feGaussianBlur stdDeviation="13"/></filter>
      <radialGradient id="core">
        <stop offset="0" stop-color="${palette.vermilion}" stop-opacity=".78"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
    `,
    body: `
      <ellipse cx="${WIDTH / 2}" cy="2780" rx="1050" ry="1260" fill="url(#core)" opacity=".72"/>
      <g fill="none" stroke="${palette.vermilion}" stroke-linecap="round">
        <path d="M1754 2270 C1370 2050 910 1920 470 1970" stroke-width="18" opacity=".55" filter="url(#inkGlow)"/>
        <path d="M1754 2270 C2130 2050 2600 1920 3050 1970" stroke-width="18" opacity=".55" filter="url(#inkGlow)"/>
        <path d="M1754 2270 C1390 2550 1080 3010 690 3340" stroke-width="18" opacity=".55" filter="url(#inkGlow)"/>
        <path d="M1754 2270 C2115 2550 2430 3010 2820 3340" stroke-width="18" opacity=".55" filter="url(#inkGlow)"/>
        <path d="M1754 2270 C1370 2050 910 1920 470 1970" stroke-width="6"/>
        <path d="M1754 2270 C2130 2050 2600 1920 3050 1970" stroke-width="6"/>
        <path d="M1754 2270 C1390 2550 1080 3010 690 3340" stroke-width="6"/>
        <path d="M1754 2270 C2115 2550 2430 3010 2820 3340" stroke-width="6"/>
      </g>
      <path d="M1715 2200 Q1754 2080 1793 2200 L1850 3230 Q1754 3350 1658 3230 Z" fill="#090907" stroke="${palette.brass}" stroke-width="10"/>
      <path d="M1732 2180 C1620 2010 1540 1920 1435 1860 M1776 2180 C1890 2010 1970 1920 2075 1860" fill="none" stroke="${palette.brass}" stroke-width="10"/>
      <circle cx="1754" cy="2730" r="92" fill="#4f1714" stroke="${palette.vermilion}" stroke-width="10"/>
      <path d="M1720 2700 h68 M1720 2760 h68" stroke="${palette.ivory}" stroke-width="13" stroke-linecap="round"/>
    `,
  });

  const steps = baseTextSvg({
    body: `
      <g font-family="${sansStack}" font-size="42" font-weight="700" text-anchor="middle">
        <g transform="translate(520 3650)">
          <circle r="38" fill="${palette.red}" stroke="${palette.ivory}" stroke-width="4"/><text y="15" fill="${palette.ivory}">1</text>
          <text y="118" fill="${palette.paper}">命运当日</text>
        </g>
        <g transform="translate(1340 3650)">
          <circle r="38" fill="${palette.red}" stroke="${palette.ivory}" stroke-width="4"/><text y="15" fill="${palette.ivory}">2</text>
          <text y="118" fill="${palette.paper}">三日之后</text>
        </g>
        <g transform="translate(2168 3650)">
          <circle r="38" fill="${palette.red}" stroke="${palette.ivory}" stroke-width="4"/><text y="15" fill="${palette.ivory}">3</text>
          <text y="118" fill="${palette.paper}">人生转折</text>
        </g>
        <g transform="translate(2988 3650)">
          <circle r="38" fill="${palette.red}" stroke="${palette.ivory}" stroke-width="4"/><text y="15" fill="${palette.ivory}">4</text>
          <text y="118" fill="${palette.paper}">最后抉择</text>
        </g>
      </g>
      <path d="M558 3650 H1302 M1378 3650 H2130 M2206 3650 H2950" stroke="${palette.brass}" stroke-width="5" stroke-dasharray="18 18" opacity=".8"/>
      <text x="${WIDTH / 2}" y="4010" text-anchor="middle" fill="${palette.ivory}" font-family="${fontStack}" font-size="78" font-weight="800" letter-spacing="7">你改写一张牌，世界重写到 2026</text>
      <text x="${WIDTH / 2}" y="4190" text-anchor="middle" fill="${palette.teal}" font-family="${sansStack}" font-size="42" font-weight="700" letter-spacing="4">同一个人 · 四次抉择 · 一整个新世界</text>
    `,
  });

  const title = await titleLayers({
    tagline: "选择落下，蝴蝶效应开始",
    subline: "从真实历史的一刻，推演到你从未见过的 2026",
    accent: palette.teal,
  });

  await sharp(background)
    .composite([
      { input: butterflyInk, left: 0, top: 0 },
      { input: leftUpper, left: 300, top: 1750, blend: "screen" },
      { input: rightUpper, left: 1948, top: 1750, blend: "screen" },
      { input: leftLower, left: 560, top: 2580, blend: "screen" },
      { input: rightLower, left: 1788, top: 2580, blend: "screen" },
      { input: butterflyInk, left: 0, top: 0 },
      ...title,
      { input: steps, left: 0, top: 0 },
      { input: safeZoneMatte(), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUTPUT_DIR, "poster-03-butterfly-effect-a3.png"));
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all([posterOne(), posterTwo(), posterThree()]);

  const guide = baseTextSvg({
    defs: `
      <pattern id="stripe" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="16" height="32" fill="#ff2e2e" opacity=".16"/>
      </pattern>
    `,
    body: `
      <rect width="${WIDTH}" height="${SAFE_TOP}" fill="url(#stripe)"/>
      <rect y="${SAFE_BOTTOM}" width="${WIDTH}" height="${HEIGHT - SAFE_BOTTOM}" fill="url(#stripe)"/>
      <rect width="${SAFE_LEFT}" height="${HEIGHT}" fill="url(#stripe)"/>
      <rect x="${SAFE_RIGHT}" width="${WIDTH - SAFE_RIGHT}" height="${HEIGHT}" fill="url(#stripe)"/>
      <rect x="${SAFE_LEFT}" y="${SAFE_TOP}" width="${SAFE_RIGHT - SAFE_LEFT}" height="${SAFE_BOTTOM - SAFE_TOP}" fill="none" stroke="#00ff88" stroke-width="10" stroke-dasharray="32 22"/>
    `,
  });
  await sharp(guide).png().toFile(path.join(OUTPUT_DIR, "a3-safe-zone-guide.png"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
