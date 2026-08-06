import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the pricing decision room", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>菜单定价决策室/);
  assert.match(html, /PRC-2026-071/);
  assert.match(html, /今天只决定一件事/);
  assert.match(html, /A 套餐/);
  assert.match(html, /当前决策/);
  assert.match(html, /共同事实/);
  assert.match(html, /方案与权衡/);
  assert.match(html, /整体菜单毛利额/);
  assert.match(html, /问题与证据/);
  assert.match(html, /决策与复盘/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("includes the product-mix decision model", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /A 套餐销售额不得下降/);
  assert.match(source, /ADQ = UPH × ADTC/);
  assert.match(source, /Product Mix/);
  assert.match(source, /整体菜单毛利额/);
  assert.match(source, /策略 B \+ 路线 D/);
});
