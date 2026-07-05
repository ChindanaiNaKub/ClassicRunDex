# First Player Experience Prototype

Question: What should the first screen and first flow look like so a Returning Thai Player immediately gets value from ClassicRunDex?

Run/open:

```bash
python3 -m http.server 5173 --directory prototypes/first-player-experience
```

Then open `http://localhost:5173/?variant=A`. Variants `A`, `B`, and `C` are switchable with the floating bar or URL query param.

## Verdict

Choose **Variant A: Answer-first guide** for the first useful player experience.

The first flow should be:

1. Ask the player's immediate goal and rough resources.
2. Give one dated Thai Player Guide answer first.
3. Show the Player Data and Source Records that make the answer trustworthy.
4. Keep Cookie Run Kakao leads visibly separated from verified CookieRun Classic facts.
5. Offer search and checklist surfaces as supporting flows, not the first screen.

## Build First

- Thai-first "what should I upgrade/use next?" guide.
- Goal/resource selector with a short recommendation.
- Source-status badges for official Classic, player-verified Classic, historical Kakao, and community lead.
- Minimal Cookie/Pet/Treasure/Combination data only where it supports the first Player Guide.
- Mobile-first layout with the recommendation above controls and source context close to the answer.

## Postpone

- Full wiki-like entity coverage.
- Advanced score calculators and real-time meta tracking.
- Community correction queue UI.
- Invite/friend coordination tooling.
- Any use of official game art or monetized asset-heavy pages before permission/legal posture is settled.
