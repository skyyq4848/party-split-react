# 🎉 派對分帳神器 v7.6.0

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8-319795?logo=chakra-ui)](https://chakra-ui.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646cff?logo=vite)](https://vitejs.dev/)

使用 React + TypeScript + Vite + Chakra UI 構建的現代化派對分帳應用程式

## ✨ 核心功能

### 🎯 完整功能列表

- **👥 人員管理** - 單筆/批次新增、刪除、列表顯示
- **🏷️ 群組管理** - 建立群組、編輯成員、快速套用分攤
- **📝 帳單解析模式** - 自動解析帳單文字為費用項目
- **✏️ 一般模式** - 手動編輯表格式輸入（支援自動去重）
- **🔍 智能人名偵測** - 批次確認並加入未知成員
- **💰 費用管理** - 派對費用、個人費用、代付項目
- **🧮 智能計算** - 自動計算分攤結果與配對還款
- **⚙️ 設定面板** - 主要付款人、合併代付選項
- **🌙 深色模式** - 支援明暗主題切換
- **💾 資料持久化** - LocalStorage 自動儲存

### 🎨 UI/UX 特色

- ✅ 響應式設計（桌面/平板/手機）
- ✅ 流暢的動畫效果
- ✅ Toast 通知系統
- ✅ 確認對話框
- ✅ 載入狀態提示
- ✅ 一鍵複製功能

---

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 **http://localhost:5173** 啟動

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

---

## 📁 專案結構

```
party-split-react/
├── src/
│   ├── components/          # React 元件
│   │   ├── PeopleManager.tsx       # 人員管理
│   │   ├── GroupManager.tsx        # 群組管理
│   │   ├── BillParser.tsx          # 帳單解析
│   │   ├── ManualEditor.tsx        # 一般模式（手動編輯）
│   │   ├── ExpenseTables.tsx       # 費用表格
│   │   ├── ResultDisplay.tsx       # 結算結果
│   │   └── SettingsPanel.tsx       # 設定面板
│   │
│   ├── core/                # 核心邏輯模組
│   │   ├── storage.js              # LocalStorage 管理
│   │   ├── utils.js                # 工具函數
│   │   ├── state.js                # 狀態管理
│   │   ├── parser.js               # 帳單解析
│   │   └── calculator.js           # 結算計算
│   │
│   ├── hooks/               # React Hooks
│   │   ├── useAppState.tsx         # 狀態管理 Hook
│   │   ├── useCalculator.ts        # 計算器 Hook
│   │   └── useBillParser.ts        # 解析器 Hook
│   │
│   ├── theme/               # Chakra UI 主題
│   │   └── index.ts
│   │
│   ├── App.tsx             # 主應用
│   └── main.tsx            # 入口
│
├── scripts/
│   └── version.js          # 版本管理腳本
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🎯 使用指南

### 典型使用流程

#### 1️⃣ 新增參加人員
- 單一新增或批次匯入
- 建立群組（可選）

#### 2️⃣ 選擇輸入模式
- **📝 解析模式** - 貼上帳單文字自動解析
- **✏️ 一般模式** - 手動表格式編輯

#### 3️⃣ 輸入費用
**解析模式支援格式：**
```
• 個人費用：小明 珍奶 50元
• 代付：小明 出 披薩 300元
• 派對費用：雞排 80元
• 分類標題：----- 雞蛋糕費用 -----
• 數學表達式：85 * 3
```

#### 4️⃣ 設定付款人（可選）
- 設定主要付錢人
- 啟用合併代付

#### 5️⃣ 計算結果
- 點擊「開始計算」
- 查看結算結果
- 一鍵複製分享

---

## 🔥 亮點功能

### 1. 🔍 智能人名偵測
解析帳單時自動偵測未知人名，彈窗確認是否加入參加人員：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
偵測到可能的新成員

☑ 布丁     (出現 3 次)
☑ 小華     (出現 5 次)

[全選] [取消全選]
[確認加入並繼續解析]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. ✏️ 一般模式（手動編輯）
表格式輸入，支援：
- 分類、品項、金額、分攤對象、類型（派對/個人/代付）
- 新增列、刪除列、清空
- 自動去除重複的分攤對象
- 從現有資料載入編輯

### 3. 🏷️ 群組快速套用
- 建立常用群組（例如：朋友群、同事群）
- 一鍵套用到費用分攤
- 編輯群組即時生效

### 4. 🧮 完整結算引擎
- 精確計算每人餘額
- 智能債務配對
- 統計摘要一目了然

---

## 🛠️ 技術棧

### 核心技術
- **React 18** - 現代化 UI 框架
- **TypeScript** - 型別安全
- **Vite** - 極速建置工具（HMR）
- **Chakra UI** - 專業元件庫

### 狀態管理
- React Context API
- Custom Hooks (useAppState)
- Observer Pattern

### 資料持久化
- LocalStorage
- 自動儲存/載入

---

## 📦 版本管理

專案內建自動化版本管理系統，使用語義化版本（Semantic Versioning）：

### 快速使用

```bash
# 修訂號 +1 (Bug 修復)
npm run version:patch    # 7.6.0 → 7.6.1

# 次版本 +1 (新功能)
npm run version:minor    # 7.6.0 → 7.7.0

# 主版本 +1 (重大更新)
npm run version:major    # 7.6.0 → 8.0.0
```

### 自動更新檔案
- ✅ package.json
- ✅ src/App.tsx（版本徽章）
- ✅ index.html（網頁標題）
- ✅ README.md

詳見 [VERSION_GUIDE.md](./VERSION_GUIDE.md)

---

## 🎨 Chakra UI 元件使用

### 常用元件

```tsx
import {
  Box,           // 通用容器
  VStack,        // 垂直堆疊
  HStack,        // 水平堆疊
  Button,        // 按鈕
  Input,         // 輸入框
  Heading,       // 標題
  Text,          // 文字
  Badge,         // 徽章
  Alert,         // 提示
  Table,         // 表格
  Tabs,          // 分頁
} from '@chakra-ui/react';
```

### 主題切換

```tsx
import { useColorMode } from '@chakra-ui/react';

const { colorMode, toggleColorMode } = useColorMode();
```

---

## 💡 開發指南

### 新增元件

1. 在 `src/components/` 建立新元件
2. 使用 Chakra UI 元件構建 UI
3. 使用 `useAppState` Hook 管理狀態
4. 在 `App.tsx` 中引入並使用

### 狀態管理

```tsx
import { useAppState } from './hooks/useAppState';

function MyComponent() {
  const { state, addPerson, deletePerson } = useAppState();
  
  // state.people 訪問人員列表
  // addPerson('小明') 新增人員
}
```

### 使用計算器

```tsx
import { useCalculator } from './hooks/useCalculator';

function ResultDisplay() {
  const { calculate, result, error } = useCalculator();
  
  const handleCalculate = () => {
    calculate();
  };
}
```

---

## 📊 專案統計

### 程式碼統計
- **總元件數：** 7 個
- **總 Hooks：** 3 個
- **核心模組：** 5 個
- **總程式碼：** 7,386 行

### 功能統計
- **輸入功能：** 8 個
- **顯示功能：** 9 個
- **管理功能：** 12 個
- **計算功能：** 完整結算引擎

---

## 🎊 版本歷史

### v7.6.0 (2026-06-26)
- ✨ 新增：一般模式（手動編輯表格）
- ✨ 新增：未知人名智能偵測與批次確認
- ✨ 新增：分攤對象自動去重
- 🐛 修復：群組管理互動優化

### v7.5.0 (2026-06-26)
- ✨ 新增：一般模式（手動編輯）元件
- ✨ 新增：解析模式與一般模式切換

### v7.4.0 (初始版本)
- 🎉 完整 React + Chakra UI 架構
- ✅ 6 個核心元件全部完成
- ✅ 所有功能實作完畢

---

## 🤝 貢獻

歡迎提出 Issue 和 Pull Request！

### 開發流程
1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📄 授權

MIT License

---

## 🙏 致謝

- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📞 聯絡方式

有任何問題或建議，歡迎透過 GitHub Issues 聯繫！

---

**享受您的派對分帳神器！** 🎉✨
