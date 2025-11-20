#!/usr/bin/env node
/*
  Simple build script for Curious Garden
  - Creates a dist/ folder
  - Copies static assets (index.html, Fonts, Images, styles, scripts)
  - No bundling or minification to respect project guidelines
*/

const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

const sources = [
  { type: 'file', src: 'index.html' },
  { type: 'dir', src: 'Fonts' },
  { type: 'dir', src: 'Images' },
  { type: 'dir', src: 'styles' },
  { type: 'dir', src: 'scripts' },
];

async function rimraf(target) {
  if (fs.existsSync(target)) {
    await fsp.rm(target, { recursive: true, force: true });
  }
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fsp.copyFile(src, dest);
}

async function copyDir(srcDir, destDir) {
  await ensureDir(destDir);
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    // Skip dotfiles and node_modules just in case
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  console.log('Building Curious Garden...');
  await rimraf(dist);
  await ensureDir(dist);

  for (const item of sources) {
    const srcPath = path.join(root, item.src);
    const destPath = path.join(dist, item.src);

    if (!fs.existsSync(srcPath)) {
      console.warn(`Skip missing: ${item.src}`);
      continue;
    }

    if (item.type === 'file') {
      await copyFile(srcPath, destPath);
      console.log(`Copied file: ${item.src}`);
    } else if (item.type === 'dir') {
      await copyDir(srcPath, destPath);
      console.log(`Copied dir: ${item.src}`);
    }
  }

  // Optionally generate prismic.config.js from environment variables for CI/CD (e.g., Amplify)
  try {
    const envRepo = process.env.PRISMIC_REPOSITORY_NAME || process.env.PRISMIC_REPOSITORY || process.env.PRISMIC_REPO || "";
    const envEndpoint = process.env.PRISMIC_ENDPOINT || ""; // e.g., curious-garden.cdn.prismic.io
    const envToken = process.env.PRISMIC_ACCESS_TOKEN || process.env.PRISMIC_TOKEN || "";
    const envDocType = process.env.PRISMIC_DOCUMENT_TYPE || "homepage";
    const envDocUID = process.env.PRISMIC_DOCUMENT_UID || "homepage";

    function deriveRepoName() {
      if (envRepo) return envRepo.replace(/^https?:\/\//, '')
        .replace(/\.cdn\.prismic\.io.*/, '')
        .replace(/\.prismic\.io.*/, '')
        .trim();
      if (!envEndpoint) return "";
      let host = envEndpoint.trim();
      try { host = new URL(host.startsWith('http') ? host : `https://${host}`).host; } catch (_) {}
      // host like curious-garden.cdn.prismic.io -> repo = part before first dot
      return (host.split('.')[0] || '').trim();
    }

    function esc(str) {
      return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    const repoName = deriveRepoName();
    if (repoName) {
      const cfg = `window.prismicConfig = {\n  repositoryName: "${esc(repoName)}",\n  documentType: "${esc(envDocType)}",\n  documentUID: "${esc(envDocUID)}",\n  accessToken: "${esc(envToken)}"\n};\n`;
      const outPath = path.join(dist, 'scripts', 'prismic.config.js');
      await ensureDir(path.dirname(outPath));
      await fsp.writeFile(outPath, cfg, 'utf8');
      console.log('Generated scripts/prismic.config.js from environment variables');
    } else {
      console.log('No PRISMIC_* env found; using checked-in scripts/prismic.config.js');
    }
  } catch (e) {
    console.warn('Could not generate prismic.config.js from env:', e.message);
  }

  console.log('Build complete -> dist/');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
