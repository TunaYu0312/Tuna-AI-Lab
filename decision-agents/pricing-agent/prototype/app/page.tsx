"use client";

import { useMemo, useState } from "react";

type StageId = "brief" | "facts" | "options" | "evidence" | "decision";
type DecisionType = "批准" | "条件批准" | "试点" | "延期" | "否决";

const stages: { id: StageId; no: string; label: string; question: string }[] = [
  { id: "brief", no: "01", label: "当前决策", question: "我们究竟要决定什么？" },
  { id: "facts", no: "02", label: "共同事实", question: "我们确定知道什么？" },
  { id: "options", no: "03", label: "方案与权衡", question: "收益、代价与风险是什么？" },
  { id: "evidence", no: "04", label: "问题与证据", question: "什么会改变我们的选择？" },
  { id: "decision", no: "05", label: "决策与复盘", question: "如何执行、止损与学习？" },
];

const facts = [
  {
    status: "事实",
    statusClass: "verified",
    metric: "A 套餐 ADQ",
    value: "86 份",
    change: "近 8 周 −3.2%",
    note: "UPH 68.3 份/百单 × ADTC 126 单/店日；商圈拆分另见下表",
    source: "POS 订单明细 · 2026/05/18—07/12 · 312 家店 · 昨日 23:40 刷新",
  },
  {
    status: "事实",
    statusClass: "verified",
    metric: "单位完整贡献",
    value: "¥9.40",
    change: "食材成本同比 +8.6%",
    note: "已扣除包装、支付渠道与平均报废；尚未含增量人工",
    source: "BOM v4.8 + 财务成本表 · 2026/07/15 · 全市场 · 置信度高",
  },
  {
    status: "估算",
    statusClass: "estimate",
    metric: "¥30 对 A 套餐 UPH 的影响",
    value: "−4.8%",
    change: "区间 −2.5%—−8.0%",
    note: "社区高频会员最敏感；交通枢纽午餐刚需相对稳定",
    source: "历史促销反推 + 相似套餐 · 18 次事件 · 置信度中",
  },
  {
    status: "假设",
    statusClass: "assumption",
    metric: "高峰增量工时",
    value: "+0.35 h",
    change: "每店每日",
    note: "销量迁移与批次备货可能加剧 11:30—13:00 瓶颈",
    source: "运营访谈 · 待用 KDS 工时与工位产能分析验证",
  },
];

const schemes = [
  {
    id: "0",
    name: "维持现状",
    route: "全国 ¥28",
    price: "¥28",
    volume: "基准",
    revenue: "0.0%",
    revenueScope: "全部商圈通过",
    normalized: "¥0",
    contribution: "¥0",
    eligible: "基准方案",
    eligibleTone: "neutral",
    ops: "低",
    valueRisk: "低",
    signal: "利润缺口持续",
  },
  {
    id: "A",
    name: "统一调价",
    route: "全部市场 ¥30",
    price: "¥30",
    volume: "−4.6%",
    revenue: "+2.2%",
    revenueScope: "社区 −1.6%",
    normalized: "+¥3,267",
    contribution: "+¥9.8 万",
    eligible: "有条件通过",
    eligibleTone: "warning",
    ops: "中",
    valueRisk: "高",
    signal: "整体销售额通过，但社区商圈下降，不能直接全面推广",
  },
  {
    id: "B",
    name: "分商圈定价",
    route: "办公/枢纽 ¥30 · 社区 ¥28",
    price: "¥28–30",
    volume: "−3.4%",
    revenue: "+2.7%",
    revenueScope: "0 个商圈下降",
    normalized: "+¥2,467",
    contribution: "+¥7.4 万",
    eligible: "通过",
    eligibleTone: "success",
    ops: "中",
    valueRisk: "中",
    signal: "通过销售额守门；需承担价差解释与执行成本",
  },
  {
    id: "C",
    name: "套餐重构",
    route: "保持 ¥28 · 调整权益",
    price: "¥28",
    volume: "+1.2%",
    revenue: "+1.2%",
    revenueScope: "0 个商圈下降",
    normalized: "+¥1,067",
    contribution: "+¥3.2 万",
    eligible: "通过",
    eligibleTone: "success",
    ops: "高",
    valueRisk: "低",
    signal: "出餐复杂度上升",
  },
  {
    id: "D",
    name: "30 店试点",
    route: "办公/枢纽 ¥30 · 6 周",
    price: "¥30",
    volume: "−2.8%",
    revenue: "+4.1%",
    revenueScope: "试点商圈均通过",
    normalized: "+¥1,900",
    contribution: "+¥5.7 万",
    eligible: "验证路线",
    eligibleTone: "estimate",
    ops: "可控",
    valueRisk: "可验证",
    signal: "用于验证策略 B，不与价格策略平行比较",
  },
];

const marketRows = [
  {
    market: "商务办公",
    stores: "128 店",
    baselineSales: "¥1,096.7 万",
    elasticity: "−3.1%",
    revenueChange: "+3.8%",
    revenueAfter: "¥1,138.6 万",
    revenueStatus: "通过",
    capacity: "82%",
    memberRisk: "中",
    contribution: "+¥4.1 万",
    action: "建议纳入",
    className: "go",
  },
  {
    market: "交通枢纽",
    stores: "46 店",
    baselineSales: "¥363.2 万",
    elasticity: "−2.4%",
    revenueChange: "+4.6%",
    revenueAfter: "¥379.8 万",
    revenueStatus: "通过",
    capacity: "89%",
    memberRisk: "低",
    contribution: "+¥2.6 万",
    action: "限产能店",
    className: "watch",
  },
  {
    market: "社区",
    stores: "138 店",
    baselineSales: "¥707.1 万",
    elasticity: "−8.2%",
    revenueChange: "−1.6%",
    revenueAfter: "¥695.5 万",
    revenueStatus: "下降",
    capacity: "63%",
    memberRisk: "高",
    contribution: "+¥0.7 万",
    action: "暂不调价",
    className: "stop",
  },
];

const menuProducts = [
  {
    id: "target",
    name: "A 套餐",
    relation: "目标产品",
    baseUph: 68.3,
    basePrice: 28,
    scenarioPrice: 30,
    unitCost: 18.6,
    migrationWeight: 0,
  },
  {
    id: "economy",
    name: "经济型套餐",
    relation: "降档替代",
    baseUph: 42,
    basePrice: 24,
    scenarioPrice: 24,
    unitCost: 15.6,
    migrationWeight: 0.45,
  },
  {
    id: "single",
    name: "单品与加购",
    relation: "拆套替代",
    baseUph: 60,
    basePrice: 10,
    scenarioPrice: 10,
    unitCost: 4.8,
    migrationWeight: 0.25,
  },
  {
    id: "premium",
    name: "高价值套餐",
    relation: "升级/同类迁移",
    baseUph: 24,
    basePrice: 36,
    scenarioPrice: 36,
    unitCost: 21.2,
    migrationWeight: 0.1,
  },
  {
    id: "other",
    name: "其他产品",
    relation: "长尾承接",
    baseUph: 18,
    basePrice: 18,
    scenarioPrice: 18,
    unitCost: 10.5,
    migrationWeight: 0.2,
  },
];

const questions = [
  {
    priority: "P0",
    title: "高峰销量迁移是否会触发瓶颈工位加班与报废？",
    owner: "林珊 · 数据分析",
    due: "会中 · 12:25",
    analysis: "产品工时 × 瓶颈产能 × 报废情景",
    state: "待运行",
  },
  {
    priority: "P0",
    title: "社区核心会员对 2 元涨幅的复购风险有多大？",
    owner: "周可 · 用户研究",
    due: "07/31 18:00",
    analysis: "会员价格敏感度 × 购买频次分层",
    state: "证据不足",
  },
  {
    priority: "P1",
    title: "分商圈价格差异是否会引发跨店投诉？",
    owner: "季敏 · 品牌",
    due: "08/01 12:00",
    analysis: "历史价差投诉 × 门店半径重叠",
    state: "排队中",
  },
];

const actionItems = [
  { date: "08/03", title: "锁定试点与对照门店", owner: "陈然 · 区域运营", status: "准备中" },
  { date: "08/06", title: "完成菜单、收银与员工话术培训", owner: "季敏 · 品牌", status: "未开始" },
  { date: "08/10", title: "启动 30 店 × 6 周试点", owner: "许澈 · 定价项目", status: "里程碑" },
  { date: "08/17", title: "首周 Guardrail 检查点", owner: "林珊 · 数据分析", status: "检查点" },
  { date: "09/21", title: "正式复盘与扩大决策", owner: "高远 · COO", status: "复盘" },
];

function DataBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`data-badge ${tone}`}>{children}</span>;
}

export default function Home() {
  const [activeStage, setActiveStage] = useState<StageId>("brief");
  const [selectedScheme, setSelectedScheme] = useState("B");
  const [selectedMarket, setSelectedMarket] = useState("全部商圈");
  const [meetingLive, setMeetingLive] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [analysisApplied, setAnalysisApplied] = useState(false);
  const [decisionType, setDecisionType] = useState<DecisionType>("试点");
  const [frozen, setFrozen] = useState(false);
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [uphDelta, setUphDelta] = useState(-3);
  const [seasonAdtc, setSeasonAdtc] = useState(126);
  const [recaptureRate, setRecaptureRate] = useState(62);
  const [notice, setNotice] = useState("");
  const [signal, setSignal] = useState("");
  const [signalAdded, setSignalAdded] = useState(false);

  const active = stages.find((stage) => stage.id === activeStage) ?? stages[0];
  const activeIndex = stages.findIndex((stage) => stage.id === activeStage);
  const previousStage = activeIndex > 0 ? stages[activeIndex - 1] : null;
  const nextStage = activeIndex < stages.length - 1 ? stages[activeIndex + 1] : null;
  const baselineUph = menuProducts[0].baseUph;
  const scenarioUph = baselineUph * (1 + uphDelta / 100);
  const baselineAdq = (baselineUph / 100) * seasonAdtc;
  const scenarioAdq = (scenarioUph / 100) * seasonAdtc;
  const operatingCost = Math.max(2.2, 3.8 + uphDelta * 0.16) * (seasonAdtc / 126);
  const baselineTargetGrossProfit = ((28 - 18.6) * baselineAdq * 30 * 30) / 10000;
  const scenarioTargetGrossProfit = ((30 - 18.6) * scenarioAdq * 30 * 30) / 10000;
  const netContribution = scenarioTargetGrossProfit - baselineTargetGrossProfit - operatingCost;
  const revenueDelta = useMemo(
    () => ((30 / 28) * (1 + uphDelta / 100) - 1) * 100,
    [uphDelta],
  );
  const baselineRevenue = (28 * baselineAdq * 30 * 30) / 10000;
  const scenarioRevenue = (30 * scenarioAdq * 30 * 30) / 10000;
  const revenuePass = revenueDelta >= 0;
  const mixModel = useMemo(() => {
    const targetAfterUph = menuProducts[0].baseUph * (1 + uphDelta / 100);
    const lostTargetUph = Math.max(0, menuProducts[0].baseUph - targetAfterUph);
    const recapturedUph = lostTargetUph * (recaptureRate / 100);
    const rows = menuProducts.map((product) => {
      const afterUph = product.id === "target"
        ? targetAfterUph
        : product.baseUph + recapturedUph * product.migrationWeight;
      return { ...product, afterUph };
    });
    const baseTotalUph = rows.reduce((sum, row) => sum + row.baseUph, 0);
    const afterTotalUph = rows.reduce((sum, row) => sum + row.afterUph, 0);
    const baseRevenuePer100 = rows.reduce((sum, row) => sum + row.baseUph * row.basePrice, 0);
    const afterRevenuePer100 = rows.reduce((sum, row) => sum + row.afterUph * row.scenarioPrice, 0);
    const baseGrossProfitPer100 = rows.reduce(
      (sum, row) => sum + row.baseUph * (row.basePrice - row.unitCost),
      0,
    );
    const afterGrossProfitPer100 = rows.reduce(
      (sum, row) => sum + row.afterUph * (row.scenarioPrice - row.unitCost),
      0,
    );
    const monthScale = (seasonAdtc / 100) * 30 * 30 / 10000;
    return {
      rows: rows.map((row) => ({
        ...row,
        baseMix: (row.baseUph / baseTotalUph) * 100,
        afterMix: (row.afterUph / afterTotalUph) * 100,
      })),
      lostTargetUph,
      recapturedUph,
      baseRevenue: baseRevenuePer100 * monthScale,
      afterRevenue: afterRevenuePer100 * monthScale,
      revenueDelta: ((afterRevenuePer100 / baseRevenuePer100) - 1) * 100,
      baseGrossProfit: baseGrossProfitPer100 * monthScale,
      afterGrossProfit: afterGrossProfitPer100 * monthScale,
      grossProfitDelta: ((afterGrossProfitPer100 / baseGrossProfitPer100) - 1) * 100,
      baseMargin: (baseGrossProfitPer100 / baseRevenuePer100) * 100,
      afterMargin: (afterGrossProfitPer100 / afterRevenuePer100) * 100,
    };
  }, [uphDelta, recaptureRate, seasonAdtc]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function exportDecision() {
    const body = `# 菜单定价决策纪要

决策编号：PRC-2026-071
状态：${frozen ? "正式版本 v1.0（已冻结）" : "会议草案"}

## 决策命题
是否从 2026 年 9 月起，将 A 套餐从 28 元调整至 30 元，首先在商务办公和交通枢纽商圈的 30 家门店开展 6 周试点，以提升门店净增量贡献，同时确保核心会员复购、P90 出餐、报废与投诉不突破阈值？

## 最终决定
${decisionType}：策略 B「分商圈定价」+ 路线 D「30 店 × 6 周试点」

## 决策理由
- 在保留学习价值的同时限制品牌与运营下行风险
- 办公与枢纽商圈的价格敏感度低于社区
- 调价先作用于 A 套餐 UPH，再以同季 ADTC 换算 ADQ
- 先验证 Product Mix、增量人工、瓶颈产能与报废假设，再决定扩大

## Guardrails
- A 套餐整体销售额不得下降；任一纳入商圈销售额下降则不得直接推广
- 核心会员 14 日复购降幅不得超过 2.0pp
- P90 出餐不得超过 8 分 30 秒
- 报废率不得超过 3.8%；价格投诉率不得超过 0.25%

## Product Mix 口径
- ADQ = UPH × ADTC；价格直接影响 UPH，ADTC 使用同季客流基线
- 相关产品替代与迁移参数须由分析师基于历史调价事件校准
- 整体菜单销售额、毛利额与毛利率均按调价后 Product Mix 重算

## 复盘
2026-09-21，由 COO 高远主持，区分决策质量、执行偏差与外部变化。

> 本文全部数值均为原型模拟数据。`;
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRC-2026-071-定价决策纪要.md";
    link.click();
    URL.revokeObjectURL(url);
    flash("Markdown 决策纪要已生成");
  }

  function finalizeDecision() {
    setFrozen(true);
    setShowDecisionPanel(false);
    setActiveStage("decision");
    flash(`已记录“${decisionType}”并冻结正式版本 v1.0`);
  }

  function addSignal() {
    if (!signal.trim()) {
      flash("请先输入一个观点或问题");
      return;
    }
    setSignalAdded(true);
    setSignal("");
    flash("已识别为“待验证假设”并加入证据队列");
  }

  return (
    <main className="app-shell">
      {notice && <div className="toast" role="status">{notice}</div>}

      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">价</span>
          <div>
            <div className="eyebrow">MENU PRICING DECISION ROOM</div>
            <div className="brand-title">菜单定价决策室</div>
          </div>
        </div>

        <div className="case-meta">
          <div>
            <span className="meta-label">决策编号</span>
            <strong>PRC-2026-071</strong>
          </div>
          <div>
            <span className="meta-label">最终决策人</span>
            <strong>高远 · COO</strong>
          </div>
          <div>
            <span className="meta-label">决策截止</span>
            <strong>2026.08.03</strong>
          </div>
        </div>

        <div className="top-actions">
          <button className="quiet-button" onClick={exportDecision}>导出纪要</button>
          <button
            className={`meeting-button ${meetingLive ? "live" : ""}`}
            onClick={() => {
              setMeetingLive(!meetingLive);
              flash(meetingLive ? "会议已暂停" : "会议模式已开始");
            }}
          >
            <span className="live-dot" />
            {meetingLive ? "会议进行中 · 43:18" : "开始会议"}
          </button>
        </div>
      </header>

      <section className="decision-ribbon">
        <div className="ribbon-index">今天只决定一件事</div>
        <h1>
          是否将 <em>A 套餐</em> 从 <s>¥28</s> 调整至 <em>¥30</em>，
          在办公与枢纽商圈 <em>30 家店试点 6 周</em>？
        </h1>
        <div className="ribbon-status">
          <DataBadge tone={frozen ? "success" : "warning"}>
            {frozen ? "正式版 v1.0" : "待决策"}
          </DataBadge>
          <span>首要目标：在销售额守门下提升整体菜单毛利额</span>
        </div>
      </section>

      <nav className="meeting-stepper" aria-label="定价决策会议流程">
        <div className="stepper-intro">
          <span>MEETING ROUTE</span>
          <strong>45–60 分钟决策路线</strong>
          <small>必须按顺序完成，每一步形成明确产出</small>
        </div>
        <div className="stepper-track">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              className={`${activeStage === stage.id ? "active" : ""} ${index < activeIndex ? "completed" : ""}`}
              onClick={() => setActiveStage(stage.id)}
            >
              <span className="step-node">{index < activeIndex ? "✓" : stage.no}</span>
              <span className="step-copy">
                <small>{index < activeIndex ? "已确认" : index === activeIndex ? "正在进行" : `下一步 ${stage.no}`}</small>
                <strong>{stage.label}</strong>
                <em>{stage.question}</em>
              </span>
            </button>
          ))}
        </div>
        <div className="stepper-clock">
          <span className="live-dot" />
          <strong>{meetingLive ? "43:18" : "已暂停"}</strong>
          <small>当前阶段剩余 04:32</small>
        </div>
      </nav>

      <div className={`workspace ${sidePanelOpen ? "panel-open" : "panel-closed"}`}>
        <nav className="stage-rail" aria-label="定价决策流程">
          <div className="stage-progress">
            <span>决策链</span>
            <strong>{stages.findIndex((s) => s.id === activeStage) + 1}/5</strong>
          </div>
          {stages.map((stage) => (
            <button
              key={stage.id}
              className={`stage-button ${activeStage === stage.id ? "active" : ""}`}
              onClick={() => setActiveStage(stage.id)}
            >
              <span className="stage-no">{stage.no}</span>
              <span>
                <strong>{stage.label}</strong>
                <small>{stage.question}</small>
              </span>
            </button>
          ))}
          <div className="readiness-card">
            <div className="readiness-head">
              <span>决策就绪度</span>
              <strong>82%</strong>
            </div>
            <div className="progress-track"><span style={{ width: "82%" }} /></div>
            <p><b>1 项 P0 证据</b>仍需确认，可通过可回滚试点化解。</p>
          </div>
          <div className="version-note">
            <span className="lock-glyph">⌁</span>
            <div><strong>{frozen ? "已冻结" : "审计已开启"}</strong><small>所有修改保留时间、人员与前后值</small></div>
          </div>
        </nav>

        <section className="main-stage">
          <div className="stage-heading">
            <div>
              <span className="section-kicker">当前阶段 {active.no} / {active.label}</span>
              <h2>{active.question}</h2>
              <p className="stage-output">
                本阶段必须产出：
                <b>{activeStage === "brief" && "全员确认同一个决策命题、范围与成功标准"}
                  {activeStage === "facts" && "共同确认关键事实、数据口径与证据缺口"}
                  {activeStage === "options" && "先过销售额守门，再用 UPH × ADTC 推演 Product Mix 与整体菜单经济结果"}
                  {activeStage === "evidence" && "回答足以改变选择的关键问题"}
                  {activeStage === "decision" && "冻结决定、责任、止损条件与正式复盘日期"}</b>
              </p>
            </div>
            <div className="stage-tools">
              <div className="stage-readiness">
                <span>决策就绪度</span>
                <strong>82%</strong>
                <i><b style={{ width: "82%" }} /></i>
              </div>
              <button
                className={`collab-toggle ${sidePanelOpen ? "active" : ""}`}
                onClick={() => setSidePanelOpen(!sidePanelOpen)}
              >
                {sidePanelOpen ? "收起协作" : "现场观点与证据"} <span>4</span>
              </button>
            </div>
          </div>

          {activeStage === "brief" && (
            <div className="stage-content brief-stage">
              <article className="frame-card">
                <div className="card-title-row">
                  <div>
                    <span className="mini-label">标准化决策命题</span>
                    <h3>一个目标，六类范围，四组底线</h3>
                  </div>
                  <DataBadge tone="success">范围完整 6/6</DataBadge>
                </div>
                <p className="decision-copy">
                  从 <b>2026 年 9 月</b>起，将 <b>A 套餐</b>从 <b>28 元</b>调整至
                  <b> 30 元</b>，面向<b>上海商务办公与交通枢纽</b>商圈的
                  <b>午餐刚需与高频会员</b>，以<b>30 店 × 6 周试点</b>方式实施，
                  验证能否恢复成本上涨造成的利润损失。
                </p>
                <div className="scope-grid">
                  {[
                    ["首要目标", "净增量贡献", "恢复成本上涨造成的利润缺口"],
                    ["市场范围", "上海 · 2 类商圈", "商务办公、交通枢纽；社区作对照"],
                    ["产品范围", "A 套餐", "主餐 + 小食 + 饮品，不含加购"],
                    ["顾客范围", "午餐刚需", "高频会员、工作日场景客群"],
                    ["时间范围", "6 周", "2026.08.10—09.20"],
                    ["推广路线", "可回滚试点", "30 试点店 + 15 对照店"],
                  ].map(([label, value, note]) => (
                    <div className="scope-item" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                      <small>{note}</small>
                    </div>
                  ))}
                </div>
              </article>

              <div className="two-column">
                <article className="guardrail-card">
                  <div className="card-title-row">
                    <div>
                      <span className="mini-label">不可穿透的底线</span>
                      <h3>Guardrails</h3>
                    </div>
                    <button className="text-button" onClick={() => flash("Guardrail 修改需品牌、运营与决策人三方确认")}>变更规则</button>
                  </div>
                  {[
                    ["顾客价值", "核心会员 14 日复购", "降幅 ≤ 2.0pp", "74% 当前置信"],
                    ["门店运营", "P90 出餐时长", "≤ 8分30秒", "距阈值 38 秒"],
                    ["经营质量", "报废率", "≤ 3.8%", "基准 2.9%"],
                    ["品牌信号", "价格相关投诉率", "≤ 0.25%", "基准 0.11%"],
                  ].map(([group, metric, threshold, note]) => (
                    <div className="guardrail-row" key={group}>
                      <span className="guardrail-icon">!</span>
                      <div><small>{group}</small><strong>{metric}</strong></div>
                      <div className="guardrail-value"><b>{threshold}</b><small>{note}</small></div>
                    </div>
                  ))}
                </article>

                <article className="success-card">
                  <span className="mini-label">成功不是“涨价完成”</span>
                  <h3>扩大试点必须同时满足</h3>
                  <div className="success-number">
                    <strong>+6.0%</strong>
                    <span>单店日均净增量贡献<br />相对对照组的最低改善</span>
                  </div>
                  <div className="criteria-list">
                    <span><i /> 连续 2 周通过全部硬性 Guardrails</span>
                    <span><i /> 试点店执行一致性 ≥ 90%</span>
                    <span><i /> 办公、枢纽商圈均为正向结果</span>
                  </div>
                  <div className="out-of-scope">
                    <small>本次明确不讨论</small>
                    <p>全国统一价格、一店一价、完整菜单重构、生产系统自动改价。</p>
                  </div>
                </article>
              </div>

            </div>
          )}

          {activeStage === "facts" && (
            <div className="stage-content">
              <div className="fact-summary">
                <div className="summary-number"><strong>7</strong><span>条关键事实</span></div>
                <div className="summary-number"><strong>2</strong><span>项估算</span></div>
                <div className="summary-number alert"><strong>1</strong><span>项待验证假设</span></div>
                <div className="fact-legend">
                  <span><i className="dot verified" /> 已验证事实</span>
                  <span><i className="dot estimate" /> 模型估算</span>
                  <span><i className="dot assumption" /> 待验证假设</span>
                </div>
              </div>

              <div className="facts-grid">
                {facts.map((fact) => (
                  <article className="fact-card" key={fact.metric}>
                    <div className="fact-top">
                      <DataBadge tone={fact.statusClass}>{fact.status}</DataBadge>
                      <button aria-label={`查看${fact.metric}口径`} onClick={() => flash(fact.source)}>口径与来源 ↗</button>
                    </div>
                    <span className="fact-metric">{fact.metric}</span>
                    <div className="fact-value"><strong>{fact.value}</strong><small>{fact.change}</small></div>
                    <p>{fact.note}</p>
                    <div className="source-strip">{fact.source}</div>
                  </article>
                ))}
              </div>

              <article className="matrix-card">
                <div className="card-title-row">
                  <div>
                    <span className="mini-label">商圈 × 顾客 × 门店</span>
                    <h3>平均值被拆开后，结论发生了什么变化？</h3>
                  </div>
                  <div className="segmented-control">
                    {["全部商圈", "商务办公", "交通枢纽", "社区"].map((market) => (
                      <button key={market} className={selectedMarket === market ? "active" : ""} onClick={() => setSelectedMarket(market)}>{market}</button>
                    ))}
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>商圈</th><th>门店</th><th>基准月销售额</th><th>¥30 UPH 影响</th><th>调价后销售额</th><th>销售额变化</th><th>守门结果</th><th>月净增量贡献</th><th>当前判断</th></tr></thead>
                    <tbody>
                      {marketRows
                        .filter((row) => selectedMarket === "全部商圈" || row.market === selectedMarket)
                        .map((row) => (
                          <tr key={row.market}>
                            <td><strong>{row.market}</strong></td><td>{row.stores}</td><td>{row.baselineSales}</td><td>{row.elasticity}</td>
                            <td>{row.revenueAfter}</td><td className={row.revenueStatus === "下降" ? "negative-number" : "positive-number"}><strong>{row.revenueChange}</strong></td>
                            <td><DataBadge tone={row.revenueStatus === "下降" ? "danger" : "success"}>{row.revenueStatus}</DataBadge></td>
                            <td><strong>{row.contribution}</strong></td>
                            <td><DataBadge tone={row.className}>{row.action}</DataBadge></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="matrix-insight">
                  <span>关键判断</span>
                  <p>统一调价后整体销售额预计增长 2.2%，但社区商圈预计下降 1.6%。因此整体守门通过不等于所有商圈都适合调价；社区应维持 28 元或单独补充证据。</p>
                </div>
              </article>
            </div>
          )}

          {activeStage === "options" && (
            <div className="stage-content">
              <div className="decision-rule-grid">
                <div className="rule-intro">
                  <span className="mini-label">先过滤，再比较，再诊断</span>
                  <strong>本轮方案判断顺序</strong>
                  <small>最近 8 周 · 同店 · 工作日午餐 · 不含促销</small>
                </div>
                <div className="rule-card hard-rule">
                  <span>01 · 硬约束</span>
                  <strong>A 套餐销售额不得下降</strong>
                  <small>整体 ≥ 0%；任一纳入商圈 &lt; 0% 不得直接推广</small>
                </div>
                <div className="rule-card primary-rule">
                  <span>02 · 主优化目标</span>
                  <strong>整体菜单毛利额 / 净贡献</strong>
                  <small>按同范围、同季 ADTC、调价后 Product Mix 重算</small>
                </div>
                <div className="rule-card signal-rule">
                  <span>03 · 诊断与止损</span>
                  <strong>毛利率、UPH、复购、运营</strong>
                  <small>不以单一总分掩盖顾客价值与执行风险</small>
                </div>
              </div>

              <div className="scheme-grid policy-grid">
                {schemes.filter((scheme) => scheme.id !== "D").map((scheme) => (
                  <button
                    key={scheme.id}
                    className={`scheme-card ${selectedScheme === scheme.id ? "selected" : ""} ${scheme.id === "A" ? "has-breach" : ""}`}
                    onClick={() => setSelectedScheme(scheme.id)}
                  >
                    <div className="scheme-head">
                      <span className="scheme-letter">{scheme.id}</span>
                      <DataBadge tone={scheme.eligibleTone}>{scheme.eligible}</DataBadge>
                    </div>
                    <h3>{scheme.name}</h3>
                    <p>{scheme.route}</p>
                    <div className="scheme-metrics">
                      <span><small>A 套餐销售额</small><b>{scheme.revenue}</b></span>
                      <span><small>商圈守门</small><b>{scheme.revenueScope}</b></span>
                      <span><small>等效 30 店净贡献</small><b>{scheme.normalized}</b></span>
                    </div>
                    <div className="scheme-risk"><span>UPH {scheme.volume}</span><span>月净贡献总额 {analysisApplied && scheme.id === "B" ? "+¥6.1 万" : scheme.contribution}</span><span>运营 {scheme.ops} · 价值风险 {scheme.valueRisk}</span></div>
                    <div className="scheme-signal">{scheme.signal}</div>
                  </button>
                ))}
              </div>

              <button className="rollout-route" onClick={() => { setSelectedScheme("B"); flash("已将路线 D 绑定为策略 B 的验证路径"); }}>
                <span className="route-letter">D</span>
                <div><small>实施路线 · 不与价格策略平行评分</small><strong>30 店 × 6 周可回滚试点</strong><p>验证策略 B 在办公与交通枢纽商圈的 UPH、Product Mix 和门店运营结果。</p></div>
                <DataBadge tone="estimate">验证路线</DataBadge>
              </button>

              <article className="mix-model-card">
                <div className="card-title-row mix-title-row">
                  <div>
                    <span className="mini-label">整体菜单结构变化 · 分析师校准层</span>
                    <h3>先预测 Product Mix，再评估整体菜单经济结果</h3>
                    <p>价格直接影响目标产品 UPH；ADTC 只作为当季交易量基线，再换算 ADQ 与金额。</p>
                  </div>
                  <DataBadge tone="assumption">原型假设 · 待接历史事件库</DataBadge>
                </div>

                <div className="causal-chain" aria-label="价格影响销量的计算链">
                  <div><small>价格动作</small><strong>¥28 → ¥30</strong><span>决策输入</span></div>
                  <i>→</i>
                  <div><small>目标产品 UPH</small><strong>{baselineUph.toFixed(1)} → {scenarioUph.toFixed(1)}</strong><span>份/百单 · 直接响应 {uphDelta}%</span></div>
                  <i>×</i>
                  <div><small>当季 ADTC</small><strong>{seasonAdtc} 单/店日</strong><span>同季无调价基线，不归因于价格</span></div>
                  <i>=</i>
                  <div className="chain-result"><small>目标产品 ADQ</small><strong>{baselineAdq.toFixed(1)} → {scenarioAdq.toFixed(1)}</strong><span>份/店日</span></div>
                </div>

                <div className="mix-controls">
                  <label>
                    <span><b>A 套餐 UPH 响应</b><strong>{uphDelta}%</strong></span>
                    <input type="range" min="-10" max="0" step="0.5" value={uphDelta} onChange={(event) => setUphDelta(Number(event.target.value))} />
                    <small>价格的直接影响 · 分析师根据同类调价事件校准</small>
                  </label>
                  <label>
                    <span><b>当季 ADTC 基线</b><strong>{seasonAdtc}</strong></span>
                    <input type="range" min="108" max="144" step="1" value={seasonAdtc} onChange={(event) => setSeasonAdtc(Number(event.target.value))} />
                    <small>季节/商圈/星期结构预测 · 同时用于基准与调价方案</small>
                  </label>
                  <label>
                    <span><b>相关产品替代回收率</b><strong>{recaptureRate}%</strong></span>
                    <input type="range" min="30" max="90" step="1" value={recaptureRate} onChange={(event) => setRecaptureRate(Number(event.target.value))} />
                    <small>未购买 A 套餐的 UPH 中，被其他产品承接的比例</small>
                  </label>
                </div>

                <div className="mix-body">
                  <div className="mix-table-wrap">
                    <div className="mix-section-head"><strong>Product Mix 迁移</strong><span>UPH 与销量结构 · 30 店月度等效</span></div>
                    <table className="mix-table">
                      <thead><tr><th>产品族</th><th>关系</th><th>UPH 前 → 后</th><th>Mix 前</th><th>Mix 后</th><th>变化</th></tr></thead>
                      <tbody>
                        {mixModel.rows.map((row) => {
                          const mixDelta = row.afterMix - row.baseMix;
                          return (
                            <tr key={row.id} className={row.id === "target" ? "target-row" : ""}>
                              <td><strong>{row.name}</strong></td>
                              <td>{row.relation}</td>
                              <td>{row.baseUph.toFixed(1)} → {row.afterUph.toFixed(1)}</td>
                              <td>{row.baseMix.toFixed(1)}%</td>
                              <td>{row.afterMix.toFixed(1)}%</td>
                              <td className={mixDelta < 0 ? "negative-number" : "positive-number"}>{mixDelta >= 0 ? "+" : ""}{mixDelta.toFixed(1)}pp</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mix-evidence-note">
                      <strong>当前参数责任</strong>
                      <span>分析师输入：自价格响应、替代回收率、产品间迁移权重</span>
                      <span>系统计算：UPH → ADQ → Product Mix → 销售额/毛利</span>
                      <span>未来 AI：从历史调价与促销事件自动建议参数，仍需人工确认</span>
                    </div>
                  </div>

                  <div className="menu-kpi-panel">
                    <div className="mix-section-head"><strong>整体菜单关键指标</strong><span>基准方案 → 策略 {selectedScheme}</span></div>
                    <div className="menu-kpi-grid">
                      <div><small>整体菜单销售额</small><strong>¥{mixModel.baseRevenue.toFixed(1)}万 → ¥{mixModel.afterRevenue.toFixed(1)}万</strong><span className={mixModel.revenueDelta >= 0 ? "positive-number" : "negative-number"}>{mixModel.revenueDelta >= 0 ? "+" : ""}{mixModel.revenueDelta.toFixed(1)}%</span></div>
                      <div><small>整体菜单毛利额</small><strong>¥{mixModel.baseGrossProfit.toFixed(1)}万 → ¥{mixModel.afterGrossProfit.toFixed(1)}万</strong><span className={mixModel.grossProfitDelta >= 0 ? "positive-number" : "negative-number"}>{mixModel.grossProfitDelta >= 0 ? "+" : ""}{mixModel.grossProfitDelta.toFixed(1)}%</span></div>
                      <div><small>整体菜单毛利率</small><strong>{mixModel.baseMargin.toFixed(1)}% → {mixModel.afterMargin.toFixed(1)}%</strong><span className={mixModel.afterMargin >= mixModel.baseMargin ? "positive-number" : "negative-number"}>{mixModel.afterMargin >= mixModel.baseMargin ? "+" : ""}{(mixModel.afterMargin - mixModel.baseMargin).toFixed(1)}pp</span></div>
                      <div><small>A 套餐销量流失去向</small><strong>{mixModel.lostTargetUph.toFixed(1)} UPH 流失</strong><span>{mixModel.recapturedUph.toFixed(1)} 被其他产品承接 · {(mixModel.lostTargetUph - mixModel.recapturedUph).toFixed(1)} 未回收</span></div>
                    </div>
                    <div className="kpi-interpretation">
                      <strong>会议判断</strong>
                      <p>毛利率上升不自动代表方案更好。必须先通过 A 套餐销售额与商圈守门，再比较整体菜单毛利额，并检查替代是否侵蚀顾客价值或运营能力。</p>
                    </div>
                  </div>
                </div>
              </article>

              <div className="two-column scenario-area">
                <article className="scenario-card">
                  <div className="card-title-row">
                    <div><span className="mini-label">目标产品硬约束</span><h3>A 套餐销售额守门</h3></div>
                    <DataBadge tone="estimate">模型估算</DataBadge>
                  </div>
                  <div className={`revenue-gate ${revenuePass ? "pass" : "fail"}`}>
                    <div><small>硬约束</small><strong>A 套餐调价后销售额不得下降</strong><span>UPH 盈亏平衡点 −6.7%</span></div>
                    <div><small>当前情景</small><strong>{revenueDelta >= 0 ? "+" : ""}{revenueDelta.toFixed(1)}%</strong><span>{revenuePass ? "通过" : "淘汰 / 缩小范围"}</span></div>
                  </div>
                  <div className="scenario-output">
                    <div><span>月销售额</span><strong>¥{baselineRevenue.toFixed(1)} → ¥{scenarioRevenue.toFixed(1)}万</strong></div>
                    <div><span>当季 ADQ</span><strong>{baselineAdq.toFixed(1)} → {scenarioAdq.toFixed(1)}</strong></div>
                    <div><span>增量运营成本</span><strong>−¥{operatingCost.toFixed(1)}万</strong></div>
                    <div className="primary-output"><span>门店净增量贡献</span><strong>{netContribution >= 0 ? "+" : ""}¥{netContribution.toFixed(1)} 万</strong></div>
                  </div>
                  <div className="formula-note">
                    ADQ = UPH × ADTC；A 套餐销售额 = 价格 × UPH × 同季 ADTC。相同 ADTC 同时进入基准与方案，避免把季节客流误归因于调价。
                  </div>
                </article>

                <article className="district-revenue-card">
                  <span className="mini-label">整体通过 ≠ 每个商圈通过</span>
                  <h3>统一调价 A · 商圈销售额守门</h3>
                  <div className="district-revenue-list">
                    {marketRows.map((row) => (
                      <div className="district-revenue-row" key={row.market}>
                        <div><strong>{row.market}</strong><span>{row.stores}</span></div>
                        <div><small>UPH 响应</small><b>{row.elasticity}</b></div>
                        <div><small>销售额变化</small><b className={row.revenueStatus === "下降" ? "negative-number" : "positive-number"}>{row.revenueChange}</b></div>
                        <DataBadge tone={row.revenueStatus === "下降" ? "danger" : "success"}>{row.revenueStatus}</DataBadge>
                      </div>
                    ))}
                  </div>
                  <div className="district-total"><span>策略 A 整体</span><strong className="positive-number">+2.2%</strong><b>1 个商圈失败</b></div>
                  <div className="tradeoff-conclusion">
                    <strong>当前优先选择</strong>
                    <p>策略 B 将社区维持 28 元：整体销售额预计 +2.7%，0 个纳入商圈下降；再通过路线 D 验证 UPH 与 Product Mix 假设。</p>
                  </div>
                </article>
              </div>

            </div>
          )}

          {activeStage === "evidence" && (
            <div className="stage-content">
              <div className="evidence-layout">
                <div className="question-list">
                  <div className="list-heading">
                    <div><span className="mini-label">只追问会改变选择的问题</span><h3>证据队列</h3></div>
                    <button className="primary-small" onClick={() => document.getElementById("signal-input")?.focus()}>+ 新问题</button>
                  </div>
                  {signalAdded && (
                    <article className="question-row new-question">
                      <span className="priority p0">P0</span>
                      <div><h4>销量增长是否会增加高峰工时和报废？</h4><p>来源：运营负责人现场发言 · 刚刚</p><small>已识别为待验证假设</small></div>
                      <DataBadge tone="warning">待分派</DataBadge>
                    </article>
                  )}
                  {questions.map((question, index) => (
                    <article className={`question-row ${index === 0 ? "active" : ""}`} key={question.title}>
                      <span className={`priority ${question.priority.toLowerCase()}`}>{question.priority}</span>
                      <div>
                        <h4>{question.title}</h4>
                        <p>{question.owner} · 截止 {question.due}</p>
                        <small>{question.analysis}</small>
                      </div>
                      <DataBadge tone={question.state === "证据不足" ? "danger" : "neutral"}>{question.state}</DataBadge>
                    </article>
                  ))}
                </div>

                <article className="analysis-console">
                  <div className="console-head">
                    <div><span className="mini-label">预设分析 03</span><h3>工时 × 瓶颈产能 × 报废情景</h3></div>
                    <DataBadge tone={analysisApplied ? "success" : "warning"}>{analysisApplied ? "已回写" : "待运行"}</DataBadge>
                  </div>
                  <div className="parameter-grid">
                    <label>试点门店<input value="30 家" readOnly /></label>
                    <label>A 套餐 UPH<input value={`${uphDelta}%`} readOnly /></label>
                    <label>主动工时<input value="42 秒/份" readOnly /></label>
                    <label>瓶颈工位<input value="组装台" readOnly /></label>
                    <label>高峰窗口<input value="11:30—13:00" readOnly /></label>
                    <label>报废上限<input value="3.8%" readOnly /></label>
                  </div>
                  <button
                    className="run-analysis"
                    onClick={() => {
                      setAnalysisApplied(true);
                      flash("分析结果经人工确认后，已回写方案 B 与 D");
                    }}
                  >
                    {analysisApplied ? "✓ 分析已完成 · 重新运行" : "运行预设分析"}
                  </button>
                  <div className={`analysis-result ${analysisApplied ? "visible" : ""}`}>
                    <div className="result-banner">
                      <span>结果会改变原判断</span>
                      <strong>7 / 30 家试点店接近瓶颈</strong>
                    </div>
                    <div className="result-metrics">
                      <div><small>P90 出餐</small><strong>+41 秒</strong><span>仍在阈值内</span></div>
                      <div><small>增量工时</small><strong>+0.31 h</strong><span>每店每日</span></div>
                      <div><small>报废率</small><strong>3.3%</strong><span>阈值 3.8%</span></div>
                    </div>
                    <p>结论：策略 B 月净增量贡献由 +7.4 万修正为 <b>+6.1 万</b>；路线 D 保持可行，但需排除 3 家极限产能店并配置 4 家替补店。</p>
                    <div className="result-actions">
                      <button onClick={() => flash("结果已标记为人工确认事实")}>确认共同事实</button>
                      <button onClick={() => { setAnalysisApplied(true); setSelectedScheme("B"); flash("结果已回写策略 B + 路线 D v0.7"); }}>回写决策方案</button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          )}

          {activeStage === "decision" && (
            <div className="stage-content">
              <article className="decision-card">
                <div className="decision-stamp"><span>{frozen ? "已冻结" : "建议结论"}</span><strong>{decisionType}</strong></div>
                <div className="decision-body">
                  <span className="mini-label">最终选择 · 策略 B + 路线 D</span>
                  <h3>办公与交通枢纽商圈，30 家门店 × 6 周可回滚试点</h3>
                  <p>社区维持 28 元；先验证 A 套餐 UPH、同季 ADTC 下的 ADQ、Product Mix 与整体菜单经济结果，再决定是否分批扩大。</p>
                  <div className="decision-reasons">
                    <div><span>01</span><p><b>通过经营底线</b>A 套餐整体销售额预计为正，纳入商圈无下降</p></div>
                    <div><span>02</span><p><b>隔离高风险</b>社区高频会员不进入首轮调价</p></div>
                    <div><span>03</span><p><b>验证组合效应</b>用历史与试点校准产品间替代和整体毛利变化</p></div>
                  </div>
                </div>
                <div className="decision-audit">
                  <small>最终决策人</small><strong>高远 · COO</strong>
                  <small>记录时间</small><strong>{frozen ? "2026.07.30 10:42" : "等待确认"}</strong>
                  <small>少数意见</small><strong>1 条已保留</strong>
                </div>
              </article>

              <div className="review-grid">
                <article className="timeline-card">
                  <div className="card-title-row"><div><span className="mini-label">从决定到复盘</span><h3>执行承诺</h3></div><DataBadge tone="neutral">5 个节点</DataBadge></div>
                  <div className="timeline">
                    {actionItems.map((item, index) => (
                      <div className="timeline-item" key={item.date}>
                        <div className="timeline-date">{item.date}</div>
                        <div className="timeline-line"><i className={index < 1 ? "done" : ""} /></div>
                        <div><strong>{item.title}</strong><span>{item.owner}</span></div>
                        <DataBadge tone={item.status === "里程碑" ? "success" : "neutral"}>{item.status}</DataBadge>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="conditions-card">
                  <span className="mini-label">预先写好，不事后找理由</span>
                  <h3>扩大、暂停与回滚</h3>
                  <div className="condition-block expand">
                    <span>扩大</span><p>A 套餐销售额与整体菜单毛利额均为正，连续两周全 Guardrails 通过，执行一致性 ≥ 90%。</p>
                  </div>
                  <div className="condition-block pause">
                    <span>暂停</span><p>任一商圈两周结果方向冲突，或 20% 以上门店出现瓶颈工位超载。</p>
                  </div>
                  <div className="condition-block rollback">
                    <span>回滚</span><p>复购下降 &gt; 2.0pp、P90 &gt; 8:30、报废 &gt; 3.8% 或投诉 &gt; 0.25%。</p>
                  </div>
                  <div className="rollback-promise"><b>48 小时</b><span>触发后恢复价格与菜单物料<br />Owner：陈然 · 区域运营</span></div>
                </article>
              </div>

              <article className="learning-card">
                <div>
                  <span className="mini-label">正式复盘 · 2026.09.21</span>
                  <h3>结果不好，不等于当时的决定一定错</h3>
                </div>
                <div className="learning-questions">
                  <span>问题定义是否正确？</span><span>关键假设是否成立？</span><span>执行是否偏离计划？</span>
                  <span>数据与模型是否偏差？</span><span>外部环境发生了什么？</span><span>什么进入下一次定价决策？</span>
                </div>
              </article>
            </div>
          )}
        </section>

        <aside className="collab-rail">
          <div className="collab-head">
            <div><span className="mini-label">会议协作</span><strong>8 人在线</strong></div>
            <div className="avatars" aria-label="在线参与者">
              <span>高</span><span>林</span><span>季</span><span>陈</span><i>+4</i>
            </div>
          </div>

          <div className="focus-card">
            <span>本阶段必须产出</span>
            <strong>{activeStage === "brief" && "确认命题、范围与成功标准"}
              {activeStage === "facts" && "确认事实、口径与证据缺口"}
              {activeStage === "options" && "确认销售额守门、Product Mix 与整体菜单经济结果"}
              {activeStage === "evidence" && "回答会改变选择的关键问题"}
              {activeStage === "decision" && "冻结决定、行动与回滚条件"}</strong>
          </div>

          <div className="discussion">
            <div className="rail-title"><strong>现场观点</strong><span>4</span></div>
            <article>
              <div className="comment-meta"><span className="avatar coral">陈</span><div><b>陈然 · 运营</b><small>10:18</small></div><DataBadge tone="assumption">假设</DataBadge></div>
              <p>销量增长可能会增加高峰工时和报废，不能只看产品毛利。</p>
            </article>
            <article>
              <div className="comment-meta"><span className="avatar blue">季</span><div><b>季敏 · 品牌</b><small>10:24</small></div><DataBadge tone="danger">风险</DataBadge></div>
              <p>社区高频会员可能把这次调整理解为“熟客变贵”。</p>
            </article>
            <article>
              <div className="comment-meta"><span className="avatar green">林</span><div><b>林珊 · 数据</b><small>10:29</small></div><DataBadge tone="verified">事实</DataBadge></div>
              <p>交通枢纽同类套餐的实际到手价中位数为 31.5 元。</p>
            </article>
          </div>

          <div className="signal-composer">
            <label htmlFor="signal-input">记录一个观点或问题</label>
            <textarea id="signal-input" value={signal} onChange={(event) => setSignal(event.target.value)} placeholder="例如：销量增长会增加高峰工时和报废……" />
            <div>
              <select aria-label="观点类型" defaultValue="auto"><option value="auto">自动识别类型</option><option>事实</option><option>假设</option><option>约束</option><option>风险</option><option>问题</option></select>
              <button onClick={addSignal}>结构化</button>
            </div>
          </div>

          <div className="evidence-alert">
            <span>证据缺口</span>
            <strong>1 项 P0 问题仍开放</strong>
            <button onClick={() => setActiveStage("evidence")}>进入证据队列 →</button>
          </div>
        </aside>
      </div>

      <footer className="decision-dock">
        {activeStage !== "decision" ? (
          <>
            <div className="dock-stage-focus">
              <span className="dock-label">会议主线 · {active.no}/05</span>
              <strong>{active.label}</strong>
              <small>完成阶段产出后再进入下一步，避免讨论提前发散</small>
            </div>
            <div className="stage-navigation">
              <button
                className="back-stage"
                disabled={!previousStage}
                onClick={() => previousStage && setActiveStage(previousStage.id)}
              >
                ← {previousStage ? previousStage.label : "已是第一步"}
              </button>
              {nextStage && (
                <button className="next-stage" onClick={() => setActiveStage(nextStage.id)}>
                  完成本阶段，进入 {nextStage.label} →
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="dock-label">当前焦点决策</span>
              <strong>策略 B · 分商圈定价 + 路线 D · 30 店试点</strong>
              <small>证据充分度 82% · 可通过可回滚试点决策</small>
            </div>
            <div className="dock-actions">
              <span>记录会议决定</span>
              {(["批准", "条件批准", "试点", "延期", "否决"] as DecisionType[]).map((type) => (
                <button key={type} className={decisionType === type ? "active" : ""} onClick={() => setDecisionType(type)}>{type}</button>
              ))}
              <button className="finalize-button" onClick={() => setShowDecisionPanel(true)}>{frozen ? "查看正式版本" : "确认决定"}</button>
            </div>
          </>
        )}
      </footer>

      {showDecisionPanel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowDecisionPanel(false)}>
          <section className="decision-modal" role="dialog" aria-modal="true" aria-labelledby="decision-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="关闭" onClick={() => setShowDecisionPanel(false)}>×</button>
            <span className="mini-label">最终人工确认点</span>
            <h2 id="decision-modal-title">冻结“{decisionType}”决定？</h2>
            <p>系统将保存当时的事实、假设、方案、异议和 Guardrails，生成不可覆盖的正式版本。系统不会自动执行改价。</p>
            <div className="modal-summary">
              <span>选择</span><strong>策略 B + 路线 D · 分商圈定价，30 店 × 6 周试点</strong>
              <span>决策人</span><strong>高远 · COO</strong>
              <span>正式复盘</span><strong>2026.09.21</strong>
            </div>
            <label className="acknowledge"><input type="checkbox" defaultChecked /> 我确认接受该方案的收益、代价与剩余不确定性</label>
            <div className="modal-actions"><button onClick={() => setShowDecisionPanel(false)}>返回检查</button><button className="confirm-freeze" onClick={finalizeDecision}>确认并冻结 v1.0</button></div>
          </section>
        </div>
      )}
    </main>
  );
}
