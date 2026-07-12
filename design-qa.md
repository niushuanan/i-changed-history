# Design QA

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
