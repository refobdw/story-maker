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
        const { topic, material, plot } = await req.json();

        if (!topic || !material || !plot) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // Save to "Generated_Plots" sheet (Columns: Timestamp, Topic, Material, Plot)
        const timestamp = new Date().toISOString();

        // We append to a sheet named "Generated_Plots". 
        // If it doesn't exist, this might fail unless we ensure it exists.
        // For simplicity, we'll try appending to "Sheet1!E:H" (assuming it won't conflict with input data at A:B)
        // OR just "GeneratedPoints!A:D" and hope the user creates it or it works.
        // Let's us "Generated_Plots!A:D".

        const values = [[timestamp, topic, material, plot]];

        await appendSheetValues(session.accessToken, "Generated_Plots!A:D", values);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error saving plot:", error);
        return NextResponse.json({ error: "Failed to save to sheet" }, { status: 500 });
    }
}
