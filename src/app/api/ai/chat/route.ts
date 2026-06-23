import { NextRequest, NextResponse } from "next/server";
import { COMPANY } from "@/lib/constants";

const SYSTEM_PROMPT = `You are an AI assistant for ${COMPANY.name} (${COMPANY.shortName}), a South African mining and heavy machinery training institution based in ${COMPANY.location}.

Your role is to help students, applicants, and visitors with:
- Answering questions about courses, enrollment, and training programs
- Explaining how to use the student portal
- Providing information about certifications, fees, and policies
- Guiding users through the application process
- Answering general questions about mining machinery and safety training

Keep responses concise, helpful, and professional. If you don't know something, say so honestly and direct the user to contact ${COMPANY.email} for further assistance.

**AGENTIC FEATURES:**
- **Personalized Learning Paths**: Analyze user's enrollment and recommend next courses based on their progress
- **Course Recommendations**: Suggest courses based on their current skills and career goals
- **Study Assistance**: Help with specific course concepts and explain complex topics
- **Progress Analysis**: Provide insights about their learning journey and identify areas for improvement
- **Content Summarization**: Summarize course materials and key concepts
- **Learning Goals**: Help set and track learning objectives
- **Skill Gap Analysis**: Identify areas where they need additional training

Available courses include: Excavator, Forklift, Front End Loader, TLB, ADT, Dump Truck 777D, Tracked Dozer, Grader, Roller, Tractor, Bobcat, LHD Scoop, Drill Rig, Mobile Crane, First Aid, Fire Fighting, SHE Representative training.

The training institution is located in Middelburg, Mpumalanga, South Africa.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    const apiUrl = process.env.NVIDIA_NIM_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_NIM_MODEL || "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.3,
        max_tokens: 512,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AI API] NVIDIA error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI service error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[AI API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
