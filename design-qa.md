# Design QA

## Plain Decision Result QA (2026-07-13)

- Source visual truth: `/var/folders/dt/4fn7m4f50ls_8jkk9vzhsxh80000gn/T/codex-clipboard-57f880b5-7010-4ed4-a05c-3a8f251bd611.png`.
- Implementation screenshot: `.playwright-cli/page-2026-07-13T14-19-08-510Z.png`.
- Viewport/state: 390 x 844, AI action selected on the Dong Zhuo continuation, before moving to the next node.
- P1 source finding: system jargon (`因果回响`, `世界已回应`, `偏离 +3`) displaced the actual result and made the page feel theatrical rather than causal. Fixed by using the concrete result as the only H1.
- P1 source finding: several 8-10px gray labels sat directly over detailed artwork. Fixed with a 92% coal result surface, 11-15px semantic labels, off-white choice copy, teal beneficiary, and vermilion cost/payer.
- P2 source finding: the generic heading and repeated labels created excess vertical hierarchy. Fixed by reducing the page to status, result, selected action, cost, affected people, and one next-step command.
- Typography: result H1 is 28px Song-style type with 1.25 line height; all supporting copy is at least 11px and uses higher optical weight.
- Spacing/layout: the 364px result surface ends at y=832; the 48px primary command ends at y=818; body client and scroll heights both equal 844.
- Colors/assets: the historical image remains visible above the result, while all text uses the existing coal, off-white, vermilion, teal, and yellow tokens. No placeholder or CSS illustration was introduced.
- Copy: no `因果回响`, `世界已回应`, `偏离`, `获益`, `付出`, or `继续推演` remains in the rendered result screen.
- Interactions: clicked a real AI choice and verified the updated result, exit, and next-node button. Focused comparison was unnecessary because the annotated source and implementation expose the same full-screen state at readable scale.

final result: passed

## Compact Event Screen QA (2026-07-13)

**Visual Truth**

- Source screenshot: `/var/folders/dt/4fn7m4f50ls_8jkk9vzhsxh80000gn/T/codex-clipboard-24c95768-a1c2-403a-a496-c7daf1f05bbc.png`.
- Final implementation screenshot: `output/playwright/compact-event-continuation-390x844.png`.
- Combined visual comparison: `output/playwright/compact-event-comparison.png`.
- Viewport and state: 390 x 844 active continuation event with one prior choice, three AI actions, direct rewrite, and causal proof.

**Comparison History**

- Iteration 1 found a P2 vertical-rhythm issue after the action rows were reduced: the opening proof inherited 249px and left a large empty lower area. The scene track increased from 164px to 248px.
- Iteration 2 still showed a P2 break between the rewrite command and proof because centering merely split the unused space. The final comfortable scene track is 320px and the dense continuation track is 292px, leaving 93px for opening evidence and 151px for denser continuation evidence.
- Post-fix evidence: body and event `clientHeight` and `scrollHeight` are all 844px; continuation proof `clientHeight === scrollHeight === 150px`; the three dense action rows are 53px each and the opening rows are 57px each.

**Findings**

- No remaining P0, P1, or P2 issue. The source's square receipt, repeated row labels, tall option gaps, action metadata, exhausted rewrite state, modern location wording, and specialist deviation wording are absent in the implementation.
- Fonts and typography: Song-style display type, sans-serif utility labels, zero negative tracking, complete wrapping, and 9px minimum progress status preserve the existing newspaper hierarchy without clipping.
- Spacing and layout rhythm: scene, event copy, compact decisions, rewrite command, and bottom proof form one continuous 844px surface with an 8px safe edge and no page scroll.
- Colors and tokens: coal, vermilion, teal, yellow, and off-white remain consistent; the bottom proof uses teal as evidence and yellow only for player authority.
- Image quality: the selected historical artwork remains a local period-accurate asset, fills the 390px scene width, and is not replaced by CSS art or a placeholder.
- Copy and content: `历史改变 3% · 变化刚刚发生`, `长安，王允旧宅内室`, and `历史已经改变` are understandable and era-appropriate; hidden action metadata remains present in the AI schema but is not repeated visually.
- Focused-region comparison was not required after the full combined image: the source's red annotations and every corresponding implementation control remain legible at original comparison resolution.

**Interactions And Console**

- Clicked a real 190-year Dong Zhuo opening, all three generated action rows, the unlimited direct-rewrite sheet, an AI choice, the world response, and continuation into node 2.
- DeepSeek returned both playable scenes with `DeepSeek 实时生成`; the continuation visibly preserved the selected warning and its changed-world consequence.
- Direct rewrite sheet opens with `本局不限次数`; empty submission remains disabled.
- Browser console: 0 errors and 0 warnings.

**Follow-up Polish**

- P3 only: future art curation can replace the current shared ink portrait with a more scene-specific interior image; it does not affect the layout or interaction gate.

final result: passed

## Visual Grounding

- Selected ImageGen direction: `design/visual-options/redaction-room.png`.
- Implemented picker capture: `design/captures/picker-390x844.png`.
- Implemented live event capture: `design/captures/event-390x844.png`.
- Implemented result capture: `design/captures/result-390x844.png`.
- The selected reference and picker implementation were inspected together at the same mobile viewport before the event and result screens were completed.

## Browser Checks

- Viewport: 390 x 844.
- Picker: one primary historical card, neighboring-card hint, five-era rail, and shuffle are visible without horizontal overflow.
- Event: stable scene crop, 12-node rail, deviation meter, four world metrics, and all three AI choices render together without overlap or vertical page scrolling.
- Result: 390 px capture node width equals its scroll width; document client width equals document scroll width, so there is no horizontal overflow.
- Export: verified real PNG at 780 x 2686 with no clipped timeline, causal chain, balance, or footer content.
- Typography, borders, color accents, spacing, and image crops remain consistent with the selected coal/newsprint archive direction.

## Functional Checks

- Completed a real 11-decision DeepSeek `deepseek-v4-flash` run from the 1962 Cuban Missile Crisis through the alternate 2026 result.
- Verified the final node contains exactly 11 history records and uses the generated 2026 city scene.
- Verified deterministic deviation reached 94 without the former post-chapter-five reset.
- Verified era navigation changes the active starting card and starts a different historical simulation.
- Verified a reload during node generation automatically resumes to a three-choice event without showing the interruption screen.
- Verified malformed model structure repairs, regenerates, or falls back locally while transport/authentication errors remain retryable.
- Verified native share/download fallback and actual PNG creation.
- Verified mute, retry, restart, era switching, three-choice decisions, and alternate-present actions.

## Final Result

Final result: passed.

# Clear Change Gameplay QA (2026-07-15)

- Full automated verification: 20 test files and 96 tests passed; TypeScript, production build, and `git diff --check` passed.
- At 390 x 844, the exit button occupies the first cell of the compact timeline header and does not overlay the scene or copy.
- The event page no longer renders the four world metrics, long relay explanation, repeated anchor, or expanded choice intentions.
- A real DeepSeek opening request returned HTTP 200 and displayed `DeepSeek 实时生成`; the following prefetched node also returned HTTP 200.
- The profile ability `系统拆解` revealed the tailored action's beneficiary and hidden cost before selection without another model request.
- The second node visibly repeated the previous action, its direct result, and its new cost; its identity changed from `火船营军需官` to `被征用的船匠领班`.
- Expanding the archive produced 50 cards in the existing horizontal carousel and zero dialogs. Browser traversal loaded 50 of 50 images with zero broken assets.
- Historical assets use 43 exact Wikipedia event pages and 7 project-local period-art fallbacks; all fifty are cached as local WebP files with credits.
- Real click verification covered profile creation, archive expansion, card selection, dynamic loading, profile forecast, choice submission, butterfly echo, next-node change proof, and exit.
- Captures: `design/captures/archive-recommended-390x844.png`, `loading-dynamic-390x844.png`, `event-opening-390x844.png`, `profile-forecast-390x844.png`, and `event-change-proof-390x844.png`.

# Living History Filmstrip QA (2026-07-13)

- At 390 x 844 the picker has one chronological set of 50 cards, no recommended subset, shuffle, expand action, modal, or second archive UI.
- Clicking year 626 moved the card strip to `scrollLeft=2408` and the timeline to `scrollLeft=294`; a subsequent 688px horizontal wheel gesture advanced both controls to year 755.
- Full traversal ended at year 1989 with 50/50 card images loaded and zero broken images.
- The picker and event document dimensions are exactly 390 x 844 with no body overflow.
- The event page's third action ends at y=735, leaving safe space inside the 844px frame. The exit button occupies only x=9..39 and y=7..37.
- The opening scene inherited `/assets/history/xuanwu-gate-626.webp` from the selected card instead of a generic ancient image.
- Two real DeepSeek requests returned HTTP 200. The second node changed the role from palace-gate captain to Yuchi Jingde's deputy and showed the previous choice, direct result, and new cost.
- Profile foresight, choice submission, cinematic world verdict, next-node continuation, and exit were clicked in the real browser; browser console reported zero errors.
- Captures: `design/captures/filmstrip-start-390x844.png`, `filmstrip-626-390x844.png`, `event-cinematic-390x844.png`, `world-verdict-390x844.png`, and `event-causal-receipt-390x844.png`.
- Final result: passed.
# Butterfly Relay QA (2026-07-14)

- 390 × 844: full history archive renders 50 selectable rows with no horizontal overflow.
- Real DeepSeek opening generated identity relay, profile advantage, and exactly one profile-powered action.
- All three opening choices fit above y=650 in an 844px viewport.
- After increasing the turn response budget from 1100 to 1600 tokens and tightening copy limits, a real chapter-six continuation completed in one API request.
- Real path observed distinct roles and topics: engineering centurion → records clerk → courier translator → local accountant → school teacher → mint deputy supervisor.
- Active run exit control is visible at 14px,14px and covered by integration tests.

# Familiar Surprise Loading QA (2026-07-14)

- Added three generated 9:16 WebP backgrounds for opening reveal, social relay, and 2026 convergence.
- Relay loading screen checked at 390 × 844: client and scroll height are both 844px; body scroll width is 390px.
- Pale-gray paper overlay uses 56% opacity; coal copy, vermilion progress, and teal completion states remain legible.
- Waiting state exposes current node, causal task, three processing stages, auto-advance note, global exit, and sound control.
- Prompt no longer forces cross-border or cross-continent jumps. It permits a timeline to remain in China while requiring two of four narrative dimensions to change.
- Loading motion adds slow image drift, two developing causal threads, four pulse nodes, an exposure pass, rotating aperture, and staged status transitions. Reduced-motion mode disables every nonessential animation.
- DeepSeek turn and ending output ceilings are both 8192 tokens; prompt length limits continue to keep the visible copy concise.
- Browser animation audit found all six named animations active; the motion layer has four pulse nodes and remains exactly 390 × 844 with no overflow.
