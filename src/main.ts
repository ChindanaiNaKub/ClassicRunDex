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
  getDrivingFacts,
  getSourcesForFact,
  playerDataFacts,
  playerGuide,
  sourceRecords,
  statusLabels,
  type PlayerDataFact,
  type SourceRecord,
  type SourceStatus,
} from "./guide-data";

function statusBadge(status: SourceStatus): string {
  return `<span class="status status-${status}">${statusLabels[status]}</span>`;
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

function renderGuide(): string {
  const drivingFacts = getDrivingFacts();
  const drivingSources = new Map<string, SourceRecord>();

  drivingFacts.forEach((fact) => {
    getSourcesForFact(fact).forEach((source) => drivingSources.set(source.id, source));
  });

  const secondaryFacts = playerDataFacts.filter(
    (fact) => !playerGuide.drivingFactIds.includes(fact.id),
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
        <div class="guide-shell">
          <div class="answer-stack">
            <p class="eyebrow">Thai-first Player Guide</p>
            <h1 id="guide-title">${playerGuide.playerJob}</h1>

            <article class="answer-panel" data-testid="primary-recommendation">
              <div class="answer-panel__header">
                <span class="guide-type">${playerGuide.target.type}</span>
                <span class="reviewed">
                  <i data-lucide="calendar-days" aria-hidden="true"></i>
                  ตรวจล่าสุด ${playerGuide.lastReviewed}
                </span>
              </div>
              <h2>${playerGuide.recommendation}</h2>
              <p class="target">${playerGuide.target.name}</p>
              <p>${playerGuide.shortReason}</p>
              <div class="status-row" aria-label="Recommendation source statuses">
                ${drivingFacts.map((fact) => statusBadge(fact.status)).join("")}
              </div>
              <p class="caution">${playerGuide.caution}</p>
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
            <label>
              <span>เป้าหมายตอนนี้</span>
              <select aria-label="เลือกเป้าหมาย">
                <option>ผ่านช่วงต้นเกม</option>
                <option>เก็บเหรียญ</option>
                <option>ทำคะแนนดีขึ้น</option>
                <option>เช็ก Event วันนี้</option>
              </select>
            </label>
            <label>
              <span>ทรัพยากรคร่าว ๆ</span>
              <select aria-label="เลือกทรัพยากร">
                <option>มีเหรียญจำกัด</option>
                <option>อัปได้ 1 อย่างวันนี้</option>
                <option>มีคริสตัลแต่ยังไม่มั่นใจ</option>
              </select>
            </label>
            <button type="button" class="primary-button">
              ดูคำแนะนำ
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </button>
            <p>ตัวเลือกนี้เป็น tracer แรก: คำตอบขึ้นก่อน แล้วข้อมูลรองรับอยู่ใกล้พอให้ตรวจได้ทันที</p>
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

app.innerHTML = renderGuide();

createIcons({
  icons: {
    ArrowRight,
    CalendarDays,
    ExternalLink,
    Search,
    ShieldCheck,
  },
});
