# GitHub AI Agent & Skills Top 10 Radar

- 统计日期：2026-08-03（Asia/Shanghai）
- 数据来源：GitHub 官方 Search/Repository API；GitHub 插件读取各仓库 README 与 LICENSE
- 目的：为 Tuna AI Lab 建立可复核的参考项目池，不以 Star 直接替代技术判断

## 口径与限制

GitHub 没有统一的“AI Agent / Agent Skills”官方分类，因此不存在完全客观、永久不变的全站 Top 10。本次采用以下可复现口径：

1. 搜索 `topic:ai-agent`、`topic:agentic-ai`、`topic:agents`、`"AI agent" in:name,description`、`"agent skills" in:name,description`；
2. 按 Star 降序合并、去重，并人工核验 README；
3. 纳入 Agent 框架、Agent 产品/平台、Agent Skills、可运行 Agent 案例库；
4. 排除纯模型权重、新闻/论文列表、提示词合集、单纯课程和与 Tuna AI Lab 落地关系弱的垂直应用；
5. n8n 虽不是纯 Agent 框架，但其 README 明确将项目定位为 “Platform for AI Agents and Workflow Automation”，因此纳入；
6. Star 和活跃日期均为统计时点快照，后续雷达应重新查询。

## Top 10（按 Star）

| # | 仓库 | Stars | 类型 | 最近推送 | 许可证判断 | Tuna 适配度 |
|---:|---|---:|---|---|---|---:|
| 1 | [obra/superpowers](https://github.com/obra/superpowers) | 265,222 | Agent Skills + 软件开发方法 | 2026-08-03 | MIT | 5/5 |
| 2 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 224,403 | 自改进个人 Agent / Agent Harness | 2026-08-03 | MIT | 4/5 |
| 3 | [n8n-io/n8n](https://github.com/n8n-io/n8n) | 199,108 | AI Agent 与工作流自动化平台 | 2026-08-03 | Sustainable Use + Enterprise，非标准开源 | 4/5 |
| 4 | [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | 185,776 | 可视化 Agent 构建与运行平台 | 2026-08-03 | 混合：`autogpt_platform/` 为 PolyForm Shield，其余多为 MIT | 3/5 |
| 5 | [anthropics/skills](https://github.com/anthropics/skills) | 165,848 | Agent Skills 规范、模板与示例 | 2026-07-24 | 混合：许多示例为 Apache-2.0；文档技能为 source-available | 5/5 |
| 6 | [langflow-ai/langflow](https://github.com/langflow-ai/langflow) | 152,768 | 可视化 Agent / Workflow Builder | 2026-08-03 | MIT | 4.5/5 |
| 7 | [langgenius/dify](https://github.com/langgenius/dify) | 151,128 | RAG、Agent、Workflow 应用平台 | 2026-08-03 | 修改版 Apache-2.0，含多租户与品牌限制 | 4/5 |
| 8 | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | 143,265 | Agent 工程平台与组件生态 | 2026-08-02 | MIT | 4/5 |
| 9 | [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 129,901 | Agent Skills、RAG 与可运行案例库 | 2026-08-03 | Apache-2.0 | 5/5 |
| 10 | [browser-use/browser-use](https://github.com/browser-use/browser-use) | 107,630 | 浏览器操作 Agent | 2026-08-03 | MIT | 4.5/5 |

> 适配度是针对 Tuna AI Lab 当前路线的判断，不是代码质量或行业地位排名。

## 对 Tuna AI Lab 的实际价值

### 1. obra/superpowers

可借鉴：

- 从需求澄清、规格、计划、TDD 到代码评审的 Skills 链路；
- Skill 自动触发和组合方式；
- 将“持续交付方法”固化为 Agent 行为，而不是依赖临时提示词。

适合：统一 Tuna AI Lab 的项目实施纪律，减少“想法很多、闭环不足”。

建议动作：优先研究和试用官方 Codex 插件；不需要为了学习而复制整个仓库。

### 2. NousResearch/hermes-agent

可借鉴：

- 从任务经验生成并改进 Skills 的闭环；
- 跨会话记忆、用户模型、会话搜索；
- 定时任务、多渠道入口、子 Agent 隔离与并行；
- MCP、工具、Skills、Memory 的一体化架构。

适合：Captain Log、Emotion Pulse、Personal AI Operating System，以及长期 GitHub Radar。

风险：系统范围很大，自改进机制如果没有评估和回滚，会积累错误。建议只抽取“记忆 + Skill 生成 + 评估”小闭环，不整仓改造成 Tuna 产品。

### 3. n8n

可借鉴：

- 定时触发、API/数据库连接、人工审批、通知与可观测性；
- 将 GitHub Radar 串成“搜索—筛选—报告—人工确认—归档”；
- 快速连接表格、邮件、数据库和 Webhook。

适合：实验室内部自动化底座。

许可证边界：Sustainable Use License 主要允许内部业务、个人或非商业用途；不应把 n8n 源码直接改造成对外商业化平台。优先“部署和配置”，不以其源码作为 Tuna 产品底座。

### 4. AutoGPT

可借鉴：

- Agent Builder、运行看板、成本/状态跟踪、Marketplace；
- Agent Benchmark 和失败记录；
- 托管版与自托管版的产品分层。

风险：许可证按目录拆分，核心 `autogpt_platform/` 受 PolyForm Shield 的竞争性使用限制；整体也较重。

建议动作：只读研究平台架构；如要复用代码，仅考虑明确标记为 MIT 的目录，并记录来源。

### 5. anthropics/skills

可借鉴：

- `SKILL.md` 的最小结构、描述与触发语义；
- 指令、脚本、参考资料和资产的目录组织；
- Skills 规范、模板和复杂生产级示例。

适合：LLM Application Lab 的 Skills 主线，以及 GitHub Radar、项目复现、PRD、评估等 Tuna 专用 Skills。

许可证边界：根仓库是混合许可；复制前必须逐目录检查。文档创建类 Skills 是 source-available，不应按普通开源代码处理。

### 6. Langflow

可借鉴：

- 可视化流程、交互式调试、多 Agent 编排；
- 将 Flow 部署为 API 或 MCP Server；
- 可观测性集成和组件化 Python 扩展。

适合：Pricing Agent、Family Learning Navigator 和 RAG/MCP 实验的快速原型。

建议动作：进入 P1 复现队列，与 Dify 使用同一小用例做对照，不同时长期维护两套平台。

### 7. Dify

可借鉴：

- 数据集/RAG、模型供应商、工具、工作流和应用发布的一体化；
- 快速验证非工程用户能否配置 Agent；
- 从原型到部署的产品体验。

风险：修改版 Apache-2.0 对多租户和前端品牌有额外限制。

建议动作：可自托管做内部对照实验；不建议 Fork 后作为 Tuna 对外 SaaS 外壳。

### 8. LangChain

可借鉴：

- Tool Calling、Retrieval、模型适配器、Agent 中间件与生态集成；
- 大量可替换组件和工程模式。

风险：范围宽、抽象层多、版本变化快，整仓阅读或复制的收益低。

建议动作：按问题选择包和示例；需要有状态、可恢复工作流时，另行重点评估 [LangGraph](https://github.com/langchain-ai/langgraph)。

### 9. awesome-llm-apps

可借鉴：

- 单 Agent、多 Agent、RAG、Voice、Generative UI、Always-on Agent 的可运行原型；
- 与 Tuna 方向直接相关的 AI Data Analysis、AI Teaching、Research、Finance 等案例；
- 以小项目为单位的快速复现方式。

适合：Tuna AI Lab 的“参考—复现—理解—改造”主要候选池。

建议动作：不要全量顺序学习；使用 sparse checkout 或只复制选中的子项目。第一批只选 1 个数据分析案例和 1 个教育案例。

### 10. browser-use

可借鉴：

- Agent 浏览网页、填写表单、结构化抽取和 Web QA；
- 自定义工具、MCP 与本地/云端浏览器组合。

适合：GitHub Radar、公开资料收集、竞品研究和应用自动化测试。

风险：网页结构变化、登录态、验证码、网站条款和提示词注入。必须使用隔离浏览器、域名白名单、动作审批和最小权限凭据。

## 推荐队列：不是按 Star 排，而是按可落地性

### P1-A：立即研究，不新增 P0

1. `anthropics/skills`：建立 Tuna Skill 模板与目录标准；
2. `obra/superpowers`：评估能否加强规格、计划、测试、评审闭环；
3. `awesome-llm-apps`：筛选两个与现有 P0 对齐的小项目。

### P1-B：小范围复现

1. `browser-use`：做一个只读 GitHub 项目采集 PoC；
2. `langflow`：用同一输入输出实现一个最小 Decision Agent Flow；
3. `dify`：只做同用例对照，四周内必须决定保留哪一个；
4. `hermes-agent`：只复现 Memory/Skills 小闭环，不复刻完整个人 Agent。

### P2：架构参考或受许可证约束

- `n8n`：内部自动化可用，产品代码不直接继承；
- `AutoGPT`：研究 Builder、运行看板和 Benchmark，严格按目录核验许可证；
- `LangChain`：按模块使用，不克隆整个单体作为学习任务。

## Star 较低但战略相关的观察池

- [mem0ai/mem0](https://github.com/mem0ai/mem0)：长期记忆，适合 Captain Log 与 Emotion Pulse；
- [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)：有状态、可恢复 Agent，适合 Decision Agent；
- [openai/openai-agents-python](https://github.com/openai/openai-agents-python)：轻量多 Agent Workflow；
- [run-llama/llama_index](https://github.com/run-llama/llama_index)：文档 Agent、RAG 与 OCR；
- [ComposioHQ/composio](https://github.com/ComposioHQ/composio)：工具集成、鉴权和沙箱；
- [microsoft/agent-framework](https://github.com/microsoft/agent-framework)：AutoGen 的后继项目。AutoGen 已进入 maintenance mode，不应用于新项目底座。

## 四周执行建议

| 周次 | 任务 | 产出 | 停止条件 |
|---|---|---|---|
| 1 | Skills 标准研究 | Tuna Skill 模板；GitHub Radar Skill 草案 | 无法形成可复用触发条件或评估样例 |
| 2 | 案例复现 | 1 个数据分析或教育 Agent 的原样运行记录 | 许可证不清或两个工作时段仍无法运行 |
| 3 | Browser-use PoC | 只读采集 10 个仓库并输出结构化 JSON | 需要高风险凭据或无法限制动作范围 |
| 4 | Langflow vs Dify | 同一用例的成本、速度、可控性、许可证对照 | 不允许两套平台同时进入长期维护 |

## 克隆与复用规则

进入 Clone Queue 前必须同时满足：

- 与 Family Learning Navigator、Pricing Agent 或 GitHub Radar 至少一个现有课题直接相关；
- 许可证明确到目标目录；
- 已写清准备借鉴的模块，而不是“先克隆再看”；
- 有原样运行的验收标准、时间盒和停止条件；
- 复用时保留原作者、许可证、来源 commit/tag 和修改记录。

结论：第一批最值得进入参考/复现队列的是 `anthropics/skills`、`obra/superpowers`、`awesome-llm-apps`、`browser-use` 和 `langflow`。n8n、Dify、AutoGPT 的 Star 很高，但许可证或系统复杂度决定了它们更适合部署评估和架构研究，而不是直接复制。
