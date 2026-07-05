# Research: Safe Cookie Run Kakao Data Sources

Date: 2026-07-04

Ticket: [Research safe Cookie Run Kakao data sources](https://github.com/ChindanaiNaKub/ClassicRunDex/issues/3)

## Question

What Cookie Run Kakao data sources can ClassicRunDex responsibly use, transform, cite, or avoid?

## Short Answer

ClassicRunDex should treat **current CookieRun Classic official sources** as the source of truth, and use Cookie Run Kakao material only as a historical lead until a fact is verified against CookieRun Classic. The safest operating model is:

- publish original Thai-first player guidance and original structured Player Data;
- cite official pages and player verification records;
- avoid copying community tables, wiki prose, images, sprites, audio, APK/IPA contents, or private API responses;
- use Devsisters/IP-bearing assets only under the User Content Policy, with disclaimer and non-commercial posture, unless Devsisters gives written permission.

This is product risk research, not legal advice.

## Evidence Summary

Devsisters' current official surfaces for Classic/Kakao are enough to anchor a safe data policy:

- [CookieRun Classic on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=com.devsisters.crg) identifies Devsisters as developer, links Devsisters' Terms/Privacy/Parental Guide, lists official Instagram/X, states the current support/probability path, and was updated June 26, 2026.
- [CookieRun Classic on the Apple App Store](https://apps.apple.com/us/app/cookierun-classic/id6759596824) identifies Devsisters as developer/seller, links official socials/support, includes version history, and lists in-app purchases.
- [Cookie Run for Kakao on Google Play](https://play.google.com/store/apps/details?hl=en_US&id=com.devsisters.CookieRunForKakao) is an official current Kakao listing from Devsisters, updated June 26, 2026, but it points to Korean policies/support and should be treated as Kakao-specific.
- [CookieRun Classic support](https://cs-cookierunclassic.devsisters.com/hc/en-us) and the [official coupon page](https://coupon.devplay.com/coupon/crg/en) are official operational sources.
- The Korean [CookieRun Classic probability category](https://cookierun.zendesk.com/hc/ko/categories/28781291176089-%ED%99%95%EB%A5%A0-%EC%A0%95%EB%B3%B4) and probability details such as [pet hatching / treasure draw / treasure evolution probabilities](https://cookierun.zendesk.com/hc/ko/articles/28813434627993-%EC%83%81%EC%84%B8%EC%A0%95%EB%B3%B4) are unusually valuable official data sources. They give dates, mechanics, and numeric probabilities.
- Devsisters' [Terms of Service](https://policy.devsisters.com/en/terms-of-service/) grant only limited non-commercial entertainment use of the service, prohibit cheats/automation/unauthorized third-party software, prohibit reverse engineering/decompilation/source derivation, and state Devsisters owns the games, characters, code, art, animations, sounds, methods of operation, and related IP. The policy site rendered dynamically, so clause text was read from its Gatsby `page-data.json` route on 2026-07-04.
- Devsisters' [User Content Policy](https://policy.devsisters.com/en/content-policy/) allows user content only under rules including non-commercial use, an explicit non-affiliation disclaimer, kindness, and no third-party infringement. The policy site rendered dynamically, so clause text was read from its Gatsby `page-data.json` route on 2026-07-04.
- Devsisters' [Brand Resources](https://www.devsisters.com/en/resource) offer Fan Kit resources, but say Fan Kit copyright is subject to Devsisters' Terms, and all rights in brand/studio assets are reserved.
- The official [Studio Kingdom interview on CookieRun for Kakao's 11th anniversary](https://studiokingdom.co.kr/en/story/27/) confirms CookieRun for Kakao resumed updates after a long dormant period, that the team faced old-technology constraints, and that balance/events/improvements may continue. That makes Kakao useful context, not a guaranteed mirror for Classic.

Community sources exist and are useful, but risky as sources of truth:

- [Fandom licensing](https://www.fandom.com/licensing) says wiki text is generally CC BY-SA 3.0 unless a wiki uses another permitted license. Reusing text requires attribution and ShareAlike; images/files may have separate rights.
- [Cookie Run for Kakao on Fandom](https://cookierun.fandom.com/wiki/Cookie_Run_for_Kakao), Fandom list pages, and Korean Fandom pages are useful leads for historical rosters/lists, but copying their text/tables imports CC BY-SA obligations and may still leave game images/assets outside the wiki text license.
- Korean guide/community sites such as [CookieRunHUB](https://www.cookierunhub.com/encyclopedia/newbie-guide/2), [cookierun-classic.wiki](https://www.cookierun-classic.wiki/ko), and [cookierunclassicwiki.wiki](https://www.cookierunclassicwiki.wiki/) are player-demand and hypothesis sources, not source-of-truth data sources unless the owner grants a license and the facts are independently verified. Some community pages include subjective rankings, old dates, or unsourced values.
- [Internet Archive terms](https://archive.org/about/terms.php) and archived pages can help recover historical official pages, but the archive is not a new license from Devsisters or the original author. Use archived pages as citation/evidence, not as permission to copy.

## Recommended Source-Of-Truth Tiers

### Tier 0: Official current CookieRun Classic sources

Use for current facts when available.

Examples:

- in-game screens manually observed by a contributor;
- in-game Settings > Game Info > Support / Probabilities;
- official Classic support and probability pages;
- official Classic App Store / Google Play listing;
- official Classic socials/notices/coupon pages.

Reuse policy:

- cite exact source URL, retrieval date, game/app version where available, language, and whether the fact was verified in-game;
- translate into Thai/English in original ClassicRunDex wording;
- do not mirror full official pages or wholesale probability tables unless legal/permission review says yes;
- do not copy official images, screenshots, icons, sprites, audio, or UI art into the repo/site unless covered by written permission or an approved Fan Kit use.

### Tier 1: Official Cookie Run for Kakao sources

Use as historical lead data and as a signal for likely Classic mechanics.

Examples:

- official Kakao Google Play listing;
- Korean Kakao support/probability pages if they are still distinct;
- official Devsisters/Studio Kingdom posts about Kakao updates.

Reuse policy:

- label as `historical-kakao` or `kakao-only` until verified in Classic;
- never silently convert Kakao values into Classic values;
- use Kakao names/rosters as discovery leads, then verify current Classic names, costs, levels, combinations, and probabilities in Tier 0 sources.

### Tier 2: Player-verified derived data

Use for facts that official pages do not publish, once independently verified.

Examples:

- a contributor manually records a cookie level cost from their account;
- two players verify a combo bonus or treasure effect in the same app version;
- a guide author contributes original observations under an explicit license.

Reuse policy:

- store facts in ClassicRunDex's own schema and wording;
- record `observed_at`, `game_version`, `language`, `verifier`, `source_method`, and `confidence`;
- require at least two independent verifications for high-impact upgrade/spend recommendations;
- mark stale facts when a relevant official update lands.

### Tier 3: Open-licensed community text

Use sparingly, mostly as leads or corroboration.

Examples:

- Fandom wiki text where the page is actually under CC BY-SA;
- other community datasets with explicit compatible license.

Reuse policy:

- prefer citation and original rewriting over copying;
- if copying/adapting text, include attribution, source link, license link, and change notice;
- understand ShareAlike may affect the page/data where reused;
- verify every gameplay fact against Tier 0 or Tier 2 before it becomes player-facing guidance.

### Tier 4: Unlicensed community guides, spreadsheets, videos, social posts

Use as discovery and demand signal only.

Examples:

- public Google Sheets with no license;
- Korean/Thai/English community guides;
- Reddit posts, Discord posts, YouTube videos, blog articles, search-result snippets.

Reuse policy:

- do not copy tables, rankings, prose, screenshots, or thumbnails;
- cite as "lead found here" only when necessary;
- contact the owner for permission before importing a spreadsheet or structured dataset;
- independently re-derive and verify any facts used.

### Tier 5: Avoid / do not use

Avoid as sources for ClassicRunDex's public repo or website.

- APK/IPA extraction, decompilation, binary asset extraction, private endpoint scraping, emulator-only bypasses, packet inspection, botting, automation, or anything that looks like reverse engineering;
- unofficial APK archives and modified clients;
- copied sprites, icons, music, sound effects, animations, UI screenshots, character portraits, or extracted JSON/resources;
- private Discord dumps or closed community spreadsheets without permission;
- wholesale mirrors of official probability tables, wiki pages, or guide databases.

## Do / Don't List

Do:

- start every data row with provenance, not just value;
- keep Classic values separate from Kakao historical values;
- write Thai Player Guides in ClassicRunDex's own voice;
- link players to official probability pages for full probability tables;
- maintain a public source ledger with URL, owner, license/status, retrieval date, and verification status;
- add a site-wide Devsisters non-affiliation disclaimer;
- get written permission before monetization, ads, sponsorship, donations tied to IP-bearing content, or Fan Kit-heavy pages.

Don't:

- scrape or call private game APIs;
- publish instructions for extracting game data;
- copy Fandom/community tables into ClassicRunDex;
- use community rankings as facts;
- hotlink or bundle official artwork;
- imply Devsisters approval;
- call Kakao data "Classic" until verified in Classic.

## Attribution Requirements

Minimum site-wide disclaimer:

> This content is not affiliated, sponsored or approved by Devsisters.

Recommended source note on each data-heavy page:

> Game facts are independently compiled by ClassicRunDex from official CookieRun Classic sources and player verification. Devsisters owns CookieRun, CookieRun Classic, Cookie Run for Kakao, characters, artwork, logos, and related IP.

For translated official facts:

> Translated by ClassicRunDex from the official Korean CookieRun Classic support page on YYYY-MM-DD. Translation is unofficial.

For Fandom-derived text, if any is copied/adapted:

> Adapted from [article title] on Cookie Run Wiki, licensed under CC BY-SA 3.0; changes made by ClassicRunDex. See the article history for contributors.

For player-verified data:

> Verified in CookieRun Classic version X on YYYY-MM-DD by contributor(s): NAME/HANDLE.

## Practical Data Policy For The First Slice

Use this schema for every imported/created fact:

- `fact_id`
- `entity_type`: cookie, pet, treasure, probability, combo, cost, guide_claim
- `name_original`
- `name_th`
- `name_en`
- `value`
- `source_tier`
- `source_url`
- `source_owner`
- `source_language`
- `observed_game`
- `observed_game_version`
- `observed_at`
- `verification_status`: official, player_verified, needs_second_verification, historical_kakao, community_lead, stale
- `license_status`: official_reference, original_observation, cc_by_sa, permission_granted, unknown_do_not_copy
- `notes`

For the Returning Thai Player job, the first publishable data slice should be conservative:

- current cookie/pet/treasure names and basic role summaries from official/player-verified sources;
- "what to upgrade next" guide logic written as original interpretation;
- links out to full official probability tables instead of mirroring them wholesale;
- no official art except possibly Fan Kit assets after permission/monetization posture is clear.

## Unknowns Needing Human Or Legal Judgment

- Whether ClassicRunDex will run ads, sponsorship, affiliate links, paid guides, donations, or other monetization. Devsisters' User Content Policy is non-commercial, so monetization needs legal review or explicit Devsisters permission.
- Whether reproducing large official probability tables is acceptable as factual data, or whether ClassicRunDex should only summarize and link out.
- Whether Devsisters would grant written permission for Fan Kit/brand assets on a Thai fan knowledge site.
- Which jurisdiction governs the project risks in practice: Thailand, Korea, the United States/GitHub, or Devsisters' policy forum.
- Whether a contributor license agreement is needed so player-submitted observations can be safely reused in an open-source repo.
- Whether historical Kakao data imported from Korean community sources could conflict with Classic if balance diverges.

## Decision

Adopt a **trust-first, no-scrape data policy**:

1. Tier 0 official Classic data and player-verified observations are safe enough to build the first Player Data layer.
2. Cookie Run Kakao data is historical/contextual until verified in Classic.
3. Community data is a lead, not source-of-truth, unless explicitly licensed and independently verified.
4. No private API scraping, reverse engineering, datamining, or asset extraction.
5. No monetized or asset-heavy launch without human/legal review or Devsisters permission.
