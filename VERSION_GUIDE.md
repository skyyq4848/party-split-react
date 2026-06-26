# 📦 版本管理指南

## 🎯 版本號規則

使用 **語義化版本 (Semantic Versioning)**

```
格式: 主版本.次版本.修訂號
      MAJOR . MINOR . PATCH
      
目前: 7.4.0
```

### **版本號意義**

| 類型 | 說明 | 範例 | 何時使用 |
|------|------|------|----------|
| **PATCH** | 修訂號 | 7.4.0 → 7.4.1 | Bug 修復、小改進 |
| **MINOR** | 次版本 | 7.4.0 → 7.5.0 | 新功能、向下相容 |
| **MAJOR** | 主版本 | 7.4.0 → 8.0.0 | 重大更新、不相容變更 |

---

## 🚀 快速使用

### **方式 1: npm 腳本（推薦）**

```bash
# 修訂號 +1 (Bug 修復)
npm run version:patch

# 次版本 +1 (新功能)
npm run version:minor

# 主版本 +1 (重大更新)
npm run version:major
```

### **方式 2: 直接執行腳本**

```bash
node scripts/version.js patch
node scripts/version.js minor
node scripts/version.js major
```

---

## 📝 自動更新的檔案

執行版本腳本時，會自動更新以下檔案：

- ✅ `package.json` - 版本號
- ✅ `src/App.tsx` - 頁面顯示的版本徽章
- ✅ `index.html` - 網頁標題
- ✅ `README.md` - 文件中的版本資訊

---

## 🔄 完整工作流程

### **1. 開發完成後**

```bash
# 確認所有改動
git status

# 執行測試（如果有）
npm run build
```

### **2. 更新版本號**

根據改動類型選擇：

```bash
# Bug 修復
npm run version:patch

# 新功能
npm run version:minor

# 重大更新
npm run version:major
```

### **3. 提交變更**

```bash
# 查看變更
git diff

# 加入變更
git add .

# 提交（腳本會建議 commit message）
git commit -m "chore: bump version to v7.4.1"

# 推送
git push
```

### **4. 建立標籤（可選）**

```bash
# 建立版本標籤
git tag v7.4.1

# 推送標籤
git push --tags
```

---

## 📊 版本更新示例

### **範例 1: 修復 Bug**

```bash
# 目前: v7.4.0
# 修復：人員刪除確認對話框問題

npm run version:patch

# 輸出:
# 🔄 版本更新中...
#    7.4.0 → 7.4.1
# 
# ✅ package.json
# ✅ src/App.tsx
# ✅ index.html
# ✅ README.md
# 
# 🎉 版本更新完成！
#    4 個檔案已更新
#    新版本: v7.4.1

git add .
git commit -m "fix: 修復人員刪除確認對話框問題"
git tag v7.4.1
git push --tags
```

### **範例 2: 新增功能**

```bash
# 目前: v7.4.1
# 新增：資料匯出功能

npm run version:minor

# 輸出:
#    7.4.1 → 7.5.0

git add .
git commit -m "feat: 新增資料匯出功能"
git tag v7.5.0
git push --tags
```

### **範例 3: 重大更新**

```bash
# 目前: v7.5.0
# 重大更新：全面改用 TypeScript，API 不向下相容

npm run version:major

# 輸出:
#    7.5.0 → 8.0.0

git add .
git commit -m "feat!: 全面改用 TypeScript

BREAKING CHANGE: API 介面全面更新"
git tag v8.0.0
git push --tags
```

---

## 🎯 版本號決策樹

```
更新類型？
├─ Bug 修復、文件更新、效能優化
│  └─ npm run version:patch
│
├─ 新增功能、新增元件、相容性更新
│  └─ npm run version:minor
│
└─ API 變更、重大重構、不相容變更
   └─ npm run version:major
```

---

## 📋 Commit Message 規範

配合版本管理，建議使用以下格式：

### **格式**
```
<type>: <description>

[optional body]

[optional footer]
```

### **Type 類型**

| Type | 說明 | 版本影響 |
|------|------|----------|
| `feat` | 新功能 | MINOR |
| `fix` | Bug 修復 | PATCH |
| `docs` | 文件更新 | PATCH |
| `style` | 格式調整 | PATCH |
| `refactor` | 重構 | MINOR/PATCH |
| `perf` | 效能優化 | PATCH |
| `test` | 測試 | 無 |
| `chore` | 建置/工具 | 無 |
| `feat!` | 重大新功能 | MAJOR |
| `fix!` | 重大 Bug 修復 | MAJOR |

### **範例**

```bash
# PATCH 版本
git commit -m "fix: 修復計算結果複製功能"
git commit -m "docs: 更新 README 安裝說明"
git commit -m "perf: 優化表格渲染效能"

# MINOR 版本
git commit -m "feat: 新增資料匯出為 CSV 功能"
git commit -m "feat: 新增深色模式主題切換"

# MAJOR 版本
git commit -m "feat!: 重構狀態管理，使用 Redux

BREAKING CHANGE: AppState API 完全改變"
```

---

## 🔧 腳本詳解

### **版本腳本功能**

`scripts/version.js` 會自動：

1. ✅ 讀取當前版本號
2. ✅ 根據類型計算新版本號
3. ✅ 更新所有相關檔案
4. ✅ 顯示更新摘要
5. ✅ 提供後續操作建議

### **更新邏輯**

```javascript
// PATCH: 7.4.0 → 7.4.1
major.minor.patch+1

// MINOR: 7.4.0 → 7.5.0
major.minor+1.0

// MAJOR: 7.4.0 → 8.0.0
major+1.0.0
```

---

## 📈 版本歷史追蹤

### **查看所有版本**

```bash
# Git 標籤
git tag -l

# 輸出:
# v7.4.0
# v7.4.1
# v7.5.0
```

### **查看特定版本**

```bash
# 查看版本差異
git diff v7.4.0 v7.4.1

# 查看版本詳情
git show v7.4.1

# 切換到特定版本
git checkout v7.4.0
```

---

## 🎨 版本顯示位置

更新版本號後，會在以下位置顯示：

### **1. 應用程式標題**
```html
<!-- index.html -->
<title>派對分帳神器 v7.4.1</title>
```

### **2. 頁面徽章**
```tsx
// src/App.tsx
<Badge colorScheme="purple">v7.4.1 React</Badge>
```

### **3. Package 資訊**
```json
// package.json
{
  "version": "7.4.1"
}
```

### **4. 文件**
```markdown
# README.md
派對分帳神器 v7.4.1
```

---

## 💡 最佳實踐

### ✅ 建議做法

1. **每次發布前更新版本**
   ```bash
   npm run version:minor
   git commit -m "chore: bump version to v7.5.0"
   git tag v7.5.0
   git push --tags
   ```

2. **使用有意義的 commit message**
   ```bash
   feat: 新增群組管理功能
   fix: 修復計算錯誤
   docs: 更新 API 文件
   ```

3. **主版本更新前通知**
   - 主版本更新 (MAJOR) 前先發布 beta
   - 撰寫 CHANGELOG.md
   - 提供遷移指南

### ❌ 避免做法

1. ❌ 手動修改多個檔案的版本號
2. ❌ 跳過版本號 (7.4.0 → 7.6.0)
3. ❌ 主版本更新沒有說明 BREAKING CHANGE
4. ❌ 忘記推送 git tag

---

## 🚀 進階功能（可選）

### **自動化 Git 操作**

建立 `scripts/release.js` 自動執行：
- 版本更新
- Git commit
- Git tag
- Git push

### **生成 CHANGELOG**

使用工具自動產生變更日誌：
```bash
npm install -D conventional-changelog-cli
```

### **Pre-commit Hook**

使用 Husky 在 commit 前驗證：
```bash
npm install -D husky
npx husky add .husky/pre-commit "npm run build"
```

---

## 📞 需要幫助？

如果遇到問題：

1. 查看腳本輸出訊息
2. 檢查 `package.json` 版本號
3. 執行 `git status` 查看變更
4. 參考本指南的範例

---

## 🎉 快速參考

```bash
# 最常用的三個命令
npm run version:patch  # Bug 修復 (7.4.0 → 7.4.1)
npm run version:minor  # 新功能   (7.4.0 → 7.5.0)
npm run version:major  # 重大更新 (7.4.0 → 8.0.0)

# 完整流程
npm run version:minor
git add .
git commit -m "feat: 新增功能描述"
git tag v7.5.0
git push --tags
```

---

**版本管理讓專案更專業！** 🚀
