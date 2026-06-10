import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful and warm customer service assistant for Robert Avery, a professional contemporary visual artist based in New York City.

Robert specializes in dark surrealism and fine art photography. His work explores themes of identity, solitude, and the beauty found in shadow.

Services and Pricing:
- Portrait Session: $500 (2-hour session, includes 10 edited digital images)
- Fine Art Print: $250 (custom framed prints available in multiple sizes)
- Custom Commission: Starting from $1,500 (timeline varies by project complexity)

When visitors ask about booking, direct them to use the Booking section on the website or the Calendly link at https://calendly.com/your-artist.

Be warm, creative, and encouraging. Keep responses concise (2-4 sentences). If asked about something outside of art/services, gently redirect the conversation back to Robert's work.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text" as const,
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" as const },
        },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
