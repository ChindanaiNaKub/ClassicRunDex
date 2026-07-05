#!/usr/bin/env python3
"""Throwaway ClassicRunDex contribution workflow prototype.

This does not persist data or validate production schemas. It makes the
proposed intake states and provenance gates visible with three sample packets.
"""

from dataclasses import dataclass
from typing import Iterable


REQUIRED_SOURCE_FIELDS = {
    "source_id",
    "source_kind",
    "owner",
    "title",
    "url_or_reference",
    "retrieved_at",
    "observed_at",
    "license_or_permission",
    "language",
    "transformation",
    "evidence_notes",
}

REQUIRED_FACT_FIELDS = {
    "fact_id",
    "entity_type",
    "entity_key",
    "field",
    "value",
    "game_context",
    "locale",
    "source_record_ids",
    "verification_status",
    "contributed_by",
    "submitted_at",
}

GUIDE_SAFE_STATUSES = {"verified_classic", "official_classic"}
LEAD_ONLY_STATUSES = {"historical_kakao", "community_lead", "translation_only"}
REJECTED_STATUSES = {"rejected", "unsafe_source"}


@dataclass(frozen=True)
class Packet:
    title: str
    reporter_lane: str
    facts: list[dict]
    sources: list[dict]
    copied_assets: bool = False
    copied_bulk_table: bool = False


def missing_fields(records: Iterable[dict], required: set[str]) -> dict[int, list[str]]:
    missing: dict[int, list[str]] = {}
    for index, record in enumerate(records, start=1):
        absent = sorted(required - set(record))
        if absent:
            missing[index] = absent
    return missing


def validate(packet: Packet) -> list[str]:
    problems: list[str] = []
    for index, fields in missing_fields(packet.sources, REQUIRED_SOURCE_FIELDS).items():
        problems.append(f"source {index} missing {', '.join(fields)}")
    for index, fields in missing_fields(packet.facts, REQUIRED_FACT_FIELDS).items():
        problems.append(f"fact {index} missing {', '.join(fields)}")

    source_ids = {source.get("source_id") for source in packet.sources}
    for fact in packet.facts:
        for source_id in fact.get("source_record_ids", []):
            if source_id not in source_ids:
                problems.append(f"{fact.get('fact_id')} references unknown source {source_id}")

    if packet.copied_assets:
        problems.append("copied official or community asset")
    if packet.copied_bulk_table:
        problems.append("bulk copied table instead of transformed fact records")
    return problems


def classify(packet: Packet) -> str:
    problems = validate(packet)
    if problems:
        if packet.copied_assets or packet.copied_bulk_table:
            return "unsafe_source"
        return "needs_info"

    statuses = {fact["verification_status"] for fact in packet.facts}
    if statuses & REJECTED_STATUSES:
        return "rejected"
    if statuses <= GUIDE_SAFE_STATUSES:
        return "verified_classic"
    if statuses <= LEAD_ONLY_STATUSES:
        return "lead_only"
    return "needs_review"


def print_packet(packet: Packet) -> None:
    print(f"\n=== {packet.title} ===")
    print(f"intake lane: {packet.reporter_lane}")
    print("reported -> triaged")

    problems = validate(packet)
    if problems:
        print("triaged -> blocked")
        for problem in problems:
            print(f"  gate: {problem}")
    else:
        print("triaged -> provenance complete")

    outcome = classify(packet)
    if outcome == "verified_classic":
        print("review -> verified_classic -> changelog -> published")
        print("guide usage: allowed, with Source Records shown")
    elif outcome == "lead_only":
        print("review -> lead_only")
        print("guide usage: not allowed as Classic fact; show only as labelled lead")
    elif outcome == "needs_info":
        print("review -> needs_info")
        print("guide usage: blocked until reporter or contributor adds evidence")
    elif outcome == "unsafe_source":
        print("review -> rejected")
        print("guide usage: blocked; do not mirror assets, private data, or bulk tables")
    else:
        print(f"review -> {outcome}")
        print("guide usage: maintainer decision required")


def main() -> None:
    packets = [
        Packet(
            title="Thai player correction from in-game observation",
            reporter_lane="GitHub issue form or simple public correction form",
            sources=[
                {
                    "source_id": "src-classic-observation-001",
                    "source_kind": "player_verified_classic",
                    "owner": "returning-thai-player",
                    "title": "Observed Cookie level cost in Cookie Run Classic",
                    "url_or_reference": "issue attachment or maintainer note",
                    "retrieved_at": "2026-07-04",
                    "observed_at": "2026-07-04",
                    "license_or_permission": "contributed under project data license",
                    "language": "th",
                    "transformation": "fact extracted from observation",
                    "evidence_notes": "screenshot available for reviewer, not republished",
                }
            ],
            facts=[
                {
                    "fact_id": "fact-cookie-cost-001",
                    "entity_type": "Cookie",
                    "entity_key": "sample_cookie",
                    "field": "level_2_cost",
                    "value": "1200 coins",
                    "game_context": "Cookie Run Classic",
                    "locale": "th",
                    "source_record_ids": ["src-classic-observation-001"],
                    "verification_status": "verified_classic",
                    "contributed_by": "returning-thai-player",
                    "submitted_at": "2026-07-04",
                }
            ],
        ),
        Packet(
            title="Cookie Run Kakao translation lead",
            reporter_lane="GitHub issue or PR with translation note",
            sources=[
                {
                    "source_id": "src-kakao-lead-001",
                    "source_kind": "community_lead",
                    "owner": "community wiki contributor",
                    "title": "Historical Kakao Cookie name lead",
                    "url_or_reference": "public page URL",
                    "retrieved_at": "2026-07-04",
                    "observed_at": "unknown",
                    "license_or_permission": "lead only; do not copy prose",
                    "language": "ko",
                    "transformation": "translated name candidate",
                    "evidence_notes": "needs Classic confirmation before guide use",
                }
            ],
            facts=[
                {
                    "fact_id": "fact-translation-lead-001",
                    "entity_type": "Cookie",
                    "entity_key": "sample_cookie",
                    "field": "historical_name_ko",
                    "value": "Sample Korean Name",
                    "game_context": "Cookie Run Kakao",
                    "locale": "ko",
                    "source_record_ids": ["src-kakao-lead-001"],
                    "verification_status": "translation_only",
                    "contributed_by": "translator",
                    "submitted_at": "2026-07-04",
                }
            ],
        ),
        Packet(
            title="Bulk copied table with game art",
            reporter_lane="drive-by PR",
            sources=[
                {
                    "source_id": "src-unsafe-001",
                    "source_kind": "unlicensed_bulk_copy",
                    "owner": "unknown",
                    "title": "Copied spreadsheet and assets",
                    "url_or_reference": "third-party mirror",
                    "retrieved_at": "2026-07-04",
                    "observed_at": "unknown",
                    "license_or_permission": "unknown",
                    "language": "mixed",
                    "transformation": "none",
                    "evidence_notes": "contains copied images and table dump",
                }
            ],
            facts=[
                {
                    "fact_id": "fact-unsafe-001",
                    "entity_type": "Treasure",
                    "entity_key": "sample_treasure",
                    "field": "description",
                    "value": "Copied prose from another source",
                    "game_context": "Cookie Run Kakao",
                    "locale": "en",
                    "source_record_ids": ["src-unsafe-001"],
                    "verification_status": "community_lead",
                    "contributed_by": "drive-by-pr",
                    "submitted_at": "2026-07-04",
                }
            ],
            copied_assets=True,
            copied_bulk_table=True,
        ),
    ]

    print("ClassicRunDex data ingestion workflow prototype")
    print("states: reported -> triaged -> reviewed -> published/lead_only/blocked/rejected")
    for packet in packets:
        print_packet(packet)


if __name__ == "__main__":
    main()
