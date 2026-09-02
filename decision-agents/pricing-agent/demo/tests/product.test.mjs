import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true },
});

after(async () => vite.close());

test("pricing simulation reproduces the baseline", async () => {
  const { simulatePricing } = await vite.ssrLoadModule("/lib/pricing-model.ts");
  const result = simulatePricing({ price: 39, elasticity: -1.15, trafficPercent: 0 });
  assert.equal(result.priceChange, 0);
  assert.equal(result.demandChange, 0);
  assert.ok(Math.abs(result.units - 79.608) < 0.001);
  assert.ok(Math.abs(result.gpChange) < 0.001);
});

test("price response, margin and pilot value are deterministic", async () => {
  const { simulatePricing } = await vite.ssrLoadModule("/lib/pricing-model.ts");
  const result = simulatePricing({ price: 42, elasticity: -1.15, trafficPercent: 0 });
  assert.ok(result.demandChange < -8 && result.demandChange > -10);
  assert.ok(result.gm > 60);
  assert.ok(Number.isFinite(result.incremental28d));
});

test("traffic is modeled separately from price response", async () => {
  const { simulatePricing } = await vite.ssrLoadModule("/lib/pricing-model.ts");
  const neutral = simulatePricing({ price: 42, elasticity: -1.15, trafficPercent: 0 });
  const growing = simulatePricing({ price: 42, elasticity: -1.15, trafficPercent: 5 });
  assert.ok(growing.units > neutral.units);
  assert.ok(growing.gp > neutral.gp);
});
