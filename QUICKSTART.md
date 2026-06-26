# 🚀 快速開始指南

## ✅ 專案已建立完成！

你的 React + Chakra UI 專案已經準備好了！

## 📦 安裝與啟動

### 1. 等待依賴安裝完成

npm install 正在背景執行中，請稍候...

### 2. 啟動開發伺服器

安裝完成後，執行：

\`\`\`bash
cd party-split-react
npm run dev
\`\`\`

應用程式將在 **http://localhost:5173** 自動開啟

## 🎉 已完成的功能

### ✅ 基礎架構
- React 18 + TypeScript
- Vite 快速建置
- Chakra UI 整合
- 明暗模式切換

### ✅ 核心模組整合
所有核心邏輯已從舊版移植：
- ✅ `storage.js` - LocalStorage 管理
- ✅ `utils.js` - 工具函數
- ✅ `state.js` - 狀態管理
- ✅ `parser.js` - 帳單解析
- ✅ `calculator.js` - 結算計算

### ✅ React Hooks
- ✅ `useAppState` - 狀態管理 Hook
- ✅ `useCalculator` - 計算器 Hook
- ✅ `useBillParser` - 解析器 Hook

### ✅ UI 元件
- ✅ `PeopleManager` - 完整的人員管理元件
  - 單一新增
  - 批次匯入
  - 刪除人員
  - 即時更新

## 🎨 Chakra UI 特色

### 明暗模式
點擊右上角 🌙/☀️ 圖示即可切換

### 響應式設計
自動適配桌面和行動裝置

### 專業配色
- 主色調：藍色 (#3182CE)
- 成功：綠色 (#38A169)
- 警告：紅色 (#E53E3E)

## 📂 專案結構

\`\`\`
party-split-react/
├── src/
│   ├── components/
│   │   └── PeopleManager.tsx      ✅ 已完成
│   ├── core/                      ✅ 核心模組
│   │   ├── storage.js
│   │   ├── utils.js
│   │   ├── state.js
│   │   ├── parser.js
│   │   └── calculator.js
│   ├── hooks/                     ✅ React Hooks
│   │   ├── useAppState.tsx
│   │   ├── useCalculator.ts
│   │   └── useBillParser.ts
│   ├── theme/                     ✅ Chakra 主題
│   │   └── index.ts
│   ├── App.tsx                    ✅ 主應用
│   └── main.tsx                   ✅ 入口
└── package.json                   ✅ 配置
\`\`\`

## 🔧 下一步開發

### 待實作元件

#### 1. 群組管理元件 (GroupManager.tsx)
\`\`\`tsx
// 建立新檔案: src/components/GroupManager.tsx
// 參考 PeopleManager.tsx 的結構
// 使用 useAppState 的群組相關方法
\`\`\`

#### 2. 帳單解析元件 (BillParser.tsx)
\`\`\`tsx
// 建立新檔案: src/components/BillParser.tsx
// 使用 useBillParser Hook
// 加入 Textarea 和解析按鈕
\`\`\`

#### 3. 費用表格元件 (ExpenseTables.tsx)
\`\`\`tsx
// 使用 Chakra UI 的 Table 元件
// 顯示派對費用、個人費用、代付項目
\`\`\`

#### 4. 結算結果元件 (ResultDisplay.tsx)
\`\`\`tsx
// 使用 useCalculator Hook
// 顯示計算結果
// 加入複製功能
\`\`\`

## 💡 開發提示

### 使用狀態管理
\`\`\`tsx
import { useAppState } from '../hooks/useAppState';

function MyComponent() {
  const { state, addPerson } = useAppState();
  
  return (
    <div>
      <p>人數: {state.people.length}</p>
      <button onClick={() => addPerson('小明')}>
        新增小明
      </button>
    </div>
  );
}
\`\`\`

### Chakra UI 元件範例
\`\`\`tsx
import { Box, Button, Input, VStack } from '@chakra-ui/react';

<Box bg="white" p={6} borderRadius="lg" shadow="md">
  <VStack spacing={4}>
    <Input placeholder="輸入..." />
    <Button colorScheme="blue">送出</Button>
  </VStack>
</Box>
\`\`\`

### 主題顏色
\`\`\`tsx
// 使用預設配色
<Button colorScheme="blue">藍色</Button>
<Button colorScheme="green">綠色</Button>
<Button colorScheme="red">紅色</Button>
<Button colorScheme="purple">紫色</Button>
\`\`\`

## 🎯 測試功能

啟動後，您可以：
1. ✅ 新增人員（單一/批次）
2. ✅ 查看人員列表
3. ✅ 刪除人員
4. ✅ 切換明暗模式
5. ✅ 響應式佈局測試

## 📝 常用命令

\`\`\`bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 型別檢查
npx tsc --noEmit
\`\`\`

## 🐛 遇到問題？

### 常見問題

**Q: 啟動後顯示空白頁面**
A: 檢查瀏覽器 Console 是否有錯誤訊息

**Q: 模組找不到錯誤**
A: 確認 npm install 已完成

**Q: 核心模組導入錯誤**
A: 檢查 src/core/ 目錄是否有所有 .js 檔案

## 🎉 享受開發！

您的現代化 React 專案已就緒！

- 🎨 **美觀** - Chakra UI 專業設計
- ⚡ **快速** - Vite HMR 秒級更新
- 🔧 **靈活** - 完整的狀態管理
- 📱 **響應式** - 自動適配各種裝置

開始打造您的派對分帳應用吧！🚀
