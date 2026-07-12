# Generative Worlds Research Notes

## Projects reviewed

- [Stanford Generative Agents](https://github.com/joonspk-research/generative_agents): believable behavior emerges from a memory stream, reflection, and planning rather than from showing raw model prose.
- [a16z AI Town](https://github.com/a16z-infra/ai-town): persistent shared world state and transactional simulation are the foundation; the chat model is replaceable infrastructure.
- [Google DeepMind Concordia](https://github.com/google-deepmind/concordia): a Game Master translates natural-language intent into grounded outcomes and checks plausibility.
- [Project Sid](https://github.com/altera-al/project-sid): 10-1000+ agents form specialized roles, change collective rules, and transmit culture. Its product lesson is visible institutional emergence, not longer dialogue.
- [Stanford GenAgents](https://github.com/joonspk-research/genagents): stable personas are useful when they predict different behavior under the same stimulus.
- [Emergence World](https://github.com/EmergenceAI/Emergence-World): persistent worlds become interesting when agents can amend institutions, form coalitions, and face scarce resources rather than merely chat.
- [LingBot-World](https://github.com/robbyant/lingbot-world): interactive world models emphasize long-horizon consistency and sub-second feedback; for this text-first game the equivalent is persistent causal state plus immediate deterministic feedback.
- [AutoGen multi-generation memory experiment](https://github.com/microsoft/autogen/discussions/7454): each generation only inherits durable written memory, reinforcing the design choice that later identities inherit a compact causal ledger rather than the original character's body.

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
8. Frame DeepSeek as a Game Master, not a copywriter. Its job is to resolve constrained actions and propagate consequences through people, organizations, and institutions.
9. Make the model's three action classes legible as `微调 / 改制 / 断裂`; they are different causal interventions, not cosmetic A/B/C answers.
10. Keep simulation depth backstage. The player sees a scene, a causal receipt, and a changed identity; the reducer, ledger, planner, validation, and recovery system remain technical evidence for judges.
