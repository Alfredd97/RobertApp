import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai/client";
import { getSystemPrompt } from "@/lib/ai/system-prompts";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Get system prompt (you can pass a role query param to use different prompts)
    // Example: POST /api/chat?role=sales
    const url = new URL(req.url);
    const role = url.searchParams.get("role") || "default";
    const systemPrompt = getSystemPrompt(role);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatResponse({
            messages,
            systemPrompt,
            model: process.env.AI_MODEL || "claude-sonnet-4-6",
            maxTokens: 1024,
          })) {
            if (chunk.type === "text" && typeof chunk.data === "string") {
              controller.enqueue(encoder.encode(chunk.data));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
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
