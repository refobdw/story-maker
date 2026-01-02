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
        // 1. Read Topic and Material from Sheet (assuming Sheet1!A:B)
        // First row might be header
        const rows = await getSheetsValues(session.accessToken, "Sheet1!A2:B");

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "No data found in sheet" }, { status: 404 });
        }

        // 2. Random selection
        const randomIndex = Math.floor(Math.random() * rows.length);
        const [topic, material] = rows[randomIndex] || ["Unknown", "Unknown"];

        // 3. Generate with Gemini
        const prompt = `Create a creative, engaging story plot based on the following:\nTopic: ${topic}\nMaterial/Subject: ${material}\n\nProvide the plot in Korean (assuming user language). Format it clearly with a Title and Synopsis.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({
            topic,
            material,
            plot: text
        });

    } catch (error) {
        console.error("Error generating plot:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
