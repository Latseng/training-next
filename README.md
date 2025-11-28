# 💪 Training Tracker — Frontend (Next.js)
以肌力與體能教練視角打造的訓練追蹤 Web。

使用者可以建立訓練紀錄、查看訓練趨勢、向 AI 訓練教練提問，從資料到建議，一站式掌握自己的訓練進程。

本專案負責 UI/UX、資料呈現、前端流程、AI 對話介面、以及與 FastAPI 後端的整合。

## ✨Features

🔐 使用者系統

登入 / 註冊 UI

Token-based (HttpOnly Cookie) 整合

後端為 [FastAPI](https://github.com/Latseng/training-tracker-fastapi) ，資料庫採用 Supabase

客製化驗證表單（zod + react-hook-form）

🏋️ 訓練紀錄

建立訓練計畫（主題、目標）

在計畫底下新增多個訓練動作 / 項目

記錄每個動作 / 項目的訓練量（例如：重量、組數、反覆次數）

即時 UI 驗證（zod schema）

📊 訓練趨勢分析（Visualization）

透過選擇時間區間查詢訓練紀錄

與 FastAPI 串接取得統計結果（例如最大肌力）

使用 shadcn + Recharts 製作折線圖

🤖 AI 教練

前端 Chat UI（AI 對話、提問介面）

呼叫 FastAPI 的 /ai-coach API

選取區間訓練紀錄並讓 AI 教練提供建議


🎨 UI / UX

Tailwind CSS + shadcn 設計系統

一致化的頁面布局、表單、按鈕、選單

RWD 手機版 / 電腦版皆適用
（畢竟訓練的人很常會一邊喘一邊點手機）

## 🖼️ Screenshots

### 登入頁面
![登入頁](/public/screenshots/login-page.png)

### 主頁-新增訓練
![主頁-新增訓練](/public/screenshots/add-new-training.png)

### 分析功能-AI教練
![分析頁面-AI教練](/public/screenshots/ask-ai.png)

## 🛠️ Installation & Usage

1. Clone
```
git clone https://github.com/Latseng/training-next.git

cd training-next
```

2. Install dependencies

```
npm install
```

3. Setup environment variables


建立 .env.local：

```
NEXT_PUBLIC_API_URL="你的後端伺服器URL"
```


4. Run

```
npm run dev
```