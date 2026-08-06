const fs = require("fs");
const path = require("path");

const demoPath = path.join(__dirname, "..", "demo", "index.html");
const html = fs.readFileSync(demoPath, "utf8");
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);

if (!scriptMatch) {
  throw new Error("Demo script block not found");
}

new Function(scriptMatch[1]);

const elements = {};
const documentStub = {
  getElementById(id) {
    if (!elements[id]) {
      elements[id] = { innerHTML: "", value: "", addEventListener() {} };
    }
    return elements[id];
  },
  querySelectorAll() {
    return [];
  }
};

const result = {};
const probe = `${scriptMatch[1]}
globalThis.defaultState = { teamId: state.teamId, page: state.page };
globalThis.overview = document.getElementById("app").innerHTML;
globalThis.expectedFocus = portfolio().filter(r => r.score < 62 || r.labels.some(l => l[1] === "red")).length;
globalThis.renderedFocus = (globalThis.overview.match(/class="team-row/g) || []).length;

state.teamId = portfolio()[0].team.id;
state.page = "health";
render();
globalThis.healthOk = document.getElementById("app").innerHTML.includes("model-grid");

state.page = "attribution";
render();
globalThis.attributionOk = document.getElementById("app").innerHTML.includes("loss-list");

state.page = "risk";
render();
globalThis.riskOk = document.getElementById("app").innerHTML.includes("risk-tabs");

state.teamId = "T02";
state.risk = "action";
render();
globalThis.emptyRiskOk = document.getElementById("app").innerHTML.includes("empty-row");

state.period = "2026-06";
globalThis.monthTarget = periodTeam(teams[0]).target;
state.period = "2026-Q2";
globalThis.quarterTarget = periodTeam(teams[0]).target;

state.teamId = "T03";
state.page = "report";
render();
globalThis.reportOk = document.getElementById("app").innerHTML.includes("reportPreview");
saveFeedback("T03", "2026-Q2", {
  conclusion: "confirmed",
  recorder: "smoke-test",
  rootCause: "synthetic root cause",
  leaderNote: "synthetic note",
  nextReview: "2026-07-15",
  updatedAt: "2026-08-06T00:00:00.000Z"
});
render();
globalThis.feedbackOk = reportDocumentHtml().includes("smoke-test");
globalThis.exportOk = reportDocumentHtml().includes("@media print");
`;

new Function("document", "globalThis", probe)(documentStub, result);

const checks = {
  defaultOverview: result.defaultState.teamId === "all" && result.defaultState.page === "overview",
  focusCountMatches: result.expectedFocus === result.renderedFocus,
  healthPage: result.healthOk,
  attributionPage: result.attributionOk,
  riskPage: result.riskOk,
  emptyRiskState: result.emptyRiskOk,
  periodLinked: result.quarterTarget === result.monthTarget * 3,
  reportPage: result.reportOk,
  feedbackContext: result.feedbackOk,
  htmlAndPrintExport: result.exportOk,
  noFabricatedConfidence: !html.includes("82%")
};

const failed = Object.entries(checks).filter(([, passed]) => !passed);
if (failed.length) {
  throw new Error(`Smoke test failed: ${failed.map(([name]) => name).join(", ")}`);
}

console.log(JSON.stringify({ status: "ok", focusTeams: result.expectedFocus, checks }, null, 2));

