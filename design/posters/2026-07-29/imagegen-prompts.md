# A3 海报 ImageGen 提示词

三套主视觉均按赛事 A3 模板约束设计：

- 画幅：A3 竖版 `1:1.414`，最终输出 `3508 × 4961 px`
- 顶部 `0–11%`、底部 `86–100%`、左右各 `0–6.5%` 仅保留可延展背景
- 关键内容完整落在垂直 `11–86%`、水平 `6.5–93.5%`
- 主体视觉中心位于垂直 `35–55%`
- 满幅出血，不生成边框、Logo 或底部信息条

## 01 命运翻牌

```text
Use case: ads-marketing
Asset type: A3 portrait campaign-poster background for the mobile historical roguelike game “哎！我改变了历史？”
Primary request: create a dramatic “destiny card flips open and history rushes out” key visual. A single monumental face-down destiny card made of coal-black worn leather and aged brass is caught mid-flip inside a dark archival chamber. Its opening seam releases vermilion causal threads and layered glimpses of three eras: an ancient Chinese palace with bronze ritual objects, a Renaissance printing press with flying paper, and an Apollo-era moon horizon. A small modern Chinese traveler silhouette stands before the card, about to be pulled through time. Communicate time travel, randomness, one draw from one hundred possible historical moments, and a whole life altered by the chosen card.
Style/medium: premium cinematic game key art, tactile photoreal mixed media, archival paper, engraved metal, subtle Chinese woodcut texture; not a UI mockup.
Composition/framing: strict A3 portrait ratio 1:1.414, full bleed. Top 0–11%, bottom 86–100%, and left/right 0–6.5% must remain clean, naturally extendable dark background with no focal object or dense detail. Every important element stays inside vertical 11–86% and horizontal 6.5–93.5%. Reserve a relatively calm dark area across vertical 12–27% for later typography. Main card/portal visual center near vertical 48%. Natural crop-safe edge continuation, no decorative border.
Lighting/mood: intense warm beam from the opening card, dusty volumetric air, ominous but inviting, imminent choice.
Color palette: coal black, warm newsprint ivory, vermilion red, oxidized teal, signal yellow, aged brass.
Materials/textures: worn leather, etched brass, torn archive paper, dust, ink, subtle film grain.
Constraints: no text, no letters, no Chinese characters, no numbers, no logo, no watermark, no app interface, no readable labels, no modern phone frame, no official event border.
```

## 02 肉鸽三选一

```text
Use case: ads-marketing
Asset type: A3 portrait campaign-poster background for the mobile historical roguelike game “哎！我改变了历史？”
Primary request: on a tactile coal-black archive table, three thick collector cards fan inward: aged-brass yellow, vermilion red, and oxidized-teal. The red center card lifts upward toward the viewer while the other two recede. Vermilion causal threads connect the cards to fragments of ancient China, a Renaissance printing press, and an Apollo moon horizon. Communicate a roguelike three-choice decision, limited rerolls, physical card play, and real consequences.
Style/medium: premium physical game-poster photography mixed with archival collage, tactile collector-card thickness, worn leather, engraved metal, dust and ink; not a UI screenshot.
Composition/framing: strict A3 portrait ratio 1:1.414, full bleed. Keep top 0–11%, bottom 86–100%, and side 0–6.5% as simple crop-safe background. Reserve vertical 12–27% as calm dark title space. Keep all three cards fully inside the safe rectangle and place their shared visual center around vertical 48%. No decorative border.
Lighting/mood: focused tabletop spotlight, dense shadows, dramatic card lift, confident and game-like.
Color palette: coal black, aged brass yellow, vermilion red, oxidized teal, warm newsprint ivory.
Materials/textures: thick card stock, leather, metal edge wear, scratches, ink, archive dust.
Constraints: no text, letters, numbers, logos, UI, watermark, readable labels, phone frame, or official event border.
```

## 03 蝴蝶效应

```text
Use case: ads-marketing
Asset type: A3 portrait campaign-poster background for the mobile historical roguelike game “哎！我改变了历史？”
Primary request: create a large butterfly made from torn historical archives and causal threads. Its left wings contain an ancient Chinese map and a Renaissance printed book; its right wings contain an Apollo moon landing and an alternate ordinary city in 2026. The butterfly body is a slim black destiny card, and four glowing vermilion nodes run through it like one human lifetime. Show that one selected card changes a person's entire life and propagates into a different 2026.
Style/medium: bold editorial poster, Chinese woodcut and newsprint collage fused with cinematic light, graphic and iconic rather than photoreal UI.
Composition/framing: strict A3 portrait ratio 1:1.414, full bleed. Top 0–11%, bottom 86–100%, and side 0–6.5% are simple crop-safe background. Reserve vertical 12–27% for later title typography. Keep the complete butterfly and all four causal nodes inside the safe rectangle; visual center near vertical 49%. Natural edge continuation, no symmetrical outer border.
Lighting/mood: mysterious, intelligent, expansive, a small decision producing an enormous world-scale consequence.
Color palette: coal black, warm newsprint ivory, vermilion red, oxidized teal, aged brass.
Materials/textures: torn paper, woodcut ink, printed maps, archival photographs, glowing thread.
Constraints: no text, letters, numbers, logo, watermark, UI, readable labels, modern phone frame, or official event border.
```

## 本轮执行说明

本轮优先调用内置 ImageGen，带本地参考图与纯新图两个接口共重试五次，均在请求阶段返回网络错误，未生成可用位图；没有切换到需要 `OPENAI_API_KEY` 的 CLI 路径。当前三张交付图由项目自有艺术字、原创卡框、历史场景图和档案舞台素材本地合成，排版与尺寸可直接复现。
