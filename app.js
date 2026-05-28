const state = {
  lang: "zh",
  query: "",
  region: "all",
  function: "all",
  selectedJob: null,
};

const referralEmail = ["victor.c", "gmicloud.ai"].join("@");
const data = window.REFERRAL_JOBS || { jobs: [] };
const chinaJobs = window.CHINA_REFERRAL_JOBS || [];
const latestLinkedinJobs = window.LATEST_LINKEDIN_JOBS || [];
const activeOverseasJobIds = new Set([
  "4393502947",
  "4387244302",
  "4399241967",
  "4379594061",
  "4389490842",
  "4394339407",
  "4359897165",
  "4386562879",
  "4400219306",
  "4383006230",
  "4393514382",
  "4390602082",
  "4393516423",
  "4387245327",
  "4401740325",
  "4384331631",
  "4393516686",
  "4393521196",
  "4417316592",
  "4415346199",
  "4407593926",
  "4410500410",
  "4412732284",
  "4419524862",
  "4411404889",
  "4410050693",
  "4397474416",
  "4419132333",
  "4418068454",
  "4412464113",
  "4418928548",
  "4419515892",
  "4419567582",
  "4417019286",
  "4411631391",
  "4411419072",
  "4410281996",
]);
const overseasSourceJobs = Array.from(
  [...(data.jobs || []), ...latestLinkedinJobs]
    .reduce((items, job) => items.set(String(job.id), job), new Map())
    .values()
);
const overseasJobs = overseasSourceJobs
  .filter((job) => activeOverseasJobIds.has(String(job.id)))
  .map((job) => ({
    ...job,
    status: "active",
    statusSource: "Refreshed against LinkedIn company jobs search on 2026-05-28",
  }));
const jobs = [...chinaJobs, ...overseasJobs].map((job) => ({
  function: inferFunction(job),
  regionGroup: inferRegionGroup(job),
  ...job,
}));

const i18n = {
  zh: {
    eyebrow: "内推通道 · GPU Cloud / AI Infra",
    headline: "AI Infra 内推",
    lead: "AI 基础设施岗位开放中。按地区和职能找到目标岗位后，可直接邮件发送简历。",
    metricJobs: "岗位总数",
    metricTrack: "Infra 赛道",
    linkedinCta: "公司动态",
    contactCta: "联系内推",
    boardEyebrow: "Open Roles",
    boardTitle: "正在内推的岗位",
    ctaEyebrow: "Referral Signal",
    ctaTitle: "已有目标岗位？",
    ctaCopy: "打开对应岗位详情，点击“邮件投递”即可带上岗位标题发送简历。请在邮件正文附上目标岗位、所在城市、可入职时间和简历。",
    search: "搜索岗位、城市、关键词",
    allRegions: "全部地区",
    mainland: "中国大陆",
    hongkong: "中国香港",
    taiwan: "中国台湾",
    overseas: "海外",
    allFunctions: "全部职能",
    view: "查看 JD",
    count: (n) => `${n} 个匹配岗位`,
    emailTemplate: "发邮件咨询",
    roleEmail: "邮件投递",
    apply: "查看原链接",
    noLink: "无外部链接",
  },
  en: {
    eyebrow: "Personal referral channel · GPU Cloud / AI Infra",
    headline: "AI Infra Referrals",
    lead: "AI infrastructure roles are open. Filter by location and function, then email your resume directly.",
    metricJobs: "open roles",
    metricTrack: "infra track",
    linkedinCta: "Company updates",
    contactCta: "Contact referral",
    boardEyebrow: "Open Roles",
    boardTitle: "Roles open for referral",
    ctaEyebrow: "Referral Signal",
    ctaTitle: "Know your target role?",
    ctaCopy: "Open the role details and use Email this role. Include the role title, target city, availability, and resume in the email.",
    search: "Search role, city, keyword",
    allRegions: "All locations",
    mainland: "Mainland China",
    hongkong: "Hong Kong",
    taiwan: "Taiwan",
    overseas: "Overseas",
    allFunctions: "All functions",
    view: "View JD",
    count: (n) => `${n} matching roles`,
    emailTemplate: "Email referral",
    roleEmail: "Email this role",
    apply: "Original link",
    noLink: "No external link",
  },
};

const els = {
  totalJobs: document.querySelector("#totalJobs"),
  searchInput: document.querySelector("#searchInput"),
  regionFilters: document.querySelector("#regionFilters"),
  functionFilters: document.querySelector("#functionFilters"),
  jobGrid: document.querySelector("#jobGrid"),
  resultCount: document.querySelector("#resultCount"),
  drawer: document.querySelector("#jobDrawer"),
  drawerTitle: document.querySelector("#drawerTitle"),
  drawerSource: document.querySelector("#drawerSource"),
  drawerMeta: document.querySelector("#drawerMeta"),
  drawerBody: document.querySelector("#drawerBody"),
  applyLink: document.querySelector("#applyLink"),
  emailThisRole: document.querySelector("#emailThisRole"),
  closeDrawer: document.querySelector("#closeDrawer"),
};

function inferFunction(job) {
  if (job.function) return job.function;
  const text = `${job.title || ""} ${job.titleZh || ""}`.toLowerCase();
  if (/recruit|talent|hr/.test(text)) return "HR";
  if (/account|bd|sales|business|growth|marketing|content|corporate/.test(text)) return "Sales";
  if (/legal|accountant|finance/.test(text)) return "Operation";
  if (/infra|sre|site reliability|network|facility|data center|pmo|sourcing/.test(text)) return "Infra";
  return "Engineering";
}

function inferRegionGroup(job) {
  const text = `${job.region || ""} ${job.location || ""} ${job.locationZh || ""}`.toLowerCase();
  if (/hong kong|hongkong|香港/.test(text)) return "hongkong";
  if (/taiwan|taipei|neihu|台北|台湾|臺灣/.test(text)) return "taiwan";
  if (/beijing|shanghai|hangzhou|shenzhen|wangjing|china|北京|上海|杭州|深圳|望京|中国区/.test(text)) return "mainland";
  return "overseas";
}

function t(key, ...args) {
  const value = i18n[state.lang][key];
  return typeof value === "function" ? value(...args) : value;
}

function textFor(job, key) {
  if (state.lang === "zh") return job[`${key}Zh`] || job[key] || "";
  return job[key] || job[`${key}Zh`] || "";
}

function jdFor(job) {
  if (state.lang === "zh") return job.jdZh || job.jdEn || "";
  return job.jdEn || job.jdZh || "";
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function filteredJobs() {
  const q = normalize(state.query);
  return jobs.filter((job) => {
    const matchesRegion = state.region === "all" || job.regionGroup === state.region;
    const matchesFunction = state.function === "all" || job.function === state.function;
    const haystack = normalize([
      job.title,
      job.titleZh,
      job.company,
      job.location,
      job.locationZh,
      job.jdEn,
      job.jdZh,
      job.function,
    ].join(" "));
    return matchesRegion && matchesFunction && (!q || haystack.includes(q));
  });
}

function renderStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
  els.searchInput.placeholder = t("search");
  const emailPitch = document.querySelector("#emailPitchBottom");
  if (emailPitch) {
    emailPitch.textContent = t("emailTemplate");
    emailPitch.href = mailtoLink();
  }
  document.querySelectorAll("[data-contact-link]").forEach((link) => {
    link.href = mailtoLink();
  });
  els.totalJobs.textContent = String(jobs.length);
}

function renderFilters() {
  const regionOptions = [
    ["all", t("allRegions")],
    ["mainland", t("mainland")],
    ["hongkong", t("hongkong")],
    ["taiwan", t("taiwan")],
    ["overseas", t("overseas")],
  ];
  const functionOptions = [["all", t("allFunctions")], ...Array.from(new Set(jobs.map((job) => job.function))).sort().map((fn) => [fn, fn])];

  els.regionFilters.innerHTML = regionOptions.map(([value, label]) => filterButton("region", value, label, state.region === value)).join("");
  els.functionFilters.innerHTML = functionOptions.map(([value, label]) => filterButton("function", value, label, state.function === value)).join("");
}

function filterButton(kind, value, label, active) {
  return `<button class="filter-btn ${active ? "active" : ""}" type="button" data-filter-kind="${kind}" data-filter-value="${value}">${label}</button>`;
}

function renderJobs() {
  const list = filteredJobs();
  els.resultCount.textContent = t("count", list.length);
  els.jobGrid.innerHTML = list.map((job) => {
    const jd = jdFor(job).replace(/\s+/g, " ").trim();
    const excerpt = jd.length > 150 ? `${jd.slice(0, 150)}...` : jd;
    const regionLabel = t(job.regionGroup);
    return `
      <button class="job-card" type="button" data-job-id="${job.id}">
        <header>
          <h3>${escapeHtml(textFor(job, "title"))}</h3>
          <span class="tag">${regionLabel}</span>
        </header>
        <div class="meta">
          <span>${escapeHtml(textFor(job, "location"))}</span>
          <span>${escapeHtml(job.company || "GMI Cloud")} · ${escapeHtml(job.function)}</span>
        </div>
        <p class="excerpt">${escapeHtml(excerpt)}</p>
        <footer>
          <span>${escapeHtml(job.postedDate || "Open")}</span>
          <span>${t("view")} →</span>
        </footer>
      </button>
    `;
  }).join("");
}

function openDrawer(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return;
  state.selectedJob = job;
  els.drawerTitle.textContent = textFor(job, "title");
  els.drawerSource.textContent = textFor(job, "location") || t(job.regionGroup);
  const criteria = state.lang === "zh" ? job.criteriaZh || job.criteria || {} : job.criteria || job.criteriaZh || {};
  els.drawerMeta.innerHTML = [
    [state.lang === "zh" ? "地点" : "Location", textFor(job, "location")],
    [state.lang === "zh" ? "区域" : "Region", t(job.regionGroup)],
    [state.lang === "zh" ? "公司" : "Company", job.company || "GMI Cloud"],
    [state.lang === "zh" ? "职能" : "Function", job.function],
    [state.lang === "zh" ? "状态" : "Status", job.postedRelative || job.postedDate || "Open"],
    ...Object.entries(criteria).slice(0, 4),
  ].map(([key, value]) => `<span><strong>${escapeHtml(key)}</strong><br>${escapeHtml(value)}</span>`).join("");
  els.drawerBody.textContent = jdFor(job);
  els.applyLink.textContent = job.url ? t("apply") : t("noLink");
  els.applyLink.href = job.url || "#";
  els.applyLink.classList.toggle("disabled", !job.url);
  els.emailThisRole.textContent = t("roleEmail");
  els.emailThisRole.href = mailtoLink(job);
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function referralText(job = null) {
  if (state.lang === "zh") {
    if (job) return `Victor 你好，\n\n我想投递 AI Infra 内推岗位：${textFor(job, "title")}\n目标地点：${textFor(job, "location")}\n可入职时间：____\n当前所在城市：____\n\n附件中是我的简历，麻烦帮忙内推，谢谢。`;
    return "Victor 你好，\n\n我想投递 AI Infra 内推岗位：____\n目标地点：____\n可入职时间：____\n当前所在城市：____\n\n附件中是我的简历，麻烦帮忙内推，谢谢。";
  }
  if (job) return `Hi Victor,\n\nI would like to apply for this AI Infra referral role: ${textFor(job, "title")}\nTarget location: ${textFor(job, "location")}\nAvailability: ____\nCurrent city: ____\n\nMy resume is attached. Thank you.`;
  return "Hi Victor,\n\nI would like to apply for this AI Infra referral role: ____\nTarget location: ____\nAvailability: ____\nCurrent city: ____\n\nMy resume is attached. Thank you.";
}

function mailtoLink(job = null) {
  const subject = state.lang === "zh"
    ? `AI Infra 内推咨询${job ? ` - ${textFor(job, "title")}` : ""}`
    : `AI Infra referral inquiry${job ? ` - ${textFor(job, "title")}` : ""}`;
  return `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(referralText(job))}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  renderStaticText();
  renderFilters();
  renderJobs();
  if (state.selectedJob && els.drawer.classList.contains("open")) {
    openDrawer(state.selectedJob.id);
  }
}

document.addEventListener("click", (event) => {
  const langBtn = event.target.closest("[data-lang]");
  if (langBtn) {
    state.lang = langBtn.dataset.lang;
    render();
    return;
  }

  const filterBtn = event.target.closest("[data-filter-kind]");
  if (filterBtn) {
    state[filterBtn.dataset.filterKind] = filterBtn.dataset.filterValue;
    render();
    return;
  }

  const card = event.target.closest("[data-job-id]");
  if (card) {
    openDrawer(card.dataset.jobId);
  }
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderJobs();
});

els.closeDrawer.addEventListener("click", closeDrawer);
els.drawer.addEventListener("click", (event) => {
  if (event.target === els.drawer) closeDrawer();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawer();
});

function startSignalCanvas() {
  const canvas = document.querySelector("#signalCanvas");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const points = Array.from({ length: 54 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0005,
    vy: (Math.random() - 0.5) * 0.0005,
    r: i % 7 === 0 ? 2.3 : 1.4,
  }));

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(112,246,255,0.18)";
    ctx.fillStyle = "rgba(162,255,155,0.72)";
    points.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.r * window.devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    });
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 * window.devicePixelRatio) {
          ctx.globalAlpha = 1 - dist / (160 * window.devicePixelRatio);
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

render();
startSignalCanvas();
