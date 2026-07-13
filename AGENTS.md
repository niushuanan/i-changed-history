# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Product Decisions

- The product title is exactly `I！我改变了历史`; never remove the leading `I`.
- The player is a modern Chinese traveler, not an abstract observer. The first screen builds a traveler profile before any historical choice.
- Opening cards must be famous, concrete AD historical turning points with an exact date, place, assigned role, immediate decision, deadline, and actual outcome.
- The deck must include substantial Chinese history before 1840 and frame world history in language accessible to Chinese players.
- The fifty-card deck is fixed at exactly 30 pre-1840 Chinese moments and 20 world moments. World cards must use people or events broadly recognizable to ordinary Chinese players; do not spend slots on minor-country or specialist Western history.
- Public-memory fiction may inspire a counterfactual hook, but the card itself must label and anchor real history. Preserve dramatic choices without turning sexual violence into a playable entertainment mechanic.
- All 50 history moments are always visible in one chronological horizontal filmstrip. Never reintroduce a recommended subset, shuffle, expand-all action, archive modal, or second browsing layout.
- The profile controls the protagonist's modern advantage and its cost across one lifetime: exactly one generated action per node visibly uses the traveler's modern strengths. Each of the four personality dilemmas has exactly four distinct choices so the result feels chosen rather than binary-tested.
- During play the user may spend one of exactly three per-run direct rewrites to declare a completed historical result. The declaration is player-authored canon: the client constructs the immediate canonical receipt and trusts no model-authored outcome text; DeepSeek classifies impact and performs the creative world simulation in the following node.
- Preserve the current coal, newsprint, vermilion, teal, and yellow visual system unless the user explicitly requests a new visual direction.
- A complete run has exactly 12 playable decisions within one protagonist's biological lifetime. The alternate 2026 report is a separate posthumous epilogue and never consumes one of the twelve nodes.
- The protagonist keeps one fixed name and body across all twelve nodes, ages monotonically, may change role, faction, city, and social reach, and dies after the twelfth decision. Never use consciousness relay, reincarnation, descendants, or a replacement identity as the playable character.
- Early nodes provide tight feedback on the scale of the same day, three days, and six weeks. Later nodes spread across the same person's career and late life; modern starts compress the lifespan so the death still occurs before the 2026 report.
- After node 3, the opening event cannot remain the current plot, title, objective, or role. The same protagonist must enter a different consequential conflict caused by earlier choices rather than randomly changing topic.
- Surprise comes from changing the social carrier, conflict, institution, or affected population, not from forced travel. A timeline may remain in China; prefer real people, institutions, cities, and lived experiences familiar to Chinese players, while changing at least two narrative dimensions from the recent three nodes.
- Active gameplay always provides an exit control that clears the run and returns to traveler profiling.
- Event screens target the iPhone 13 viewport at 390 x 844 and must show only the scene, complete event copy, causal proof, all three generated choices, and the compact fourth-path entry without page scrolling. Do not restore the four-metric dashboard or repeated mission explanations.
- Scene art must follow the simulated year as well as the chapter. Never show modern or space technology in a pre-industrial node merely because it is a late chapter.
- A refresh or development-server reconnect during generation must resume the saved AI request automatically; structural model drift must fall back locally and must not strand the player on an interruption screen.
- DeepSeek turn and ending requests use an 8192-token output ceiling so transport truncation cannot strand normal JSON; concise output is controlled by the prompt and schema, not a small token cap.
- Loading-room motion includes archival drift, causal-thread tracing, pulse nodes, exposure passes, and status cycling, with a `prefers-reduced-motion` static fallback.
- The event header must visibly distinguish `DeepSeek 实时生成` from `本地保底续写`; model provenance is part of the player's trust contract.
- The traveler's profile grants one named lifetime ability. Once per node it can reveal the beneficiary and hidden cost of the single profile-tailored action before the player chooses.
- All fifty moments live in the same chronological horizontal carousel. Do not reintroduce recommendations, expansion states, a modal, or a separate archive layout.
- Every history seed owns a local `/assets/history/<seed-id>.webp` path with an event-accurate source or a local period-art fallback; broken remote images must never be part of runtime rendering.
- The picker timeline and card filmstrip are one synchronized control: scrolling cards centers the matching year, and selecting a year scrolls the matching card into view.
- History picker cards must leave a clearly visible preview of the next card on the right at first glance. Keep the parenthetical swipe hint `（滑动可切换不同的历史瞬间）` visible beside the year/count readout.
- Active play is a continuous cinematic surface, not a dashboard. Use one scene, one compact causal receipt, and three separated action rows; avoid nested cards, metrics, badges, and explanatory panels.
- The AI is framed as a grounded world simulator. It generates the three ordinary actions against historical constraints, but it never vetoes a direct player rewrite. For direct rewrites, the client owns the immediate receipt and the AI owns only the next-node world extrapolation. The visible proof is source provenance, a causal receipt, and the same protagonist's age and evolving role, not long model prose.
- The opening profile is a four-dilemma, one-screen-at-a-time time-personality calibration using the familiar I/E, S/N, T/F, J/P dimensions. Never restore name, occupation, skill checklist, or risk-style forms.
- The four-letter time personality is a gameplay contract, not decoration: exactly one choice per node follows it, its causal-preview lens changes what consequence the player can reveal, and direct rewrites use it only to choose which hidden consequence is emphasized.
- Music begins on the first eligible user gesture in the profile calibration and continues through the picker, generation, events, and ending. Browser autoplay failure must never block play.
- A direct rewrite spends its opportunity only after a valid canonical result is committed. Network failure, model repair, refresh recovery, and retry never consume an opportunity; player-authored results enter the same causal memory and 2026 ending contract as generated choices.
- Every one of the 12 playable nodes must be a consequential alternate-history turning point. Do not use ordinary reporting, routine administration, or generic livelihood scenes merely to create variety.
- The twelfth node is the protagonist's final playable decision, not a death cutscene. After that decision becomes canon, the ending must show the protagonist's death, four posthumous historical eras, three concrete 2026 life details, and a novel-like closing passage about a world the protagonist never saw.
- Every completed action enters a deterministic client-owned world canon before the next model call. Player-authored rewrites are irreversible facts, retain their exact wording, and remain explicit active mandates for the next three nodes; multiple mandates such as accession plus industrialization must coexist rather than collapse into one label.
- The client-side pivotal brief chooses the next conflict from active causal mandates and advances its scale from scene to regime, nation, civilization, and world. It may rotate among power, technology, institutions, war, trade, knowledge, and livelihood, but must never jump topics only to avoid repetition.
- DeepSeek is the scene director, not the owner of continuity. It must ground the pivotal brief in concrete people, institutions, places, objects, deadlines, and a visible counterfactual difference; the client validates those causal receipts and falls back locally if the result is generic or drops required canon.
- The event receipt must show `你的决定 -> 已经改变 -> 重大节点`, followed by a concise causal bridge and a real-history divergence proof. This is the primary way the player sees that their action mattered.
