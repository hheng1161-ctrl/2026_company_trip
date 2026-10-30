# 2026 宇宙科技公司員工旅遊

活動報名網站包含活動橫幅、行程與報名表單。網站根目錄的 `cover.jpg` 是由 `spec/cover.jpg` 複製而來，讓排除 `spec` 資料夾的部署仍能顯示封面。

## 本機預覽

在專案資料夾執行：

```powershell
python -m http.server 8000
```

接著用瀏覽器開啟 <http://localhost:8000/>。

## Google Sheet 與報名資料

1. 開啟 `2026_company_trip` 試算表，選擇「擴充功能」>「Apps Script」，讓 Apps Script 與這份試算表綁定。
2. 將 `apps-script/Code.gs` 貼入編輯器並儲存。
3. 選取並執行 `setup`，依 Google 畫面登入及授權。此步驟會在目前這份試算表設定「報名名單」工作表、標題列，並把「電話」欄設為純文字；不會另建一份試算表。
4. 部署為網頁應用程式，執行身分選「我」，存取權限依公司政策設定。複製部署後的網頁應用程式 URL。
5. 將 URL 設定到 `index.html` 內的 `SCRIPT_URL` 常數，重新發布網站。
6. 以實際報名資料測試，並在「報名名單」工作表確認新增資料及電話前導零。

表單使用跨網域的單向送出方式；頁面只能確認送出請求，無法直接讀取 Google Sheet 是否成功寫入。請以試算表內容確認實際結果。

> **關於頁面文案**：因為上述限制，前端送出成功後顯示的是「已送出報名！主辦人會再確認並與你聯繫。」
> ——給報名者確定感，而不是技術細節。**真正需要「以試算表確認」的提醒留在本文件**（給主辦人看）。
> 若日後要讓前端也能確認寫入結果，可在 `Code.gs` 加一個 `doGet` 回報目前報名人數，
> 前端於送出後比對數字（此做法已在 HazardCheck 專案中驗證可行）。

## 社群分享預覽

已加入 Open Graph 標籤（`og:title` / `og:description` / `og:image` / `og:url`）
與 `twitter:card`，並使用 `cover.jpg` 作為預覽圖，讓網址貼到 LINE 或 Facebook 時會顯示縮圖與標題。

修改 `cover.jpg` 時請同步更新 `og:image:width` / `og:image:height`（目前 1536×1024）。
分享預覽有快取，更新後若仍看到舊圖，可用
[Facebook 分享偵錯工具](https://developers.facebook.com/tools/debug/) 重新抓取。

## GitHub Pages

網站網址：<https://hheng1161-ctrl.github.io/2026_company_trip/>
