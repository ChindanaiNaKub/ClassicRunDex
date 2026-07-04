export type SourceStatus =
  | "official_classic"
  | "verified_classic"
  | "historical_kakao"
  | "community_lead";

export type EntityType = "Cookie" | "Pet" | "Treasure" | "Combination";
export type GuideGoal = "early_progression" | "score_improvement" | "coins" | "event_utility";
export type ResourceState = "coin_limited" | "one_upgrade" | "crystals_uncertain";

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
  field: string;
  value: string;
  status: SourceStatus;
  sourceIds: string[];
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
  title: string;
  status: SourceStatus;
  context: string;
}

export const statusLabels: Record<SourceStatus, string> = {
  official_classic: "official Classic",
  verified_classic: "player-verified Classic",
  historical_kakao: "historical Kakao",
  community_lead: "community lead",
};

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
    title: "เปิดลิงก์ redemption/support จาก official surface เท่านั้น",
    status: "official_classic",
    context: "แสดงเป็นทางไปต่อ ไม่รับโค้ดหรือข้อมูลบัญชีใน ClassicRunDex",
  },
  {
    title: "บันทึกเลเวลและทรัพยากรคร่าว ๆ ก่อนอัป",
    status: "verified_classic",
    context: "ช่วยให้ Player Guide ไม่แนะนำสิ่งที่ทำตามไม่ได้ตอนนี้",
  },
  {
    title: "แยก tier list หรือคำแนะนำชุมชนเป็น lead ก่อน",
    status: "community_lead",
    context: "ใช้เป็นคำถามสำหรับตรวจสอบ ไม่ใช้เป็นคำตอบสุดท้าย",
  },
];

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

export function getSourcesForFact(fact: PlayerDataFact): SourceRecord[] {
  return fact.sourceIds
    .map((sourceId) => sourceRecords.find((source) => source.id === sourceId))
    .filter((source): source is SourceRecord => Boolean(source));
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

export function getGuideRecommendation(
  goal: GuideGoal,
  resourceState: ResourceState,
): PlayerGuideRecommendation {
  const exactRecommendation = playerGuide.recommendations.find(
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

export function getDrivingFacts(
  recommendation: PlayerGuideRecommendation,
): PlayerDataFact[] {
  return recommendation.drivingFactIds
    .map((factId) => playerDataFacts.find((fact) => fact.id === factId))
    .filter((fact): fact is PlayerDataFact => Boolean(fact));
}
