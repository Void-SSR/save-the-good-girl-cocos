import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, "..");
export const docsDir = path.join(projectRoot, "docs");
export const sourcePath = path.join(docsDir, "project-status.json");
export const mdPath = path.join(docsDir, "DEVLOG.md");
export const htmlPath = path.join(docsDir, "PROJECT-DASHBOARD.html");

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function readStatus(inputPath = sourcePath) {
  return JSON.parse(fs.readFileSync(inputPath, "utf8"));
}

export function writeStatus(data, outputPath = sourcePath) {
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function runGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

export function getGitContext() {
  const shortCommit = runGit(["rev-parse", "--short", "HEAD"]);
  const exactTag = runGit(["describe", "--tags", "--exact-match"]);

  return {
    shortCommit: shortCommit || null,
    exactTag: exactTag || null
  };
}

export function withRuntimeMetadata(data, options = {}) {
  const enriched = cloneJson(data);
  const useGitContext = options.useGitContext !== false;
  const gitContext = useGitContext ? getGitContext() : { shortCommit: null, exactTag: null };

  if ((!enriched.current.gitCommit || enriched.current.gitCommit === "待提交") && gitContext.shortCommit) {
    enriched.current.gitCommit = gitContext.shortCommit;
  }

  if ((!enriched.current.gitTag || enriched.current.gitTag === "待定") && gitContext.exactTag) {
    enriched.current.gitTag = gitContext.exactTag;
  }

  enriched.history = enriched.history.map((item) => {
    const nextItem = { ...item };

    if (nextItem.commit === "待提交" && gitContext.shortCommit && nextItem.tag === enriched.current.gitTag) {
      nextItem.commit = gitContext.shortCommit;
    }

    return nextItem;
  });

  return enriched;
}

export function renderMarkdown(data) {
  const moduleLines = data.modules
    .map((item) => `| ${item.name} | ${item.status} | ${item.note} |`)
    .join("\n");

  const historyBlocks = data.history
    .map((item) => {
      const summary = item.summary.map((line) => `- ${line}`).join("\n");
      return `## ${item.tag} · ${item.title}

- 日期：${item.date}
- 提交：${item.commit}
- 可回滚：${item.rollbackReady ? "是" : "否"}

${summary}`;
    })
    .join("\n\n");

  const nextSteps = data.nextSteps.map((line, index) => `${index + 1}. ${line}`).join("\n");
  const usageNotes = data.usageNotes.map((line) => `- ${line}`).join("\n");

  return `# 开发日志

> 本文件由 \`docs/project-status.json\` 自动生成，请不要把它当作唯一真相源直接手改。

## 项目概览

- 项目：${data.project.name}
- 引擎：${data.project.engine}
- 目标平台：${data.project.platform}
- 当前阶段：${data.current.title}
- 当前状态：${data.current.status}
- 当前 Git 标签：${data.current.gitTag}
- 当前提交：${data.current.gitCommit}
- 最近更新：${data.current.updatedAt}
- 下一个标签：${data.tagRule.nextTag}

## 当前摘要

${data.current.summary}

## Git 标签规则

- 前缀：${data.tagRule.prefix}
- 格式：${data.tagRule.format}
- 当前序号：${data.tagRule.currentSequence}
- 当前标签：${data.tagRule.currentTag}
- 说明：${data.tagRule.notes}

## 模块状态

| 模块 | 状态 | 说明 |
| --- | --- | --- |
${moduleLines}

## 版本记录

${historyBlocks}

## 下一步

${nextSteps}

## 使用说明

${usageNotes}
`;
}

export function renderHtml(data) {
  const moduleCards = data.modules
    .map(
      (item) => `
        <article class="module-card">
          <div class="module-head">
            <h3>${escapeHtml(item.name)}</h3>
            <span class="status-chip">${escapeHtml(item.status)}</span>
          </div>
          <p>${escapeHtml(item.note)}</p>
        </article>
      `
    )
    .join("");

  const historyItems = data.history
    .map(
      (item) => `
        <article class="history-card">
          <div class="history-head">
            <strong>${escapeHtml(item.tag)}</strong>
            <span>${escapeHtml(item.date)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="meta">提交：${escapeHtml(item.commit)} | 可回滚：${item.rollbackReady ? "是" : "否"}</p>
          <ul>
            ${item.summary.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  const nextSteps = data.nextSteps.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const usageNotes = data.usageNotes.map((line) => `<li>${escapeHtml(line)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.project.name)} · 项目看板</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f6fb;
      --panel: #ffffff;
      --text: #1e2430;
      --muted: #5d6778;
      --line: #dbe2ef;
      --accent: #4a72ff;
      --accent-soft: rgba(74, 114, 255, 0.12);
      --shadow: 0 18px 40px rgba(31, 45, 78, 0.08);
      --radius: 20px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
      background: linear-gradient(180deg, #eef3ff 0%, var(--bg) 100%);
      color: var(--text);
    }

    .wrap {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 56px;
    }

    .hero {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 28px;
      box-shadow: var(--shadow);
      padding: 28px;
      margin-bottom: 22px;
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: 32px;
      line-height: 1.15;
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .meta-grid,
    .two-grid,
    .module-grid,
    .history-grid {
      display: grid;
      gap: 16px;
    }

    .meta-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-top: 20px;
    }

    .two-grid {
      grid-template-columns: 1.15fr 0.85fr;
      margin-bottom: 22px;
    }

    .support-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 18px;
    }

    .module-grid,
    .history-grid {
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      margin-bottom: 22px;
    }

    .panel,
    .module-card,
    .history-card,
    .meta-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    .panel {
      padding: 22px;
    }

    .support-panel {
      padding: 20px;
      background: linear-gradient(180deg, rgba(255, 244, 219, 0.92) 0%, rgba(255, 238, 208, 0.92) 100%);
      border: 1px dashed #e4bc6f;
      box-shadow: 0 12px 26px rgba(157, 110, 14, 0.08);
    }

    .support-panel h2 {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .support-panel h2::before {
      content: "";
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: #d3912a;
      box-shadow: 0 0 0 6px rgba(211, 145, 42, 0.16);
    }

    .panel h2,
    .history-card h3,
    .module-card h3 {
      margin: 0 0 10px;
    }

    .panel p,
    .module-card p,
    .history-card p,
    .panel li,
    .history-card li {
      color: var(--muted);
      line-height: 1.65;
    }

    .meta-card {
      padding: 18px 16px;
    }

    .meta-card .label {
      display: block;
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .meta-card strong {
      font-size: 22px;
      line-height: 1.2;
    }

    .module-card,
    .history-card {
      padding: 20px;
    }

    .module-head,
    .history-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 74px;
      padding: 6px 12px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 13px;
      font-weight: 700;
    }

    .history-card ul,
    .panel ul,
    .panel ol {
      padding-left: 18px;
      margin: 10px 0 0;
    }

    .meta {
      margin-top: 0;
      font-size: 14px;
    }

    .footer-note {
      text-align: center;
      color: var(--muted);
      font-size: 13px;
      margin-top: 10px;
    }

    @media (max-width: 860px) {
      .two-grid,
      .support-grid {
        grid-template-columns: 1fr;
      }

      .hero {
        padding: 22px;
      }

      .hero h1 {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <h1>${escapeHtml(data.project.name)} · 项目看板</h1>
      <p>${escapeHtml(data.current.summary)}</p>
      <div class="meta-grid">
        <article class="meta-card">
          <span class="label">当前阶段</span>
          <strong>${escapeHtml(data.current.title)}</strong>
        </article>
        <article class="meta-card">
          <span class="label">当前 Git 标签</span>
          <strong>${escapeHtml(data.current.gitTag)}</strong>
        </article>
        <article class="meta-card">
          <span class="label">当前提交</span>
          <strong>${escapeHtml(data.current.gitCommit)}</strong>
        </article>
        <article class="meta-card">
          <span class="label">最近更新</span>
          <strong>${escapeHtml(data.current.updatedAt)}</strong>
        </article>
      </div>
    </section>

    <section class="panel">
      <h2>模块进度</h2>
      <div class="module-grid">${moduleCards}</div>
    </section>

    <section class="panel">
      <h2>版本记录</h2>
      <div class="history-grid">${historyItems}</div>
    </section>

    <section class="two-grid">
      <article class="panel">
        <h2>下一步</h2>
        <ol>${nextSteps}</ol>
      </article>
      <article class="panel">
        <h2>回滚提醒</h2>
        <p>回滚时不要直接点按钮操作。请把标签名告诉 Codex，例如：<strong>回滚到 ${escapeHtml(data.current.gitTag)}</strong>。</p>
        <p class="meta">真正回滚仍以 Git 提交和标签为准。</p>
      </article>
    </section>

    <section class="support-grid">
      <article class="panel support-panel">
        <h2>Git 标签规则</h2>
        <ul>
          <li>前缀：${escapeHtml(data.tagRule.prefix)}</li>
          <li>格式：${escapeHtml(data.tagRule.format)}</li>
          <li>当前标签：${escapeHtml(data.tagRule.currentTag)}</li>
          <li>下一个标签：${escapeHtml(data.tagRule.nextTag)}</li>
          <li>${escapeHtml(data.tagRule.notes)}</li>
        </ul>
      </article>
      <article class="panel support-panel">
        <h2>使用方式</h2>
        <ul>${usageNotes}</ul>
      </article>
    </section>

    <p class="footer-note">本页面由 docs/project-status.json 自动生成。</p>
  </main>
</body>
</html>
`;
}

export function writeOutputs(data, outputs = {}) {
  const nextMdPath = outputs.mdPath || mdPath;
  const nextHtmlPath = outputs.htmlPath || htmlPath;
  fs.writeFileSync(nextMdPath, renderMarkdown(data), "utf8");
  fs.writeFileSync(nextHtmlPath, renderHtml(data), "utf8");
  return {
    mdPath: nextMdPath,
    htmlPath: nextHtmlPath
  };
}

export function renderStatusArtifacts(options = {}) {
  const baseData = options.data || readStatus(options.sourcePath || sourcePath);
  const enrichedData = withRuntimeMetadata(baseData, options);
  const outputs = writeOutputs(enrichedData, options);

  return {
    data: enrichedData,
    ...outputs
  };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  renderStatusArtifacts();
  console.log("Rendered DEVLOG.md and PROJECT-DASHBOARD.html");
}
