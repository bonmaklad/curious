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

  console.log('Build complete -> dist/');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
