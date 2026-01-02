import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSheetsValues } from "@/lib/sheets";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Read Strength and Weakness from Sheet (assuming Sheet1!C2:D)
        const rows = await getSheetsValues(session.accessToken, "Sheet1!C2:D");

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "No data found in sheet for characters" }, { status: 404 });
        }

        // 2. Random selection (Independent)
        const strengths = rows.map(row => row[0]).filter(val => val && val.trim() !== "");
        const weaknesses = rows.map(row => row[1]).filter(val => val && val.trim() !== "");

        if (strengths.length === 0 || weaknesses.length === 0) {
            return NextResponse.json({ error: "Insufficient data in sheet for characters" }, { status: 404 });
        }

        const strength = strengths[Math.floor(Math.random() * strengths.length)];
        const weakness = weaknesses[Math.floor(Math.random() * weaknesses.length)];

        // 3. Generate with Gemini
        const prompt = `Create a complex, interesting character profile based on the following attributes:\nStrength: ${strength}\nWeakness/Flaw: ${weakness}\n\nProvide the profile in Korean. Include Name, Age, Occupation, Personality Description, and Background Story.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({
            strength,
            weakness,
            profile: text
        });

    } catch (error) {
        console.error("Error generating character:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
