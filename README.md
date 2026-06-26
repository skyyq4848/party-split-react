# 派對分帳神器 v7.4 - React + Chakra UI

使用 React + TypeScript + Vite + Chakra UI 重構的現代化派對分帳應用程式

## ✨ 技術棧

- **React 18** - UI 框架
- **TypeScript** - 型別安全
- **Vite** - 快速建置工具
- **Chakra UI** - 元件庫
- **Framer Motion** - 動畫效果

## 🚀 快速開始

### 安裝依賴

\`\`\`bash
npm install
\`\`\`

### 啟動開發伺服器

\`\`\`bash
npm run dev
\`\`\`

應用程式將在 http://localhost:5173 啟動

### 建置生產版本

\`\`\`bash
npm run build
\`\`\`

### 預覽生產版本

\`\`\`bash
npm run preview
\`\`\`

## 📁 專案結構

\`\`\`
party-split-react/
├── src/
│   ├── components/          # React 元件
│   │   ├── PeopleManager.tsx
│   │   ├── GroupManager.tsx    # 待實作
│   │   ├── BillParser.tsx      # 待實作
│   │   └── ...
│   │
│   ├── core/                # 核心邏輯（重用既有模組）
│   │   ├── storage.js
│   │   ├── utils.js
│   │   ├── state.js
│   │   ├── parser.js
│   │   └── calculator.js
│   │
│   ├── hooks/               # React Hooks
│   │   ├── useAppState.tsx
│   │   ├── useCalculator.ts
│   │   └── useBillParser.ts
│   │
│   ├── theme/               # Chakra UI 主題
│   │   └── index.ts
│   │
│   ├── App.tsx             # 主應用
│   └── main.tsx            # 入口
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
\`\`\`

## 🎯 已實作功能

✅ **基礎架構**
- React + TypeScript 專案設定
- Chakra UI 整合
- 主題系統（明暗模式）
- 狀態管理 (useAppState Hook)

✅ **核心模組整合**
- 重用既有的 JavaScript 模組
- storage.js - LocalStorage 管理
- utils.js - 工具函數
- state.js - 狀態管理
- parser.js - 帳單解析
- calculator.js - 結算計算

✅ **人員管理元件**
- 單一新增人員
- 批次匯入人員
- 人員列表顯示
- 刪除人員功能

## 🔧 待完成功能

⏳ **群組管理元件**
- 建立群組
- 編輯群組
- 刪除群組

⏳ **帳單解析元件**
- 文字帳單輸入
- 自動解析功能
- 範例載入

⏳ **費用管理元件**
- 派對費用表格
- 個人費用表格
- 代付項目表格

⏳ **結算計算元件**
- 計算結果顯示
- 結果複製功能
- 詳細明細表格

## 🎨 Chakra UI 元件使用

### 常用元件

\`\`\`tsx
import {
  Box,           // 通用容器
  VStack,        // 垂直堆疊
  HStack,        // 水平堆疊
  Button,        // 按鈕
  Input,         // 輸入框
  Heading,       // 標題
  Text,          // 文字
  Badge,         // 徽章
  Tag,           // 標籤
  Alert,         // 提示
  Divider,       // 分隔線
} from '@chakra-ui/react';
\`\`\`

### 主題切換

\`\`\`tsx
import { useColorMode } from '@chakra-ui/react';

const { colorMode, toggleColorMode } = useColorMode();
\`\`\`

## 💡 開發建議

### 新增元件

1. 在 `src/components/` 建立新元件
2. 使用 Chakra UI 元件構建 UI
3. 使用 `useAppState` Hook 管理狀態
4. 在 `App.tsx` 中引入並使用

### 狀態管理

\`\`\`tsx
import { useAppState } from './hooks/useAppState';

function MyComponent() {
  const { state, addPerson, deletePerson } = useAppState();
  
  // state.people 訪問人員列表
  // addPerson('小明') 新增人員
}
\`\`\`

### 使用計算器

\`\`\`tsx
import { useCalculator } from './hooks/useCalculator';

function ResultDisplay() {
  const { calculate, result, error } = useCalculator();
  
  const handleCalculate = () => {
    calculate();
  };
}
\`\`\`

## 🐛 已知問題

- 群組管理元件尚未實作
- 帳單解析 UI 尚未完成
- 費用表格元件待開發
- 結算結果顯示待完善

## 📝 開發計劃

### Phase 1 - 基礎架構 ✅
- [x] 專案初始化
- [x] Chakra UI 整合
- [x] 核心模組整合
- [x] 人員管理元件

### Phase 2 - 核心功能 ⏳
- [ ] 群組管理元件
- [ ] 帳單解析元件
- [ ] 費用表格元件

### Phase 3 - 計算與顯示 ⏳
- [ ] 結算計算整合
- [ ] 結果顯示元件
- [ ] 資料匯出功能

### Phase 4 - 優化與測試 ⏳
- [ ] 單元測試
- [ ] E2E 測試
- [ ] 效能優化
- [ ] 部署設定

## 🤝 貢獻

歡迎提出 Issue 和 Pull Request！

## 📄 授權

MIT License
