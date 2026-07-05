import { expect, test } from "@playwright/test";

test("Returning Thai Player sees a goal-aware guide with nearby source evidence", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  const answer = page.getByTestId("primary-recommendation");
  const controls = page.getByTestId("guide-controls");

  await expect(
    page.getByRole("heading", { name: "วันนี้ควรใช้อะไรหรืออัปเกรดอะไรต่อ?" }),
  ).toBeVisible();
  await expect(answer).toContainText(
    "อัปคุกกี้ตัวหลักก่อน แล้วจับคู่กับ Pet ที่ยืนยันใน Classic แล้ว",
  );
  await expect(answer).toContainText("ตรวจล่าสุด 4 กรกฎาคม 2026");
  await expect(answer).toContainText("player-verified Classic");
  await expect(controls).toBeVisible();

  const nearAnswerEvidence = page.getByTestId("near-answer-evidence");
  await expect(nearAnswerEvidence.getByRole("heading", { name: "หลักฐานที่ใช้กับคำแนะนำนี้" })).toBeVisible();
  await expect(nearAnswerEvidence.getByText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด")).toBeVisible();
  await expect(nearAnswerEvidence.getByText("Pet ที่มีผลจับคู่ยืนยันใน Classic")).toBeVisible();
  await expect(nearAnswerEvidence).toContainText("SRC-CLASSIC-OBS-001");

  await expect(page.getByText("official Classic").first()).toBeVisible();
  await expect(page.getByText("historical Kakao").first()).toBeVisible();
  await expect(page.getByText("community lead").first()).toBeVisible();
  await expect(page.getByText("ClassicRunDex ไม่ใช่บริการ official ของ Devsisters")).toBeVisible();

  if (testInfo.project.name === "mobile") {
    const answerBox = await answer.boundingBox();
    const controlsBox = await controls.boundingBox();

    expect(answerBox, "answer panel should be measurable").not.toBeNull();
    expect(controlsBox, "controls panel should be measurable").not.toBeNull();
    expect(answerBox!.y + answerBox!.height).toBeLessThanOrEqual(controlsBox!.y);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }
});

test("Returning Thai Player gets different guidance for goal and resource combinations", async ({
  page,
}) => {
  await page.goto("/");

  const answer = page.getByTestId("primary-recommendation");
  const goalSelect = page.getByLabel("เลือกเป้าหมาย");
  const resourceSelect = page.getByLabel("เลือกทรัพยากร");

  await expect(answer).toContainText("ผ่านช่วงต้นเกม");
  await expect(answer).toContainText("มีเหรียญจำกัด");
  await expect(answer).toContainText("Level");
  await expect(answer).toContainText("Cost");

  await goalSelect.selectOption("score_improvement");
  await resourceSelect.selectOption("one_upgrade");
  await page.getByRole("button", { name: "ดูคำแนะนำ" }).click();

  await expect(answer).toContainText("ทำคะแนนดีขึ้น");
  await expect(answer).toContainText("อัปได้ 1 อย่างวันนี้");
  await expect(answer).toContainText("อัปแค่จุดเดียวใน Combination ที่ยืนยันแล้ว");
  await expect(answer).toContainText("ไม่แตกทรัพยากรไป Treasure lead");

  await resourceSelect.selectOption("crystals_uncertain");
  await page.getByRole("button", { name: "ดูคำแนะนำ" }).click();

  await expect(answer).toContainText("ทำคะแนนดีขึ้น");
  await expect(answer).toContainText("มีคริสตัลแต่ยังไม่มั่นใจ");
  await expect(answer).toContainText("ยังไม่ใช้คริสตัล");

  await goalSelect.selectOption("coins");
  await resourceSelect.selectOption("crystals_uncertain");
  await page.getByRole("button", { name: "ดูคำแนะนำ" }).click();

  await expect(answer).toContainText("เก็บเหรียญ");
  await expect(answer).toContainText("มีคริสตัลแต่ยังไม่มั่นใจ");
  await expect(answer).toContainText("เก็บคริสตัลไว้ก่อน");
  await expect(answer).toContainText("เลือกทางที่ไม่ต้องซื้อของใหม่");
});

test("Player Data lookup resolves Translation terms without changing verification", async ({
  page,
}) => {
  await page.goto("/");

  const lookup = page.getByLabel("ค้นหา Thai, English, Korean, หรือชื่อเก่า");
  const summary = page.getByTestId("lookup-summary");
  const results = page.getByTestId("player-data-lookup");

  await lookup.fill("main runner");
  await expect(summary).toContainText("1 Player Data results");
  await expect(results.getByTestId("player-data-fact")).toHaveCount(1);
  await expect(results).toContainText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด");
  await expect(results).toContainText("main runner");
  await expect(results).toContainText("player-verified Classic");
  await expect(results).toContainText(
    "Translation helps lookup; Source Record status verifies gameplay facts.",
  );

  await lookup.fill("คุกกี้ตัวหลัก");
  await expect(results.getByTestId("player-data-fact")).toHaveCount(1);
  await expect(results).toContainText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด");
  await expect(results).toContainText("player-verified Classic");

  await lookup.fill("쿠키");
  await expect(results.getByTestId("player-data-fact")).toHaveCount(1);
  await expect(results).toContainText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด");
  await expect(results).toContainText("player-verified Classic");

  await lookup.fill("LINE starter cookie");
  await expect(results.getByTestId("player-data-fact")).toHaveCount(1);
  await expect(results).toContainText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด");
  await expect(results).toContainText("player-verified Classic");

  await lookup.fill("카카오");
  await expect(results.getByTestId("player-data-fact")).toHaveCount(1);
  await expect(results).toContainText("ข้อมูลจาก Cookie Run Kakao");
  await expect(results).toContainText("historical Kakao");
});

test("Launch Checklist exposes official links, review dates, expiry context, and non-affiliation", async ({
  page,
}) => {
  await page.goto("/");

  const launchChecklist = page.getByTestId("launch-checklist");
  await expect(launchChecklist.getByTestId("checklist-item")).toHaveCount(3);

  const couponItem = launchChecklist
    .getByTestId("checklist-item")
    .filter({ hasText: "กรอก Coupon ที่ DevPlay Classic เท่านั้น" });
  await expect(couponItem).toContainText("Reviewed 2026-07-05");
  await expect(couponItem).toContainText("check official expiry");
  await expect(couponItem).toContainText("SRC-CLASSIC-COUPON-001");
  await expect(couponItem).toContainText("ClassicRunDex ไม่รับโค้ดหรือ DevPlay account");
  await expect(
    couponItem.getByRole("link", { name: "เปิดหน้า coupon official" }),
  ).toHaveAttribute("href", "https://coupon.devplay.com/coupon/crg/en");

  const launchGiftsItem = launchChecklist
    .getByTestId("checklist-item")
    .filter({ hasText: "เช็ก Launch gifts ก่อนใช้คริสตัล" });
  await expect(launchGiftsItem).toContainText("no expiry listed");
  await expect(launchGiftsItem).toContainText("SRC-CLASSIC-GPLAY-LAUNCH-GIFTS-001");
  await expect(
    launchGiftsItem.getByRole("link", { name: "ดู Launch gifts official" }),
  ).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/eventdetails/4832236980895547585",
  );

  const inviteItem = launchChecklist
    .getByTestId("checklist-item")
    .filter({ hasText: "ตรวจ invite/community claim จาก official surface ก่อนแชร์" });
  await expect(inviteItem).toContainText("needs review");
  await expect(inviteItem).toContainText("ไม่ใช้ ClassicRunDex เป็นบริการ invite");
  await expect(
    inviteItem.getByRole("link", { name: "เปิด Support / Community official" }),
  ).toHaveAttribute("href", "https://cs-cookierunclassic.devsisters.com/hc/en-us");

  await expect(page.getByText("ClassicRunDex ไม่ใช่บริการ official ของ Devsisters")).toBeVisible();
});

test("Trust policy surfaces and week-one launch loop stay visible and manual", async ({
  page,
}) => {
  await page.goto("/");

  const trustPolicy = page.getByTestId("trust-policy-surfaces");
  await expect(trustPolicy.getByTestId("trust-policy-surface")).toHaveCount(5);
  await expect(trustPolicy).toContainText("Unofficial source-reviewed guide");
  await expect(trustPolicy).toContainText("ไม่รับโค้ด บัญชี หรือ invite-service");
  await expect(trustPolicy).toContainText("ไม่มี affiliate, boost, account sale, หรือ paid invite");
  await expect(trustPolicy).toContainText("แชร์เป็น unofficial source-reviewed guide เท่านั้น");

  const launchLoop = page.getByTestId("week-one-launch-loop");
  await expect(launchLoop).toContainText("Manual week-one launch loop");
  await expect(launchLoop).toContainText("2026-07-05 through 2026-07-11");
  await expect(launchLoop).toContainText("docs/week-one-launch-loop.md");
  await expect(launchLoop).toContainText("No analytics SDK");
  await expect(launchLoop.getByTestId("launch-signal")).toHaveCount(5);
  await expect(launchLoop).toContainText("Repeat usage");
  await expect(launchLoop).toContainText("Correction reports");
  await expect(launchLoop).toContainText("Source-safe feedback");
  await expect(launchLoop).toContainText("Stale claims");
  await expect(launchLoop).toContainText("Maintenance burden");
});
