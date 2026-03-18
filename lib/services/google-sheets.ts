import { google } from "googleapis";

import { getServerEnv } from "@/lib/env";

type GoogleSheetsLeadRow = {
  createdAt: string;
  email: string;
  firstName?: string | null;
  marketingConsent: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ssid?: string | null;
  site?: string | null;
  clientMac?: string | null;
  apMac?: string | null;
  clientIp?: string | null;
  redirect?: string | null;
  authorizationStatus: string;
};

function getGoogleSheetsConfig() {
  const env = getServerEnv();

  if (!env.GOOGLE_SHEETS_CLIENT_EMAIL || !env.GOOGLE_SHEETS_PRIVATE_KEY || !env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    return null;
  }

  return {
    clientEmail: env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
    spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
    sheetName: env.GOOGLE_SHEETS_SHEET_NAME,
  };
}

export async function appendLeadToGoogleSheet(row: GoogleSheetsLeadRow) {
  const config = getGoogleSheetsConfig();

  if (!config) {
    return {
      ok: false,
      skipped: true,
      message: "Google Sheets integration is not configured.",
    };
  }

  const auth = new google.auth.JWT({
    email: config.clientEmail,
    key: config.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetName}!A:M`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          row.createdAt,
          row.email,
          row.firstName ?? "",
          row.marketingConsent ? "Yes" : "No",
          row.termsAccepted ? "Yes" : "No",
          row.privacyAccepted ? "Yes" : "No",
          row.ssid ?? "",
          row.site ?? "",
          row.clientMac ?? "",
          row.apMac ?? "",
          row.clientIp ?? "",
          row.redirect ?? "",
          row.authorizationStatus,
        ],
      ],
    },
  });

  return {
    ok: true,
    skipped: false,
  };
}
