# Pricing Decision Workspace Demo

Pricing Decision System 的可运行 MVP，演示一次套餐调价从问题定义、证据准备、约束审阅、方案模拟、Owner 提交到试点复盘的完整流程。

## 本地运行

```bash
npm run install:ci
npm run dev
```

生产构建与测试：

```bash
npm test
```

演示使用模拟数据，不包含真实企业数据。定价模拟逻辑位于 `lib/pricing-model.ts`，自然语言提示不参与数值计算。
