# Pricing Decision System PRD v0.2

## 1. 产品定义

Pricing Decision System 不是定价报表，也不是自动改价工具。它是一个面向连锁餐饮管理团队的**决策会议工作台**：把一次价格调整从模糊议题转化为有证据、有约束、有备选方案、有明确责任，并能通过试点复盘学习的组织决策。

首个 MVP 使用“套餐价格调整”作为垂直场景，验证以下主张：

> 标准化决策流程 + 确定性经营模型 + AI 结构化推理，是否能让管理团队更快形成可执行、可验证的定价决策。

## 2. 目标用户与责任

| 角色 | 核心任务 | 系统责任 |
|---|---|---|
| Decision Owner（COO/经营负责人） | 拍板并承担结果 | 确认范围、方案、护栏与复盘日期 |
| 产品/定价负责人 | 发起决策、解释业务背景 | 定义决策对象与方案 |
| Finance | 守住利润与财务口径 | 提供成本、毛利和财务约束 |
| Operations | 判断门店可执行性 | 评估制作、人员和试点负担 |
| Data | 提供可追溯证据与因果评估 | 计算指标、检查质量、设计对照 |
| Consumer/Brand | 守住价值感和品牌边界 | 提供 PSS、NPS、竞品与品牌原则 |

Agent 不拥有最终决策权。

## 3. MVP 决策对象

每个决策必须保存为结构化 Decision Object：

- `decision_question`：要决定什么；
- `objective`：要改善的经营结果；
- `owner`：最终拍板者；
- `scope`：市场、商圈、门店、SKU、渠道和时间；
- `deadline`：最迟决策日期；
- `non_goals`：本次明确不决定什么；
- `evidence`：事实、来源、版本、质量与适用范围；
- `constraints`：硬约束、护栏和原则；
- `options`：可选动作及适用条件；
- `assumptions`：模拟依赖的可调整假设；
- `tradeoffs`：收益、代价、风险与放弃项；
- `commitment`：最终选择和理由；
- `action_plan`：负责人、里程碑和停止条件；
- `review_plan`：基线、目标、复盘日期与归因方法。

## 4. 端到端流程

### Step 1 — Define

将“讨论套餐涨价”改写为可拍板问题：

> 是否在上海写字楼商圈，将经典鸡腿堡套餐从 ¥39 调整至 ¥42，并先在 20 家门店试点 4 周？

通过条件：动作、对象、幅度、范围、时间、Decision Owner 和非目标明确。

### Step 2 — Evidence

Step 2 是 **Pre-Decision Evidence Workflow**，不是一张静态 Evidence Card。系统按决策范围自动组织：

- P-mix / UPH 与价格带；
- 单位成本、毛利率、贡献毛利；
- Menu Grid 与 SKU 角色；
- ADTC、AC、ADS 和情景预测；
- PSS / GVFM / NPS 与价格敏感度；
- 竞品价格（只作背景，不能自动触发跟价）；
- SKU 替代、促销和渠道混杂；
- 门店制作复杂度、损耗和缺货风险。

所有证据必须显示来源、时间、完整度、适用范围和缺口。缺失数据不得由模型补造。

### Step 3 — Constitution

会议开始前先确认：

- 硬约束：违反即不得选择；
- 护栏：试点中触发即暂停或升级审批；
- 原则：品牌、消费者公平与合规边界；
- 权责：谁能拍板、谁能否决、谁负责执行。

### Step 4 — Options

至少保留三个真实可选方案，不把“推荐方案”伪装成唯一答案：

1. 保持现价并优化成本；
2. 小范围测试涨价；
3. 重组套餐与价值锚点。

系统展示每个方案的收益、损失、风险、证据强度和约束符合度。数值模拟由确定性代码完成，LLM 只负责解释、识别冲突和提出待验证假设。

### Step 5 — Commit

Decision Owner 必须确认：最终选择、为什么选择、放弃了什么、适用范围、执行负责人、成功指标、停止条件和复盘日期。提交后冻结证据版本和关键假设。

### Step 6 — Learn

通过匹配实验店与对照店复盘：

> 决策时预期 → 实际结果 → 偏差 → 执行问题 / 模型问题 / 环境变化 → 是否扩大、调整或终止。

## 5. 首版确定性模型

基础指标：

```text
ADQ = UPH × ADTC / 100
Unit Gross Profit = Price - Unit Cost
Gross Margin % = Unit Gross Profit / Price
SKU Daily GP = ADQ × Unit Gross Profit
```

价格响应模拟：

```text
Price Change % = New Price / Current Price - 1
Demand Factor = max(0.55, 1 + Elasticity × Price Change %) × (1 + External Traffic %)
Predicted UPH = Baseline UPH × Demand Factor
Pilot Incremental GP = (New Daily GP - Baseline Daily GP) × Stores × Days
```

模型必须把价格效应与外部客流分开，并显式显示假设。MVP 不把模拟当作因果预测承诺。

## 6. MVP 功能范围

已纳入：

- 六步决策导航和共享状态；
- Decision Definition 与非目标；
- Evidence Readiness 和数据缺口；
- Decision Constitution 与自动约束检查；
- 三方案比较；
- 价格、弹性、外部客流实时模拟；
- Owner 提交确认；
- 试点时间线、护栏和复盘计分卡；
- 完整模拟数据，不使用公司真实数据。

暂不纳入：

- 企业数据库/API 接入；
- 录音、转写与实时多人协作；
- LLM 在线生成与企业知识库；
- 权限系统与永久审计存储；
- 自动改价、自动发布菜单；
- 全量 P-mix Response Simulation、SKU 网络替代和因果模型。

## 7. 成功标准

- 业务用户能在 10 分钟内完成一次端到端模拟决策；
- 所有数值能追溯到输入和公式；
- 硬约束冲突不会被隐藏；
- Decision Owner、执行人、停止条件和复盘日期完整；
- 至少 10 个情景回归测试无计算错误；
- 与静态报表相比，人工评审认为方案取舍和复盘计划更完整。

## 8. 产品验证重点

本阶段不是验证“预测准不准”，而是验证三个问题：

1. 真实 Decision Owner 是否愿意按六步流程完成一次价格决策；
2. Evidence Workflow 是否减少会中临时找数据和口径争论；
3. 方案取舍、停止条件和复盘基线是否明显提升决策可执行性。

## 9. 停止条件

若真实用户认为流程增加负担但未减少返工，关键证据长期无法获得，或系统输出无法优于一页规则模板，则暂停扩展，不继续包装为通用 Agent 平台。
