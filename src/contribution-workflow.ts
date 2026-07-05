export type ContributionReviewState =
  | "reported"
  | "needs_info"
  | "candidate"
  | "community_lead"
  | "historical_kakao"
  | "translation_only"
  | "verified_classic"
  | "official_classic"
  | "rejected"
  | "superseded";

export type ContributorRole =
  | "reporter"
  | "translator"
  | "data_contributor"
  | "data_reviewer"
  | "guide_author"
  | "maintainer";

export type ReviewDecision = "approved" | "needs_info" | "rejected";

export type UnsafeSubmissionKind =
  | "copied_prose"
  | "copied_table"
  | "copied_asset"
  | "private_api"
  | "reverse_engineering"
  | "datamined_data"
  | "bulk_mirror"
  | "account_or_coupon"
  | "invite_service"
  | "gray_market";

export type ContributionAuditState = "published" | "superseded" | "disputed";

export interface ContributionParticipant {
  name: string;
  role: ContributorRole;
  handle?: string;
}

export interface ContributionSourceRecord {
  id: string;
  owner: string;
  urlOrObservation: string;
  observedAt: string;
  proposedState: ContributionReviewState;
  safetyNote: string;
}

export interface ContributionReview {
  reviewerName: string;
  reviewerRole: ContributorRole;
  decision: ReviewDecision;
  reviewedAt: string;
  note: string;
}

export interface ContributionClaim {
  id: string;
  title: string;
  state: ContributionReviewState;
  sourceRecordIds: string[];
  guideImpact: {
    recommendationDriving: boolean;
    note: string;
    affectedGuideId?: string;
  };
  unsafeSubmissionKinds: UnsafeSubmissionKind[];
  audit?: {
    state: ContributionAuditState;
    note: string;
    relatedClaimIds: string[];
  };
  review?: ContributionReview;
}

export interface ContributionPacket {
  id: string;
  title: string;
  contributors: ContributionParticipant[];
  reporterRole: ContributorRole;
  sourceRecords: ContributionSourceRecord[];
  claims: ContributionClaim[];
}

export interface ContributionValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ContributionTransitionRequest {
  from: ContributionReviewState;
  to: ContributionReviewState;
  review?: ContributionReview;
}

export interface ContributionTransitionResult {
  allowed: boolean;
  reason?: string;
}

export interface DataChangelogClaim {
  id: string;
  title: string;
  reviewState: ContributionReviewState;
  sourceRecords: Array<{
    id: string;
    owner: string;
    reviewState: ContributionReviewState;
  }>;
  reviewer: {
    name: string;
    role: ContributorRole;
    reviewedAt: string;
  };
  guideImpact: ContributionClaim["guideImpact"];
  audit: {
    state: ContributionAuditState;
    note: string;
    relatedClaimIds: string[];
  };
}

export interface DataChangelogEntry {
  packetId: string;
  title: string;
  publishedAt: string;
  contributors: ContributionParticipant[];
  reviewers: Array<{
    name: string;
    role: ContributorRole;
    reviewedAt: string;
  }>;
  claims: DataChangelogClaim[];
}

export const contributionReviewStates: ContributionReviewState[] = [
  "reported",
  "needs_info",
  "candidate",
  "community_lead",
  "historical_kakao",
  "translation_only",
  "verified_classic",
  "official_classic",
  "rejected",
  "superseded",
];

export const contributorRoles: ContributorRole[] = [
  "reporter",
  "translator",
  "data_contributor",
  "data_reviewer",
  "guide_author",
  "maintainer",
];

export const unsafeSubmissionLabels: Record<UnsafeSubmissionKind, string> = {
  copied_prose: "copied prose",
  copied_table: "copied table",
  copied_asset: "copied asset",
  private_api: "private API output",
  reverse_engineering: "reverse-engineered data",
  datamined_data: "datamined data",
  bulk_mirror: "bulk mirrored data",
  account_or_coupon: "account details or coupon codes",
  invite_service: "invite-service request",
  gray_market: "gray-market service",
};

const recommendationDrivingStates: ContributionReviewState[] = [
  "official_classic",
  "verified_classic",
];

const preReviewStates: ContributionReviewState[] = [
  "reported",
  "needs_info",
  "candidate",
  "community_lead",
  "historical_kakao",
  "translation_only",
];

const reviewerRoles: ContributorRole[] = ["data_reviewer", "maintainer"];

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isKnownReviewState(state: string): state is ContributionReviewState {
  return contributionReviewStates.includes(state as ContributionReviewState);
}

function isReviewerRole(role: ContributorRole): boolean {
  return reviewerRoles.includes(role);
}

function isRecommendationDrivingState(state: ContributionReviewState): boolean {
  return recommendationDrivingStates.includes(state);
}

function hasApproval(review: ContributionReview | undefined): boolean {
  return Boolean(
    review &&
      review.reviewerName.trim() &&
      review.decision === "approved" &&
      isReviewerRole(review.reviewerRole) &&
      isIsoDate(review.reviewedAt),
  );
}

function participantLabel(participant: ContributionParticipant): string {
  return participant.handle
    ? `${participant.name} (${participant.role}, ${participant.handle})`
    : `${participant.name} (${participant.role})`;
}

function reviewerKey(review: ContributionReview): string {
  return `${review.reviewerName}:${review.reviewerRole}:${review.reviewedAt}`;
}

export function canTransitionContributionClaim({
  from,
  to,
  review,
}: ContributionTransitionRequest): ContributionTransitionResult {
  if (from === "rejected" && to !== "superseded") {
    return {
      allowed: false,
      reason: "Rejected Contribution Claims can only be superseded.",
    };
  }

  if (preReviewStates.includes(from) && isRecommendationDrivingState(to) && !hasApproval(review)) {
    return {
      allowed: false,
      reason:
        "Recommendation-driving Review States require Data Reviewer or Maintainer approval.",
    };
  }

  if (isRecommendationDrivingState(to) && !hasApproval(review)) {
    return {
      allowed: false,
      reason:
        "official Classic and verified Classic Review States require Data Reviewer or Maintainer approval.",
    };
  }

  return { allowed: true };
}

export function validateContributionPacket(packet: ContributionPacket): ContributionValidationResult {
  const errors: string[] = [];
  const sourceRecordsById = new Map<string, ContributionSourceRecord>();
  const claimsById = new Map<string, ContributionClaim>();

  if (!contributorRoles.includes(packet.reporterRole)) {
    errors.push(`Contribution Packet ${packet.id} uses unknown reporter role ${packet.reporterRole}.`);
  }

  if (packet.contributors.length === 0) {
    errors.push(`Contribution Packet ${packet.id} must name at least one contributor.`);
  }

  packet.contributors.forEach((contributor) => {
    if (!contributor.name.trim()) {
      errors.push(`Contribution Packet ${packet.id} has a contributor without a name.`);
    }

    if (!contributorRoles.includes(contributor.role)) {
      errors.push(`Contribution Packet ${packet.id} uses unknown contributor role ${contributor.role}.`);
    }
  });

  packet.sourceRecords.forEach((sourceRecord) => {
    if (sourceRecordsById.has(sourceRecord.id)) {
      errors.push(`Contribution Packet ${packet.id} duplicates Source Record ${sourceRecord.id}.`);
    }

    sourceRecordsById.set(sourceRecord.id, sourceRecord);

    if (!isKnownReviewState(sourceRecord.proposedState)) {
      errors.push(`Source Record ${sourceRecord.id} uses unknown Review State ${sourceRecord.proposedState}.`);
    }

    if (!sourceRecord.owner.trim()) {
      errors.push(`Source Record ${sourceRecord.id} must name an owner.`);
    }

    if (!sourceRecord.urlOrObservation.trim()) {
      errors.push(`Source Record ${sourceRecord.id} must include a URL or observation note.`);
    }

    if (!isIsoDate(sourceRecord.observedAt)) {
      errors.push(`Source Record ${sourceRecord.id} must use YYYY-MM-DD observedAt.`);
    }

    if (!sourceRecord.safetyNote.trim()) {
      errors.push(`Source Record ${sourceRecord.id} must include a permission or safety note.`);
    }
  });

  packet.claims.forEach((claim) => {
    if (claimsById.has(claim.id)) {
      errors.push(`Contribution Packet ${packet.id} duplicates Contribution Claim ${claim.id}.`);
    }

    claimsById.set(claim.id, claim);

    if (!isKnownReviewState(claim.state)) {
      errors.push(`Contribution Claim ${claim.id} uses unknown Review State ${claim.state}.`);
    }

    if (claim.unsafeSubmissionKinds.length > 0) {
      errors.push(
        `Contribution Claim ${claim.id} contains rejected source material: ${claim.unsafeSubmissionKinds
          .map((kind) => unsafeSubmissionLabels[kind])
          .join(", ")}.`,
      );
    }

    if (claim.sourceRecordIds.length === 0) {
      errors.push(`Contribution Claim ${claim.id} must cite at least one Source Record.`);
    }

    claim.sourceRecordIds.forEach((sourceRecordId) => {
      const sourceRecord = sourceRecordsById.get(sourceRecordId);

      if (!sourceRecord) {
        errors.push(`Contribution Claim ${claim.id} references unknown Source Record ${sourceRecordId}.`);
        return;
      }

      if (
        isRecommendationDrivingState(claim.state) &&
        !isRecommendationDrivingState(sourceRecord.proposedState)
      ) {
        errors.push(
          `Contribution Claim ${claim.id} cannot publish ${claim.state} from ${sourceRecord.proposedState} Source Record ${sourceRecord.id}.`,
        );
      }
    });

    if (claim.guideImpact.recommendationDriving && !isRecommendationDrivingState(claim.state)) {
      errors.push(
        `Contribution Claim ${claim.id} cannot drive Player Guide recommendations while in Review State ${claim.state}.`,
      );
    }

    if (claim.review) {
      if (!claim.review.reviewerName.trim()) {
        errors.push(`Contribution Claim ${claim.id} review must name a reviewer.`);
      }

      if (!contributorRoles.includes(claim.review.reviewerRole)) {
        errors.push(`Contribution Claim ${claim.id} review uses unknown reviewer role ${claim.review.reviewerRole}.`);
      }

      if (!isIsoDate(claim.review.reviewedAt)) {
        errors.push(`Contribution Claim ${claim.id} review must use YYYY-MM-DD reviewedAt.`);
      }
    }

    if (isRecommendationDrivingState(claim.state) && !hasApproval(claim.review)) {
      errors.push(
        `Contribution Claim ${claim.id} requires Data Reviewer or Maintainer approval before ${claim.state} publication.`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateDataChangelogEntry(
  packet: ContributionPacket,
  publishedAt: string,
): DataChangelogEntry {
  if (!isIsoDate(publishedAt)) {
    throw new Error(`Data changelog entry for ${packet.id} must use YYYY-MM-DD publishedAt.`);
  }

  const validation = validateContributionPacket(packet);

  if (!validation.valid) {
    throw new Error(`Cannot generate data changelog for ${packet.id}:\n${validation.errors.join("\n")}`);
  }

  const sourceRecordsById = new Map(
    packet.sourceRecords.map((sourceRecord) => [sourceRecord.id, sourceRecord]),
  );
  const reviewersByKey = new Map<string, DataChangelogEntry["reviewers"][number]>();
  const claims: DataChangelogClaim[] = packet.claims.map((claim) => {
    if (!claim.review) {
      throw new Error(`Contribution Claim ${claim.id} must be reviewed before changelog generation.`);
    }

    reviewersByKey.set(reviewerKey(claim.review), {
      name: claim.review.reviewerName,
      role: claim.review.reviewerRole,
      reviewedAt: claim.review.reviewedAt,
    });

    return {
      id: claim.id,
      title: claim.title,
      reviewState: claim.state,
      sourceRecords: claim.sourceRecordIds.map((sourceRecordId) => {
        const sourceRecord = sourceRecordsById.get(sourceRecordId);

        if (!sourceRecord) {
          throw new Error(`Contribution Claim ${claim.id} references unknown Source Record ${sourceRecordId}.`);
        }

        return {
          id: sourceRecord.id,
          owner: sourceRecord.owner,
          reviewState: sourceRecord.proposedState,
        };
      }),
      reviewer: {
        name: claim.review.reviewerName,
        role: claim.review.reviewerRole,
        reviewedAt: claim.review.reviewedAt,
      },
      guideImpact: claim.guideImpact,
      audit: claim.audit ?? {
        state: "published",
        note: "Published from reviewed Contribution Packet.",
        relatedClaimIds: [],
      },
    };
  });

  return {
    packetId: packet.id,
    title: packet.title,
    publishedAt,
    contributors: packet.contributors,
    reviewers: [...reviewersByKey.values()],
    claims,
  };
}

export function renderDataChangelogEntry(entry: DataChangelogEntry): string {
  const lines = [
    `## ${entry.publishedAt} - ${entry.packetId}: ${entry.title}`,
    "",
    `Contributors: ${entry.contributors.map(participantLabel).join(", ")}`,
    `Reviewers: ${entry.reviewers
      .map((reviewer) => `${reviewer.name} (${reviewer.role}, ${reviewer.reviewedAt})`)
      .join(", ")}`,
    "",
    "Changed claims:",
  ];

  entry.claims.forEach((claim) => {
    lines.push(
      `- ${claim.id}: ${claim.title} [${claim.reviewState}]`,
      `  - Source Records: ${claim.sourceRecords
        .map((sourceRecord) => `${sourceRecord.id} (${sourceRecord.reviewState}, ${sourceRecord.owner})`)
        .join(", ")}`,
      `  - Reviewer: ${claim.reviewer.name} (${claim.reviewer.role}, ${claim.reviewer.reviewedAt})`,
      `  - Guide impact: ${
        claim.guideImpact.recommendationDriving ? "recommendation-driving" : "context-only"
      } - ${claim.guideImpact.note}`,
      `  - Audit: ${claim.audit.state} - ${claim.audit.note}`,
    );

    if (claim.guideImpact.affectedGuideId) {
      lines.push(`  - Affected Player Guide: ${claim.guideImpact.affectedGuideId}`);
    }

    if (claim.audit.relatedClaimIds.length > 0) {
      lines.push(`  - Related claims: ${claim.audit.relatedClaimIds.join(", ")}`);
    }
  });

  return `${lines.join("\n")}\n`;
}

export function generateDataChangelogMarkdown(
  packet: ContributionPacket,
  publishedAt: string,
): string {
  return renderDataChangelogEntry(generateDataChangelogEntry(packet, publishedAt));
}
