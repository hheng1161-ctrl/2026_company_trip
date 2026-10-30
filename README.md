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

## GitHub Pages

網站網址：<https://hheng1161-ctrl.github.io/2026_company_trip/>
