# Generative Worlds Research Notes

## Projects reviewed

- [Stanford Generative Agents](https://github.com/joonspk-research/generative_agents): believable behavior emerges from a memory stream, reflection, and planning rather than from showing raw model prose.
- [a16z AI Town](https://github.com/a16z-infra/ai-town): persistent shared world state and transactional simulation are the foundation; the chat model is replaceable infrastructure.
- [Google DeepMind Concordia](https://github.com/google-deepmind/concordia): a Game Master translates natural-language intent into grounded outcomes and checks plausibility.
- [Project Sid](https://github.com/altera-al/project-sid): 10-1000+ agents form specialized roles, change collective rules, and transmit culture. Its product lesson is visible institutional emergence, not longer dialogue.
- [Stanford GenAgents](https://github.com/joonspk-research/genagents): stable personas are useful when they predict different behavior under the same stimulus.

## Funding claim checked

Altera/FRL is the team behind Project Sid. Public announcements show a $2M pre-seed and a later $9M seed. This is material funding, but it is not evidence of a newly announced tens-of-millions round. The product direction remains relevant because it frames agents as persistent digital humans rather than chat windows.

## Product decisions for this game

1. Hide simulation machinery by default. One screen shows the scene, proof of change, and three actions.
2. Make memory visible as a causal receipt: `your choice -> changed fact -> new pressure`.
3. Give the traveler profile a verb. Its signature ability previews the beneficiary and hidden cost of exactly one tailored action per node.
4. Mark provenance. Every scene says whether it came from live DeepSeek generation or deterministic local recovery.
5. Preserve the horizontal archive. Expanding to all fifty moments changes the carousel contents in place; it never opens a second UI universe.
6. Treat images as historical identity, not generic decoration. Every seed gets a dedicated local image path with a verified fallback.
7. Award-worthy technical story: structured causal memory, authoritative time planner, provenance-aware generation, deterministic recovery, and a client-computed deviation model.
