export type SourceStatus =
  | "official_classic"
  | "verified_classic"
  | "historical_kakao"
  | "community_lead";

export type EntityType = "Cookie" | "Pet" | "Treasure" | "Combination";

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

export interface PlayerGuide {
  id: string;
  playerJob: string;
  lastReviewed: string;
  recommendation: string;
  target: {
    type: EntityType;
    name: string;
  };
  shortReason: string;
  caution: string;
  drivingFactIds: string[];
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
  recommendation: "อัปคุกกี้ตัวหลักก่อน แล้วจับคู่กับ Pet ที่ยืนยันใน Classic แล้ว",
  target: {
    type: "Combination",
    name: "คุกกี้เลเวลสูงสุด + Pet ที่มี Source Record แบบ Classic",
  },
  shortReason:
    "ทางนี้ใช้ทรัพยากรกับสิ่งที่บัญชีมีอยู่แล้ว และเลี่ยง Treasure หรือข้อมูล Kakao ที่ยังไม่มีหลักฐาน Classic พอสำหรับคำแนะนำ",
  caution:
    "ถ้าเป้าหมายคือทำคะแนนสูงสุดหรือ Event เฉพาะทาง ให้รอ Source Record เพิ่มก่อนใช้ทรัพยากรหนัก",
  drivingFactIds: ["FACT-STARTER-COOKIE-LEVEL", "FACT-STARTER-PET-PAIR"],
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

export function getSourcesForFact(fact: PlayerDataFact): SourceRecord[] {
  return fact.sourceIds
    .map((sourceId) => sourceRecords.find((source) => source.id === sourceId))
    .filter((source): source is SourceRecord => Boolean(source));
}

export function getDrivingFacts(): PlayerDataFact[] {
  return playerGuide.drivingFactIds
    .map((factId) => playerDataFacts.find((fact) => fact.id === factId))
    .filter((fact): fact is PlayerDataFact => Boolean(fact));
}
