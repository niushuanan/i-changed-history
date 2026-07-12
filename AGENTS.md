# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Product Decisions

- The product title is exactly `I！我改变了历史`; never remove the leading `I`.
- The player is a modern Chinese traveler, not an abstract observer. The first screen builds a traveler profile before any historical choice.
- Opening cards must be famous, concrete AD historical turning points with an exact date, place, assigned role, immediate decision, deadline, and actual outcome.
- The deck must include substantial Chinese history before 1840 and frame world history in language accessible to Chinese players.
- All 50 history moments are available to every profile. Five cards may be recommended for a fast start, but the profile never locks or hides a moment.
- The profile controls cross-generation advantages and their costs: exactly one action per node visibly uses the traveler's modern strengths. During play the user can only choose the three AI-generated actions; there is no free-text opening or intervention.
- Preserve the current coal, newsprint, vermilion, teal, and yellow visual system unless the user explicitly requests a new visual direction.
- A complete run has exactly 12 timeline nodes: 11 player decisions followed by the alternate 2026 summary. Early intervals are one day, one month, one year, three years, ten years, thirty years, and one hundred years before compressing adaptively toward 2026.
- The player is not immortal. Later nodes switch to new era-appropriate identities, explain the consciousness relay, and move across domains or regions through a visible butterfly-effect chain. After node 3, the opening event cannot remain the main topic.
- Surprise comes from changing the social carrier, conflict, institution, or affected population, not from forced travel. A timeline may remain in China; prefer real people, institutions, cities, and lived experiences familiar to Chinese players, while changing at least two narrative dimensions from the recent three nodes.
- Active gameplay always provides an exit control that clears the run and returns to traveler profiling.
- Event screens target the iPhone 13 viewport at 390 x 844 and must show the scene, mission, metrics, and all three choices without page scrolling.
- Scene art must follow the simulated year as well as the chapter. Never show modern or space technology in a pre-industrial node merely because it is a late chapter.
- A refresh or development-server reconnect during generation must resume the saved AI request automatically; structural model drift must fall back locally and must not strand the player on an interruption screen.
