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
  checklistExpiryLabels,
  getGuideGoalOption,
  getGuideRecommendation,
  getDrivingFacts,
  getResourceStateOption,
  getSourcesForFact,
  guideGoalOptions,
  playerDataFacts,
  playerGuide,
  resourceStateOptions,
  searchPlayerDataFacts,
  sourceRecords,
  statusLabels,
  translationLanguageLabels,
  trustPolicySurfaces,
  weekOneLaunchLoop,
  type GuideGoal,
  type ChecklistItem,
  type WeekOneLaunchSignal,
  type PlayerDataFact,
  type ResourceState,
  type SourceRecord,
  type SourceStatus,
  type TrustPolicySurface,
} from "./guide-data";

interface GuideSelection {
  goal: GuideGoal;
  resourceState: ResourceState;
}

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

function statusBadge(status: SourceStatus): string {
  return `<span class="status status-${status}">${escapeHtml(statusLabels[status])}</span>`;
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
        `<option value="${escapeHtml(option.value)}"${selectedAttribute(option.value, selectedValue)}>
          ${escapeHtml(option.label)}
        </option>`,
    )
    .join("");
}

function translationList(fact: PlayerDataFact): string {
  if (fact.translations.length === 0) {
    return "";
  }

  return `
    <div class="translation-block">
      <div class="translation-block__title">Translation</div>
      <ul class="translation-list">
        ${fact.translations
          .map(
            (translation) => `
              <li>
                <span>${escapeHtml(translationLanguageLabels[translation.language])}</span>
                <strong>${escapeHtml(translation.value)}</strong>
              </li>
            `,
          )
          .join("")}
      </ul>
      <p>Translation helps lookup; Source Record status verifies gameplay facts.</p>
    </div>
  `;
}

function factCard(fact: PlayerDataFact): string {
  return `
    <article
      class="fact-card"
      aria-label="${escapeHtml(`${fact.entityType}: ${fact.thaiName}`)}"
      data-testid="player-data-fact"
      data-fact-id="${escapeHtml(fact.id)}"
    >
      <div class="fact-card__type">${escapeHtml(fact.entityType)}</div>
      <h3>${escapeHtml(fact.thaiName)}</h3>
      <p class="fact-card__alias">${escapeHtml(fact.globalName)}</p>
      ${translationList(fact)}
      <dl>
        <div>
          <dt>${escapeHtml(fact.field)}</dt>
          <dd>${escapeHtml(fact.value)}</dd>
        </div>
      </dl>
      <div class="status-row">${statusBadge(fact.status)}</div>
    </article>
  `;
}

function lookupSummaryText(resultCount: number, query: string): string {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return `${resultCount} Player Data records`;
  }

  return `${resultCount} Player Data results`;
}

function renderLookupResults(query: string): string {
  const results = searchPlayerDataFacts(query);

  if (results.length === 0) {
    return `
      <p class="empty-state" data-testid="lookup-empty">
        ยังไม่มี Player Data ที่ตรงกับคำค้นนี้
      </p>
    `;
  }

  return results.map(factCard).join("");
}

function sourceItem(source: SourceRecord): string {
  return `
    <li>
      <div>
        <strong>${escapeHtml(source.id)}</strong>
        <span>${escapeHtml(source.label)}</span>
      </div>
      <p>${escapeHtml(source.note)}</p>
      <div class="source-meta">
        ${statusBadge(source.status)}
        <span>Observed ${escapeHtml(source.observedAt)}</span>
      </div>
    </li>
  `;
}

function checklistCard(item: ChecklistItem): string {
  return `
    <article class="check-item" data-testid="checklist-item">
      <i data-lucide="shield-check" aria-hidden="true"></i>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.context)}</p>
        <div class="check-meta">
          ${statusBadge(item.status)}
          <span>Reviewed ${escapeHtml(item.lastReviewed)}</span>
          <span class="expiry-status">${escapeHtml(checklistExpiryLabels[item.expiryStatus])}</span>
        </div>
        <p class="check-source-ids">Source Records: ${escapeHtml(item.sourceIds.join(", "))}</p>
        <a class="check-link" href="${escapeHtml(item.officialUrl)}" target="_blank" rel="noreferrer">
          <span>${escapeHtml(item.actionLabel)}</span>
          <i data-lucide="external-link" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  `;
}

function trustPolicyCard(surface: TrustPolicySurface): string {
  return `
    <article class="trust-card" data-testid="trust-policy-surface">
      <i data-lucide="shield-check" aria-hidden="true"></i>
      <div>
        <span class="trust-label">${escapeHtml(surface.publicLabel)}</span>
        <h3>${escapeHtml(surface.title)}</h3>
        <p>${escapeHtml(surface.body)}</p>
        <p class="check-source-ids">Source Records: ${escapeHtml(surface.sourceIds.join(", "))}</p>
      </div>
    </article>
  `;
}

function launchSignalCard(signal: WeekOneLaunchSignal): string {
  return `
    <article class="launch-signal" data-testid="launch-signal">
      <h3>${escapeHtml(signal.label)}</h3>
      <p><strong>Question:</strong> ${escapeHtml(signal.question)}</p>
      <p><strong>Manual evidence:</strong> ${escapeHtml(signal.manualEvidence)}</p>
      <p><strong>Action:</strong> ${escapeHtml(signal.actionThreshold)}</p>
    </article>
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
        <a href="#launch-loop">Launch loop</a>
      </nav>
    </header>

    <main>
      <section id="guide" class="guide-band" aria-labelledby="guide-title">
        <div class="guide-heading">
          <p class="eyebrow">Thai-first Player Guide</p>
          <h1 id="guide-title">${escapeHtml(playerGuide.playerJob)}</h1>
        </div>
        <div class="guide-shell">
          <div class="answer-stack">
            <article
              class="answer-panel"
              data-testid="primary-recommendation"
              aria-live="polite"
            >
              <div class="answer-panel__header">
                <span class="guide-type">${escapeHtml(activeRecommendation.target.type)}</span>
                <span class="reviewed">
                  <i data-lucide="calendar-days" aria-hidden="true"></i>
                  ตรวจล่าสุด ${escapeHtml(playerGuide.lastReviewed)}
                </span>
              </div>
              <div class="state-summary" data-testid="selected-guide-state">
                <span><strong>เป้าหมาย:</strong> ${escapeHtml(selectedGoal.label)}</span>
                <span><strong>ทรัพยากร:</strong> ${escapeHtml(selectedResourceState.label)}</span>
              </div>
              <h2>${escapeHtml(activeRecommendation.recommendation)}</h2>
              <p class="target">${escapeHtml(activeRecommendation.target.name)}</p>
              <p>${escapeHtml(activeRecommendation.shortReason)}</p>
              <p class="level-cost" data-testid="level-cost-context">
                <strong>Level / Cost:</strong> ${escapeHtml(activeRecommendation.levelCostContext)}
              </p>
              <div class="status-row" aria-label="Recommendation source statuses">
                ${drivingFacts.map((fact) => statusBadge(fact.status)).join("")}
              </div>
              <p class="caution">${escapeHtml(activeRecommendation.caution)}</p>
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

          <aside class="control-panel" data-testid="guide-controls" aria-label="Guide controls">
            <h2>ปรับคำตอบ</h2>
            <label for="guide-goal">
              <span>เป้าหมายตอนนี้</span>
              <select id="guide-goal" aria-label="เลือกเป้าหมาย">
                ${guideOptions(guideGoalOptions, activeRecommendation.goal)}
              </select>
              <span class="control-help">${escapeHtml(selectedGoal.helper)}</span>
            </label>
            <label for="resource-state">
              <span>ทรัพยากรคร่าว ๆ</span>
              <select id="resource-state" aria-label="เลือกทรัพยากร">
                ${guideOptions(resourceStateOptions, activeRecommendation.resourceState)}
              </select>
              <span class="control-help">${escapeHtml(selectedResourceState.helper)}</span>
            </label>
            <button type="button" class="primary-button">
              ดูคำแนะนำ
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </button>
            <p>คำตอบจะเลี่ยงตัวเลือกที่ใช้ทรัพยากรเกินสถานะคร่าว ๆ และไม่ยก Kakao/community lead เป็น Classic fact</p>
          </aside>
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
            <input
              id="lookup"
              type="search"
              placeholder="คุกกี้ / Pet / Treasure / Kakao lead"
              autocomplete="off"
            />
          </form>
        </div>

        <p class="lookup-summary" data-testid="lookup-summary">
          ${lookupSummaryText(playerDataFacts.length, "")}
        </p>
        <div class="fact-grid" data-testid="player-data-lookup">
          ${renderLookupResults("")}
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
        <div class="checklist-grid" data-testid="launch-checklist">
          ${checklist.map(checklistCard).join("")}
        </div>
      </section>

      <section id="policy" class="policy-band" aria-labelledby="policy-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Trust Policy Surfaces</p>
            <h2 id="policy-title">ขอบเขตความไว้ใจต้องเห็นก่อนแชร์หรือส่งข้อมูล</h2>
          </div>
          <a class="link-button" href="#launch-loop">
            <span>ดู launch loop</span>
            <i data-lucide="external-link" aria-hidden="true"></i>
          </a>
        </div>
        <div class="trust-grid" data-testid="trust-policy-surfaces">
          ${trustPolicySurfaces.map(trustPolicyCard).join("")}
        </div>
      </section>

      <section
        id="launch-loop"
        class="content-band launch-loop-band"
        aria-labelledby="launch-loop-title"
        data-testid="week-one-launch-loop"
      >
        <div class="section-heading">
          <div>
            <p class="eyebrow">Week-One Launch Loop</p>
            <h2 id="launch-loop-title">${escapeHtml(weekOneLaunchLoop.title)}</h2>
          </div>
          <span class="reviewed">
            <i data-lucide="calendar-days" aria-hidden="true"></i>
            ${escapeHtml(weekOneLaunchLoop.reviewWindow)}
          </span>
        </div>
        <div class="launch-loop-summary">
          <p>
            Manual repo-owned loop in <strong>${escapeHtml(weekOneLaunchLoop.repoRecordPath)}</strong>.
            No analytics SDK, account tracking, coupon collection, invite service, affiliate redirect,
            paid boost, or account-sale flow.
          </p>
        </div>
        <div class="launch-signal-grid">
          ${weekOneLaunchLoop.signals.map(launchSignalCard).join("")}
        </div>
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
  const lookupForm = document.querySelector<HTMLFormElement>(".search-box");
  const lookupInput = document.querySelector<HTMLInputElement>("#lookup");
  const lookupResults = document.querySelector<HTMLDivElement>("[data-testid='player-data-lookup']");
  const lookupSummary = document.querySelector<HTMLParagraphElement>("[data-testid='lookup-summary']");

  applyButton?.addEventListener("click", () => {
    mountGuide({
      goal: (goalSelect?.value ?? playerGuide.defaultGoal) as GuideGoal,
      resourceState: (resourceStateSelect?.value ??
        playerGuide.defaultResourceState) as ResourceState,
    });
  });

  lookupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  lookupInput?.addEventListener("input", () => {
    const query = lookupInput.value;
    const results = searchPlayerDataFacts(query);

    if (lookupResults) {
      lookupResults.innerHTML = renderLookupResults(query);
    }

    if (lookupSummary) {
      lookupSummary.textContent = lookupSummaryText(results.length, query);
    }
  });
}

mountGuide({
  goal: playerGuide.defaultGoal,
  resourceState: playerGuide.defaultResourceState,
});
