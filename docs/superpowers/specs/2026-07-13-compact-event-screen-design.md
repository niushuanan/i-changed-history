# Compact Event Screen Design

## Goal

Make the playable event screen immediately understandable and visibly tighter without removing the evidence that the player's previous decision changed history.

## Product Decisions

- Replace internal alternate-history jargon with plain Chinese. The header reads `历史改变 {score}% · {stage}`; the five stages are `变化刚刚发生`, `影响正在扩大`, `历史明显不同`, `世界正在重塑`, and `已是全新世界`.
- Historical locations must use vocabulary appropriate to their year and culture. Pre-1900 scenes reject modern generic room names such as `议事厅`, `会议室`, `办公室`, `指挥中心`, and `新闻中心`; DeepSeek repairs the location instead of the client rewriting visible prose.
- Remove the square `因果回执` label and the three repeated labels `你的决定 / 已经改变 / 重大节点`.
- Keep causal evidence, but move it below the decisions as one compact `历史已经改变` strip: previous decision, current consequence, causal bridge, and divergence proof.
- Each A/B/C row shows only its executable action label and arrow. Actor/deadline metadata remains in the model contract for quality but is not repeated in the interface.
- Direct result rewriting has no global usage limit. The command never disables or displays a remaining count; each playable node still accepts only one final decision because submission advances the timeline.
- Preserve the 390 x 844 no-scroll contract, the existing visual palette, three AI choices, direct rewrite modal, source provenance, and exit/music controls.

## Layout

The event body is ordered as scene copy, decision zone, then causal evidence. The scene image and event copy remain compact. The decision zone owns a fixed-height title, three 46-52px action rows, and a 42px direct-rewrite row. The bottom causal strip uses a short highlighted result followed by a two-line explanation, with no boxed sub-panels.

## Validation

- Component tests cover plain-language deviation copy, hidden action metadata, bottom evidence order, and unlimited rewrite availability.
- Reducer and storage tests prove more than three custom rewrites remain valid.
- Prompt/schema tests reject anachronistic pre-1900 room names and request AI field repair.
- Browser QA checks 390 x 844 and a desktop-scaled shell, including no clipping, no scroll, modal submission, and console errors.
