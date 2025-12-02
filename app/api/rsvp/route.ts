import { NextResponse } from "next/server";
import { google } from "googleapis";

async function getAuth() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Google Sheets environment variables are missing");
  }

  const jwt = new google.auth.JWT({
    email: clientEmail,
    // Replace literal '\n' with real newlines (needed on Vercel)
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await jwt.authorize();
  return jwt;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      hasCompanion,
      companionPartner,
      companionChildren,
      childrenCount,
    } = body;

    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set");
    }

    const now = new Date().toISOString();

    const values = [
      [
        now,
        name ?? "",
        hasCompanion ? "yes" : "no",
        companionPartner ? "yes" : "no",
        companionChildren ? "yes" : "no",
        companionChildren ? Number(childrenCount || 0) : 0,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1", // it will append after the last row
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error writing to Google Sheets", err);
    return NextResponse.json(
      { success: false, error: "Erro salvando no Google Sheets" },
      { status: 500 }
    );
  }
}
