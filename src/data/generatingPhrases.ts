/** 历史现场感 */
const SCENE_PHRASES = [
  "翻阅泛黄的档案",
  "追踪历史的蛛丝马迹",
  "重新编织因果线",
  "在故纸堆里寻找真相",
  "擦拭旧时代的灰尘",
  "校准时间线的刻度",
] as const;

/** 调皮/打破第四面墙 */
const META_PHRASES = [
  "历史学家还在翻书，别急",
  "正在给时间线打结",
  "平行宇宙正在加载中…",
  "蝴蝶效应计算中，请勿扇动翅膀",
  "时间机器正在预热",
  "刚才的历史还没写好，再等等",
] as const;

/** 诗意/哲思 */
const POETIC_PHRASES = [
  "历史不会等待",
  "每一个决定都在重塑世界线",
  "过去从未真正过去",
  "历史没有草稿",
  "时间是一条咬住自己尾巴的蛇",
] as const;

/** 底部氛围短语（替换 "新的历史现场即将出现"） */
export const ATMOSPHERE_PHRASES: readonly string[] = [
  ...SCENE_PHRASES,
  ...META_PHRASES,
  ...POETIC_PHRASES,
];

/** 草稿区校验短语（替换 "场景仍在写成，完整校验后才能决定"） */
export const POLISHING_PHRASES: readonly string[] = [
  "正在打磨最后的细节",
  "推敲每一处遣词造句",
  "校验历史事实的准确性",
  "润色即将呈现的现场",
  "调整叙事的时间线",
  "核对所有历史细节",
  "把碎片拼成完整画面",
] as const;

/** 进度步骤 1 短语池 */
export const STEP1_PHRASES: readonly string[] = [
  "确认真实人物与地点",
  "锁定历史坐标与人物",
  "查明何时何地何人何事",
  "确认时代与舞台",
] as const;

/** 进度步骤 2 短语池 */
export const STEP2_PHRASES: readonly string[] = [
  "把既有决定写进现场",
  "将前序选择织入当下",
  "让选择落地为具体场景",
  "把前因铺成现场",
] as const;

/** 进度步骤 3 短语池 */
export const STEP3_PHRASES: readonly string[] = [
  "写出下一次关键抉择",
  "推演下一个岔路口",
  "标记下一个抉择点",
  "为下一步埋下伏笔",
] as const;
