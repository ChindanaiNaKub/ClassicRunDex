import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Search,
  ShieldCheck,
  createIcons,
} from "lucide";
import "./styles.css";
import {
  checklist,
  getGuideGoalOption,
  getGuideRecommendation,
  getDrivingFacts,
  getResourceStateOption,
  getSourcesForFact,
  guideGoalOptions,
  playerDataFacts,
  playerGuide,
  resourceStateOptions,
  sourceRecords,
  statusLabels,
  type GuideGoal,
  type PlayerDataFact,
  type ResourceState,
  type SourceRecord,
  type SourceStatus,
} from "./guide-data";

interface GuideSelection {
  goal: GuideGoal;
  resourceState: ResourceState;
}

function statusBadge(status: SourceStatus): string {
  return `<span class="status status-${status}">${statusLabels[status]}</span>`;
}

function selectedAttribute(value: string, selectedValue: string): string {
  return value === selectedValue ? " selected" : "";
}

function guideOptions<TValue extends string>(
  options: Array<{ value: TValue; label: string; helper: string }>,
  selectedValue: TValue,
): string {
  return options
    .map(
      (option) =>
        `<option value="${option.value}"${selectedAttribute(option.value, selectedValue)}>
          ${option.label}
        </option>`,
    )
    .join("");
}

function factCard(fact: PlayerDataFact): string {
  return `
    <article class="fact-card" aria-label="${fact.entityType}: ${fact.thaiName}">
      <div class="fact-card__type">${fact.entityType}</div>
      <h3>${fact.thaiName}</h3>
      <p class="fact-card__alias">${fact.globalName}</p>
      <dl>
        <div>
          <dt>${fact.field}</dt>
          <dd>${fact.value}</dd>
        </div>
      </dl>
      <div class="status-row">${statusBadge(fact.status)}</div>
    </article>
  `;
}

function sourceItem(source: SourceRecord): string {
  return `
    <li>
      <div>
        <strong>${source.id}</strong>
        <span>${source.label}</span>
      </div>
      <p>${source.note}</p>
      <div class="source-meta">
        ${statusBadge(source.status)}
        <span>Observed ${source.observedAt}</span>
      </div>
    </li>
  `;
}

function renderGuide(selection: GuideSelection): string {
  const activeRecommendation = getGuideRecommendation(selection.goal, selection.resourceState);
  const selectedGoal = getGuideGoalOption(activeRecommendation.goal);
  const selectedResourceState = getResourceStateOption(activeRecommendation.resourceState);
  const drivingFacts = getDrivingFacts(activeRecommendation);
  const drivingSources = new Map<string, SourceRecord>();

  drivingFacts.forEach((fact) => {
    getSourcesForFact(fact).forEach((source) => drivingSources.set(source.id, source));
  });

  const secondaryFacts = playerDataFacts.filter(
    (fact) => !activeRecommendation.drivingFactIds.includes(fact.id),
  );

  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="ClassicRunDex home">
        <span class="brand-mark">CRD</span>
        <span>ClassicRunDex</span>
      </a>
      <nav class="topnav" aria-label="Primary">
        <a href="#guide" aria-current="page">Player Guide</a>
        <a href="#evidence">Player Data</a>
        <a href="#checklist">Codes / Events</a>
        <a href="#policy">Source policy</a>
      </nav>
    </header>

    <main>
      <section id="guide" class="guide-band" aria-labelledby="guide-title">
        <div class="guide-heading">
          <p class="eyebrow">Thai-first Player Guide</p>
          <h1 id="guide-title">${playerGuide.playerJob}</h1>
        </div>
        <div class="guide-shell">
          <aside class="control-panel" data-testid="guide-controls" aria-label="Guide controls">
            <h2>ปรับคำตอบ</h2>
            <label for="guide-goal">
              <span>เป้าหมายตอนนี้</span>
              <select id="guide-goal" aria-label="เลือกเป้าหมาย">
                ${guideOptions(guideGoalOptions, activeRecommendation.goal)}
              </select>
              <span class="control-help">${selectedGoal.helper}</span>
            </label>
            <label for="resource-state">
              <span>ทรัพยากรคร่าว ๆ</span>
              <select id="resource-state" aria-label="เลือกทรัพยากร">
                ${guideOptions(resourceStateOptions, activeRecommendation.resourceState)}
              </select>
              <span class="control-help">${selectedResourceState.helper}</span>
            </label>
            <button type="button" class="primary-button">
              ดูคำแนะนำ
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </button>
            <p>คำตอบจะเลี่ยงตัวเลือกที่ใช้ทรัพยากรเกินสถานะคร่าว ๆ และไม่ยก Kakao/community lead เป็น Classic fact</p>
          </aside>

          <div class="answer-stack">
            <article
              class="answer-panel"
              data-testid="primary-recommendation"
              aria-live="polite"
            >
              <div class="answer-panel__header">
                <span class="guide-type">${activeRecommendation.target.type}</span>
                <span class="reviewed">
                  <i data-lucide="calendar-days" aria-hidden="true"></i>
                  ตรวจล่าสุด ${playerGuide.lastReviewed}
                </span>
              </div>
              <div class="state-summary" data-testid="selected-guide-state">
                <span><strong>เป้าหมาย:</strong> ${selectedGoal.label}</span>
                <span><strong>ทรัพยากร:</strong> ${selectedResourceState.label}</span>
              </div>
              <h2>${activeRecommendation.recommendation}</h2>
              <p class="target">${activeRecommendation.target.name}</p>
              <p>${activeRecommendation.shortReason}</p>
              <p class="level-cost" data-testid="level-cost-context">
                <strong>Level / Cost:</strong> ${activeRecommendation.levelCostContext}
              </p>
              <div class="status-row" aria-label="Recommendation source statuses">
                ${drivingFacts.map((fact) => statusBadge(fact.status)).join("")}
              </div>
              <p class="caution">${activeRecommendation.caution}</p>
            </article>

            <section
              class="near-answer"
              aria-labelledby="evidence-title"
              data-testid="near-answer-evidence"
            >
              <div>
                <p class="eyebrow">Evidence close to answer</p>
                <h2 id="evidence-title">หลักฐานที่ใช้กับคำแนะนำนี้</h2>
              </div>
              <div class="fact-grid fact-grid--driving">
                ${drivingFacts.map(factCard).join("")}
              </div>
              <ul class="source-list source-list--compact" aria-label="Source Records cited by this answer">
                ${[...drivingSources.values()].map(sourceItem).join("")}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section id="evidence" class="content-band" aria-labelledby="player-data-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Player Data</p>
            <h2 id="player-data-title">ข้อมูลรองรับ ไม่ใช่ตารางให้ค้นก่อนตอบ</h2>
          </div>
          <form class="search-box" role="search">
            <label class="visually-hidden" for="lookup">ค้นหา Thai, English, Korean, หรือชื่อเก่า</label>
            <i data-lucide="search" aria-hidden="true"></i>
            <input id="lookup" type="search" value="คุกกี้ / Pet / Treasure / Kakao lead" />
          </form>
        </div>

        <div class="fact-grid">
          ${secondaryFacts.map(factCard).join("")}
        </div>
      </section>

      <section class="content-band source-layout" aria-labelledby="source-title">
        <div>
          <p class="eyebrow">Source Records</p>
          <h2 id="source-title">สถานะแหล่งข้อมูลต้องเห็นชัด</h2>
          <p>
            Recommendation ใช้เฉพาะ official Classic หรือ player-verified Classic เท่านั้น
            ส่วน historical Kakao และ community lead แสดงเป็นบริบทหรือคำถามสำหรับตรวจต่อ
          </p>
          <ul class="source-list">
            ${sourceRecords.map(sourceItem).join("")}
          </ul>
        </div>
        <figure class="status-map">
          <img src="/source-status-map.svg" alt="Source statuses flow toward guide review" />
          <figcaption>Source statuses visible before a fact can shape a Player Guide.</figcaption>
        </figure>
      </section>

      <section id="checklist" class="content-band checklist-band" aria-labelledby="checklist-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Codes / Events / Invite</p>
            <h2 id="checklist-title">เช็กลิสต์ launch-week แบบไม่สวมรอย official</h2>
          </div>
          <a class="link-button" href="#policy">
            <span>ดู source policy</span>
            <i data-lucide="external-link" aria-hidden="true"></i>
          </a>
        </div>
        <div class="checklist-grid">
          ${checklist
            .map(
              (item) => `
                <article class="check-item">
                  <i data-lucide="shield-check" aria-hidden="true"></i>
                  <div>
                    <h3>${item.title}</h3>
                    <p>${item.context}</p>
                    ${statusBadge(item.status)}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section id="policy" class="policy-band" aria-labelledby="policy-title">
        <p class="eyebrow">Unofficial source-reviewed guide</p>
        <h2 id="policy-title">ClassicRunDex ไม่ใช่บริการ official ของ Devsisters</h2>
        <p>
          เนื้อหา Player Guide เป็นคำอธิบายต้นฉบับของ ClassicRunDex และต้องผูกกับ Source Record
          ก่อนเผยแพร่คำแนะนำที่กระทบการใช้ทรัพยากร
        </p>
      </section>
    </main>
  `;
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

const appRoot = app;

function refreshIcons(): void {
  createIcons({
    icons: {
      ArrowRight,
      CalendarDays,
      ExternalLink,
      Search,
      ShieldCheck,
    },
  });
}

function mountGuide(selection: GuideSelection): void {
  appRoot.innerHTML = renderGuide(selection);
  refreshIcons();

  const goalSelect = document.querySelector<HTMLSelectElement>("#guide-goal");
  const resourceStateSelect = document.querySelector<HTMLSelectElement>("#resource-state");
  const applyButton = document.querySelector<HTMLButtonElement>(".primary-button");

  applyButton?.addEventListener("click", () => {
    mountGuide({
      goal: (goalSelect?.value ?? playerGuide.defaultGoal) as GuideGoal,
      resourceState: (resourceStateSelect?.value ??
        playerGuide.defaultResourceState) as ResourceState,
    });
  });
}

mountGuide({
  goal: playerGuide.defaultGoal,
  resourceState: playerGuide.defaultResourceState,
});
