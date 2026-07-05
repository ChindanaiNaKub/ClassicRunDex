import { expect, test } from "@playwright/test";
import {
  checklist,
  playerDataFacts,
  playerGuide,
  searchPlayerDataFacts,
  sourceRecords,
  trustPolicySurfaces,
  validatePlayerGuideData,
  weekOneLaunchLoop,
  type ChecklistExpiryStatus,
  type GuideDataSet,
  type LaunchSignalKind,
  type SourceStatus,
  type TranslationLanguage,
  type TrustPolicySurfaceKind,
} from "../src/guide-data";

function validDataSet(): GuideDataSet {
  return {
    sourceRecords: structuredClone(sourceRecords),
    playerDataFacts: structuredClone(playerDataFacts),
    playerGuide: structuredClone(playerGuide),
    checklist: structuredClone(checklist),
    trustPolicySurfaces: structuredClone(trustPolicySurfaces),
    weekOneLaunchLoop: structuredClone(weekOneLaunchLoop),
  };
}

function expectValidationError(data: GuideDataSet, message: string): void {
  expect(validatePlayerGuideData(data).errors).toEqual(
    expect.arrayContaining([expect.stringContaining(message)]),
  );
}

test("current Player Guide data satisfies Source Record status rules", () => {
  const validation = validatePlayerGuideData(validDataSet());

  expect(validation.errors).toEqual([]);
  expect(validation.valid).toBe(true);
});

test("lookup terms resolve the same Player Data fact without changing verification", () => {
  const englishResult = searchPlayerDataFacts("main runner");
  const thaiResult = searchPlayerDataFacts("คุกกี้ตัวหลัก");
  const koreanResult = searchPlayerDataFacts("쿠키");
  const historicalResult = searchPlayerDataFacts("LINE starter cookie");
  const kakaoResult = searchPlayerDataFacts("카카오");

  expect(englishResult.map((fact) => fact.id)).toEqual(["FACT-STARTER-COOKIE-LEVEL"]);
  expect(thaiResult.map((fact) => fact.id)).toEqual(["FACT-STARTER-COOKIE-LEVEL"]);
  expect(koreanResult.map((fact) => fact.id)).toEqual(["FACT-STARTER-COOKIE-LEVEL"]);
  expect(historicalResult.map((fact) => fact.id)).toEqual(["FACT-STARTER-COOKIE-LEVEL"]);
  expect(englishResult[0].status).toBe("verified_classic");
  expect(kakaoResult.map((fact) => fact.id)).toEqual(["FACT-KAKAO-SEPARATION"]);
  expect(kakaoResult[0].status).toBe("historical_kakao");
});

test("recommendation-driving facts require at least one Source Record", () => {
  const data = validDataSet();
  const fact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-STARTER-PET-PAIR",
  );

  expect(fact).toBeDefined();
  fact!.sourceIds = [];

  expectValidationError(
    data,
    "Player Data fact FACT-STARTER-PET-PAIR must reference at least one Source Record.",
  );
});

test("unknown Source Record references are rejected", () => {
  const data = validDataSet();
  const fact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-STARTER-PET-PAIR",
  );

  expect(fact).toBeDefined();
  fact!.sourceIds = ["SRC-MISSING"];

  expectValidationError(
    data,
    "Player Data fact FACT-STARTER-PET-PAIR references unknown Source Record SRC-MISSING.",
  );
});

test("Translation records require known languages and values", () => {
  const data = validDataSet();
  const fact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-STARTER-PET-PAIR",
  );

  expect(fact).toBeDefined();
  fact!.translations = [
    {
      language: "machine_guess" as TranslationLanguage,
      value: "",
      note: "Unsafe lookup term",
    },
  ];

  expectValidationError(
    data,
    "Player Data fact FACT-STARTER-PET-PAIR uses unknown Translation language machine_guess.",
  );
  expectValidationError(
    data,
    "Player Data fact FACT-STARTER-PET-PAIR has an empty Translation value.",
  );
});

test("Launch Checklist items require official URLs, review dates, expiry state, and Source Records", () => {
  const data = validDataSet();
  const item = data.checklist.find((checklistItem) => checklistItem.id === "CHECK-CLASSIC-COUPON");

  expect(item).toBeDefined();
  item!.officialUrl = "http://example.com/not-official";
  item!.lastReviewed = "July 5";
  item!.expiryStatus = "stale" as ChecklistExpiryStatus;
  item!.sourceIds = [];

  expectValidationError(
    data,
    "Launch Checklist item CHECK-CLASSIC-COUPON must use an HTTPS official URL.",
  );
  expectValidationError(
    data,
    "Launch Checklist item CHECK-CLASSIC-COUPON must use YYYY-MM-DD lastReviewed.",
  );
  expectValidationError(
    data,
    "Launch Checklist item CHECK-CLASSIC-COUPON uses unknown expiry status stale.",
  );
  expectValidationError(
    data,
    "Launch Checklist item CHECK-CLASSIC-COUPON must reference at least one Source Record.",
  );
});

test("Launch Checklist items cannot cite historical or community Source Records", () => {
  const data = validDataSet();
  const item = data.checklist.find((checklistItem) => checklistItem.id === "CHECK-CLASSIC-COUPON");

  expect(item).toBeDefined();
  item!.sourceIds = ["SRC-COMMUNITY-LEAD-001"];

  expectValidationError(
    data,
    "Launch Checklist item CHECK-CLASSIC-COUPON cites community lead Source Record SRC-COMMUNITY-LEAD-001.",
  );
});

test("Trust Policy Surfaces require known kinds and Source Records", () => {
  const data = validDataSet();
  const surface = data.trustPolicySurfaces.find(
    (trustPolicySurface) => trustPolicySurface.id === "TRUST-NON-AFFILIATION",
  );

  expect(surface).toBeDefined();
  surface!.kind = "legal_footer" as TrustPolicySurfaceKind;
  surface!.sourceIds = ["SRC-MISSING"];

  expectValidationError(
    data,
    "Trust Policy Surface TRUST-NON-AFFILIATION uses unknown kind legal_footer.",
  );
  expectValidationError(
    data,
    "Trust Policy Surface TRUST-NON-AFFILIATION references unknown Source Record SRC-MISSING.",
  );
});

test("Week-One Launch Loop stays manual and tracks every Launch Signal", () => {
  const data = validDataSet();

  data.weekOneLaunchLoop.analyticsSdkAllowed = true;
  data.weekOneLaunchLoop.signals = data.weekOneLaunchLoop.signals.filter(
    (signal) => signal.kind !== "stale_claims",
  );
  data.weekOneLaunchLoop.signals[0].kind = "session_replay" as LaunchSignalKind;

  expectValidationError(
    data,
    "Week-One Launch Loop LOOP-WEEK-ONE-LAUNCH must not allow analytics SDK tracking.",
  );
  expectValidationError(data, "Launch Signal SIGNAL-REPEAT-USAGE uses unknown kind session_replay.");
  expectValidationError(
    data,
    "Week-One Launch Loop LOOP-WEEK-ONE-LAUNCH must track stale_claims.",
  );
});

test("historical and community statuses cannot drive Player Guide recommendations", () => {
  const data = validDataSet();
  const communityFact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-COST-CAUTION",
  );

  expect(communityFact).toBeDefined();
  data.playerGuide.recommendations[0].drivingFactIds = [communityFact!.id];

  expectValidationError(
    data,
    "Player Guide recommendation REC-EARLY-COIN-LIMITED cannot be driven by community lead fact FACT-COST-CAUTION.",
  );
});

test("generated fallback recommendations use the same source safety gate", () => {
  const data = validDataSet();
  const fact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-STARTER-PET-PAIR",
  );

  expect(fact).toBeDefined();
  data.playerGuide.recommendations = [];
  fact!.status = "community_lead";

  expectValidationError(
    data,
    "Player Guide recommendation REC-early_progression-coin_limited cannot be driven by community lead fact FACT-STARTER-PET-PAIR.",
  );
});

test("unknown source statuses are unsafe for recommendation-driving facts", () => {
  const data = validDataSet();
  const fact = data.playerDataFacts.find(
    (playerDataFact) => playerDataFact.id === "FACT-STARTER-PET-PAIR",
  );

  expect(fact).toBeDefined();
  fact!.status = "translation_only" as SourceStatus;

  expectValidationError(
    data,
    "Player Data fact FACT-STARTER-PET-PAIR uses unknown source status translation_only.",
  );
  expectValidationError(
    data,
    "Player Guide recommendation REC-EARLY-COIN-LIMITED cannot be driven by translation_only fact FACT-STARTER-PET-PAIR.",
  );
});

test("recommendation-driving facts cannot cite historical or community Source Records", () => {
  const data = validDataSet();
  const sourceRecord = data.sourceRecords.find(
    (source) => source.id === "SRC-CLASSIC-OBS-001",
  );

  expect(sourceRecord).toBeDefined();
  sourceRecord!.status = "historical_kakao";

  expectValidationError(
    data,
    "Player Guide recommendation REC-EARLY-COIN-LIMITED fact FACT-STARTER-COOKIE-LEVEL cites historical Kakao Source Record SRC-CLASSIC-OBS-001.",
  );
});
