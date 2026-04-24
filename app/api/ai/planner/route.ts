import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit } from "@/utils/rateLimit";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    // Basic IP tracking from headers (works locally and partially on standard setups)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // Rate limit: Max 5 requests per minute
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    if (!apiKey || apiKey === "YOUR_KEY_HERE") {
      return NextResponse.json({ error: "Gemini API Key missing or invalid in .env.local" }, { status: 400 });
    }

    const body = await req.json();
    const { mode, people, budget } = body;

    // Strict Input Validation
    if (!mode || !["Trip", "Party", "Flatmate"].includes(mode)) {
      return NextResponse.json({ error: "Invalid gathering mode." }, { status: 400 });
    }
    if (typeof people !== "number" || people < 1 || people > 100) {
      return NextResponse.json({ error: "People count must be a reasonable number (1-100)." }, { status: 400 });
    }
    if (typeof budget !== "number" || budget < 100 || budget > 10000000) {
      return NextResponse.json({ error: "Budget must be between ₹100 and ₹10,000,000." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are KharchaX, an intelligent financial AI for GenZ group expenses.
      The user is planning a ${mode} gathering for ${people} people with a total budget of ₹${budget}.
      
      Generate a realistic budget allocation split into exactly 3 practical categories (summing to 100% of the budget),
      along with 3 highly specific, actionable, and smart tips tailored to saving money for this specific scenario.
      
      Return the output strictly as a JSON object with this exact schema:
      {
        "breakdown": [
          { "category": "Category Name", "percentage": <number>, "amount": <calculated_value in rupees> }
        ],
        "tips": [
          "Tip 1", "Tip 2", "Tip 3"
        ]
      }
      
      Do NOT wrap the JSON in Markdown backticks (like \`\`\`json). Just return the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Safely parse JSON in case the AI hallucinates markdown wrappers
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (e) {
      console.error("AI JSON Parse Error:", responseText);
      return NextResponse.json({ error: "AI returned malformed data. Try again." }, { status: 500 });
    }

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("AI PLANNER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
