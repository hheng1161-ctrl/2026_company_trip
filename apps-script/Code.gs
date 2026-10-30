const SPREADSHEET_NAME = "2026_company_trip";
const SPREADSHEET_ID_PROPERTY = "REGISTRATION_SPREADSHEET_ID";
const HEADERS = ["姓名", "Email", "單位", "電話", "職稱", "報名時間"];

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet || spreadsheet.getName() !== SPREADSHEET_NAME) {
    throw new Error(`Open the "${SPREADSHEET_NAME}" spreadsheet and run setup() from its bound Apps Script.`);
  }

  const properties = PropertiesService.getScriptProperties();
  let sheet = spreadsheet.getSheetByName("報名名單");
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
    if (sheet.getLastRow() > 0) {
      throw new Error('The first sheet is not empty. Create an empty sheet named "報名名單" and run setup() again.');
    }
    sheet.setName("報名名單");
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (HEADERS.some((header, index) => currentHeaders[index] !== header)) {
      throw new Error('The first row of "報名名單" must be empty or contain the expected column headers.');
    }
  }

  sheet.getRange("D:D").setNumberFormat("@");
  sheet.setFrozenRows(1);
  properties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  return `試算表已設定：${spreadsheet.getUrl()}`;
}

function doPost(event) {
  const data = event && event.parameter ? event.parameter : {};
  if (data.website) {
    return jsonResponse({ ok: false, error: "Invalid submission" });
  }

  const name = cleanValue(data.name);
  const email = cleanValue(data.email);
  const department = cleanValue(data.department);
  const phone = cleanValue(data.phone);
  const title = cleanValue(data.title);

  if (!name || !email || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: "Name, valid email, and phone are required." });
  }

  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty(SPREADSHEET_ID_PROPERTY);
  if (!spreadsheetId) {
    throw new Error("Run setup() before accepting registrations.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("報名名單");
    if (!sheet) {
      throw new Error("The registration sheet was not found.");
    }
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 4).setNumberFormat("@");
    sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
      name,
      email,
      department,
      phone,
      title,
      new Date()
    ]]);
  } finally {
    lock.releaseLock();
  }

  return jsonResponse({ ok: true });
}

function cleanValue(value) {
  return String(value || "").trim();
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
