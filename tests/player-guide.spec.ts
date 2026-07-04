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
  await expect(page.getByText("คุกกี้ตัวหลักที่มีเลเวลสูงสุด")).toBeVisible();
  await expect(page.getByText("Pet ที่มีผลจับคู่ยืนยันใน Classic")).toBeVisible();
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
    expect(controlsBox!.y + controlsBox!.height).toBeLessThanOrEqual(answerBox!.y);

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
