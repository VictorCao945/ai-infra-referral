const state = {
  lang: "zh",
  query: "",
  region: "all",
  function: "all",
  selectedJob: null,
};

const referralEmail = "victorowen945@qq.com";
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

const anonymousCompany = {
  zh: "AI 基础设施公司",
  en: "AI infrastructure company",
};

const functionLabels = {
  Engineering: { zh: "工程研发", en: "Engineering" },
  Infra: { zh: "基础设施", en: "Infrastructure" },
  Sales: { zh: "商业化 / 售前", en: "Sales / Solutions" },
  Operation: { zh: "运营 / 财务", en: "Operations / Finance" },
  Marketing: { zh: "市场 / 内容", en: "Marketing / Content" },
  Design: { zh: "设计", en: "Design" },
  HR: { zh: "招聘 / HR", en: "Recruiting / HR" },
  Product: { zh: "产品", en: "Product" },
};

const listingTracks = [
  {
    id: "gpu-cloud",
    titleZh: "GPU Cloud / 算力云",
    title: "GPU Cloud / Compute Cloud",
    copyZh: "GPU 云、裸金属、Kubernetes、资源调度、计费、交付与客户成功岗位。",
    copy: "GPU cloud, bare metal, Kubernetes, scheduling, billing, delivery, and customer success roles.",
  },
  {
    id: "model-infra",
    titleZh: "模型服务 / MLOps",
    title: "Model Serving / MLOps",
    copyZh: "LLM 推理、训练平台、模型部署、可观测性、数据与评测平台岗位。",
    copy: "LLM inference, training platforms, model deployment, observability, data, and evaluation platform roles.",
  },
  {
    id: "datacenter-network",
    titleZh: "数据中心 / 网络",
    title: "Data Center / Networking",
    copyZh: "AI 集群网络、InfiniBand、RoCE、SRE、设施、电力、采购与供应链岗位。",
    copy: "AI cluster networking, InfiniBand, RoCE, SRE, facilities, power, procurement, and supply chain roles.",
  },
  {
    id: "gtm-ops",
    titleZh: "GTM / 运营 / 市场",
    title: "GTM / Ops / Marketing",
    copyZh: "售前、解决方案、开发者关系、技术内容、招聘、财务与运营岗位。",
    copy: "Pre-sales, solutions, developer relations, technical content, recruiting, finance, and operations roles.",
  },
];

const i18n = {
  zh: {
    eyebrow: "聚合内推通道 · GPU Cloud / AI Infra",
    headline: "AI Infra 内推",
    lead: "聚合 AI 基础设施岗位内推，找到合适机会后可直接邮件发送简历，我会协助确认匹配度并推进内推。",
    metricJobs: "岗位总数",
    metricTrack: "地区覆盖",
    linkedinCta: "公司动态",
    contactCta: "联系内推",
    listRoleCta: "上架岗位",
    boardEyebrow: "Open Roles",
    boardTitle: "正在内推的岗位",
    company: "企业",
    companyDisclosure: "企业信息",
    companyHidden: "企业详情可邮件确认",
    companyVisible: "企业信息已展示",
    sourceLink: "打开来源",
    mainlandDetailNote: "中国区岗位企业信息不在公开页面展示，可邮件确认企业详情、岗位归属和匹配建议。",
    ctaEyebrow: "Referral Signal",
    ctaTitle: "已有目标岗位？",
    ctaCopy: "打开对应岗位详情，点击“邮件投递”即可带上岗位标题发送简历。大陆岗位公司详情不在公开页面展示，可联系我进一步了解。",
    intakeEyebrow: "For AI Infra Companies",
    intakeTitle: "提交更多AI Infra岗位",
    intakeCopy: "欢迎提交GPU Cloud、模型服务、数据中心网络、MLOps、GTM 等相关岗位。",
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
    noLink: "无外部链接",
  },
  en: {
    eyebrow: "Aggregated referral channel · GPU Cloud / AI Infra",
    headline: "AI Infra Referrals",
    lead: "An aggregated referral board for AI infrastructure roles. Find relevant GPU Cloud, model serving, data center, and MLOps opportunities, then email your resume for referral support.",
    metricJobs: "open roles",
    metricTrack: "location groups",
    linkedinCta: "Company updates",
    contactCta: "Contact referral",
    listRoleCta: "List roles",
    boardEyebrow: "Open Roles",
    boardTitle: "Roles open for referral",
    company: "Company",
    companyDisclosure: "Company info",
    companyHidden: "Available by email",
    companyVisible: "Company details shown",
    sourceLink: "Open source",
    mainlandDetailNote: "Company details for Mainland China roles are not shown publicly. Email me to confirm the company, role ownership, and fit.",
    ctaEyebrow: "Referral Signal",
    ctaTitle: "Know your target role?",
    ctaCopy: "Open the role details and use Email this role. Company details for Mainland China roles are not shown publicly; contact me to learn more.",
    intakeEyebrow: "For AI Infra Companies",
    intakeTitle: "Submit more AI Infra roles",
    intakeCopy: "GPU Cloud, model serving, data center networking, MLOps, GTM, and related roles are welcome.",
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
    noLink: "No external link",
  },
};

const els = {
  totalJobs: document.querySelector("#totalJobs"),
  regionCount: document.querySelector("#regionCount"),
  searchInput: document.querySelector("#searchInput"),
  regionFilters: document.querySelector("#regionFilters"),
  functionFilters: document.querySelector("#functionFilters"),
  jobGrid: document.querySelector("#jobGrid"),
  listingOptions: document.querySelector("#listingOptions"),
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

function functionLabel(value) {
  const item = functionLabels[value];
  if (!item) return value;
  return state.lang === "zh" ? item.zh : item.en;
}

function shouldHideCompany(job) {
  return job.regionGroup === "mainland";
}

function companyNameFor(job) {
  if (shouldHideCompany(job)) return state.lang === "zh" ? anonymousCompany.zh : anonymousCompany.en;
  const company = String(job.company || "").trim();
  if (company && !/^AI Infrastructure Company$/i.test(company)) return company;
  const rawText = `${job.jdEn || ""} ${job.jdZh || ""}`;
  if (/GMI Cloud|GMI云|\bGMI\b/i.test(rawText)) return "GMI Cloud";
  return company || (state.lang === "zh" ? anonymousCompany.zh : anonymousCompany.en);
}

function jdFor(job) {
  const preferred = state.lang === "zh" ? job.jdZh || "" : job.jdEn || "";
  const fallback = state.lang === "zh" ? job.jdEn || "" : job.jdZh || "";
  const jd = preferred || fallback;
  const body = shouldHideCompany(job) ? anonymizeText(stripCompanyIntro(jd)) : jd;
  return String(body || "").trim();
}

function drawerBodyFor(job) {
  const note = shouldHideCompany(job) ? t("mainlandDetailNote") : "";
  return [note, jdFor(job)].filter(Boolean).join("\n\n");
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
      companyNameFor(job),
      job.location,
      job.locationZh,
      shouldHideCompany(job) ? jdFor(job) : `${job.jdEn || ""} ${job.jdZh || ""}`,
      job.function,
      functionLabel(job.function),
    ].join(" "));
    return matchesRegion && matchesFunction && (!q || haystack.includes(q));
  });
}

function stripCompanyIntro(value) {
  let text = String(value || "");
  text = text.replace(/^(About (?:GMI Cloud|GMI|US|Us)[\s\S]*?)(?=\n\n(?:The Role|Role Overview|About this role|Location:|Team:|We're|We are seeking|As a|What You'll Do|Responsibilities|Key Responsibilities|Overview))/i, "");
  text = text.replace(/^(关于(?:GMI Cloud|GMI云|GMI|我们)[\s\S]*?)(?=\n\n(?:关于此角色|岗位介绍|职位简介|角色|工作职责|岗位职责|职责描述|任职要求|作为|我们正在寻找|该岗位主要|职位概述|你的职责|解决方案架构师))/u, "");
  text = text.replace(/^GMI Cloud｜总部山景城[\s\S]*?(?=\n\n岗位介绍)/u, "");
  return text.trim();
}

function anonymizeText(value) {
  return String(value || "")
    .replace(/GMI Cloud/gi, state.lang === "zh" ? "该公司" : "the company")
    .replace(/GMI云/gi, "该公司")
    .replace(/\bGMI's\b/g, "the company's")
    .replace(/\bGMI\b/g, state.lang === "zh" ? "该公司" : "the company")
    .replace(/gmicloud\.ai/gi, "company-domain.example")
    .replace(/gmi-cloud-ai/gi, "company-profile");
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
  document.querySelectorAll("[data-list-role-link]").forEach((link) => {
    link.href = listRoleMailtoLink();
  });
  els.totalJobs.textContent = String(jobs.length);
  if (els.regionCount) {
    els.regionCount.textContent = String(new Set(jobs.map((job) => job.regionGroup)).size);
  }
}

function renderListingOptions() {
  if (!els.listingOptions) return;
  els.listingOptions.innerHTML = listingTracks.map((track) => `
    <article class="listing-option">
      <strong>${escapeHtml(state.lang === "zh" ? track.titleZh : track.title)}</strong>
      <p>${escapeHtml(state.lang === "zh" ? track.copyZh : track.copy)}</p>
    </article>
  `).join("");
}

function renderFilters() {
  const regionOptions = [
    ["all", t("allRegions")],
    ["mainland", t("mainland")],
    ["hongkong", t("hongkong")],
    ["taiwan", t("taiwan")],
    ["overseas", t("overseas")],
  ];
  const functionOptions = [["all", t("allFunctions")], ...Array.from(new Set(jobs.map((job) => job.function))).sort().map((fn) => [fn, functionLabel(fn)])];

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
          <span>${escapeHtml(companyNameFor(job))} · ${escapeHtml(functionLabel(job.function))}</span>
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
    [t("company"), companyNameFor(job)],
    [t("companyDisclosure"), shouldHideCompany(job) ? t("companyHidden") : t("companyVisible")],
    [state.lang === "zh" ? "区域" : "Region", t(job.regionGroup)],
    [state.lang === "zh" ? "职能" : "Function", functionLabel(job.function)],
    [state.lang === "zh" ? "状态" : "Status", job.postedRelative || job.postedDate || "Open"],
    ...Object.entries(criteria),
  ].map(([key, value]) => `<span><strong>${escapeHtml(key)}</strong><br>${escapeHtml(value)}</span>`).join("");
  els.drawerBody.textContent = drawerBodyFor(job);
  if (!shouldHideCompany(job) && job.url) {
    els.applyLink.textContent = t("sourceLink");
    els.applyLink.href = job.url;
    els.applyLink.target = "_blank";
    els.applyLink.rel = "noreferrer";
    els.applyLink.hidden = false;
    els.applyLink.style.display = "";
  } else {
    els.applyLink.hidden = true;
    els.applyLink.style.display = "none";
    els.applyLink.textContent = "";
    els.applyLink.href = "#";
    els.applyLink.removeAttribute("target");
    els.applyLink.removeAttribute("rel");
  }
  els.applyLink.classList.remove("disabled");
  els.emailThisRole.textContent = t("roleEmail");
  els.emailThisRole.href = mailtoLink(job);
  els.drawer.classList.add("open");
  els.drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  els.drawer.classList.remove("open");
  els.drawer.setAttribute("aria-hidden", "true");
}

function referralText(job = null, askCompanyDetails = false) {
  if (state.lang === "zh") {
    if (job && askCompanyDetails) return `Victor 你好，\n\n我想了解这个 AI Infra 内推岗位的更多信息：${textFor(job, "title")}\n目标企业：${companyNameFor(job)}\n目标地点：${textFor(job, "location")}\n\n也想确认该岗位是否适合我的背景。谢谢。`;
    if (job) return `Victor 你好，\n\n我想投递 AI Infra 内推岗位：${textFor(job, "title")}\n目标企业：${companyNameFor(job)}\n目标地点：${textFor(job, "location")}\n可入职时间：____\n当前所在城市：____\n\n附件中是我的简历，麻烦帮忙内推，谢谢。`;
    return "Victor 你好，\n\n我想投递 AI Infra 内推岗位：____\n目标地点：____\n可入职时间：____\n当前所在城市：____\n\n附件中是我的简历，麻烦帮忙内推，谢谢。";
  }
  if (job && askCompanyDetails) return `Hi Victor,\n\nI would like to learn more about this AI Infra referral role: ${textFor(job, "title")}\nTarget company: ${companyNameFor(job)}\nTarget location: ${textFor(job, "location")}\n\nI would also like to check whether my background is a fit. Thank you.`;
  if (job) return `Hi Victor,\n\nI would like to apply for this AI Infra referral role: ${textFor(job, "title")}\nTarget company: ${companyNameFor(job)}\nTarget location: ${textFor(job, "location")}\nAvailability: ____\nCurrent city: ____\n\nMy resume is attached. Thank you.`;
  return "Hi Victor,\n\nI would like to apply for this AI Infra referral role: ____\nTarget location: ____\nAvailability: ____\nCurrent city: ____\n\nMy resume is attached. Thank you.";
}

function mailtoLink(job = null, askCompanyDetails = false) {
  const subject = state.lang === "zh"
    ? `${askCompanyDetails ? "AI Infra 公司详情咨询" : "AI Infra 内推咨询"}${job ? ` - ${textFor(job, "title")}` : ""}`
    : `${askCompanyDetails ? "AI Infra company details inquiry" : "AI Infra referral inquiry"}${job ? ` - ${textFor(job, "title")}` : ""}`;
  return `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(referralText(job, askCompanyDetails))}`;
}

function listRoleMailtoLink() {
  const subject = state.lang === "zh" ? "AI Infra 岗位上架申请" : "AI Infra role listing request";
  const body = state.lang === "zh"
    ? "Victor 你好，\n\n我想在 AI Infra 内推页提交岗位。\n\n公司名称：____\n公司官网 / LinkedIn：____\n岗位名称：____\n岗位地区：____\n办公方式：____\n岗位 JD：____\n是否支持内推：____\n联系人：____\n\n谢谢。"
    : "Hi Victor,\n\nI would like to list AI Infra roles on the referral board.\n\nCompany name: ____\nCompany website / LinkedIn: ____\nRole title: ____\nRegion: ____\nWork style: ____\nJob description: ____\nReferral support: ____\nContact person: ____\n\nThank you.";
  return `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  renderListingOptions();
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
