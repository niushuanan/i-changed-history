import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "src", "data", "fixedOpeningChoices.generated.ts");
const interactiveOutputPath = path.join(root, "src", "data", "fixedOpeningChoices.interactive.generated.ts");
const checkpointPath = path.join(root, "tmp", "fixed-opening-choice-progress.json");
const interactiveSeedIds = new Set([
  "gutenberg-bible-1455",
  "galileo-1610",
  "apollo-11-1969",
]);
let localEnv = {};
try {
  localEnv = Object.fromEntries(
    (await fs.readFile(path.join(root, ".env.local"), "utf8"))
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
} catch {
  localEnv = {};
}
const env = loadEnv("development", root, "");
const apiKey = (
  process.env.FIXED_OPENING_DEEPSEEK_API_KEY
  ?? localEnv.DEEPSEEK_API_KEY
  ?? localEnv.VITE_DEEPSEEK_API_KEY
  ?? env.DEEPSEEK_API_KEY
  ?? env.VITE_DEEPSEEK_API_KEY
  ?? process.env.DEEPSEEK_API_KEY
  ?? process.env.VITE_DEEPSEEK_API_KEY
)?.trim();
const model = (
  localEnv.DEEPSEEK_MODEL
  ?? localEnv.VITE_DEEPSEEK_MODEL
  ?? env.DEEPSEEK_MODEL
  ?? env.VITE_DEEPSEEK_MODEL
  ?? process.env.DEEPSEEK_MODEL
  ?? process.env.VITE_DEEPSEEK_MODEL
  ?? "deepseek-v4-flash"
).trim();

const vite = await createServer({
  root,
  configFile: false,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});
const { HISTORY_SEEDS } = await vite.ssrLoadModule("/src/data/historySeeds/index.ts");
await vite.close();

const SYSTEM = [
  "你为中国玩家的历史穿越卡牌编写固定第一幕的循史与破局决定。",
  "这里的“循史”不是温和、拖延或少改变，而是让 historySnapshot.actualHistory 中已经发生的真实结果按时发生。",
  "真实历史本身可能包含战争、政变、公开、拒绝、处决或制度巨变；只要它确实让 actualHistory 发生，就仍然属于循史。",
  "两张 A 必须由玩家以 assignedRole 的权限执行不同具体动作，但都保留真实历史中的关键人物、控制关系、命令方向和最终结果。不得阻止、逆转、推迟到期限之后或偷换真实结果。",
  "两张 B 必须在同一历史决断点改变控制关系、命令方向或关键结果，并明确谁立刻获益、谁承担代价。",
  "四张牌都必须落到快照中的真实人物、机构、地点、器物、命令和期限，像当事人会当场说出口的动作。",
  "这是四幕人生的第一幕。任何牌的直接结果或代价都不得让玩家死亡、被处死、失去意识、终身监禁或永久失去行动能力；可以受伤、失势、被追捕或流亡。",
  "禁止“按原计划、遵循历史、推进历史、现场众人、原负责人、另找一队、有关人物、稳妥处置、综合施策”等占位话术。",
  "不得使用超能力、现代武器、未来知识或架空技术。只返回 JSON。",
].join("\n");

const JUDGE_SYSTEM = [
  "你是历史卡牌语义审校员。",
  "你只审校 A1 和 A2，不评价 B 牌。",
  "只判断两张 A 是否都会让 actualHistory 中的关键控制关系、命令方向和最终结果按时发生，并且动作符合玩家 assignedRole。",
  "不要因为真实历史本身激进就把 A 判成 B。判断标准只有它是否保留真实发生的结果。",
  "发现 A 阻止、逆转、拖延真实结果，或只是核对等待而没有执行真实动作，必须判失败。",
  "只返回 JSON。",
].join("\n");

const banned = /按原计划|遵循历史|推进历史|历史走向|现场众人|在场者|有关人物|原负责人|另找一队|另派一队|稳妥处置|综合施策|改变历史/;
const passiveOnly = /^(?:先|暂缓|等待|观察|核对|复核|询问|追问|调查|查清)/;
const protagonistRemoved = /(?:你|玩家|主角)(?!的).{0,8}(?:被|遭).{0,8}(?:处死|斩首|杀死|击毙|杀害)|(?:你|玩家|主角)(?!的)(?:本人)?(?:当场|随后|最终|立即|会|将)?(?:死亡|身亡|丧命|殒命|自尽|失去意识|终身监禁|终身囚禁)|(?:处死|斩首|杀死|击毙)(?:了)?(?:你|玩家|主角)(?!的)/;
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let providerUnavailable = !apiKey;

function promptFor(seed, validationErrors = [], previousRejected = null) {
  return JSON.stringify({
    task: "写固定第一幕两组 A/B 牌。首组进入场景即显示，第二组供第一次 Roll；两组职责完全一致但动作杠杆不得重复。",
    historySnapshot: {
      date: seed.dateLabel,
      eventName: seed.eventName,
      location: seed.location,
      assignedRole: seed.role,
      counterfactualQuestion: seed.decision,
      deadline: seed.urgency,
      actualHistory: seed.historicalOutcome,
      verifiedFacts: seed.baselineFacts,
    },
    semanticContract: {
      trajectory: "先用一句话写清：为了让 actualHistory 发生，assignedRole 在 deadline 前必须完成什么具体动作。",
      choicesA: "A1；必须实际执行 trajectory，而不是等待、核对或提出建议",
      choicesB: "B1；必须改变 trajectory 中的控制权、命令或结果",
      rollChoicesA: "A2；使用另一人物、器物或程序实际执行同一真实历史轨道",
      rollChoicesB: "B2；使用另一杠杆改变真实历史结果",
    },
    exactShape: {
      trajectory: {
        historicalPath: "真实历史中的具体行动链",
        preservedResult: "逐字对应 actualHistory 的结果",
        decisiveFork: "本幕能够改变结果的具体控制点",
      },
      choices: ["A1 完整对象", "B1 完整对象"],
      rollChoices: ["A2 完整对象", "B2 完整对象"],
    },
    eachChoice: {
      id: "按位置固定为 A 或 B",
      displayLabel: "4-12 个汉字；具体动宾短语",
      label: "18-58 个汉字；你在 deadline 前对具体人物、命令、器物或程序做出不可撤销动作",
      intent: "说明保留或改动了哪条具体行动链，不写产品术语",
      deviationClass: "A 固定 nudge；B 固定 reform",
      usesModernKnowledge: "固定 false",
      actionSpec: {
        actor: "逐字固定为你",
        action: "已经执行的具体动作",
        target: "快照中有名字的人、机构、命令、地点或器物",
        deadline: "沿用或具体化 historySnapshot.deadline",
      },
      instantEcho: {
        directResult: "动作后立刻发生的可见事实；A 必须朝 actualHistory 落地，B 必须让它发生变化",
        unexpectedCost: "不否定动作已经成功的具体代价",
        beneficiary: "具体受益者",
        payer: "具体承担者",
      },
    },
    ...(validationErrors.length > 0 ? { previousValidationErrors: validationErrors } : {}),
    ...(previousRejected ? {
      previousRejected,
      rewriteInstruction: "根据问题重写全部四张，保留准确历史事实但不要保留失败句式",
    } : {}),
  });
}

function textField(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateChoice(choice, expectedId, pathLabel) {
  const errors = [];
  if (!choice || typeof choice !== "object") return [`${pathLabel} 不是对象`];
  if (choice.id !== expectedId) errors.push(`${pathLabel}.id 必须为 ${expectedId}`);
  if (choice.deviationClass !== (expectedId === "A" ? "nudge" : "reform")) {
    errors.push(`${pathLabel}.deviationClass 与位置不符`);
  }
  if (choice.usesModernKnowledge !== false) errors.push(`${pathLabel}.usesModernKnowledge 必须为 false`);
  if (choice.powerId !== undefined) errors.push(`${pathLabel} 不得携带 powerId`);
  if (choice.actionSpec?.actor !== "你") errors.push(`${pathLabel}.actionSpec.actor 必须逐字为你`);
  for (const field of ["displayLabel", "label", "intent"]) {
    if (!textField(choice[field])) errors.push(`${pathLabel}.${field} 缺失`);
  }
  for (const field of ["action", "target", "deadline"]) {
    if (!textField(choice.actionSpec?.[field])) errors.push(`${pathLabel}.actionSpec.${field} 缺失`);
  }
  for (const field of ["directResult", "unexpectedCost", "beneficiary", "payer"]) {
    if (!textField(choice.instantEcho?.[field])) errors.push(`${pathLabel}.instantEcho.${field} 缺失`);
  }
  if (textField(choice.displayLabel)) {
    const length = [...choice.displayLabel.trim()].length;
    if (length < 4 || length > 16) errors.push(`${pathLabel}.displayLabel 必须为4-16字`);
  }
  const combined = [
    choice.displayLabel,
    choice.label,
    choice.actionSpec?.action,
    choice.actionSpec?.target,
  ].filter(Boolean).join("；");
  if (banned.test(combined)) errors.push(`${pathLabel} 使用了通用占位话术`);
  if (
    expectedId === "A"
    && passiveOnly.test(choice.actionSpec?.action ?? "")
    && !/(交付|签署|发布|下令|执行|打开|关闭|移交|发射|印刷|宣读|进攻|撤退|逮捕|放行|起火|点火|投票|接受|拒绝|提交|送出|发出|扣动|切断|登陆|登月)/.test(combined)
  ) {
    errors.push(`${pathLabel} 只在等待或核对，没有执行真实历史动作`);
  }
  if (protagonistRemoved.test([
    choice.instantEcho?.directResult,
    choice.instantEcho?.unexpectedCost,
    choice.instantEcho?.payer,
  ].filter(Boolean).join("；"))) {
    errors.push(`${pathLabel} 让四幕主角在第一幕死亡或永久退场`);
  }
  return errors;
}

function validateCandidate(candidate) {
  const errors = [];
  if (!candidate || typeof candidate !== "object") return ["顶层不是对象"];
  if (!candidate.trajectory || typeof candidate.trajectory !== "object") {
    errors.push("缺少 trajectory");
  } else {
    for (const field of ["historicalPath", "preservedResult", "decisiveFork"]) {
      if (!textField(candidate.trajectory[field])) errors.push(`trajectory.${field} 缺失`);
    }
  }
  if (!Array.isArray(candidate.choices) || candidate.choices.length !== 2) {
    errors.push("choices 必须恰好两项");
  }
  if (!Array.isArray(candidate.rollChoices) || candidate.rollChoices.length !== 2) {
    errors.push("rollChoices 必须恰好两项");
  }
  if (Array.isArray(candidate.choices)) {
    errors.push(...validateChoice(candidate.choices[0], "A", "choices.0"));
    errors.push(...validateChoice(candidate.choices[1], "B", "choices.1"));
  }
  if (Array.isArray(candidate.rollChoices)) {
    errors.push(...validateChoice(candidate.rollChoices[0], "A", "rollChoices.0"));
    errors.push(...validateChoice(candidate.rollChoices[1], "B", "rollChoices.1"));
  }
  const labels = [
    ...(candidate.choices ?? []),
    ...(candidate.rollChoices ?? []),
  ].map((choice) => choice?.label).filter(textField);
  if (new Set(labels).size !== labels.length) errors.push("四张牌的完整决定不得重复");
  return errors;
}

function normalizeCandidate(candidate) {
  if (!candidate || typeof candidate !== "object") return candidate;
  if (candidate.data && typeof candidate.data === "object") return normalizeCandidate(candidate.data);
  if (candidate.exactShape && typeof candidate.exactShape === "object") {
    return normalizeCandidate(candidate.exactShape);
  }
  const firstCards = candidate.firstSceneCards;
  if (firstCards && typeof firstCards === "object") {
    if (Array.isArray(firstCards.choices) && Array.isArray(firstCards.rollChoices)) {
      return normalizeCandidate(firstCards);
    }
    const rollCards = candidate.rollChoicesCards ?? candidate.rollCards;
    if (
      firstCards.A1
      && firstCards.B1
      && rollCards
      && typeof rollCards === "object"
      && rollCards.A2
      && rollCards.B2
    ) {
      return {
        trajectory: firstCards.trajectory,
        choices: [firstCards.A1, firstCards.B1],
        rollChoices: [rollCards.A2, rollCards.B2],
      };
    }
  }
  for (const key of [
    "result",
    "output",
    "opening",
    "firstScene",
    "firstActCards",
    "scene",
    "fixedOpening",
    "fixedOpeningChoices",
  ]) {
    if (candidate[key] && typeof candidate[key] === "object") {
      return normalizeCandidate(candidate[key]);
    }
  }
  const objectEntries = Object.entries(candidate)
    .filter(([, value]) => value && typeof value === "object");
  if (
    !candidate.trajectory
    && !candidate.choices
    && objectEntries.length === 1
  ) {
    return normalizeCandidate(objectEntries[0][1]);
  }
  return candidate;
}

function coerceCandidate(seed, candidate) {
  if (!candidate || typeof candidate !== "object") return candidate;
  const rawChoices = Array.isArray(candidate.choices) ? candidate.choices : [];
  const choices = rawChoices.length === 4 ? rawChoices.slice(0, 2) : rawChoices;
  const rollChoices = Array.isArray(candidate.rollChoices)
    ? candidate.rollChoices
    : rawChoices.length === 4
      ? rawChoices.slice(2, 4)
      : [];
  const normalizePair = (pair) => pair.map((choice, index) => {
    const directResult = choice?.instantEcho?.directResult ?? "";
    const intent = banned.test(choice?.intent ?? "")
      ? `${index === 0 ? "确保" : "改成"}${directResult.replace(/[。！？!?]+$/g, "")}`
      : choice?.intent;
    return {
      ...choice,
      intent,
      id: index === 0 ? "A" : "B",
      deviationClass: index === 0 ? "nudge" : "reform",
      usesModernKnowledge: false,
      actionSpec: {
        ...choice?.actionSpec,
        actor: "你",
      },
    };
  });
  const normalizedChoices = normalizePair(choices);
  const normalizedRollChoices = normalizePair(rollChoices);
  return {
    ...candidate,
    trajectory: typeof candidate.trajectory === "object" && candidate.trajectory !== null
      ? candidate.trajectory
      : {
      historicalPath: typeof candidate.trajectory === "string"
        ? candidate.trajectory
        : normalizedChoices[0]?.intent ?? normalizedChoices[0]?.actionSpec?.action ?? "",
      preservedResult: seed.historicalOutcome,
      decisiveFork: normalizedChoices[1]?.intent ?? normalizedChoices[1]?.actionSpec?.action ?? "",
    },
    choices: normalizedChoices,
    rollChoices: normalizedRollChoices,
  };
}

async function requestJson(system, userContent, attempt) {
  if (providerUnavailable) throw new Error("DeepSeek generation is unavailable.");
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
      max_tokens: 8192,
      stream: false,
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) {
    if (response.status === 402) {
      providerUnavailable = true;
      throw new Error("DeepSeek generation quota is exhausted.");
    }
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await delay(800 * attempt);
      return requestJson(system, userContent, attempt + 1);
    }
    throw new Error(`DeepSeek returned ${response.status}`);
  }
  const envelope = await response.json();
  try {
    return JSON.parse(envelope?.choices?.[0]?.message?.content ?? "");
  } catch (error) {
    if (attempt < 3) {
      await delay(400 * attempt);
      return requestJson(system, userContent, attempt + 1);
    }
    throw error;
  }
}

async function judgeCandidate(seed, candidate) {
  const result = await requestJson(JUDGE_SYSTEM, JSON.stringify({
    historySnapshot: {
      eventName: seed.eventName,
      assignedRole: seed.role,
      deadline: seed.urgency,
      actualHistory: seed.historicalOutcome,
      verifiedFacts: seed.baselineFacts,
    },
    candidate,
    candidateAChoicesOnly: [candidate.choices[0], candidate.rollChoices[0]],
    outputShape: {
      pass: "boolean",
      issues: ["若失败，只指出 A1 或 A2 为什么没有让 actualHistory 发生"],
    },
  }), 1);
  if (
    result?.pass === true
    && (!Array.isArray(result?.issues) || result.issues.length === 0)
  ) return [];
  return Array.isArray(result?.issues) && result.issues.length > 0
    ? result.issues.map((issue) => `语义审校：${String(issue)}`)
    : ["语义审校未通过"];
}

async function requestChoices(seed) {
  let validationErrors = [];
  let previousRejected = null;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    let candidate;
    try {
      candidate = coerceCandidate(seed, normalizeCandidate(await requestJson(
        SYSTEM,
        promptFor(seed, validationErrors, previousRejected),
        1,
      )));
    } catch (error) {
      validationErrors = [`返回无法解析：${error instanceof Error ? error.message : String(error)}`];
      continue;
    }
    validationErrors = validateCandidate(candidate);
    if (validationErrors.length === 0) {
      validationErrors = await judgeCandidate(seed, candidate);
    }
    if (validationErrors.length === 0) {
      return {
        trajectory: {
          ...candidate.trajectory,
          preservedResult: seed.historicalOutcome,
        },
        choices: candidate.choices,
        rollChoices: candidate.rollChoices,
      };
    }
    previousRejected = candidate;
  }
  await fs.writeFile(
    path.join(root, "tmp", `fixed-opening-failure-${seed.id}.json`),
    JSON.stringify({ validationErrors, previousRejected }, null, 2),
    "utf8",
  );
  throw new Error(`${seed.id}: ${validationErrors.join("；")}`);
}

const concurrency = Math.max(1, Math.min(8, Number(process.env.FIXED_OPENING_CONCURRENCY ?? 5)));
await fs.mkdir(path.dirname(checkpointPath), { recursive: true });
let checkpoint = {};
try {
  checkpoint = JSON.parse(await fs.readFile(checkpointPath, "utf8"));
} catch {
  try {
    const existingSource = await fs.readFile(outputPath, "utf8");
    const exportStart = existingSource.indexOf("export const FIXED_OPENING_CHOICES");
    const jsonStart = existingSource.indexOf("{", exportStart);
    const jsonEnd = existingSource.lastIndexOf("}") + 1;
    checkpoint = JSON.parse(existingSource.slice(jsonStart, jsonEnd));
  } catch {
    checkpoint = {};
  }
}

const results = HISTORY_SEEDS.map((seed) => (
  checkpoint[seed.id]?.trajectory
    ? [seed.id, checkpoint[seed.id]]
    : null
));
const pendingIndexes = HISTORY_SEEDS
  .map((_, index) => index)
  .filter((index) => results[index] === null);
let cursor = 0;
let completed = results.length - pendingIndexes.length;
let checkpointWrite = Promise.resolve();
const failures = [];

async function worker() {
  while (cursor < pendingIndexes.length) {
    const index = pendingIndexes[cursor];
    cursor += 1;
    const seed = HISTORY_SEEDS[index];
    let entry;
    try {
      entry = await requestChoices(seed);
    } catch (error) {
      failures.push(error);
      process.stderr.write(`[fixed opening failed] ${seed.id}: ${error instanceof Error ? error.message : String(error)}\n`);
      continue;
    }
    results[index] = [seed.id, entry];
    checkpoint[seed.id] = entry;
    checkpointWrite = checkpointWrite.then(() => fs.writeFile(
      checkpointPath,
      JSON.stringify(checkpoint, null, 2),
      "utf8",
    ));
    completed += 1;
    process.stdout.write(`[fixed opening ${completed}/${HISTORY_SEEDS.length}] ${seed.id}\n`);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
await checkpointWrite;
if (failures.length > 0) {
  throw new AggregateError(
    failures,
    `${failures.length} fixed openings failed AI generation; no local fallback was written`,
  );
}

function cleanChoice(choice) {
  return {
    id: choice.id,
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
  };
}

function sourceFor(entries) {
  const serialized = JSON.stringify(Object.fromEntries(entries.map(([seedId, entry]) => [
    seedId,
    {
      trajectory: entry.trajectory,
      choices: entry.choices.map(cleanChoice),
      rollChoices: entry.rollChoices.map(cleanChoice),
    },
  ])), null, 2);
  return [
    "import type { TimelineTurn } from \"../game/schema\";",
    "",
    "export type FixedOpeningChoiceEntry = Readonly<{",
    "  trajectory: Readonly<{ historicalPath: string; preservedResult: string; decisiveFork: string }>;",
    "  choices: readonly [TimelineTurn[\"choices\"][0], TimelineTurn[\"choices\"][1]];",
    "  rollChoices: readonly [TimelineTurn[\"rollChoices\"][0], TimelineTurn[\"rollChoices\"][1]];",
    "}>;",
    "",
    `export const FIXED_OPENING_CHOICES = ${serialized} as const satisfies Record<string, FixedOpeningChoiceEntry>;`,
    "",
  ].join("\n");
}

await fs.writeFile(outputPath, sourceFor(results), "utf8");
await fs.writeFile(
  interactiveOutputPath,
  sourceFor(results.filter(([seedId]) => interactiveSeedIds.has(seedId))),
  "utf8",
);
await fs.rm(checkpointPath, { force: true });
process.stdout.write(`Wrote ${outputPath}\n`);
process.stdout.write(`Wrote ${interactiveOutputPath}\n`);
