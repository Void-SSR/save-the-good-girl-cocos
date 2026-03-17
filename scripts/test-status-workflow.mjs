import assert from "node:assert/strict";
import fs from "node:fs";
import { exportStatusSite } from "./export-status-site.mjs";
import { htmlPath, mdPath, readStatus, renderStatusArtifacts, sourcePath, writeStatus } from "./render-project-status.mjs";

const originalStatus = readStatus();
const originalMarkdown = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, "utf8") : "";
const originalHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";

const fixtures = [
  {
    schemaVersion: 1,
    project: {
      name: "拯救美少女",
      engine: "Cocos Creator 3.8.8",
      platform: "手机竖屏小游戏",
      sourceOfTruth: "docs/project-status.json"
    },
    tagRule: {
      prefix: "sgg",
      format: "sgg-01, sgg-02, sgg-03 ...",
      currentSequence: 2,
      currentTag: "sgg-02",
      nextTag: "sgg-03",
      notes: "全项目统一使用短标签，尾部数字按顺序递增，方便记忆、查找和回滚。"
    },
    current: {
      title: "首页结构验证",
      status: "进行中",
      gitTag: "sgg-02",
      gitCommit: "testa01",
      updatedAt: "2026-03-17",
      summary: "测试首页数据、模块状态、版本联动是否稳定。"
    },
    modules: [
      { id: "log-system", name: "日志系统", status: "已完成", note: "JSON、Markdown 和 HTML 联动正常。" },
      { id: "home-ux", name: "首页 UI/UX 重做", status: "进行中", note: "首页主卡、章节入口和快捷系统卡正在验证。" }
    ],
    history: [
      {
        sequence: 2,
        tag: "sgg-02",
        date: "2026-03-17",
        title: "首页结构验证",
        commit: "testa01",
        rollbackReady: true,
        summary: ["验证首页信息层级。", "验证 HTML 与 Markdown 联动。", "验证导出站点生成。", "验证版本区展示。"] 
      },
      {
        sequence: 1,
        tag: "sgg-01",
        date: "2026-03-17",
        title: "Cocos 骨架与日志系统初始化",
        commit: "base001",
        rollbackReady: true,
        summary: ["基础骨架已建。", "日志方案已落地。"]
      }
    ],
    nextSteps: ["继续验证战斗板块联动。", "确认版本记录样式。", "准备清理测试数据。"],
    usageNotes: [
      "开发者以 docs/project-status.json 为唯一真实记录来源。",
      "DEVLOG.md 给开发和版本回滚查看。",
      "PROJECT-DASHBOARD.html 给非技术伙伴快速查看。"
    ]
  },
  {
    schemaVersion: 1,
    project: {
      name: "拯救美少女",
      engine: "Cocos Creator 3.8.8",
      platform: "手机竖屏小游戏",
      sourceOfTruth: "docs/project-status.json"
    },
    tagRule: {
      prefix: "sgg",
      format: "sgg-01, sgg-02, sgg-03 ...",
      currentSequence: 3,
      currentTag: "sgg-03",
      nextTag: "sgg-04",
      notes: "全项目统一使用短标签，尾部数字按顺序递增，方便记忆、查找和回滚。"
    },
    current: {
      title: "战斗板块联动验证",
      status: "进行中",
      gitTag: "sgg-03",
      gitCommit: "testb02",
      updatedAt: "2026-03-18",
      summary: "第二轮测试模拟后续版本更新，验证覆盖写入和导出刷新是否正常。"
    },
    modules: [
      { id: "log-system", name: "日志系统", status: "已完成", note: "联动更新稳定。" },
      { id: "cocos-skeleton", name: "Cocos 项目骨架", status: "已完成", note: "基础模块已就位。" },
      { id: "battle-rebuild", name: "战斗系统重构", status: "进行中", note: "验证第二轮版本追记与展示。" }
    ],
    history: [
      {
        sequence: 3,
        tag: "sgg-03",
        date: "2026-03-18",
        title: "战斗板块联动验证",
        commit: "testb02",
        rollbackReady: true,
        summary: ["验证第二轮覆盖渲染。", "验证版本号顺序增长。", "验证导出站点实时更新。", "验证页面底部辅助信息区位置。"] 
      },
      {
        sequence: 2,
        tag: "sgg-02",
        date: "2026-03-17",
        title: "首页结构验证",
        commit: "testa01",
        rollbackReady: true,
        summary: ["第一页联动测试通过。", "准备继续下一轮。"]
      },
      {
        sequence: 1,
        tag: "sgg-01",
        date: "2026-03-17",
        title: "Cocos 骨架与日志系统初始化",
        commit: "base001",
        rollbackReady: true,
        summary: ["初始化完成。"]
      }
    ],
    nextSteps: ["恢复正式数据。", "生成正式版日志。", "准备投入使用。"],
    usageNotes: [
      "开发者以 docs/project-status.json 为唯一真实记录来源。",
      "DEVLOG.md 给开发和版本回滚查看。",
      "PROJECT-DASHBOARD.html 给非技术伙伴快速查看。",
      "真正回滚时，由使用者告诉 Codex 标签名，再由 Codex 执行回滚。"
    ]
  }
];

function assertContains(haystack, needle, message) {
  assert.ok(haystack.includes(needle), message);
}

function verifyRenderedOutputs(fixture) {
  const markdown = fs.readFileSync(mdPath, "utf8");
  const html = fs.readFileSync(htmlPath, "utf8");
  const exportResult = exportStatusSite({ data: fixture, useGitContext: false });
  const exportedHtml = fs.readFileSync(exportResult.files.indexHtml, "utf8");
  const exportedJson = fs.readFileSync(exportResult.files.statusJson, "utf8");

  assertContains(markdown, fixture.current.title, "Markdown 未同步当前阶段标题");
  assertContains(markdown, fixture.current.gitTag, "Markdown 未同步当前 Git 标签");
  assertContains(markdown, fixture.history[0].title, "Markdown 未同步版本记录");

  assertContains(html, fixture.current.summary, "HTML 未同步当前摘要");
  assertContains(html, fixture.tagRule.nextTag, "HTML 未同步下一个标签");
  assertContains(html, fixture.history[0].tag, "HTML 未同步最新版本标签");

  assert.ok(
    html.indexOf("<h2>下一步</h2>") < html.indexOf("<h2>Git 标签规则</h2>"),
    "辅助说明区没有保持在页面底部"
  );

  assertContains(exportedHtml, fixture.current.title, "导出站点 index.html 未同步当前阶段");
  assertContains(exportedHtml, fixture.current.gitTag, "导出站点 index.html 未同步 Git 标签");
  assertContains(exportedJson, fixture.current.gitTag, "导出站点 project-status.json 未同步最新数据");
}

try {
  for (const fixture of fixtures) {
    writeStatus(fixture);
    renderStatusArtifacts({ useGitContext: false });
    verifyRenderedOutputs(fixture);
  }

  console.log("Status dashboard test passed for 2 fixtures.");
} finally {
  writeStatus(originalStatus);
  fs.writeFileSync(mdPath, originalMarkdown, "utf8");
  fs.writeFileSync(htmlPath, originalHtml, "utf8");
  renderStatusArtifacts();
  exportStatusSite();
}
