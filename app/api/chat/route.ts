import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai/client";
import { getSystemPrompt } from "@/lib/ai/system-prompts";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    console.log("[Chat API] Received request with", messages.length, "messages");

    // Get system prompt (you can pass a role query param to use different prompts)
    // Example: POST /api/chat?role=sales
    const url = new URL(req.url);
    const role = url.searchParams.get("role") || "default";
    const provider = process.env.AI_PROVIDER || "anthropic";
    const model = process.env.AI_MODEL || "claude-sonnet-4-6";

    console.log(
      `[Chat API] Using provider: ${provider}, model: ${model}, role: ${role}`
    );

    const systemPrompt = getSystemPrompt(role);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          console.log("[Chat API] Starting stream");
          let textChunks = 0;

          for await (const chunk of streamChatResponse({
            messages,
            systemPrompt,
            model,
            maxTokens: 1024,
          })) {
            if (chunk.type === "text" && typeof chunk.data === "string") {
              textChunks++;
              console.log(
                `[Chat API] Streaming text chunk ${textChunks}:`,
                chunk.data.substring(0, 50)
              );
              controller.enqueue(encoder.encode(chunk.data));
            }
          }

          console.log(`[Chat API] Stream complete. Total text chunks: ${textChunks}`);
          controller.close();
        } catch (error) {
          console.error("[Chat API] Stream error:", error);
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
