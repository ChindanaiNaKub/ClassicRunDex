# Contributing to ClassicRunDex

ClassicRunDex accepts source-first contributions through GitHub Issues. There is no user account system, moderation dashboard, invite service, or in-app report UI yet.

Use the issue forms:

- **Source-first data report** for corrections, missing Player Data, aliases, Source Record leads, Classic-vs-Kakao Differences, or Player Guide impact.
- **Contribution Packet** for prepared batches with Source Records, proposed Player Data, Translations, and guide impact.

## Source Tiers

Accepted source tiers:

- **official Classic**: Devsisters or platform surfaces for Cookie Run Classic.
- **player-verified Classic**: direct current Cookie Run Classic observation, described in original wording.
- **historical Kakao**: useful context from Cookie Run Kakao, not Classic truth.
- **Translation-only**: Thai, English, Korean, or historical wording that improves lookup but does not verify gameplay facts.
- **community lead**: a question or lead that suggests what to check next.

Rejected source types:

- copied official or community prose
- copied tables or bulk mirrored spreadsheets
- copied game art, sprites, audio, screenshots, or extracted assets without review
- private API output, reverse engineering, datamined data, or automation-derived data
- account credentials, coupon codes, invite-service requests, boosting, account sales, or gray-market services

## Roles

- **Reporter**: opens a Contribution Report with original observations and source context.
- **Translator**: proposes Translation records or aliases for lookup and comprehension.
- **Data Contributor**: prepares a Contribution Packet with Source Records and proposed Player Data facts.
- **Data Reviewer**: checks provenance, source status, safety, and Classic-vs-Kakao separation.
- **Guide Author**: updates Player Guide wording after the data is reviewed.
- **Maintainer**: publishes accepted data, rejects unsafe submissions, and records audit context.

## Review States

Incoming Contribution Claims move through these Review States:

- `reported`
- `needs_info`
- `candidate`
- `community_lead`
- `historical_kakao`
- `translation_only`
- `verified_classic`
- `official_classic`
- `rejected`
- `superseded`

Only `official_classic` and `verified_classic` can drive Player Guide recommendations, and only after approval by a Data Reviewer or Maintainer.

## Contribution Packet Format

Use original ClassicRunDex wording:

```yaml
contributors:
  - name: "Contributor name"
    role: "reporter | translator | data_contributor | data_reviewer | guide_author | maintainer"
    handle: "@optional"
source_records:
  - id: SRC-...
    owner: "Source owner"
    url_or_observation: "URL or observation note"
    observed_at: "YYYY-MM-DD"
    proposed_status: "official_classic | verified_classic | historical_kakao | translation_only | community_lead"
    permission_or_safety_note: "Why this is safe to use"
facts:
  - entity_type: "Cookie | Pet | Treasure | Combination"
    thai_name: "Thai name or description"
    global_name: "English/global name"
    field: "Level | Cost | Skill | Episode | Combination | Classic-vs-Kakao Difference"
    value: "Original ClassicRunDex wording"
    source_record_ids: ["SRC-..."]
    proposed_review_state: "candidate"
translations:
  - language: "thai | english | korean | historical"
    value: "Searchable wording"
    maps_to: "Player Data fact or entity"
    note: "Why this helps lookup"
guide_impact:
  affected_player_guide: "Guide id or player job"
  recommendation_driving: false
  impact: "change advice | add caution | add context | no guide change"
review:
  reviewer_name: "Data Reviewer or Maintainer name"
  reviewer_role: "data_reviewer | maintainer"
  reviewed_at: "YYYY-MM-DD"
  decision: "approved | needs_info | rejected"
audit:
  state: "published | superseded | disputed"
  note: "Why this claim appears in the changelog"
  related_claim_ids: []
```

Unsafe submissions are rejected instead of normalized into Player Data.

## Data Changelog

Published data batches should generate changelog entries from reviewed Contribution Packets. Do not hand-write changelog notes detached from the packet.

Every generated entry must name:

- changed Contribution Claims
- Source Record IDs and source statuses
- contributors
- Data Reviewer or Maintainer approval
- Player Guide impact
- superseded or disputed claim context, when present

Superseded or disputed claims stay visible in the changelog instead of being silently deleted from audit history.

## Week-One Launch Loop

The week-one loop is manual and repo-owned. Use `docs/week-one-launch-loop.md` plus GitHub Issues to watch repeat usage, correction reports, source-safe feedback, stale claims, and maintenance burden.

Do not add analytics SDKs, account tracking, coupon collection, invite handling, affiliate links, paid boost flows, account sales, or monetized redirects to measure launch feedback.
