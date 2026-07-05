export type SourceStatus =
  | "official_classic"
  | "verified_classic"
  | "historical_kakao"
  | "community_lead";

export type EntityType = "Cookie" | "Pet" | "Treasure" | "Combination";
export type GuideGoal = "early_progression" | "score_improvement" | "coins" | "event_utility";
export type ResourceState = "coin_limited" | "one_upgrade" | "crystals_uncertain";
export type TranslationLanguage = "thai" | "english" | "korean" | "historical";
export type ChecklistExpiryStatus =
  | "active"
  | "check_expiration"
  | "no_expiry_listed"
  | "needs_review";
export type TrustPolicySurfaceKind =
  | "non_affiliation"
  | "source_review"
  | "no_account_coupon_intake"
  | "no_monetization"
  | "safe_share_wording";
export type LaunchLoopMode = "manual_repo_owned";
export type LaunchSignalKind =
  | "repeat_usage"
  | "correction_reports"
  | "source_safe_feedback"
  | "stale_claims"
  | "maintenance_burden";

export interface SourceRecord {
  id: string;
  label: string;
  status: SourceStatus;
  owner: string;
  observedAt: string;
  note: string;
}

export interface PlayerDataFact {
  id: string;
  entityType: EntityType;
  thaiName: string;
  globalName: string;
  translations: TranslationRecord[];
  field: string;
  value: string;
  status: SourceStatus;
  sourceIds: string[];
}

export interface TranslationRecord {
  language: TranslationLanguage;
  value: string;
  note: string;
}

export interface GuideOption<TValue extends string> {
  value: TValue;
  label: string;
  helper: string;
}

export interface PlayerGuideRecommendation {
  id: string;
  goal: GuideGoal;
  resourceState: ResourceState;
  recommendation: string;
  target: {
    type: EntityType;
    name: string;
  };
  shortReason: string;
  levelCostContext: string;
  caution: string;
  drivingFactIds: string[];
}

export interface PlayerGuide {
  id: string;
  playerJob: string;
  lastReviewed: string;
  defaultGoal: GuideGoal;
  defaultResourceState: ResourceState;
  recommendations: PlayerGuideRecommendation[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: SourceStatus;
  context: string;
  officialUrl: string;
  actionLabel: string;
  lastReviewed: string;
  expiryStatus: ChecklistExpiryStatus;
  sourceIds: string[];
}

export interface TrustPolicySurface {
  id: string;
  kind: TrustPolicySurfaceKind;
  title: string;
  publicLabel: string;
  body: string;
  sourceIds: string[];
}

export interface WeekOneLaunchSignal {
  id: string;
  kind: LaunchSignalKind;
  label: string;
  question: string;
  manualEvidence: string;
  actionThreshold: string;
}

export interface WeekOneLaunchLoop {
  id: string;
  title: string;
  reviewWindow: string;
  mode: LaunchLoopMode;
  repoRecordPath: string;
  analyticsSdkAllowed: boolean;
  signals: WeekOneLaunchSignal[];
}

export const statusLabels: Record<SourceStatus, string> = {
  official_classic: "official Classic",
  verified_classic: "player-verified Classic",
  historical_kakao: "historical Kakao",
  community_lead: "community lead",
};

export const sourceStatuses: SourceStatus[] = [
  "official_classic",
  "verified_classic",
  "historical_kakao",
  "community_lead",
];

export const recommendationDrivingSourceStatuses: SourceStatus[] = [
  "official_classic",
  "verified_classic",
];

export const translationLanguageLabels: Record<TranslationLanguage, string> = {
  thai: "Thai",
  english: "English",
  korean: "Korean",
  historical: "Historical name",
};

export const translationLanguages: TranslationLanguage[] = [
  "thai",
  "english",
  "korean",
  "historical",
];

export const checklistExpiryStatuses: ChecklistExpiryStatus[] = [
  "active",
  "check_expiration",
  "no_expiry_listed",
  "needs_review",
];

export const checklistExpiryLabels: Record<ChecklistExpiryStatus, string> = {
  active: "active",
  check_expiration: "check official expiry",
  no_expiry_listed: "no expiry listed",
  needs_review: "needs review",
};

export const trustPolicySurfaceKinds: TrustPolicySurfaceKind[] = [
  "non_affiliation",
  "source_review",
  "no_account_coupon_intake",
  "no_monetization",
  "safe_share_wording",
];

export const launchLoopModes: LaunchLoopMode[] = ["manual_repo_owned"];

export const launchSignalKinds: LaunchSignalKind[] = [
  "repeat_usage",
  "correction_reports",
  "source_safe_feedback",
  "stale_claims",
  "maintenance_burden",
];

export interface GuideDataSet {
  sourceRecords: SourceRecord[];
  playerDataFacts: PlayerDataFact[];
  playerGuide: PlayerGuide;
  checklist: ChecklistItem[];
  trustPolicySurfaces: TrustPolicySurface[];
  weekOneLaunchLoop: WeekOneLaunchLoop;
}

export interface GuideDataValidationResult {
  valid: boolean;
  errors: string[];
}

function sourceStatusLabel(status: string): string {
  return statusLabels[status as SourceStatus] ?? status;
}

function isSourceStatus(status: string): status is SourceStatus {
  return sourceStatuses.includes(status as SourceStatus);
}

function isTranslationLanguage(language: string): language is TranslationLanguage {
  return translationLanguages.includes(language as TranslationLanguage);
}

function isChecklistExpiryStatus(status: string): status is ChecklistExpiryStatus {
  return checklistExpiryStatuses.includes(status as ChecklistExpiryStatus);
}

function isTrustPolicySurfaceKind(kind: string): kind is TrustPolicySurfaceKind {
  return trustPolicySurfaceKinds.includes(kind as TrustPolicySurfaceKind);
}

function isLaunchLoopMode(mode: string): mode is LaunchLoopMode {
  return launchLoopModes.includes(mode as LaunchLoopMode);
}

function isLaunchSignalKind(kind: string): kind is LaunchSignalKind {
  return launchSignalKinds.includes(kind as LaunchSignalKind);
}

function canDriveRecommendation(status: string): boolean {
  return recommendationDrivingSourceStatuses.includes(status as SourceStatus);
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export const guideGoalOptions: GuideOption<GuideGoal>[] = [
  {
    value: "early_progression",
    label: "ผ่านช่วงต้นเกม",
    helper: "เน้นใช้ของที่มีอยู่ให้ไปต่อได้ไว",
  },
  {
    value: "coins",
    label: "เก็บเหรียญ",
    helper: "เน้นลดการใช้ทรัพยากรก่อนรู้ทางที่คุ้ม",
  },
  {
    value: "score_improvement",
    label: "ทำคะแนนดีขึ้น",
    helper: "เน้นจุดอัปเดียวที่ส่งผลกับ run วันนี้",
  },
  {
    value: "event_utility",
    label: "เช็ก Event วันนี้",
    helper: "เน้นความปลอดภัยของลิงก์และเงื่อนไขปัจจุบัน",
  },
];

export const resourceStateOptions: GuideOption<ResourceState>[] = [
  {
    value: "coin_limited",
    label: "มีเหรียญจำกัด",
    helper: "หลีกเลี่ยงตัวเลือกที่ต้องเริ่มลงทุนใหม่",
  },
  {
    value: "one_upgrade",
    label: "อัปได้ 1 อย่างวันนี้",
    helper: "เลือกจุดอัปที่มีผลกับคำแนะนำมากที่สุด",
  },
  {
    value: "crystals_uncertain",
    label: "มีคริสตัลแต่ยังไม่มั่นใจ",
    helper: "ยังไม่ใช้คริสตัลกับข้อมูลที่เป็น lead",
  },
];

export const sourceRecords: SourceRecord[] = [
  {
    id: "SRC-CLASSIC-OBS-001",
    label: "Classic launch observation packet",
    status: "verified_classic",
    owner: "ClassicRunDex player observation",
    observedAt: "2026-07-04",
    note: "Fact-level notes from current Cookie Run Classic play. Original ClassicRunDex wording only.",
  },
  {
    id: "SRC-CLASSIC-OFFICIAL-001",
    label: "Official Classic support surface",
    status: "official_classic",
    owner: "Devsisters official surface",
    observedAt: "2026-07-04",
    note: "Used only for non-affiliation wording and official-link cues, not copied guide prose.",
  },
  {
    id: "SRC-CLASSIC-SUPPORT-001",
    label: "CookieRun Classic help center",
    status: "official_classic",
    owner: "Devsisters support surface",
    observedAt: "2026-07-05",
    note: "Official help center used for support, coupon instructions, and community-link checks.",
  },
  {
    id: "SRC-CLASSIC-COUPON-001",
    label: "CookieRun Classic DevPlay coupon redemption",
    status: "official_classic",
    owner: "Devsisters DevPlay coupon surface",
    observedAt: "2026-07-05",
    note: "Official Classic coupon redemption page; ClassicRunDex does not collect coupon codes or account identifiers.",
  },
  {
    id: "SRC-CLASSIC-GPLAY-GRAND-OPEN-001",
    label: "CookieRun Classic Grand Open Google Play event",
    status: "official_classic",
    owner: "Devsisters Corporation on Google Play",
    observedAt: "2026-07-05",
    note: "Official store event surface used for launch-week reward and beginner-event context.",
  },
  {
    id: "SRC-CLASSIC-GPLAY-LAUNCH-GIFTS-001",
    label: "CookieRun Classic Launch gifts Google Play event",
    status: "official_classic",
    owner: "Devsisters Corporation on Google Play",
    observedAt: "2026-07-05",
    note: "Official store event surface used for launch-gift context; expiry must still be checked on the official surface.",
  },
  {
    id: "SRC-KAKAO-HIST-001",
    label: "Cookie Run Kakao historical memory",
    status: "historical_kakao",
    owner: "Historical player recollection",
    observedAt: "2026-07-04",
    note: "Kept as context until verified against Cookie Run Classic.",
  },
  {
    id: "SRC-COMMUNITY-LEAD-001",
    label: "Thai community question lead",
    status: "community_lead",
    owner: "Community report lane",
    observedAt: "2026-07-04",
    note: "Can suggest what to check next, but cannot drive the recommendation.",
  },
];

export const playerDataFacts: PlayerDataFact[] = [
  {
    id: "FACT-STARTER-COOKIE-LEVEL",
    entityType: "Cookie",
    thaiName: "คุกกี้ตัวหลักที่มีเลเวลสูงสุด",
    globalName: "Highest-level owned Cookie",
    translations: [
      {
        language: "thai",
        value: "คุกกี้ตัวหลัก",
        note: "Thai guide wording",
      },
      {
        language: "english",
        value: "main runner",
        note: "English alias",
      },
      {
        language: "korean",
        value: "쿠키",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "LINE starter cookie",
        note: "Returning-player memory cue",
      },
    ],
    field: "Level",
    value: "ใช้ตัวที่ผู้เล่นอัปไว้แล้วก่อน เพื่อไม่เริ่มต้นใช้เหรียญซ้ำ",
    status: "verified_classic",
    sourceIds: ["SRC-CLASSIC-OBS-001"],
  },
  {
    id: "FACT-STARTER-PET-PAIR",
    entityType: "Pet",
    thaiName: "Pet ที่มีผลจับคู่ยืนยันใน Classic",
    globalName: "Verified Classic Pet pair",
    translations: [
      {
        language: "thai",
        value: "สัตว์เลี้ยงคู่หลัก",
        note: "Thai player shorthand",
      },
      {
        language: "english",
        value: "pet pair",
        note: "English alias",
      },
      {
        language: "korean",
        value: "펫",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "Kakao pet pair",
        note: "Historical memory cue",
      },
    ],
    field: "Combination",
    value: "เลือก Pet ที่ Source Record ระบุว่าเห็นผลใน Cookie Run Classic แล้ว",
    status: "verified_classic",
    sourceIds: ["SRC-CLASSIC-OBS-001"],
  },
  {
    id: "FACT-COST-CAUTION",
    entityType: "Treasure",
    thaiName: "Treasure ที่ยังเป็นแค่ lead",
    globalName: "Unverified Treasure lead",
    translations: [
      {
        language: "thai",
        value: "สมบัติที่ยังไม่ยืนยัน",
        note: "Thai guide wording",
      },
      {
        language: "english",
        value: "treasure lead",
        note: "English alias",
      },
      {
        language: "korean",
        value: "보물",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "Kakao treasure",
        note: "Historical memory cue",
      },
    ],
    field: "Cost",
    value: "พักการใช้เหรียญหรือคริสตัลหนักจนกว่าจะมี Source Record แบบ Classic",
    status: "community_lead",
    sourceIds: ["SRC-COMMUNITY-LEAD-001"],
  },
  {
    id: "FACT-ONE-UPGRADE-FOCUS",
    entityType: "Combination",
    thaiName: "จุดอัปเกรดเดียวที่ตรวจแล้ว",
    globalName: "Verified one-upgrade focus",
    translations: [
      {
        language: "thai",
        value: "อัปหนึ่งอย่าง",
        note: "Thai guide wording",
      },
      {
        language: "english",
        value: "one upgrade",
        note: "English alias",
      },
      {
        language: "korean",
        value: "조합",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "Combi",
        note: "Historical player shorthand",
      },
    ],
    field: "Cost",
    value: "เมื่ออัปได้ 1 อย่าง ให้ลงกับ Cookie หรือ Pet ใน Combination ที่ยืนยันใน Classic แล้วก่อน",
    status: "verified_classic",
    sourceIds: ["SRC-CLASSIC-OBS-001"],
  },
  {
    id: "FACT-CRYSTAL-HOLD",
    entityType: "Treasure",
    thaiName: "คริสตัลกับ Treasure lead",
    globalName: "Crystal spend caution",
    translations: [
      {
        language: "thai",
        value: "คริสตัล",
        note: "Thai resource wording",
      },
      {
        language: "english",
        value: "crystal spend",
        note: "English alias",
      },
      {
        language: "korean",
        value: "크리스탈",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "crystal hold",
        note: "Returning-player memory cue",
      },
    ],
    field: "Cost",
    value: "ยังไม่ใช้คริสตัลกับ Treasure หรือคำแนะนำที่มีแค่ community lead",
    status: "verified_classic",
    sourceIds: ["SRC-CLASSIC-OBS-001"],
  },
  {
    id: "FACT-EVENT-OFFICIAL-LINK",
    entityType: "Combination",
    thaiName: "Event และ invite ต้องเริ่มจาก official surface",
    globalName: "Official event path",
    translations: [
      {
        language: "thai",
        value: "กิจกรรมและชวนเพื่อน",
        note: "Thai checklist wording",
      },
      {
        language: "english",
        value: "event invite",
        note: "English alias",
      },
      {
        language: "korean",
        value: "이벤트",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "invite code",
        note: "Historical/community shorthand",
      },
    ],
    field: "Episode",
    value: "ตรวจ code, event, invite ผ่านลิงก์ official/support ที่ระบุชัด ไม่ส่งข้อมูลบัญชีให้ ClassicRunDex",
    status: "official_classic",
    sourceIds: ["SRC-CLASSIC-OFFICIAL-001"],
  },
  {
    id: "FACT-KAKAO-SEPARATION",
    entityType: "Combination",
    thaiName: "ข้อมูลจาก Cookie Run Kakao",
    globalName: "Historical Kakao combination memory",
    translations: [
      {
        language: "thai",
        value: "คาเคา",
        note: "Thai historical shorthand",
      },
      {
        language: "english",
        value: "Kakao memory",
        note: "English alias",
      },
      {
        language: "korean",
        value: "카카오",
        note: "Korean search cue only",
      },
      {
        language: "historical",
        value: "LINE/Kakao memory",
        note: "Returning-player memory cue",
      },
    ],
    field: "Classic-vs-Kakao Difference",
    value: "ใช้เป็นสิ่งที่ควรตรวจ ไม่ใช้เป็นความจริงของ Classic",
    status: "historical_kakao",
    sourceIds: ["SRC-KAKAO-HIST-001"],
  },
];

export const playerGuide: PlayerGuide = {
  id: "GUIDE-RETURNING-THAI-STARTER",
  playerJob: "วันนี้ควรใช้อะไรหรืออัปเกรดอะไรต่อ?",
  lastReviewed: "4 กรกฎาคม 2026",
  defaultGoal: "early_progression",
  defaultResourceState: "coin_limited",
  recommendations: [
    {
      id: "REC-EARLY-COIN-LIMITED",
      goal: "early_progression",
      resourceState: "coin_limited",
      recommendation: "อัปคุกกี้ตัวหลักก่อน แล้วจับคู่กับ Pet ที่ยืนยันใน Classic แล้ว",
      target: {
        type: "Combination",
        name: "คุกกี้เลเวลสูงสุด + Pet ที่มี Source Record แบบ Classic",
      },
      shortReason:
        "เพราะเป้าหมายคือผ่านช่วงต้นเกมและมีเหรียญจำกัด จึงเลือกทางที่ใช้ Level ที่บัญชีมีอยู่แล้วแทนการเริ่มลงทุนใหม่",
      levelCostContext:
        "Level: ใช้คุกกี้ที่เลเวลสูงสุดในบัญชีเป็นฐาน. Cost: เลี่ยง Treasure หรือข้อมูล Kakao ที่ยังไม่มีหลักฐาน Classic พอสำหรับคำแนะนำ",
      caution:
        "ถ้าเป้าหมายคือทำคะแนนสูงสุดหรือ Event เฉพาะทาง ให้รอ Source Record เพิ่มก่อนใช้ทรัพยากรหนัก",
      drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL", "FACT-STARTER-PET-PAIR"],
    },
    {
      id: "REC-SCORE-ONE-UPGRADE",
      goal: "score_improvement",
      resourceState: "one_upgrade",
      recommendation: "อัปแค่จุดเดียวใน Combination ที่ยืนยันแล้ว",
      target: {
        type: "Combination",
        name: "คุกกี้เลเวลสูงสุด + Pet ที่เห็นผลใน Cookie Run Classic",
      },
      shortReason:
        "เพราะเป้าหมายคือทำคะแนนดีขึ้นและอัปได้ 1 อย่างวันนี้ ให้เลือกจุดที่ผูกกับ Combination ที่มี Source Record แล้ว ไม่แตกทรัพยากรไป Treasure lead",
      levelCostContext:
        "Level: ถ้าคุกกี้หลักนำ Pet อยู่หลายเลเวล ให้รักษาคุกกี้เป็นตัวหลักก่อน. Cost: จำกัดการใช้เหรียญไว้ที่หนึ่ง upgrade ที่ตรวจผลได้",
      caution:
        "ยังไม่ใช้ historical Kakao หรือ community lead เป็นเหตุผลอัป Treasure เพื่อคะแนน",
      drivingFactIds: [
        "FACT-STARTER-COOKIE-LEVEL",
        "FACT-STARTER-PET-PAIR",
        "FACT-ONE-UPGRADE-FOCUS",
      ],
    },
    {
      id: "REC-COINS-CRYSTALS-UNCERTAIN",
      goal: "coins",
      resourceState: "crystals_uncertain",
      recommendation: "เก็บคริสตัลไว้ก่อน แล้วฟาร์มด้วยคู่ที่มีอยู่และยืนยันใน Classic",
      target: {
        type: "Combination",
        name: "คุกกี้เลเวลสูงสุด + Pet verified Classic แบบไม่ต้องซื้อของใหม่",
      },
      shortReason:
        "เพราะเป้าหมายคือเก็บเหรียญและมีคริสตัลแต่ยังไม่มั่นใจ จึงเลือกทางที่ไม่ต้องซื้อของใหม่และไม่ผูกกับ Treasure lead",
      levelCostContext:
        "Level: ใช้ Level เดิมเพื่อให้ run สม่ำเสมอก่อน. Cost: ถือคริสตัลไว้จนกว่ามี Source Record แบบ official หรือ player-verified Classic",
      caution:
        "ถ้ามี code หรือ event ที่ให้ทรัพยากร ควรเช็กจาก official surface ก่อนตัดสินใจใช้คริสตัล",
      drivingFactIds: [
        "FACT-STARTER-COOKIE-LEVEL",
        "FACT-STARTER-PET-PAIR",
        "FACT-CRYSTAL-HOLD",
      ],
    },
    {
      id: "REC-EVENT-ONE-UPGRADE",
      goal: "event_utility",
      resourceState: "one_upgrade",
      recommendation: "เช็ก official event path ก่อน แล้วค่อยอัปหนึ่งอย่างที่ใช้ได้ทันที",
      target: {
        type: "Combination",
        name: "official event/support surface + Combination verified Classic",
      },
      shortReason:
        "เพราะเป้าหมายคือเช็ก Event วันนี้และอัปได้ 1 อย่าง คำตอบต้องเริ่มจากลิงก์ official แล้วเลือกอัปเฉพาะสิ่งที่ใช้กับ run หรือ checklist ตอนนี้",
      levelCostContext:
        "Level: อย่าเปลี่ยนตัวหลักถ้า event ไม่ได้บังคับ. Cost: ใช้หนึ่ง upgrade หลังตรวจวันหมดอายุหรือเงื่อนไข event แล้ว",
      caution:
        "ClassicRunDex ไม่รับ code หรือข้อมูลบัญชี และไม่สวมรอยเป็นบริการ official",
      drivingFactIds: [
        "FACT-EVENT-OFFICIAL-LINK",
        "FACT-STARTER-COOKIE-LEVEL",
        "FACT-ONE-UPGRADE-FOCUS",
      ],
    },
  ],
};

export const checklist: ChecklistItem[] = [
  {
    id: "CHECK-CLASSIC-COUPON",
    title: "กรอก Coupon ที่ DevPlay Classic เท่านั้น",
    status: "official_classic",
    context:
      "เปิดหน้า coupon official เองและตรวจวันหมดอายุของโค้ดก่อนกรอก ClassicRunDex ไม่รับโค้ดหรือ DevPlay account",
    officialUrl: "https://coupon.devplay.com/coupon/crg/en",
    actionLabel: "เปิดหน้า coupon official",
    lastReviewed: "2026-07-05",
    expiryStatus: "check_expiration",
    sourceIds: ["SRC-CLASSIC-COUPON-001", "SRC-CLASSIC-SUPPORT-001"],
  },
  {
    id: "CHECK-LAUNCH-GIFTS",
    title: "เช็ก Launch gifts ก่อนใช้คริสตัล",
    status: "official_classic",
    context:
      "ใช้ official event surface เพื่อยืนยันของรางวัล launch-week ก่อนตัดสินใจใช้ทรัพยากรหนัก",
    officialUrl: "https://play.google.com/store/apps/eventdetails/4832236980895547585",
    actionLabel: "ดู Launch gifts official",
    lastReviewed: "2026-07-05",
    expiryStatus: "no_expiry_listed",
    sourceIds: ["SRC-CLASSIC-GPLAY-LAUNCH-GIFTS-001"],
  },
  {
    id: "CHECK-GRAND-OPEN-INVITE",
    title: "ตรวจ invite/community claim จาก official surface ก่อนแชร์",
    status: "official_classic",
    context:
      "ถ้าเห็น invite, community, หรือ beginner reward claim ให้เริ่มจาก support/community official ก่อน ไม่ใช้ ClassicRunDex เป็นบริการ invite",
    officialUrl: "https://cs-cookierunclassic.devsisters.com/hc/en-us",
    actionLabel: "เปิด Support / Community official",
    lastReviewed: "2026-07-05",
    expiryStatus: "needs_review",
    sourceIds: ["SRC-CLASSIC-SUPPORT-001", "SRC-CLASSIC-GPLAY-GRAND-OPEN-001"],
  },
];

export const trustPolicySurfaces: TrustPolicySurface[] = [
  {
    id: "TRUST-NON-AFFILIATION",
    kind: "non_affiliation",
    title: "Unofficial source-reviewed guide",
    publicLabel: "ไม่ใช่บริการ official",
    body:
      "ClassicRunDex ไม่ใช่บริการ official ของ Devsisters และชี้ผู้เล่นไปยัง official support, coupon, หรือ event surface เมื่อเป็นเรื่องบัญชีหรือบริการเกม",
    sourceIds: ["SRC-CLASSIC-OFFICIAL-001", "SRC-CLASSIC-SUPPORT-001"],
  },
  {
    id: "TRUST-SOURCE-REVIEW",
    kind: "source_review",
    title: "Recommendation ต้องผ่าน Source Record",
    publicLabel: "คำแนะนำใช้เฉพาะ official/verified Classic",
    body:
      "Player Guide ใช้ official Classic หรือ player-verified Classic เท่านั้น ส่วน Kakao และ community lead อยู่เป็นบริบทจนกว่าจะตรวจแล้ว",
    sourceIds: ["SRC-CLASSIC-OBS-001", "SRC-CLASSIC-OFFICIAL-001"],
  },
  {
    id: "TRUST-NO-ACCOUNT-COUPON",
    kind: "no_account_coupon_intake",
    title: "ไม่รับโค้ด บัญชี หรือ invite-service",
    publicLabel: "เปิดลิงก์ official เอง",
    body:
      "ClassicRunDex ไม่เก็บ DevPlay account, coupon code, invite request, หรือข้อมูลส่วนตัว และไม่มีช่องให้ส่งข้อมูลเหล่านี้ในแอป",
    sourceIds: ["SRC-CLASSIC-COUPON-001", "SRC-CLASSIC-SUPPORT-001"],
  },
  {
    id: "TRUST-NO-MONETIZATION",
    kind: "no_monetization",
    title: "ไม่มี affiliate, boost, account sale, หรือ paid invite",
    publicLabel: "ไม่ monetized",
    body:
      "ลิงก์ checklist เป็นลิงก์ official/context เท่านั้น ไม่มี affiliate redirect, บริการรับจ้างเล่น, ซื้อขายบัญชี, หรือ paid invite",
    sourceIds: ["SRC-CLASSIC-OFFICIAL-001"],
  },
  {
    id: "TRUST-SAFE-SHARE",
    kind: "safe_share_wording",
    title: "แชร์เป็น unofficial source-reviewed guide เท่านั้น",
    publicLabel: "คำแชร์ต้องไม่สวมรอย official",
    body:
      "เมื่อแชร์ ClassicRunDex ให้เรียกว่า unofficial source-reviewed guide ไม่ใช่ support, coupon service, invite hub, หรือ official wiki",
    sourceIds: ["SRC-CLASSIC-OFFICIAL-001"],
  },
];

export const weekOneLaunchLoop: WeekOneLaunchLoop = {
  id: "LOOP-WEEK-ONE-LAUNCH",
  title: "Manual week-one launch loop",
  reviewWindow: "2026-07-05 through 2026-07-11",
  mode: "manual_repo_owned",
  repoRecordPath: "docs/week-one-launch-loop.md",
  analyticsSdkAllowed: false,
  signals: [
    {
      id: "SIGNAL-REPEAT-USAGE",
      kind: "repeat_usage",
      label: "Repeat usage",
      question: "ผู้เล่นกลับมาดู Player Guide, Checklist, หรือ Source Record เดิมซ้ำหรือไม่",
      manualEvidence: "GitHub comments, community replies, or maintainer notes in docs/week-one-launch-loop.md",
      actionThreshold: "ถ้าซ้ำที่คำถามเดิม ให้ทำคำตอบนั้นให้ชัดขึ้นก่อนเพิ่ม scope",
    },
    {
      id: "SIGNAL-CORRECTION-REPORTS",
      kind: "correction_reports",
      label: "Correction reports",
      question: "มีรายงาน Player Data, Translation, checklist, หรือ Classic-vs-Kakao Difference ที่ควรแก้หรือไม่",
      manualEvidence: "GitHub Source-first data report issues",
      actionThreshold: "แปลงรายงานที่ปลอดภัยเป็น Contribution Claim หรือ Contribution Packet",
    },
    {
      id: "SIGNAL-SOURCE-SAFE-FEEDBACK",
      kind: "source_safe_feedback",
      label: "Source-safe feedback",
      question: "feedback ผ่าน source safety โดยไม่ส่ง copied/prohibited material หรือไม่",
      manualEvidence: "Issue template safety confirmations and reviewer notes",
      actionThreshold: "ถ้า feedback ไม่ปลอดภัย ให้ปิดหรือขอข้อมูลใหม่แทนการ normalize เป็น Player Data",
    },
    {
      id: "SIGNAL-STALE-CLAIMS",
      kind: "stale_claims",
      label: "Stale claims",
      question: "มี event, invite, coupon, หรือ community lead ที่หมดอายุหรือคลุมเครือหรือไม่",
      manualEvidence: "Launch Checklist review notes and official surface checks",
      actionThreshold: "ลดสถานะเป็น needs review หรือ community lead จนกว่าจะตรวจ official surface แล้ว",
    },
    {
      id: "SIGNAL-MAINTENANCE-BURDEN",
      kind: "maintenance_burden",
      label: "Maintenance burden",
      question: "งาน review/source check ยังพอทำได้ใน maintainer pass สั้น ๆ ทุกวันหรือไม่",
      manualEvidence: "Daily log notes and unresolved issue count",
      actionThreshold: "ถ้างานหนักเกิน ให้ freeze scope และแก้เฉพาะ Source Record/checklist ที่เสี่ยง",
    },
  ],
};

interface RecommendationSeed {
  recommendation: string;
  target: PlayerGuideRecommendation["target"];
  shortReason: string;
  levelCostContext: string;
  caution: string;
  drivingFactIds: string[];
}

interface ResourceRecommendationSeed {
  shortReason: string;
  levelCostContext: string;
  caution: string;
  drivingFactIds: string[];
}

const goalRecommendationSeeds: Record<GuideGoal, RecommendationSeed> = {
  early_progression: {
    recommendation: "อัปคุกกี้ตัวหลักก่อน แล้วจับคู่กับ Pet ที่ยืนยันใน Classic แล้ว",
    target: {
      type: "Combination",
      name: "คุกกี้เลเวลสูงสุด + Pet ที่มี Source Record แบบ Classic",
    },
    shortReason: "เลือกทางที่ใช้ของที่บัญชีมีอยู่แล้วเพื่อผ่านช่วงต้นเกมโดยไม่เริ่มลงทุนใหม่",
    levelCostContext: "Level: ใช้คุกกี้ที่เลเวลสูงสุดในบัญชีเป็นฐาน",
    caution: "ถ้าจะเปลี่ยนไปสายคะแนนหรือ Event เฉพาะทาง ให้รอ Source Record เพิ่มก่อน",
    drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL", "FACT-STARTER-PET-PAIR"],
  },
  score_improvement: {
    recommendation: "เพิ่มคะแนนจาก Combination ที่ยืนยันแล้วก่อนแตะ Treasure lead",
    target: {
      type: "Combination",
      name: "คุกกี้เลเวลสูงสุด + Pet ที่เห็นผลใน Cookie Run Classic",
    },
    shortReason:
      "เลือกจุดที่ผูกกับ Combination ที่มี Source Record แล้ว ไม่แตกทรัพยากรไป Treasure lead",
    levelCostContext: "Level: ถ้าคุกกี้หลักนำ Pet อยู่หลายเลเวล ให้รักษาคุกกี้เป็นตัวหลักก่อน",
    caution: "ยังไม่ใช้ historical Kakao หรือ community lead เป็นเหตุผลอัป Treasure เพื่อคะแนน",
    drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL", "FACT-STARTER-PET-PAIR"],
  },
  coins: {
    recommendation: "ฟาร์มเหรียญด้วยคู่ที่มีอยู่และยืนยันใน Classic",
    target: {
      type: "Combination",
      name: "คุกกี้เลเวลสูงสุด + Pet verified Classic แบบไม่ต้องซื้อของใหม่",
    },
    shortReason: "เลือกทางที่ไม่ต้องซื้อของใหม่และทำให้ run สม่ำเสมอก่อน",
    levelCostContext: "Level: ใช้ Level เดิมเพื่อให้ run คาดเดาได้",
    caution: "ถ้ามี code หรือ event ที่ให้ทรัพยากร ควรเช็กจาก official surface ก่อน",
    drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL", "FACT-STARTER-PET-PAIR"],
  },
  event_utility: {
    recommendation: "เช็ก official event path ก่อน แล้วค่อยเลือกของที่ใช้ได้ทันที",
    target: {
      type: "Combination",
      name: "official event/support surface + Combination verified Classic",
    },
    shortReason:
      "คำตอบต้องเริ่มจากลิงก์ official แล้วเลือกอัปเฉพาะสิ่งที่ใช้กับ run หรือ checklist ตอนนี้",
    levelCostContext: "Level: อย่าเปลี่ยนตัวหลักถ้า event ไม่ได้บังคับ",
    caution: "ClassicRunDex ไม่รับ code หรือข้อมูลบัญชี และไม่สวมรอยเป็นบริการ official",
    drivingFactIds: ["FACT-EVENT-OFFICIAL-LINK", "FACT-STARTER-COOKIE-LEVEL"],
  },
};

const resourceRecommendationSeeds: Record<ResourceState, ResourceRecommendationSeed> = {
  coin_limited: {
    shortReason: "เพราะมีเหรียญจำกัด จึงหลีกเลี่ยงตัวเลือกที่ต้องเริ่มลงทุนใหม่",
    levelCostContext: "Cost: ใช้ทรัพยากรกับสิ่งที่มี Source Record แบบ Classic แล้ว",
    caution: "พัก Treasure หรือข้อมูล Kakao ที่ยังไม่มีหลักฐาน Classic พอสำหรับคำแนะนำ",
    drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL"],
  },
  one_upgrade: {
    shortReason: "เพราะอัปได้ 1 อย่างวันนี้ จึงเลือกจุดเดียวที่ตรวจผลได้",
    levelCostContext: "Cost: จำกัดการใช้เหรียญไว้ที่หนึ่ง upgrade ที่ผูกกับ Combination ยืนยันแล้ว",
    caution: "อย่าแยกทรัพยากรไปหลายจุดก่อนรู้ว่าจุดใดกระทบ run วันนี้",
    drivingFactIds: ["FACT-ONE-UPGRADE-FOCUS"],
  },
  crystals_uncertain: {
    shortReason: "เพราะมีคริสตัลแต่ยังไม่มั่นใจ จึงยังไม่ใช้คริสตัลกับ lead ที่ยังไม่ verify",
    levelCostContext:
      "Cost: ถือคริสตัลไว้จนกว่ามี Source Record แบบ official หรือ player-verified Classic",
    caution: "ยังไม่ใช้คริสตัลกับ Treasure หรือคำแนะนำที่มีแค่ community lead",
    drivingFactIds: ["FACT-CRYSTAL-HOLD"],
  },
};

function uniqueFactIds(factIds: string[]): string[] {
  return [...new Set(factIds)];
}

function normalizeLookupText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function getFactLookupTerms(fact: PlayerDataFact): string[] {
  return [
    fact.id,
    fact.entityType,
    fact.thaiName,
    fact.globalName,
    fact.field,
    fact.value,
    statusLabels[fact.status],
    ...fact.translations.flatMap((translation) => [
      translation.language,
      translation.value,
      translation.note,
    ]),
  ];
}

export function searchPlayerDataFacts(
  query: string,
  facts: PlayerDataFact[] = playerDataFacts,
): PlayerDataFact[] {
  const normalizedQuery = normalizeLookupText(query);

  if (!normalizedQuery) {
    return facts;
  }

  return facts.filter((fact) =>
    getFactLookupTerms(fact).some((term) =>
      normalizeLookupText(term).includes(normalizedQuery),
    ),
  );
}

export function getSourcesForFact(fact: PlayerDataFact): SourceRecord[] {
  return fact.sourceIds.map((sourceId) => {
    const source = sourceRecords.find((sourceRecord) => sourceRecord.id === sourceId);

    if (!source) {
      throw new Error(`Player Data fact ${fact.id} references unknown Source Record ${sourceId}.`);
    }

    return source;
  });
}

export function getGuideGoalOption(goal: GuideGoal): GuideOption<GuideGoal> {
  return guideGoalOptions.find((option) => option.value === goal) ?? guideGoalOptions[0];
}

export function getResourceStateOption(
  resourceState: ResourceState,
): GuideOption<ResourceState> {
  return (
    resourceStateOptions.find((option) => option.value === resourceState) ??
    resourceStateOptions[0]
  );
}

function getGuideRecommendationFromGuide(
  guide: PlayerGuide,
  goal: GuideGoal,
  resourceState: ResourceState,
): PlayerGuideRecommendation {
  const exactRecommendation = guide.recommendations.find(
    (recommendation) =>
      recommendation.goal === goal && recommendation.resourceState === resourceState,
  );

  if (exactRecommendation) {
    return exactRecommendation;
  }

  const goalOption = getGuideGoalOption(goal);
  const resourceOption = getResourceStateOption(resourceState);
  const goalSeed = goalRecommendationSeeds[goal];
  const resourceSeed = resourceRecommendationSeeds[resourceState];

  return {
    id: `REC-${goal}-${resourceState}`,
    goal,
    resourceState,
    recommendation: goalSeed.recommendation,
    target: goalSeed.target,
    shortReason: `เพราะเป้าหมายคือ${goalOption.label}และ${resourceOption.label} ${goalSeed.shortReason} ${resourceSeed.shortReason}`,
    levelCostContext: `${goalSeed.levelCostContext}. ${resourceSeed.levelCostContext}`,
    caution: `${resourceSeed.caution} ${goalSeed.caution}`,
    drivingFactIds: uniqueFactIds([
      ...goalSeed.drivingFactIds,
      ...resourceSeed.drivingFactIds,
    ]),
  };
}

export function getGuideRecommendation(
  goal: GuideGoal,
  resourceState: ResourceState,
): PlayerGuideRecommendation {
  return getGuideRecommendationFromGuide(playerGuide, goal, resourceState);
}

function getGuideRecommendationsForValidation(guide: PlayerGuide): PlayerGuideRecommendation[] {
  const recommendationsByState = new Map<string, PlayerGuideRecommendation>();

  guideGoalOptions.forEach((goalOption) => {
    resourceStateOptions.forEach((resourceOption) => {
      const recommendation = getGuideRecommendationFromGuide(
        guide,
        goalOption.value,
        resourceOption.value,
      );

      recommendationsByState.set(
        `${recommendation.goal}:${recommendation.resourceState}`,
        recommendation,
      );
    });
  });

  return [...recommendationsByState.values()];
}

export function getDrivingFacts(
  recommendation: PlayerGuideRecommendation,
): PlayerDataFact[] {
  return recommendation.drivingFactIds.map((factId) => {
    const fact = playerDataFacts.find((playerDataFact) => playerDataFact.id === factId);

    if (!fact) {
      throw new Error(
        `Player Guide recommendation ${recommendation.id} references unknown driving fact ${factId}.`,
      );
    }

    return fact;
  });
}

export function validatePlayerGuideData({
  sourceRecords,
  playerDataFacts,
  playerGuide,
  checklist,
  trustPolicySurfaces,
  weekOneLaunchLoop,
}: GuideDataSet): GuideDataValidationResult {
  const errors: string[] = [];
  const sourceRecordsById = new Map<string, SourceRecord>();
  const playerDataFactsById = new Map<string, PlayerDataFact>();
  const checklistItemsById = new Map<string, ChecklistItem>();
  const trustPolicySurfacesById = new Map<string, TrustPolicySurface>();

  sourceRecords.forEach((sourceRecord) => {
    if (sourceRecordsById.has(sourceRecord.id)) {
      errors.push(`Source Record ${sourceRecord.id} is duplicated.`);
    }

    sourceRecordsById.set(sourceRecord.id, sourceRecord);

    if (!isSourceStatus(sourceRecord.status)) {
      errors.push(
        `Source Record ${sourceRecord.id} uses unknown source status ${sourceRecord.status}.`,
      );
    }
  });

  playerDataFacts.forEach((fact) => {
    if (playerDataFactsById.has(fact.id)) {
      errors.push(`Player Data fact ${fact.id} is duplicated.`);
    }

    playerDataFactsById.set(fact.id, fact);

    if (!isSourceStatus(fact.status)) {
      errors.push(`Player Data fact ${fact.id} uses unknown source status ${fact.status}.`);
    }

    fact.translations.forEach((translation) => {
      if (!isTranslationLanguage(translation.language)) {
        errors.push(
          `Player Data fact ${fact.id} uses unknown Translation language ${translation.language}.`,
        );
      }

      if (!translation.value.trim()) {
        errors.push(`Player Data fact ${fact.id} has an empty Translation value.`);
      }
    });

    if (fact.sourceIds.length === 0) {
      errors.push(`Player Data fact ${fact.id} must reference at least one Source Record.`);
    }

    fact.sourceIds.forEach((sourceId) => {
      if (!sourceRecordsById.has(sourceId)) {
        errors.push(`Player Data fact ${fact.id} references unknown Source Record ${sourceId}.`);
      }
    });
  });

  getGuideRecommendationsForValidation(playerGuide).forEach((recommendation) => {
    if (recommendation.drivingFactIds.length === 0) {
      errors.push(
        `Player Guide recommendation ${recommendation.id} must reference at least one driving fact.`,
      );
    }

    recommendation.drivingFactIds.forEach((factId) => {
      const fact = playerDataFactsById.get(factId);

      if (!fact) {
        errors.push(
          `Player Guide recommendation ${recommendation.id} references unknown driving fact ${factId}.`,
        );
        return;
      }

      if (!canDriveRecommendation(fact.status)) {
        errors.push(
          `Player Guide recommendation ${recommendation.id} cannot be driven by ${sourceStatusLabel(
            fact.status,
          )} fact ${fact.id}.`,
        );
      }

      fact.sourceIds.forEach((sourceId) => {
        const sourceRecord = sourceRecordsById.get(sourceId);

        if (sourceRecord && !canDriveRecommendation(sourceRecord.status)) {
          errors.push(
            `Player Guide recommendation ${recommendation.id} fact ${fact.id} cites ${sourceStatusLabel(
              sourceRecord.status,
            )} Source Record ${sourceRecord.id}.`,
          );
        }
      });
    });
  });

  checklist.forEach((item) => {
    if (checklistItemsById.has(item.id)) {
      errors.push(`Launch Checklist item ${item.id} is duplicated.`);
    }

    checklistItemsById.set(item.id, item);

    if (!isSourceStatus(item.status)) {
      errors.push(`Launch Checklist item ${item.id} uses unknown source status ${item.status}.`);
    }

    if (!canDriveRecommendation(item.status)) {
      errors.push(
        `Launch Checklist item ${item.id} cannot use ${sourceStatusLabel(
          item.status,
        )} as its visible status.`,
      );
    }

    if (!isHttpsUrl(item.officialUrl)) {
      errors.push(`Launch Checklist item ${item.id} must use an HTTPS official URL.`);
    }

    if (!isIsoDate(item.lastReviewed)) {
      errors.push(`Launch Checklist item ${item.id} must use YYYY-MM-DD lastReviewed.`);
    }

    if (!isChecklistExpiryStatus(item.expiryStatus)) {
      errors.push(
        `Launch Checklist item ${item.id} uses unknown expiry status ${item.expiryStatus}.`,
      );
    }

    if (item.sourceIds.length === 0) {
      errors.push(`Launch Checklist item ${item.id} must reference at least one Source Record.`);
    }

    item.sourceIds.forEach((sourceId) => {
      const sourceRecord = sourceRecordsById.get(sourceId);

      if (!sourceRecord) {
        errors.push(`Launch Checklist item ${item.id} references unknown Source Record ${sourceId}.`);
        return;
      }

      if (!canDriveRecommendation(sourceRecord.status)) {
        errors.push(
          `Launch Checklist item ${item.id} cites ${sourceStatusLabel(
            sourceRecord.status,
          )} Source Record ${sourceRecord.id}.`,
        );
      }
    });
  });

  trustPolicySurfaces.forEach((surface) => {
    if (trustPolicySurfacesById.has(surface.id)) {
      errors.push(`Trust Policy Surface ${surface.id} is duplicated.`);
    }

    trustPolicySurfacesById.set(surface.id, surface);

    if (!isTrustPolicySurfaceKind(surface.kind)) {
      errors.push(`Trust Policy Surface ${surface.id} uses unknown kind ${surface.kind}.`);
    }

    if (!surface.title.trim()) {
      errors.push(`Trust Policy Surface ${surface.id} must have a title.`);
    }

    if (!surface.publicLabel.trim()) {
      errors.push(`Trust Policy Surface ${surface.id} must have a public label.`);
    }

    if (!surface.body.trim()) {
      errors.push(`Trust Policy Surface ${surface.id} must have body text.`);
    }

    if (surface.sourceIds.length === 0) {
      errors.push(`Trust Policy Surface ${surface.id} must reference at least one Source Record.`);
    }

    surface.sourceIds.forEach((sourceId) => {
      if (!sourceRecordsById.has(sourceId)) {
        errors.push(`Trust Policy Surface ${surface.id} references unknown Source Record ${sourceId}.`);
      }
    });
  });

  trustPolicySurfaceKinds.forEach((kind) => {
    if (!trustPolicySurfaces.some((surface) => surface.kind === kind)) {
      errors.push(`Trust Policy Surfaces must include ${kind}.`);
    }
  });

  if (!isLaunchLoopMode(weekOneLaunchLoop.mode)) {
    errors.push(`Week-One Launch Loop ${weekOneLaunchLoop.id} uses unknown mode ${weekOneLaunchLoop.mode}.`);
  }

  if (weekOneLaunchLoop.analyticsSdkAllowed) {
    errors.push(`Week-One Launch Loop ${weekOneLaunchLoop.id} must not allow analytics SDK tracking.`);
  }

  if (!weekOneLaunchLoop.repoRecordPath.trim()) {
    errors.push(`Week-One Launch Loop ${weekOneLaunchLoop.id} must name a repo record path.`);
  }

  if (!weekOneLaunchLoop.reviewWindow.trim()) {
    errors.push(`Week-One Launch Loop ${weekOneLaunchLoop.id} must name a review window.`);
  }

  const launchSignalsById = new Map<string, WeekOneLaunchSignal>();
  const launchSignalKindsSeen = new Set<LaunchSignalKind>();

  weekOneLaunchLoop.signals.forEach((signal) => {
    if (launchSignalsById.has(signal.id)) {
      errors.push(`Launch Signal ${signal.id} is duplicated.`);
    }

    launchSignalsById.set(signal.id, signal);

    if (!isLaunchSignalKind(signal.kind)) {
      errors.push(`Launch Signal ${signal.id} uses unknown kind ${signal.kind}.`);
    } else {
      launchSignalKindsSeen.add(signal.kind);
    }

    if (!signal.label.trim()) {
      errors.push(`Launch Signal ${signal.id} must have a label.`);
    }

    if (!signal.question.trim()) {
      errors.push(`Launch Signal ${signal.id} must have a question.`);
    }

    if (!signal.manualEvidence.trim()) {
      errors.push(`Launch Signal ${signal.id} must name manual evidence.`);
    }

    if (!signal.actionThreshold.trim()) {
      errors.push(`Launch Signal ${signal.id} must name an action threshold.`);
    }
  });

  launchSignalKinds.forEach((kind) => {
    if (!launchSignalKindsSeen.has(kind)) {
      errors.push(`Week-One Launch Loop ${weekOneLaunchLoop.id} must track ${kind}.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function assertValidPlayerGuideData(
  data: GuideDataSet = {
    sourceRecords,
    playerDataFacts,
    playerGuide,
    checklist,
    trustPolicySurfaces,
    weekOneLaunchLoop,
  },
): void {
  const validation = validatePlayerGuideData(data);

  if (!validation.valid) {
    throw new Error(`Invalid Player Guide data:\n${validation.errors.join("\n")}`);
  }
}

assertValidPlayerGuideData();
