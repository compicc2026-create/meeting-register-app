/**
 * Meeting Register — Google Apps Script backend
 * ------------------------------------------------
 * Turns a Google Sheet into a small CRUD JSON API that the web app talks to.
 * Deploy this as a Web App (see SETUP.md). Do not change function names.
 */

const SHEET_NAME = "Meetings";
const FOLDER_NAME = "Meeting Register Attachments";
const HEADERS = ["ID", "Topic", "Date", "Time", "Where", "Type", "FileName", "FileURL", "CreatedAt", "UpdatedAt"];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  // Force Date/Time to plain text on every call (not just on first creation) so
  // sheets created before this fix — or rows Sheets already auto-converted —
  // get corrected too. Google Sheets otherwise silently reinterprets typed
  // values like "3:30 PM" as a time serial, which reads back as a JS Date
  // stamped on Sheets' zero-date (1899-12-30) instead of your original text.
  sheet.getRange("C2:D").setNumberFormat("@");
  return sheet;
}

function getFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOLDER_NAME);
}

function doGet(e) {
  const action = (e.parameter.action || "list");
  if (action === "list") return jsonResponse(listMeetings());
  return jsonResponse({ error: "Unknown action: " + action });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: "Invalid request body" });
  }
  try {
    switch (body.action) {
      case "create":
        return jsonResponse(createMeeting(body));
      case "update":
        return jsonResponse(updateMeeting(body));
      case "delete":
        return jsonResponse(deleteMeeting(body));
      default:
        return jsonResponse({ error: "Unknown action: " + body.action });
    }
  } catch (err) {
    return jsonResponse({ error: err.message || String(err) });
  }
}

function listMeetings() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter(r => r[0]);
  return { meetings: rows.map(rowToObject) };
}

function rowToObject(r) {
  return {
    id: r[0],
    topic: r[1],
    date: cellToText(r[2], "date"),
    time: cellToText(r[3], "time"),
    where: r[4],
    type: r[5],
    fileName: r[6],
    fileUrl: r[7],
    createdAt: toIso(r[8]),
    updatedAt: toIso(r[9])
  };
}

function toIso(v) {
  return v instanceof Date ? v.toISOString() : v;
}

// Legacy safety net: rows written before the plain-text fix (or any edge case
// Sheets still auto-converts) come back as JS Date objects instead of the
// original text. Rather than exposing a raw, meaningless ISO timestamp,
// reconstruct a readable value from it.
function cellToText(v, kind) {
  if (!(v instanceof Date)) return v;
  const tz = Session.getScriptTimeZone();
  return kind === "time" ? Utilities.formatDate(v, tz, "h:mm a") : Utilities.formatDate(v, tz, "d MMM yyyy");
}

function createMeeting(body) {
  const sheet = getSheet();
  const id = Utilities.getUuid();
  const now = new Date().toISOString();
  let fileName = "", fileUrl = "";
  if (body.file && body.file.data) {
    const saved = saveFile(body.file, id);
    fileName = saved.name;
    fileUrl = saved.url;
  }
  const rowIndex = sheet.getLastRow() + 1;
  sheet.getRange(rowIndex, 3, 1, 2).setNumberFormat("@"); // Date, Time columns — belt and suspenders
  sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([[
    id, body.topic || "", body.date || "", body.time || "", body.where || "", body.type || "", fileName, fileUrl, now, now
  ]]);
  return { meeting: { id, topic: body.topic || "", date: body.date || "", time: body.time || "", where: body.where || "", type: body.type || "", fileName, fileUrl, createdAt: now, updatedAt: now } };
}

function updateMeeting(body) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) {
      const now = new Date().toISOString();
      let fileName = data[i][6], fileUrl = data[i][7];
      if (body.file && body.file.data) {
        const saved = saveFile(body.file, body.id);
        fileName = saved.name;
        fileUrl = saved.url;
      } else if (body.removeFile) {
        fileName = "";
        fileUrl = "";
      }
      const createdAt = toIso(data[i][8]);
      sheet.getRange(i + 1, 3, 1, 2).setNumberFormat("@"); // Date, Time columns — belt and suspenders
      sheet.getRange(i + 1, 2, 1, 9).setValues([[
        body.topic || "", body.date || "", body.time || "", body.where || "", body.type || "",
        fileName, fileUrl, createdAt, now
      ]]);
      return { meeting: { id: body.id, topic: body.topic || "", date: body.date || "", time: body.time || "", where: body.where || "", type: body.type || "", fileName, fileUrl, createdAt, updatedAt: now } };
    }
  }
  throw new Error("Meeting not found");
}

function deleteMeeting(body) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(body.id)) {
      sheet.deleteRow(i + 1);
      return { deleted: true };
    }
  }
  throw new Error("Meeting not found");
}

function saveFile(file, id) {
  const folder = getFolder();
  const bytes = Utilities.base64Decode(file.data);
  const blob = Utilities.newBlob(bytes, file.mimeType, file.name);
  const driveFile = folder.createFile(blob);
  driveFile.setName(id + " — " + file.name);
  driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { name: file.name, url: driveFile.getUrl() };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
