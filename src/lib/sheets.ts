import { google } from "googleapis";

export async function getSheetsValues(accessToken: string, range: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
        });
        return response.data.values;
    } catch (error) {
        console.error("Error reading sheets:", error);
        throw error;
    }
}

export async function appendSheetValues(accessToken: string, range: string, values: string[][]) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values,
            },
        });
    } catch (error) {
        console.error("Error appending to sheet:", error);
        throw error;
    }
}
