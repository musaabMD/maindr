import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const { messages, system } = await req.json();

    if (!messages?.length || !system) {
      return NextResponse.json(
        { error: "messages and system are required" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })
      ),
    });

    const text =
      response.content?.[0]?.type === "text"
        ? response.content[0].text
        : "No response.";

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Explain API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
