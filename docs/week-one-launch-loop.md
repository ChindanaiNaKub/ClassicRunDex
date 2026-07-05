# Week-One Launch Loop

ClassicRunDex starts with a manual launch loop. The first seven-day review window runs from 2026-07-05 through 2026-07-11.

No analytics SDK, account tracking, coupon collection, invite service, affiliate program, paid boost path, or monetized redirect is part of this loop.

## Signals

Track these Launch Signals once per day:

- **Repeat usage**: Returning Thai Players come back to the same Player Guide, checklist, or Source Record question. Evidence comes from manual support/community observation or GitHub comments, not client telemetry.
- **Correction reports**: GitHub Issues report missing Player Data, source status mistakes, stale checklist items, Translation gaps, or Classic-vs-Kakao Differences.
- **Source-safe feedback**: Contribution Reports pass the safety checks without copied prose, copied tables, copied assets, private API output, account details, coupon codes, or invite-service requests.
- **Stale claims**: Launch Checklist items, community leads, or event claims need review because expiry or official context is unclear.
- **Maintenance burden**: Review, source checking, and guide updates fit in a small daily maintainer pass.

## Daily Log Template

```md
## YYYY-MM-DD

- Repeat usage:
- Correction reports:
- Source-safe feedback:
- Stale claims:
- Maintenance burden:
- Actions taken:
- Needs next:
```

## Decision Rule

Keep the launch scope only when the guide remains useful without unsafe data intake or heavy maintenance. If stale claims or unsafe reports dominate, narrow the visible checklist and keep those claims as community leads until reviewed.
