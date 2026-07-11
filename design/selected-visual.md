# Selected Visual Target

selected_target: design/visual-options/redaction-room.png
viewport: 390 x 844
source_pixels: 853 x 1844

## Why This Wins

- The product name, era rail, and active historical question can be understood within three seconds.
- One complete card and two neighboring peeks make the random deck and replayability visible without explanation.
- Red proofreader marks and the dark newsroom create a recognizable identity without becoming antique parchment fantasy.
- The visual hierarchy survives implementation with one carousel, one toolbar, and one custom-prompt command.

## Fidelity Locks

- Brand zone: 104px high, with the title left aligned.
- Era rail: 66px high, compact and horizontally stable.
- Picker toolbar: 52px high, heading left and one shuffle icon on the right.
- Card viewport: 400px high.
- Active card: 242px wide at the reference viewport, with 12px gaps and neighboring peeks.
- Primary card action: 50px high.
- Custom-prompt action: 66px high and visible without scrolling.
- Horizontal page padding: 18px.
- Corner radius: 0-8px; no pill-shaped cards.
- Palette roles: coal-black room, newsprint cards, editorial-red actions and annotations, oxidized-teal facts, signal-yellow exception markers.

## Implementation Corrections

- Keep only the shuffle control in the picker toolbar; omit the duplicated shuffle control shown below the active card.
- Render all UI text as live HTML so generated-image lettering does not constrain copy accuracy.
- Use generated scene art as card media while preserving the target's crop and contrast.
