import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendSheetValues } from "@/lib/sheets";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { strength, weakness, profile } = await req.json();

        if (!strength || !weakness || !profile) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Save to "Generated_Characters" sheet
        const timestamp = new Date().toISOString();
        const values = [[timestamp, strength, weakness, profile]];

        await appendSheetValues(session.accessToken, "Generated_Characters!A:D", values);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error saving character:", error);
        return NextResponse.json({ error: "Failed to save to sheet" }, { status: 500 });
    }
}
