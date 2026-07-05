# Data Ingestion And Contribution Workflow Prototype

## Question

How should Korean data, translations, corrections, and community submissions enter ClassicRunDex in a way that stays transparent, maintainable, and trusted?

## Assumption

This is a workflow and data-shape prototype, not production code. The executable artifact is a small terminal walkthrough because the key design question is whether the review states and required provenance gates feel clear.

Run it with:

```bash
python3 prototypes/data-ingestion-workflow/prototype.py
```

## Proposed Workflow

ClassicRunDex should use a GitHub-native contribution workflow first, with a non-coder report lane feeding the same review queue.

1. **Report**: Thai players, translators, and contributors submit a correction, lead, or data packet through a GitHub issue form. If GitHub is too much friction, a simple public form can mirror into GitHub manually.
2. **Triage**: Maintainers classify the submission as current Cookie Run Classic observation, official Classic source, historical Cookie Run Kakao lead, translation-only lead, community lead, unsafe source, or needs-info.
3. **Normalize**: A contributor or maintainer turns accepted submissions into fact-level Player Data records with Source Records. Scripts may normalize, diff, and validate records, but scripts must not promote leads into verified facts.
4. **Review**: A Data Reviewer checks provenance, license/permission posture, Classic-vs-Kakao labeling, and whether copied text/assets or bulk mirrored tables are present.
5. **Publish**: Verified Classic facts can support Player Guides. Historical Kakao, translation-only, and community leads can be shown only as labelled leads or hidden from guide recommendations until verified.
6. **Audit**: Each published batch gets a changelog entry naming changed facts, source status, reviewers, contributors, and whether guides were affected.

Recommended states:

- `reported`
- `needs_info`
- `candidate`
- `verified_classic`
- `official_classic`
- `historical_kakao`
- `translation_only`
- `community_lead`
- `rejected`
- `superseded`

Only `verified_classic` and `official_classic` should be allowed to drive Player Guide recommendations.

## Source And Audit Fields

Each Source Record should include:

- `source_id`
- `source_kind`: official Classic, official Kakao, player-verified Classic, open-licensed community, community lead, unsafe source
- `owner`
- `title`
- `url_or_reference`
- `retrieved_at`
- `observed_at`
- `game_context`
- `version_or_event_context`
- `language`
- `license_or_permission`
- `allowed_use`
- `transformation`: observed, translated, summarized, derived, calculated, copied lead, rejected copy
- `evidence_notes`
- `reviewer`
- `reviewed_at`

Each Player Data fact should include:

- `fact_id`
- `entity_type`: Cookie, Pet, Treasure, Combination, Skill, Level, Cost, Episode, Translation, Classic-vs-Kakao Difference
- `entity_key`
- `field`
- `value`
- `game_context`
- `version_or_event_context`
- `locale`
- `source_record_ids`
- `verification_status`
- `contributed_by`
- `reviewed_by`
- `submitted_at`
- `verified_at`
- `supersedes`
- `notes`

Each Player Guide should cite the verified facts it depends on, show a last-reviewed date, and avoid using historical Kakao or community leads as if they were current Classic truth.

## Contributor Roles

- **Reporter**: non-coder who submits a correction, screenshot, source link, or question.
- **Translator**: maps Thai, English, Korean, or historical names into project wording, but does not create verification by translating.
- **Data Contributor**: prepares fact records and Source Records in a PR.
- **Data Reviewer**: checks provenance, status labels, license posture, and Classic-vs-Kakao separation.
- **Guide Author**: writes dated Player Guides using only allowed facts for recommendations.
- **Maintainer**: merges reviewed data, publishes changelogs, resolves disputes, and handles unsafe-source removals.

Contributor credit should appear in changelogs and optional contributor metadata, but credit should not override source safety.

## Smallest Workflow Worth Building First

Build this first:

1. A GitHub issue form for "Report a data correction or lead".
2. A `CONTRIBUTING_DATA.md` guide with accepted source tiers, rejected source types, and examples.
3. A minimal JSON or YAML contribution packet template containing `sources`, `facts`, and `guide_impacts`.
4. A lightweight validation script that blocks missing Source Records, unsafe statuses in Player Guides, and unknown source references.
5. A manual changelog file for data updates.

Postpone:

- Full moderation dashboards.
- User accounts and reputation.
- Automated import from community wikis or spreadsheets.
- Bulk mirrored data tables.
- Publishing official game art or copied prose.

## Decision

Use a conservative source-first workflow: every incoming claim becomes a fact-level record with a Source Record before it can influence a Player Guide. Community and Kakao material is useful as a lead, but the first build should make it structurally impossible for those leads to appear as verified Cookie Run Classic recommendations without reviewer action.
