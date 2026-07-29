import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "src", "data", "fixedPowerChoices.generated.ts");
const interactiveOutputPath = path.join(root, "src", "data", "fixedPowerChoices.interactive.generated.ts");
const checkpointPath = path.join(root, "tmp", "fixed-power-progress.json");
const interactiveSeedIds = new Set([
  "gutenberg-bible-1455",
  "galileo-1610",
  "apollo-11-1969",
]);
const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

const vite = await createServer({
  root,
  configFile: false,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

const [{ HISTORY_SEEDS }, { POWER_CATALOGUE }] = await Promise.all([
  vite.ssrLoadModule("/src/data/historySeeds/index.ts"),
  vite.ssrLoadModule("/src/game/powers.ts"),
]);
await vite.close();

const SYSTEM = [
  "你为中国玩家的历史穿越卡牌编写“天外”决定。",
  "每张牌都由客户端指定一项超能力。你只能使用指定能力，不能更换、弱化、比喻化或讨论它。",
  "必须完整兑现能力的范围、强度、对象和持续时间；能力本身就是解决历史瓶颈的决胜动作，不能只用来制造掩护再靠普通动作解决问题。",
  "主语永远是“你”。玩家亲自发动能力；历史人物只能是目标、盟友、对手或受影响者。",
  "决定必须深度使用给定快照中的具体人名、地点、器物、命令、期限和矛盾，不能写“历史现场、所有人、在场者、有关人物、公开审判、真相现形”。",
  "六张牌必须像六个完全不同的人在危急时刻说出的具体做法，不要共享句式。",
  "所有输出值必须是面向中国玩家的自然中文。powerId、actionSpec、deadline、unexpectedCost、deviationClass 等只允许作为 JSON 键名，绝不能原样写入牌面或正文；能力在文案里只写 assignedPowers.name，不得写 reverse-cause 等英文 ID。",
  "只返回 JSON。",
].join("\n");

const banned = /历史现场|在场者|有关人物|公开审判|真相现形|被迫说真话/;
const internalPlayerCopy = /\b(?:actionSpec|deadline|unexpectedCost|directResult|deviationClass|powerId)\b|(?:resverse|reverse)[\s_-]*cause/i;
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function assignedPowers(seedIndex) {
  return Array.from({ length: 6 }, (_, optionIndex) => (
    POWER_CATALOGUE[(seedIndex * 7 + optionIndex * 11) % POWER_CATALOGUE.length]
  ));
}

function promptFor(seed, powers, validationErrors = [], previousRejectedChoices = null) {
  return JSON.stringify({
    task: "为这个固定第一幕写六张可随机发出的天外 C 牌，每张严格对应同位置的 assignedPowers。",
    historySnapshot: {
      date: seed.dateLabel,
      eventName: seed.eventName,
      location: seed.location,
      playerRole: seed.role,
      immediateDecision: seed.decision,
      deadline: seed.urgency,
      actualOutcome: seed.historicalOutcome,
      verifiedFacts: seed.baselineFacts,
    },
    assignedPowers: powers.map(({ id, name, rule, duration }) => ({ powerId: id, name, exactRule: rule, duration })),
    exactTopLevelShape: { choices: ["六个完整 C 牌对象；顶层只能有 choices 这一个字段"] },
    outputContract: {
      choices: "恰好六项，顺序与 assignedPowers 相同",
      playerFacingLanguage: "字段值只写自然中文；内部键名和英文能力 ID 只能出现在键位，能力正文只用 assignedPowers.name",
      eachChoice: {
        id: "固定为 C",
        powerId: "逐字复制 assignedPowers.powerId",
        displayLabel: "4-12 个汉字；动词开头，直接点名本幕人物、器物或行动结果",
        label: "18-52 个汉字；你在期限前亲自发动该能力，对本幕具体人物或器物完成一项不可撤销行动",
        intent: "一句话说明这项能力怎样突破本幕唯一瓶颈",
        deviationClass: "固定为 rupture",
        usesModernKnowledge: "固定为 false",
        actionSpec: {
          actor: "逐字固定为你",
          action: "具体发动动作，不能复述能力定义",
          target: "本幕中有名字的人、地点、命令或器物",
          deadline: "沿用或具体化 historySnapshot.deadline",
        },
        instantEcho: {
          directResult: "能力发动后立即发生的可见事实",
          unexpectedCost: "不否定能力成功的具体代价",
          beneficiary: "具体受益者",
          payer: "具体承担者",
        },
      },
    },
    ...(validationErrors.length > 0 ? { previousValidationErrors: validationErrors } : {}),
    ...(previousRejectedChoices ? { previousRejectedChoices, rewriteInstruction: "只修正被拒问题，仍按 assignedPowers 原顺序返回全部六项" } : {}),
  });
}

function validate(seed, powers, candidate) {
  const errors = [];
  if (!candidate || typeof candidate !== "object" || !Array.isArray(candidate.choices)) {
    return ["缺少 choices 数组"];
  }
  if (candidate.choices.length !== powers.length) errors.push("choices 必须恰好六项");
  candidate.choices.forEach((choice, index) => {
    const expectedPower = powers[index];
    if (!choice || typeof choice !== "object") {
      errors.push(`choices.${index} 不是对象`);
      return;
    }
    if (choice.id !== "C") errors.push(`choices.${index}.id 必须为 C`);
    if (choice.powerId !== expectedPower?.id) errors.push(`choices.${index}.powerId 必须为 ${expectedPower?.id}`);
    if (choice.deviationClass !== "rupture") errors.push(`choices.${index}.deviationClass 必须为 rupture`);
    if (choice.usesModernKnowledge !== false) errors.push(`choices.${index}.usesModernKnowledge 必须为 false`);
    if (choice.actionSpec?.actor !== "你") errors.push(`choices.${index}.actionSpec.actor 必须逐字为你`);
    for (const field of ["displayLabel", "label", "intent"]) {
      if (typeof choice[field] !== "string" || !choice[field].trim()) errors.push(`choices.${index}.${field} 缺失`);
    }
    for (const field of ["action", "target", "deadline"]) {
      if (typeof choice.actionSpec?.[field] !== "string" || !choice.actionSpec[field].trim()) {
        errors.push(`choices.${index}.actionSpec.${field} 缺失`);
      }
    }
    for (const field of ["directResult", "unexpectedCost", "beneficiary", "payer"]) {
      if (typeof choice.instantEcho?.[field] !== "string" || !choice.instantEcho[field].trim()) {
        errors.push(`choices.${index}.instantEcho.${field} 缺失`);
      }
    }
    if (typeof choice.displayLabel === "string" && [...choice.displayLabel].length > 16) {
      errors.push(`choices.${index}.displayLabel 超过16字`);
    }
    if (banned.test(`${choice.displayLabel ?? ""}${choice.label ?? ""}${choice.actionSpec?.target ?? ""}`)) {
      errors.push(`choices.${index} 使用抽象占位词`);
    }
    const playerFacingCopy = [
      choice.displayLabel,
      choice.label,
      choice.intent,
      choice.actionSpec?.actor,
      choice.actionSpec?.action,
      choice.actionSpec?.target,
      choice.actionSpec?.deadline,
      choice.instantEcho?.directResult,
      choice.instantEcho?.unexpectedCost,
      choice.instantEcho?.beneficiary,
      choice.instantEcho?.payer,
    ].filter(Boolean).join("；");
    const leaksPowerId = powers.some(({ id }) => {
      const pattern = new RegExp(`\\b${id.replaceAll("-", "[\\s_-]+")}\\b`, "i");
      return pattern.test(playerFacingCopy);
    });
    if (internalPlayerCopy.test(playerFacingCopy) || leaksPowerId) {
      errors.push(`choices.${index} 泄漏内部字段名或英文能力 ID`);
    }
    const groundedChoiceText = `${choice.label ?? ""}${choice.actionSpec?.action ?? ""}${choice.actionSpec?.target ?? ""}`;
    if (
      typeof choice.label === "string"
      && !seed.baselineFacts.some((fact) => {
        const anchors = fact.match(/[\u3400-\u9fffA-Za-z0-9·—-]{2,12}/g) ?? [];
        return anchors.some((anchor) => [...anchor].length >= 2 && groundedChoiceText.includes(anchor));
      })
      && ![seed.eventName, seed.location, seed.decision].some((anchor) => (
        [...anchor].some((character) => /[\u3400-\u9fffA-Za-z0-9]/.test(character) && groundedChoiceText.includes(character))
      ))
    ) {
      errors.push(`choices.${index}.label 没有落到历史快照`);
    }
  });
  return errors;
}

function normalizeCandidate(candidate) {
  if (Array.isArray(candidate)) return { choices: candidate };
  if (!candidate || typeof candidate !== "object") return candidate;
  if (Array.isArray(candidate.choices)) return { choices: candidate.choices };
  if (Array.isArray(candidate.cards)) return { choices: candidate.cards };
  if (Array.isArray(candidate.options)) return { choices: candidate.options };
  if (Array.isArray(candidate.cChoices)) return { choices: candidate.cChoices };
  if (candidate.data && typeof candidate.data === "object") return normalizeCandidate(candidate.data);
  return candidate;
}

async function requestChoices(seed, powers) {
  let validationErrors = [];
  let previousRejectedChoices = null;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: promptFor(seed, powers, validationErrors, previousRejectedChoices) },
        ],
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 8192,
        stream: false,
      }),
    });
    if (!response.ok) {
      const retryable = response.status === 429 || response.status >= 500;
      if (retryable && attempt < 3) {
        await delay(800 * attempt);
        continue;
      }
      throw new Error(`${seed.id}: DeepSeek returned ${response.status}`);
    }
    const envelope = await response.json();
    const content = envelope?.choices?.[0]?.message?.content;
    let candidate;
    try {
      candidate = normalizeCandidate(JSON.parse(content));
    } catch {
      validationErrors = ["返回内容不是 JSON"];
      continue;
    }
    validationErrors = validate(seed, powers, candidate);
    if (validationErrors.length === 0) return candidate.choices;
    previousRejectedChoices = candidate.choices ?? null;
  }
  throw new Error(`${seed.id}: ${validationErrors.join("；")}`);
}

const concurrency = Math.max(1, Math.min(8, Number(process.env.FIXED_POWER_CONCURRENCY ?? 5)));
await fs.mkdir(path.dirname(checkpointPath), { recursive: true });
let checkpoint = {};
try {
  checkpoint = JSON.parse(await fs.readFile(checkpointPath, "utf8"));
} catch {
  try {
    const existingSource = await fs.readFile(outputPath, "utf8");
    const exportStart = existingSource.indexOf("export const FIXED_POWER_CHOICES");
    const jsonStart = existingSource.indexOf("{", exportStart);
    const jsonEnd = existingSource.lastIndexOf("}") + 1;
    checkpoint = JSON.parse(existingSource.slice(jsonStart, jsonEnd));
  } catch {
    checkpoint = {};
  }
}
const results = HISTORY_SEEDS.map((seed, index) => {
  const choices = checkpoint[seed.id];
  return Array.isArray(choices)
    && validate(seed, assignedPowers(index), { choices }).length === 0
    ? [seed.id, choices]
    : null;
});
const pendingIndexes = HISTORY_SEEDS
  .map((_, index) => index)
  .filter((index) => results[index] === null);
if (pendingIndexes.length > 0 && !apiKey) {
  throw new Error("DEEPSEEK_API_KEY is required when fixed choices are missing.");
}
let cursor = 0;
let completed = results.length - pendingIndexes.length;
let checkpointWrite = Promise.resolve();

async function worker() {
  while (cursor < pendingIndexes.length) {
    const index = pendingIndexes[cursor];
    cursor += 1;
    const seed = HISTORY_SEEDS[index];
    const choices = await requestChoices(seed, assignedPowers(index));
    results[index] = [seed.id, choices];
    checkpoint[seed.id] = choices;
    checkpointWrite = checkpointWrite.then(() => fs.writeFile(
      checkpointPath,
      JSON.stringify(checkpoint, null, 2),
      "utf8",
    ));
    completed += 1;
    process.stdout.write(`[fixed powers ${completed}/${HISTORY_SEEDS.length}] ${seed.id}\n`);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await checkpointWrite;

function sourceFor(entries) {
  const cleanEntries = entries.map(([seedId, choices]) => [
    seedId,
    choices.map((choice) => ({
      id: choice.id,
      powerId: choice.powerId,
      displayLabel: choice.displayLabel,
      label: choice.label,
      intent: choice.intent,
      deviationClass: choice.deviationClass,
      usesModernKnowledge: choice.usesModernKnowledge,
      actionSpec: {
        actor: choice.actionSpec.actor,
        action: choice.actionSpec.action,
        target: choice.actionSpec.target,
        deadline: choice.actionSpec.deadline,
      },
      instantEcho: {
        directResult: choice.instantEcho.directResult,
        unexpectedCost: choice.instantEcho.unexpectedCost,
        beneficiary: choice.instantEcho.beneficiary,
        payer: choice.instantEcho.payer,
      },
    })),
  ]);
  const serialized = JSON.stringify(Object.fromEntries(cleanEntries), null, 2);
  return [
    "import type { TimelineTurn } from \"../game/schema\";",
    "",
    `export const FIXED_POWER_CHOICES = ${serialized} as const satisfies Record<string, readonly TimelineTurn["choices"][2][]>;`,
    "",
  ].join("\n");
}

const source = sourceFor(results);
const interactiveSource = sourceFor(
  results.filter(([seedId]) => interactiveSeedIds.has(seedId)),
);
await fs.writeFile(outputPath, source, "utf8");
await fs.writeFile(interactiveOutputPath, interactiveSource, "utf8");
await fs.rm(checkpointPath, { force: true });
process.stdout.write(`Wrote ${outputPath}\n`);
process.stdout.write(`Wrote ${interactiveOutputPath}\n`);
