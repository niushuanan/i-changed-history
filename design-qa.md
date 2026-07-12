# Design QA

## Visual Grounding

- Selected ImageGen direction: `design/visual-options/redaction-room.png`.
- Implemented picker capture: `design/captures/picker-390x844.png`.
- Implemented live event capture: `design/captures/event-390x844.png`.
- Implemented result capture: `design/captures/result-390x844.png`.
- The selected reference and picker implementation were inspected together at the same mobile viewport before the event and result screens were completed.

## Browser Checks

- Viewport: 390 x 844.
- Picker: one primary historical card, neighboring-card hint, five-era rail, shuffle, and custom start are visible without horizontal overflow.
- Event: stable scene crop, chapter rail, deviation meter, four world metrics, three AI choices, and free intervention render without overlap.
- Result: 390 px capture node width equals its scroll width; document client width equals document scroll width, so there is no horizontal overflow.
- Export: verified real PNG at 780 x 2686 with no clipped timeline, causal chain, balance, or footer content.
- Typography, borders, color accents, spacing, and image crops remain consistent with the selected coal/newsprint archive direction.

## Functional Checks

- Completed a real five-turn DeepSeek `deepseek-v4-flash` run from a curated card.
- Used a free intervention in chapter two and verified immediate local echo plus background pre-generation.
- Verified deterministic deviation from 0 to 64 and an AI plausibility score of 78.
- Verified native share/download fallback and actual PNG creation.
- Verified mute, retry, restart, custom start, custom intervention, and alternate-present actions.

## Final Result

Final result: passed.
