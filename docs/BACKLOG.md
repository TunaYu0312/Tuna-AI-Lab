# 项目待办池

## P0：当前周期

### Family Learning Navigator

- 校验家长的高频决策问题；
- 完成能力画像与证据模型；
- 设计多路径建议和四周实验；
- 建立避免“AI 算命”的安全评估。

### Pricing Agent

- 建立样本数据和指标字典；
- 完成菜单工程与定价规则基线；
- 设计建议解释、情景模拟和试点方案；
- 建立回归测试与人工复核。

## P1：下一候选

- Store Health Agent：多指标异常诊断与行动优先级；
- Customer Journey Agent：排队、出餐、评价的旅程诊断；
- Decision Agent Starter：统一输入、证据、建议和评估框架；
- GitHub Radar：每周研究 3–5 个候选项目并推荐一个复现目标；
- RAG Evaluation Lab：比较检索、重排和引用正确性。

### GitHub Agent & Skills Radar（2026-08-03）

完整研究见 [AI Agent & Skills Top 10 Radar](../open-source-research/2026-08-03-ai-agent-skills-top10.md)。

- 立即研究：`anthropics/skills`、`obra/superpowers`、`awesome-llm-apps`；
- 小范围复现：`browser-use`、`langflow`；
- 同用例对照后择一：`langflow` 与 `dify`，不同时进入长期维护；
- 架构研究：`hermes-agent` 的 Memory/Skills 闭环；
- 受许可证或复杂度约束，仅部署评估/只读研究：`n8n`、`AutoGPT`；
- 按模块采用，不做整仓学习任务：`LangChain`；
- AutoGen 已进入 maintenance mode；新项目观察其后继 `microsoft/agent-framework`。

四周计划：

1. 建立 Tuna Skill 模板和 GitHub Radar Skill 草案；
2. 从 `awesome-llm-apps` 选择一个与现有 P0 对齐的案例原样复现；
3. 用 `browser-use` 做只读 GitHub 采集 PoC；
4. 用同一最小 Decision Agent 用例对照 Langflow 与 Dify，并只保留一个方向。

上述任务保持 P1，不挤占当前两个 P0。任何项目进入 Clone Queue 前，必须明确目标模块、目录级许可证、验收标准、时间盒和停止条件。

## P2：探索池

- Menu Engineering Agent；
- Location Agent；
- Member Marketing Agent；
- Store Inspection Vision；
- OCR 文档/菜单识别；
- YOLO 门店对象检测；
- Voice Agent；
- Camera–Vision–LLM–Action 机器人链路；
- Mosquito Vision Radar（仅视觉检测阶段；激光硬件涉及眼睛与火灾安全，另行风险审查）。

## 排序规则

按“问题价值、证据强度、能力匹配、四周可交付性、数据可得性、风险”评分。任何时间最多保留两个 P0；新增 P0 必须替换或完成现有 P0。
