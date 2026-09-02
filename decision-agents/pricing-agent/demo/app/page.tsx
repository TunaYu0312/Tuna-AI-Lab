"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, Check, CheckCircle2, ChevronRight, CircleAlert,
  ClipboardCheck, FileSearch, Flag, Gauge, Lightbulb, LockKeyhole,
  Scale, Sparkles, Target, TrendingUp, Users, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { simulatePricing, type PricingSimulation } from "@/lib/pricing-model";

const stages = [
  { id: 0, short: "Define", zh: "定义问题", icon: Target },
  { id: 1, short: "Evidence", zh: "准备证据", icon: FileSearch },
  { id: 2, short: "Constitution", zh: "确认约束", icon: LockKeyhole },
  { id: 3, short: "Options", zh: "比较方案", icon: Scale },
  { id: 4, short: "Commit", zh: "提交决策", icon: Flag },
  { id: 5, short: "Learn", zh: "试点复盘", icon: TrendingUp },
];

const evidence = [
  { name: "交易与 P-mix", owner: "Data", status: "ready", detail: "120店 · 12周 · 96.8%完整" },
  { name: "SKU成本与毛利", owner: "Finance", status: "ready", detail: "成本更新至 8月" },
  { name: "顾客价值感 / PSS", owner: "Consumer", status: "warning", detail: "仅覆盖写字楼客群" },
  { name: "门店制作复杂度", owner: "Ops", status: "ready", detail: "峰值出餐 +4秒" },
  { name: "竞品价格", owner: "Marketing", status: "warning", detail: "2/5品牌数据已过期" },
  { name: "SKU替代关系", owner: "Data", status: "ready", detail: "套餐B替代率 2.8%" },
];

const constraints = [
  { type: "硬约束", text: "任何全国性调价必须先完成 ≥20 家店、4 周试点", owner: "COO", hard: true },
  { type: "硬约束", text: "核心套餐毛利率不得低于 58%", owner: "CFO", hard: true },
  { type: "护栏", text: "试点期交易量下降不得超过 8%", owner: "Growth", hard: false },
  { type: "护栏", text: "NPS 下降超过 3 分立即暂停", owner: "CX", hard: false },
  { type: "原则", text: "不以隐性减量制造价格错觉", owner: "Brand", hard: false },
];

function money(value: number) {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(value);
}

function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  return <span className={value >= 0 ? "text-teal-700" : "text-red-600"}>{value >= 0 ? "+" : ""}{value.toFixed(1)}{suffix}</span>;
}

export default function Home() {
  const [stage, setStage] = useState(1);
  const [price, setPrice] = useState(42);
  const [elasticity, setElasticity] = useState(-0.95);
  const [traffic, setTraffic] = useState(0);
  const [selected, setSelected] = useState("pilot");
  const [committed, setCommitted] = useState(false);

  const sim = useMemo(() => simulatePricing({ price, elasticity, trafficPercent: traffic }), [price, elasticity, traffic]);

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10 bg-[#102a33] text-white">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-[#d9a43b] text-[#102a33]"><Scale className="size-5" /></div>
            <div><div className="text-[15px] font-semibold tracking-wide">Pricing Decision Workspace</div><div className="text-xs text-slate-300">Decision ID · PD-2026-009</div></div>
          </div>
          <div className="hidden items-center gap-4 text-sm md:flex">
            <div className="flex items-center gap-2 text-slate-300"><Users className="size-4" /> 6 位评审人</div>
            <Badge className="border-amber-400/30 bg-amber-400/15 text-amber-200">会前准备中</Badge>
            <div className="grid size-8 place-items-center rounded-full bg-teal-700 font-semibold">TY</div>
          </div>
        </div>
      </header>

      <div className="border-b bg-white">
        <div className="mx-auto grid max-w-[1540px] grid-cols-3 gap-3 px-5 py-4 sm:grid-cols-6 lg:px-8">
          {stages.map((item) => {
            const Icon = item.icon; const active = stage === item.id; const done = stage > item.id || (committed && item.id <= 4);
            return <button key={item.id} onClick={() => setStage(item.id)} className="group flex min-w-0 items-center gap-2 text-left">
              <div className={`grid size-8 shrink-0 place-items-center rounded-full border transition ${active ? "border-teal-700 bg-teal-700 text-white" : done ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-300 text-slate-400"}`}>
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </div>
              <div className="min-w-0"><div className={`truncate text-xs font-semibold uppercase tracking-wide ${active ? "text-teal-800" : "text-slate-500"}`}>{item.short}</div><div className="truncate text-sm">{item.zh}</div></div>
              {item.id < 5 && <ChevronRight className="ml-auto hidden size-4 text-slate-300 xl:block" />}
            </button>;
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1540px] px-5 py-6 lg:px-8">
        <section className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2"><Badge variant="outline">套餐定价</Badge><span className="text-sm text-slate-500">决策截止：2026-09-08</span></div>
            <h1 className="max-w-5xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">是否在上海写字楼商圈，将经典鸡腿堡套餐从 ¥39 调整至 ¥42，并先在 20 家门店试点 4 周？</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-lg border bg-white px-4 py-3 panel-shadow">
            <div><div className="text-xs text-slate-500">Decision Owner</div><div className="font-semibold">陈明 · COO</div></div>
            <div className="h-9 w-px bg-slate-200" />
            <div><div className="text-xs text-slate-500">准备度</div><div className="font-semibold text-amber-700">82% · 有条件开会</div></div>
          </div>
        </section>

        {stage === 0 && <DefineStage onNext={() => setStage(1)} />}
        {stage === 1 && <EvidenceStage onNext={() => setStage(2)} />}
        {stage === 2 && <ConstitutionStage onNext={() => setStage(3)} />}
        {stage === 3 && <OptionsStage price={price} setPrice={setPrice} elasticity={elasticity} setElasticity={setElasticity} traffic={traffic} setTraffic={setTraffic} sim={sim} selected={selected} setSelected={setSelected} onNext={() => setStage(4)} />}
        {stage === 4 && <CommitStage selected={selected} price={price} sim={sim} committed={committed} onCommit={() => { setCommitted(true); setStage(5); }} />}
        {stage === 5 && <LearnStage committed={committed} price={price} elasticity={elasticity} sim={sim} />}
      </div>
    </main>
  );
}

function Shell({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return <div className={`grid gap-5 ${aside ? "xl:grid-cols-[minmax(0,1fr)_340px]" : ""}`}><div className="space-y-5">{children}</div>{aside && <aside className="space-y-5">{aside}</aside>}</div>;
}

function Panel({ title, eyebrow, children, className = "" }: { title: string; eyebrow?: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border bg-white panel-shadow ${className}`}><div className="border-b px-5 py-4">{eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-[.14em] text-teal-700">{eyebrow}</div>}<h2 className="text-lg font-semibold">{title}</h2></div><div className="p-5">{children}</div></section>;
}

function DefineStage({ onNext }: { onNext: () => void }) {
  const fields = [
    ["业务目标", "在不显著损害交易量与价值感的前提下，提高单店贡献毛利"],
    ["市场范围", "上海 · 写字楼商圈 · 20家匹配门店"],
    ["产品范围", "经典鸡腿堡套餐（SKU CMB-017）"],
    ["决策方式", "先试点 4 周；通过护栏后再决定是否扩大"],
  ];
  return <Shell aside={<AgentNote title="Framing Agent 检查" tone="good" text="议题已包含动作、对象、幅度、范围和验证路径，可以形成明确的 Yes / No / Modify 决策。" />}>
    <Panel eyebrow="Step 1 · Decision Definition" title="决策对象已经可拍板">
      <div className="grid gap-3 md:grid-cols-2">{fields.map(([k,v]) => <div key={k} className="rounded-lg border bg-slate-50 p-4"><div className="text-xs font-medium text-slate-500">{k}</div><div className="mt-1 text-[15px] font-medium leading-6">{v}</div></div>)}</div>
      <div className="mt-5 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4"><div className="font-semibold">非目标</div><div className="mt-1 text-sm leading-6 text-slate-700">本次不决定全国调价，不扩展至其他套餐，也不把短期毛利提升等同于长期价格策略成功。</div></div>
      <div className="mt-5 flex justify-end"><Button onClick={onNext}>检查证据 <ArrowRight /></Button></div>
    </Panel>
  </Shell>;
}

function EvidenceStage({ onNext }: { onNext: () => void }) {
  return <Shell aside={<><Readiness /><AgentNote title="Evidence Agent" tone="warn" text="可以开会，但 PSS 样本只覆盖写字楼客群，结论不得外推至社区店。竞品价格只作为背景，不作为调价触发器。" /></>}>
    <div className="metric-grid overflow-hidden rounded-xl border bg-white panel-shadow">
      {[["当前价格","¥39","同品类 P50：¥41"],["UPH","18.6","每100笔交易销量"],["单位贡献毛利","¥22.4","毛利率 57.4%"],["日均交易 ADTC","428","近12周 -1.8%"]].map((m,i)=><div key={m[0]} className={`p-4 ${i ? "border-l" : ""}`}><div className="text-xs text-slate-500">{m[0]}</div><div className="mt-1 text-2xl font-semibold">{m[1]}</div><div className="mt-1 text-xs text-slate-500">{m[2]}</div></div>)}
    </div>
    <Panel eyebrow="Step 2 · Pre-Decision Evidence Workflow" title="证据包与缺口">
      <div className="divide-y">{evidence.map((e)=><div key={e.name} className="grid gap-2 py-3 sm:grid-cols-[1fr_110px_180px] sm:items-center"><div className="flex items-center gap-3">{e.status === "ready" ? <CheckCircle2 className="size-5 text-teal-600"/> : <CircleAlert className="size-5 text-amber-600"/>}<div><div className="font-medium">{e.name}</div><div className="text-sm text-slate-500 sm:hidden">{e.detail}</div></div></div><div className="text-sm text-slate-500">{e.owner}</div><div className="hidden text-right text-sm text-slate-600 sm:block">{e.detail}</div></div>)}</div>
      <div className="mt-5 flex justify-end"><Button onClick={onNext}>审阅决策约束 <ArrowRight /></Button></div>
    </Panel>
  </Shell>;
}

function Readiness() {
  return <Panel title="开会准备度"><div className="flex items-end justify-between"><span className="text-3xl font-semibold">82%</span><Badge className="bg-amber-100 text-amber-800">有条件通过</Badge></div><Progress value={82} className="mt-4"/><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><span className="text-slate-500">关键证据覆盖</span><b>5 / 6</b></div><div className="flex justify-between"><span className="text-slate-500">未验证假设</span><b>2</b></div><div className="flex justify-between"><span className="text-slate-500">待处理冲突</span><b>1</b></div></div></Panel>;
}

function ConstitutionStage({ onNext }: { onNext: () => void }) {
  return <Shell aside={<AgentNote title="Constraint Check" tone="warn" text="¥42 方案的预测毛利率为 60.5%，满足财务硬约束。交易量下降预测接近 -8% 护栏，需要把停止条件写进试点协议。" />}>
    <Panel eyebrow="Step 3 · Decision Constitution" title="先确认边界，再讨论偏好">
      <div className="space-y-3">{constraints.map((c)=><div key={c.text} className="flex gap-4 rounded-lg border p-4"><div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-md ${c.hard ? "bg-slate-900 text-white" : "bg-teal-50 text-teal-700"}`}>{c.hard ? <LockKeyhole className="size-4"/> : <Gauge className="size-4"/>}</div><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-sm">{c.type}</b><span className="text-xs text-slate-500">Owner · {c.owner}</span></div><div className="mt-1 leading-6">{c.text}</div></div><CheckCircle2 className="size-5 shrink-0 text-teal-600"/></div>)}</div>
      <div className="mt-5 flex justify-end"><Button onClick={onNext}>进入方案比较 <ArrowRight /></Button></div>
    </Panel>
  </Shell>;
}

type Sim = PricingSimulation;

function OptionsStage({ price, setPrice, elasticity, setElasticity, traffic, setTraffic, sim, selected, setSelected, onNext }: { price:number; setPrice:(n:number)=>void; elasticity:number; setElasticity:(n:number)=>void; traffic:number; setTraffic:(n:number)=>void; sim:Sim; selected:string; setSelected:(s:string)=>void; onNext:()=>void }) {
  const options = [
    { id:"hold", label:"A · 保持现价", desc:"保持 ¥39，先优化单位成本 ¥0.80", gp:"+3.6%", volume:"0.0%", risk:"低", fit:true },
    { id:"pilot", label:`B · ¥${price} 试点`, desc:"20店测试4周，满足护栏后再扩大", gp:`${sim.gpChange>=0?"+":""}${sim.gpChange.toFixed(1)}%`, volume:`${sim.demandChange.toFixed(1)}%`, risk:"中", fit:sim.gm>=58 && sim.demandChange>=-8 },
    { id:"bundle", label:"C · 重组套餐", desc:"升级配餐后定价 ¥45，改变价值锚点", gp:"+8.1%", volume:"-11.2%", risk:"高", fit:false },
  ];
  const canProceed = selected === "hold" || (selected === "pilot" && sim.gm >= 58 && sim.demandChange >= -8);
  return <Shell aside={<AgentNote title="Trade-off Agent" tone={sim.demandChange < -8 ? "bad":"good"} text={sim.demandChange < -8 ? `当前假设下交易量下降 ${sim.demandChange.toFixed(1)}%，已穿透 -8% 护栏。建议降低试点价格或缩小弹性假设区间。` : `B方案在当前假设下满足硬约束与交易量护栏。主要不确定性来自价格弹性，不应把模拟结果当作预测承诺。`} />}>
    <Panel eyebrow="Step 4 · Options & Trade-offs" title="三种可选路径">
      <div className="grid gap-3 lg:grid-cols-3">{options.map((o)=><button key={o.id} onClick={()=>setSelected(o.id)} className={`rounded-lg border-2 p-4 text-left transition ${selected===o.id ? "border-teal-700 bg-teal-50/60":"border-slate-200 hover:border-slate-300"}`}><div className="flex items-center justify-between"><b>{o.label}</b>{selected===o.id && <CheckCircle2 className="size-5 text-teal-700"/>}</div><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{o.desc}</p><div className="mt-4 grid grid-cols-3 gap-2 text-sm"><div><span className="block text-xs text-slate-500">毛利</span><b>{o.gp}</b></div><div><span className="block text-xs text-slate-500">销量</span><b>{o.volume}</b></div><div><span className="block text-xs text-slate-500">风险</span><b>{o.risk}</b></div></div><div className={`mt-4 text-xs font-medium ${o.fit?"text-teal-700":"text-red-600"}`}>{o.fit?"满足当前约束":"未满足当前约束"}</div></button>)}</div>
    </Panel>

    <Panel title="B方案 · 假设与响应模拟" eyebrow="Deterministic model">
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6 rounded-lg bg-slate-50 p-4">
          <Control label="试点价格" value={`¥${price}`} note="当前 ¥39"><Slider value={[price]} min={40} max={45} step={1} onValueChange={(v)=>setPrice(v[0])}/></Control>
          <Control label="价格弹性" value={elasticity.toFixed(2)} note="敏感度越高，销量影响越大"><Slider value={[elasticity]} min={-2} max={-.4} step={.05} onValueChange={(v)=>setElasticity(v[0])}/></Control>
          <Control label="外部客流变化" value={`${traffic>0?"+":""}${traffic}%`} note="与调价效果分开"><Slider value={[traffic]} min={-10} max={10} step={1} onValueChange={(v)=>setTraffic(v[0])}/></Control>
        </div>
        <div>
          <div className="metric-grid overflow-hidden rounded-lg border">{[
            ["价格变化", <Delta key="p" value={sim.priceChange}/>], ["预测销量", <Delta key="v" value={sim.demandChange}/>], ["单位毛利率", `${sim.gm.toFixed(1)}%`], ["28天增量毛利", money(sim.incremental28d)]
          ].map((m,i)=><div key={i} className={`bg-white p-4 ${i?"border-l":""}`}><div className="text-xs text-slate-500">{m[0]}</div><div className="mt-2 text-xl font-semibold">{m[1]}</div></div>)}</div>
          <div className="mt-5 grid gap-3 md:grid-cols-3"><ModelLine label="ADQ / 店日" formula="UPH × ADTC / 100" value={`${sim.units.toFixed(1)} 份`}/><ModelLine label="预测 UPH" formula="基准UPH × 需求系数" value={sim.mix.toFixed(1)}/><ModelLine label="贡献毛利 / 店日" formula="ADQ × 单位毛利" value={money(sim.gp)}/></div>
          <div className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm leading-6 text-blue-900"><CircleAlert className="mt-1 size-4 shrink-0"/>模拟只改变价格、弹性与外部客流；尚未纳入竞品跟价、长期复购和跨 SKU 替代的二阶效应。</div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-end gap-3">{!canProceed && <span className="text-sm text-red-600">当前方案穿透决策约束，不能提交</span>}<Button onClick={onNext} disabled={!canProceed}>形成决策建议 <ArrowRight /></Button></div>
    </Panel>
  </Shell>;
}

function Control({ label, value, note, children }: { label:string; value:string; note:string; children:React.ReactNode }) { return <div><div className="mb-2 flex justify-between"><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-slate-500">{note}</div></div><b>{value}</b></div>{children}</div>; }
function ModelLine({ label, formula, value }: { label:string; formula:string; value:string }) { return <div className="rounded-lg border bg-white p-4"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-xl font-semibold">{value}</div><div className="mt-2 font-mono text-[11px] text-slate-400">{formula}</div></div>; }

function CommitStage({ selected, price, sim, committed, onCommit }: { selected:string; price:number; sim:Sim; committed:boolean; onCommit:()=>void }) {
  return <Shell aside={<AgentNote title="Decision Secretary" tone="warn" text="系统记录证据和取舍，但不替代拍板。Decision Owner 必须确认适用范围、停止条件与复盘日期。" />}>
    <Panel eyebrow="Step 5 · Commit" title="待提交的决策记录">
      <div className="rounded-lg border-2 border-teal-700 bg-teal-50/50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-wide text-teal-700">推荐选择</div><div className="mt-1 text-xl font-semibold">{selected==="hold"?"A · 保持现价并优化成本":`B · ¥${price} 小范围试点`}</div></div><Badge className="bg-teal-700">置信度 · 中等</Badge></div><div className="mt-5 grid gap-4 md:grid-cols-3"><Summary label="为什么" text="在满足毛利硬约束的同时，保留小范围验证价格敏感度的机会。"/><Summary label="放弃了什么" text="不立即获得全国性毛利提升；接受4周观察期和试点管理成本。"/><Summary label="核心风险" text={`真实价格弹性高于假设，交易量可能跌破 -8% 护栏。当前模拟为 ${sim.demandChange.toFixed(1)}%。`}/></div></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2"><SummaryBox title="执行责任"><p><b>负责人：</b>华东运营总监</p><p><b>启动：</b>2026-09-14</p><p><b>范围：</b>20 家匹配试点店 + 20 家对照店</p></SummaryBox><SummaryBox title="成功与停止"><p><b>成功：</b>增量毛利 &gt; 5%，交易量下降 &lt; 5%</p><p><b>停止：</b>连续7天交易量 &lt; -8% 或 NPS &lt; -3</p><p><b>复盘：</b>2026-10-19</p></SummaryBox></div>
      <div className="mt-5 flex justify-end">
        <Dialog><DialogTrigger asChild><Button disabled={committed}><ClipboardCheck />{committed?"决策已提交":"由 Decision Owner 提交"}</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>确认提交试点决策</DialogTitle><DialogDescription>提交后将锁定本次决策问题、证据版本、关键假设和停止条件，供后续复盘使用。</DialogDescription></DialogHeader><div className="rounded-md bg-slate-50 p-4 text-sm"><b>陈明 · COO</b><p className="mt-1 text-slate-600">{selected === "hold" ? "批准 A 方案：保持 ¥39，优先优化单位成本。" : `批准 B 方案：上海写字楼商圈 20 店，¥${price}，试点 4 周。`}</p></div><DialogFooter><DialogClose asChild><Button variant="outline">返回检查</Button></DialogClose><DialogClose asChild><Button onClick={onCommit}>确认并生成试点计划</Button></DialogClose></DialogFooter></DialogContent></Dialog>
      </div>
    </Panel>
  </Shell>;
}

function LearnStage({ committed, price, elasticity, sim }: { committed:boolean; price:number; elasticity:number; sim:Sim }) {
  return <Shell aside={<AgentNote title="Review Agent" tone={committed?"good":"warn"} text={committed?"已将决策时假设冻结为复盘基线。复盘时将区分：判断偏差、执行偏差、环境变化。":"这是试点计划预览。正式提交决策后，才会锁定基线与责任。"} />}>
    <Panel eyebrow="Step 6 · Learn" title={committed?"试点已进入执行准备":"试点与复盘计划预览"}>
      <div className="grid gap-3 md:grid-cols-4">{[["第0周","门店匹配","确认实验组与对照组"],["第1周","启动监测","每日检查交易量护栏"],["第2–3周","稳定观察","排除活动与节假日干扰"],["第4周","决策复盘","扩大、调整或终止"]].map((x,i)=><div key={x[0]} className="relative rounded-lg border p-4"><div className="mb-3 grid size-8 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">{i+1}</div><b>{x[0]} · {x[1]}</b><p className="mt-2 text-sm leading-6 text-slate-600">{x[2]}</p></div>)}</div>
      <Tabs defaultValue="scorecard" className="mt-6"><TabsList><TabsTrigger value="scorecard">复盘计分卡</TabsTrigger><TabsTrigger value="logic">决策逻辑</TabsTrigger><TabsTrigger value="actions">执行清单</TabsTrigger></TabsList><TabsContent value="scorecard" className="mt-4"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["指标","决策时基线","预期","成功阈值","停止条件"].map(h=><th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y">{[
          ["单店贡献毛利/日","¥1,783",money(sim.gp),"> +5%","—"],["套餐交易量","79.6份",`${sim.units.toFixed(1)}份`,"> -5%","< -8% / 7天"],["套餐 UPH","18.6",sim.mix.toFixed(1),"> 17.7","< 17.1"],["NPS","52","≥ 50","> -2分","< -3分"]
        ].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i} className={`px-4 py-3 ${i===0?"font-medium":""}`}>{c}</td>)}</tr>)}</tbody></table></div></TabsContent><TabsContent value="logic" className="mt-4"><div className="grid gap-3 md:grid-cols-3"><Summary label="假设" text={`写字楼客群在 ¥${price} 试点下，价格弹性约为 ${elasticity.toFixed(2)}。`}/><Summary label="因果主张" text="匹配对照店差异用于估计调价增量，不能直接用前后对比。"/><Summary label="复盘判断" text="先看执行一致性，再判断模型假设和策略方向。"/></div></TabsContent><TabsContent value="actions" className="mt-4"><div className="space-y-2">{["Finance 冻结试点成本基线","Ops 确认40家门店匹配","Data 发布每日护栏监测","CX 设置NPS异常提醒"].map((x,i)=><div key={x} className="flex items-center gap-3 rounded-md border p-3"><div className={`grid size-6 place-items-center rounded-full ${i<1?"bg-teal-600 text-white":"bg-slate-100 text-slate-500"}`}>{i<1?<Check className="size-3"/>:i+1}</div>{x}</div>)}</div></TabsContent></Tabs>
    </Panel>
  </Shell>;
}

function Summary({ label, text }: { label:string; text:string }) { return <div><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div><p className="mt-1 text-sm leading-6 text-slate-700">{text}</p></div>; }
function SummaryBox({ title, children }: { title:string; children:React.ReactNode }) { return <div className="rounded-lg border p-4"><h3 className="mb-3 font-semibold">{title}</h3><div className="space-y-2 text-sm leading-6 text-slate-700">{children}</div></div>; }

function AgentNote({ title, text, tone }: { title:string; text:string; tone:"good"|"warn"|"bad" }) {
  const colors = tone==="good"?"border-teal-200 bg-teal-50 text-teal-950":tone==="bad"?"border-red-200 bg-red-50 text-red-950":"border-amber-200 bg-amber-50 text-amber-950";
  const Icon = tone==="good"?Sparkles:tone==="bad"?X:Lightbulb;
  return <div className={`rounded-xl border p-5 ${colors}`}><div className="flex items-center gap-2 font-semibold"><Icon className="size-5"/>{title}</div><p className="mt-3 text-sm leading-6 opacity-85">{text}</p><button className="mt-4 flex items-center gap-1 text-sm font-semibold">查看依据 <ChevronRight className="size-4"/></button></div>;
}
