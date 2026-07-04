import { expect, test } from "@playwright/test";

test("Returning Thai Player sees an answer-first guide with nearby source evidence", async ({
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
    expect(answerBox!.y + answerBox!.height).toBeLessThanOrEqual(controlsBox!.y);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }
});
