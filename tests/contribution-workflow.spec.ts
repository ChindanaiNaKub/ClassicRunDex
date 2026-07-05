import { expect, test } from "@playwright/test";
import {
  canTransitionContributionClaim,
  generateDataChangelogEntry,
  generateDataChangelogMarkdown,
  validateContributionPacket,
  type ContributionPacket,
  type ContributionReview,
  type ContributionReviewState,
} from "../src/contribution-workflow";

function reviewerApproval(): ContributionReview {
  return {
    reviewerName: "Mali Reviewer",
    reviewerRole: "data_reviewer",
    decision: "approved",
    reviewedAt: "2026-07-05",
    note: "Source checked against Cookie Run Classic.",
  };
}

function validPacket(): ContributionPacket {
  return {
    id: "PACKET-001",
    title: "Verified Classic starter correction",
    contributors: [
      {
        name: "Nok Contributor",
        role: "data_contributor",
        handle: "@nok",
      },
    ],
    reporterRole: "data_contributor",
    sourceRecords: [
      {
        id: "SRC-PACKET-CLASSIC-001",
        owner: "ClassicRunDex player observation",
        urlOrObservation: "Observed in current Cookie Run Classic play.",
        observedAt: "2026-07-05",
        proposedState: "verified_classic",
        safetyNote: "Original observation, no copied prose or assets.",
      },
    ],
    claims: [
      {
        id: "CLAIM-STARTER-001",
        title: "Starter Cookie level correction",
        state: "verified_classic",
        sourceRecordIds: ["SRC-PACKET-CLASSIC-001"],
        guideImpact: {
          recommendationDriving: true,
          affectedGuideId: "GUIDE-RETURNING-THAI-STARTER",
          note: "Can affect the starter Player Guide after review.",
        },
        unsafeSubmissionKinds: [],
        review: reviewerApproval(),
      },
    ],
  };
}

function expectPacketError(packet: ContributionPacket, message: string): void {
  expect(validateContributionPacket(packet).errors).toEqual(
    expect.arrayContaining([expect.stringContaining(message)]),
  );
}

test("reviewed official or verified Contribution Claims may drive Player Guides", () => {
  const validation = validateContributionPacket(validPacket());

  expect(validation.errors).toEqual([]);
  expect(validation.valid).toBe(true);
});

test("reported, candidate, and lead states cannot skip into recommendation-driving publication", () => {
  const blockedStates: ContributionReviewState[] = [
    "reported",
    "candidate",
    "community_lead",
    "historical_kakao",
    "translation_only",
  ];

  blockedStates.forEach((from) => {
    const transition = canTransitionContributionClaim({
      from,
      to: "verified_classic",
    });

    expect(transition.allowed, `${from} should not skip review`).toBe(false);
    expect(transition.reason).toContain("Data Reviewer or Maintainer approval");
  });

  expect(
    canTransitionContributionClaim({
      from: "candidate",
      to: "verified_classic",
      review: reviewerApproval(),
    }).allowed,
  ).toBe(true);
});

test("candidate or community Contribution Claims cannot drive Player Guide recommendations", () => {
  const packet = validPacket();
  packet.sourceRecords[0].proposedState = "community_lead";
  packet.claims[0].state = "community_lead";
  delete packet.claims[0].review;

  expectPacketError(
    packet,
    "Contribution Claim CLAIM-STARTER-001 cannot drive Player Guide recommendations while in Review State community_lead.",
  );
});

test("verified Classic publication requires Data Reviewer or Maintainer approval", () => {
  const packet = validPacket();
  delete packet.claims[0].review;

  expectPacketError(
    packet,
    "Contribution Claim CLAIM-STARTER-001 requires Data Reviewer or Maintainer approval before verified_classic publication.",
  );

  packet.claims[0].review = {
    reviewerName: "Reporter Self-Review",
    reviewerRole: "reporter",
    decision: "approved",
    reviewedAt: "2026-07-05",
    note: "Reporter cannot approve their own claim.",
  };

  expectPacketError(
    packet,
    "Contribution Claim CLAIM-STARTER-001 requires Data Reviewer or Maintainer approval before verified_classic publication.",
  );
});

test("verified Classic claims cannot be published from community or historical Source Records", () => {
  const packet = validPacket();
  packet.sourceRecords[0].proposedState = "community_lead";

  expectPacketError(
    packet,
    "Contribution Claim CLAIM-STARTER-001 cannot publish verified_classic from community_lead Source Record SRC-PACKET-CLASSIC-001.",
  );
});

test("unsafe Contribution Claims are rejected before publication", () => {
  const packet = validPacket();
  packet.claims[0].unsafeSubmissionKinds = ["copied_prose", "private_api"];

  expectPacketError(
    packet,
    "Contribution Claim CLAIM-STARTER-001 contains rejected source material: copied prose, private API output.",
  );
});

test("reviewed Contribution Packets generate data changelog entries", () => {
  const packet = validPacket();
  const entry = generateDataChangelogEntry(packet, "2026-07-06");
  const markdown = generateDataChangelogMarkdown(packet, "2026-07-06");

  expect(entry.packetId).toBe("PACKET-001");
  expect(entry.contributors.map((contributor) => contributor.name)).toEqual([
    "Nok Contributor",
  ]);
  expect(entry.reviewers.map((reviewer) => reviewer.name)).toEqual(["Mali Reviewer"]);
  expect(entry.claims[0]).toMatchObject({
    id: "CLAIM-STARTER-001",
    reviewState: "verified_classic",
    guideImpact: {
      recommendationDriving: true,
      affectedGuideId: "GUIDE-RETURNING-THAI-STARTER",
    },
  });

  expect(markdown).toContain("PACKET-001: Verified Classic starter correction");
  expect(markdown).toContain("Nok Contributor (data_contributor, @nok)");
  expect(markdown).toContain("Mali Reviewer (data_reviewer, 2026-07-05)");
  expect(markdown).toContain("CLAIM-STARTER-001: Starter Cookie level correction [verified_classic]");
  expect(markdown).toContain("SRC-PACKET-CLASSIC-001 (verified_classic, ClassicRunDex player observation)");
  expect(markdown).toContain(
    "Guide impact: recommendation-driving - Can affect the starter Player Guide after review.",
  );
});

test("data changelogs keep superseded and disputed audit context", () => {
  const packet = validPacket();
  packet.claims[0].audit = {
    state: "superseded",
    note: "Supersedes an older Kakao-memory claim with current Classic observation.",
    relatedClaimIds: ["CLAIM-KAKAO-OLD"],
  };
  packet.claims.push({
    id: "CLAIM-STARTER-DISPUTE",
    title: "Starter correction disputed by later observation",
    state: "verified_classic",
    sourceRecordIds: ["SRC-PACKET-CLASSIC-001"],
    guideImpact: {
      recommendationDriving: false,
      affectedGuideId: "GUIDE-RETURNING-THAI-STARTER",
      note: "Adds audit context but does not change the recommendation yet.",
    },
    unsafeSubmissionKinds: [],
    audit: {
      state: "disputed",
      note: "Conflicts with a later player observation and remains visible for audit.",
      relatedClaimIds: ["CLAIM-STARTER-001"],
    },
    review: reviewerApproval(),
  });

  const markdown = generateDataChangelogMarkdown(packet, "2026-07-06");

  expect(markdown).toContain("Audit: superseded - Supersedes an older Kakao-memory claim");
  expect(markdown).toContain("Related claims: CLAIM-KAKAO-OLD");
  expect(markdown).toContain("Audit: disputed - Conflicts with a later player observation");
  expect(markdown).toContain("Related claims: CLAIM-STARTER-001");
});

test("data changelog generation requires contributor and reviewer context", () => {
  const noContributorPacket = validPacket();
  noContributorPacket.contributors = [];

  expect(() => generateDataChangelogMarkdown(noContributorPacket, "2026-07-06")).toThrow(
    "must name at least one contributor",
  );

  const noReviewPacket = validPacket();
  delete noReviewPacket.claims[0].review;

  expect(() => generateDataChangelogMarkdown(noReviewPacket, "2026-07-06")).toThrow(
    "requires Data Reviewer or Maintainer approval",
  );

  expect(() => generateDataChangelogMarkdown(validPacket(), "July 6")).toThrow(
    "must use YYYY-MM-DD publishedAt",
  );
});
