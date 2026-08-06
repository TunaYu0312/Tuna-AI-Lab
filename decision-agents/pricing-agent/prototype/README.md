# Menu Pricing Decision Room MVP

连锁餐饮菜单定价决策会议工作台原型。该版本围绕一个模拟案例，完整演示从问题定义、共同事实、方案比较和 Product Mix 推演，到试点冻结与复盘的五阶段流程。

## 关键能力

- 会议大屏式五阶段决策路线；
- 套餐整体及分商圈销售额硬约束；
- `ADQ = UPH × ADTC` 的明确计算口径；
- 目标产品 UPH、当季 ADTC、替代回收率的交互情景输入；
- Product Mix 前后变化及相关产品迁移；
- 整体菜单销售额、毛利额、毛利率和净增量贡献联动计算；
- 策略与试点路线分离，支持扩大、暂停和回滚条件；
- 决策纪要导出及正式版本冻结交互。

## 本地运行

环境要求：Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

验证：

```bash
npm run lint
npm test
```

## 主要文件

- `app/page.tsx`：五阶段会议流程、Product Mix 模型和交互逻辑；
- `app/globals.css`：会议大屏布局与响应式样式；
- `docs/MERGED_MVP_SCOPE.md`：合并后的产品范围、计算口径和验收标准；
- `tests/rendered-html.test.mjs`：服务端渲染及关键模型文案检查；
- `.openai/hosting.json`：Sites 部署项目声明。

## 模型边界

本仓库不包含真实企业经营数据。页面中的门店、销量、价格、成本、Product Mix、顾客及商圈结果均为原型模拟值，不应直接用于真实定价决策。

正式接入时应优先冻结指标口径和历史事件样本，分析价格对目标产品 UPH 的影响，再使用同季 ADTC 换算 ADQ。相关产品的替代、升级、拆套和连带效应需要有经验的分析师校准；未来 AI 只负责从历史事件提出可审查的参数建议。

## 在线演示

[私有生产演示（需授权）](https://menu-pricing-decision-room.tunayu0312.chatgpt.site)
