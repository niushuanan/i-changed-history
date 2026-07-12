# Generative Worlds Research Notes

## Projects reviewed

- [Stanford Generative Agents](https://github.com/joonspk-research/generative_agents): believable behavior emerges from a memory stream, reflection, and planning rather than from showing raw model prose.
- [a16z AI Town](https://github.com/a16z-infra/ai-town): persistent shared world state and transactional simulation are the foundation; the chat model is replaceable infrastructure.
- [Google DeepMind Concordia](https://github.com/google-deepmind/concordia): a Game Master translates natural-language intent into grounded outcomes and checks plausibility.
- [Project Sid](https://github.com/altera-al/project-sid): 10-1000+ agents form specialized roles, change collective rules, and transmit culture. Its product lesson is visible institutional emergence, not longer dialogue.
- [Stanford GenAgents](https://github.com/joonspk-research/genagents): stable personas are useful when they predict different behavior under the same stimulus.

## Funding claim checked

Altera is the team behind Project Sid and later became Fundamental Research Labs (FRL). It first raised a $2M pre-seed and $9M seed, then announced a $33M Series A led by Prosus in August 2025. The user's recollection of a tens-of-millions round was therefore correct. The product direction is relevant because FRL treats agents as persistent digital humans with memory and social behavior rather than chat windows.

- Funding source: [TechCrunch, FRL raises $33M](https://techcrunch.com/2025/08/01/fundamental-research-labs-nabs-30-million-from-prosus-to-build-ai-agents-for-multiple-verticals/)
- Earlier round: [TechCrunch, Altera raises $9M](https://techcrunch.com/2024/05/08/bye-bye-bots-alteras-game-playing-ai-agents-get-backing-from-eric-schmidt/)

## Product decisions for this game

1. Hide simulation machinery by default. One screen shows the scene, proof of change, and three actions.
2. Make memory visible as a causal receipt: `your choice -> changed fact -> new pressure`.
3. Give the traveler profile a verb. Its signature ability previews the beneficiary and hidden cost of exactly one tailored action per node.
4. Mark provenance. Every scene says whether it came from live DeepSeek generation or deterministic local recovery.
5. Preserve the horizontal archive. Expanding to all fifty moments changes the carousel contents in place; it never opens a second UI universe.
6. Treat images as historical identity, not generic decoration. Every seed gets a dedicated local image path with a verified fallback.
7. Award-worthy technical story: structured causal memory, authoritative time planner, provenance-aware generation, deterministic recovery, and a client-computed deviation model.
