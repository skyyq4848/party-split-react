#!/usr/bin/env node

/**
 * 版本管理腳本
 * 用法：
 *   npm run version:patch  -> 7.4.0 -> 7.4.1
 *   npm run version:minor  -> 7.4.0 -> 7.5.0
 *   npm run version:major  -> 7.4.0 -> 8.0.0
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// 版本類型
const versionType = process.argv[2] || 'patch';
const validTypes = ['patch', 'minor', 'major'];

if (!validTypes.includes(versionType)) {
  console.error(`❌ 無效的版本類型: ${versionType}`);
  console.log(`✅ 有效類型: ${validTypes.join(', ')}`);
  process.exit(1);
}

// 讀取 package.json
const packagePath = join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const oldVersion = packageJson.version;

// 計算新版本
function incrementVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error('Invalid version type');
  }
}

const newVersion = incrementVersion(oldVersion, versionType);

console.log('');
console.log('🔄 版本更新中...');
console.log(`   ${oldVersion} → ${newVersion}`);
console.log('');

// 需要更新的檔案列表
const filesToUpdate = [
  {
    path: 'package.json',
    update: (content) => {
      const json = JSON.parse(content);
      json.version = newVersion;
      return JSON.stringify(json, null, 2) + '\n';
    },
  },
  {
    path: 'src/App.tsx',
    update: (content) => {
      return content.replace(
        /v\d+\.\d+\.\d+ React/,
        `v${newVersion} React`
      );
    },
  },
  {
    path: 'index.html',
    update: (content) => {
      return content.replace(
        /派對分帳神器 v\d+\.\d+\.\d+/,
        `派對分帳神器 v${newVersion}`
      );
    },
  },
  {
    path: 'README.md',
    update: (content) => {
      return content.replace(
        /"version": "\d+\.\d+\.\d+"/,
        `"version": "${newVersion}"`
      ).replace(
        /v\d+\.\d+\.\d+/g,
        `v${newVersion}`
      );
    },
  },
];

// 更新所有檔案
let updateCount = 0;

filesToUpdate.forEach(({ path, update }) => {
  const fullPath = join(projectRoot, path);

  try {
    const content = readFileSync(fullPath, 'utf8');
    const newContent = update(content);

    if (content !== newContent) {
      writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ ${path}`);
      updateCount++;
    } else {
      console.log(`⏭️  ${path} (無變更)`);
    }
  } catch (error) {
    console.log(`⚠️  ${path} (檔案不存在)`);
  }
});

console.log('');
console.log(`🎉 版本更新完成！`);
console.log(`   ${updateCount} 個檔案已更新`);
console.log(`   新版本: v${newVersion}`);
console.log('');
console.log('📝 建議接下來執行:');
console.log(`   git add .`);
console.log(`   git commit -m "chore: bump version to v${newVersion}"`);
console.log('');
