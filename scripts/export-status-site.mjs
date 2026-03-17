import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { docsDir, htmlPath, mdPath, renderStatusArtifacts, sourcePath } from "./render-project-status.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const exportRoot = path.join(projectRoot, ".generated", "status-site");

function ensureCleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

export function exportStatusSite(options = {}) {
  renderStatusArtifacts(options);

  ensureCleanDir(exportRoot);
  fs.copyFileSync(htmlPath, path.join(exportRoot, "index.html"));
  fs.copyFileSync(mdPath, path.join(exportRoot, "DEVLOG.md"));
  fs.copyFileSync(sourcePath, path.join(exportRoot, "project-status.json"));

  return {
    exportRoot,
    files: {
      indexHtml: path.join(exportRoot, "index.html"),
      devlog: path.join(exportRoot, "DEVLOG.md"),
      statusJson: path.join(exportRoot, "project-status.json")
    }
  };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  exportStatusSite();
  console.log(`Exported status site to ${path.relative(projectRoot, exportRoot)}`);
}
