import { NextRequest, NextResponse } from "next/server";
import { streamChatResponse } from "@/lib/ai/client";
import { getSystemPrompt } from "@/lib/ai/system-prompts";
import { executeTool, formatToolResult } from "@/lib/tools/handler";
import type { ChatMessage } from "@/lib/ai/client";
import type { ToolCall } from "@/lib/ai/providers/types";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };
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
          let conversationMessages = [...messages];

          // Loop to handle tool calls: AI may call tools, we execute them,
          // send results back, and AI continues the conversation
          let isFirstResponse = true;
          let continueLoop = true;
          let loopCount = 0;
          const MAX_LOOPS = 5; // Prevent infinite loops

          while (continueLoop && loopCount < MAX_LOOPS) {
            loopCount++;
            console.log(`[Chat API] ==> Loop iteration ${loopCount}/${MAX_LOOPS}`);
            continueLoop = false; // Assume we won't loop again unless there are tool calls

            console.log(
              `[Chat API] Streaming response with ${conversationMessages.length} messages`
            );

            const collectedText: string[] = [];
            const toolCalls: Array<{ name: string; input: Record<string, unknown> }> = [];

            // Stream the response
            console.log(
              `[Chat API] --- Starting stream with ${conversationMessages.length} messages ---`
            );
            console.log(
              `[Chat API] Messages being sent to provider:`,
              JSON.stringify(conversationMessages, null, 2).substring(0, 500)
            );
            for await (const chunk of streamChatResponse({
              messages: conversationMessages,
              systemPrompt,
              model,
              maxTokens: 1024,
            })) {
              if (chunk.type === "text" && typeof chunk.data === "string") {
                textChunks++;
                console.log(
                  `[Chat API] Text chunk ${textChunks} (${chunk.data.length} chars):`,
                  chunk.data.substring(0, 50)
                );
                collectedText.push(chunk.data);
                controller.enqueue(encoder.encode(chunk.data));
              } else if (chunk.type === "tool_call") {
                const toolCall = chunk.data as ToolCall;
                console.log(
                  `[Chat API] !!! TOOL CALL DETECTED: ${toolCall.name}`,
                  `with input:`,
                  JSON.stringify(toolCall.input, null, 2)
                );
                toolCalls.push(toolCall);
              }
            }
            console.log(
              `[Chat API] --- Stream ended. Text chunks: ${textChunks}, Tool calls: ${toolCalls.length} ---`
            );

            // If there were tool calls, execute them and loop
            if (toolCalls.length > 0) {
              console.log(
                `[Chat API] ========== TOOL EXECUTION START ==========`
              );
              console.log(
                `[Chat API] Executing ${toolCalls.length} tool call(s)`,
                toolCalls.map(tc => tc.name)
              );

              // Add the AI's response (text + tool calls) to conversation
              const fullText = collectedText.join("");
              if (fullText) {
                conversationMessages.push({
                  role: "assistant",
                  content: fullText,
                });
              }

              // Execute each tool and collect results
              const toolResults: Array<{
                toolName: string;
                toolInput: Record<string, unknown>;
                result: unknown;
              }> = [];

              for (const toolCall of toolCalls) {
                try {
                  console.log(
                    `[Chat API] >>> Starting tool: ${toolCall.name}`
                  );
                  console.log(
                    `[Chat API] >>> Tool input:`,
                    JSON.stringify(toolCall.input, null, 2)
                  );

                  const toolResult = await executeTool(toolCall);
                  console.log(
                    `[Chat API] >>> Tool completed: ${toolCall.name}`,
                    `Success: ${toolResult.success}`
                  );

                  const formattedResult = formatToolResult(
                    toolCall.name,
                    toolResult
                  );

                  console.log(
                    `[Chat API] >>> Formatted result:`,
                    formattedResult.substring(0, 150)
                  );

                  toolResults.push({
                    toolName: toolCall.name,
                    toolInput: toolCall.input,
                    result: formattedResult,
                  });
                } catch (toolError) {
                  console.error(
                    `[Chat API] !!! TOOL ERROR (${toolCall.name}):`,
                    toolError
                  );
                  console.error(
                    `[Chat API] !!! Stack:`,
                    toolError instanceof Error ? toolError.stack : "No stack"
                  );
                  toolResults.push({
                    toolName: toolCall.name,
                    toolInput: toolCall.input,
                    result: `Error: ${
                      toolError instanceof Error
                        ? toolError.message
                        : "Unknown error"
                    }`,
                  });
                }
              }

              console.log(
                `[Chat API] ========== TOOL EXECUTION END ==========`
              );

              // Add tool results to conversation
              // Format as a user message with tool results
              // IMPORTANT: Don't use [toolName] format as it confuses the AI into calling the tool again
              const toolResultsText = toolResults
                .map(
                  (tr) =>
                    `${typeof tr.result === "string" ? tr.result : JSON.stringify(tr.result)}`
                )
                .join("\n\n");

              console.log(
                `[Chat API] Adding tool results to conversation:`,
                toolResultsText.substring(0, 200)
              );

              // Add as assistant message with tool result, not user message
              // This makes it clear to the AI that this is a completed tool execution
              conversationMessages.push({
                role: "assistant",
                content: toolResultsText,
              });

              console.log(
                `[Chat API] Conversation now has ${conversationMessages.length} messages`
              );
              console.log(
                `[Chat API] Last 2 messages:`,
                JSON.stringify(conversationMessages.slice(-2), null, 2).substring(0, 300)
              );

              // After tool execution, send tool result to user and stop looping
              // The tool result message is the response - don't call AI again
              controller.enqueue(encoder.encode(toolResultsText));

              console.log(`[Chat API] Tool results sent to user, stopping loop`);
              continueLoop = false;
            } else {
              // No tool calls, check if we got any text
              if (textChunks === 0 && collectedText.length === 0) {
                console.warn("[Chat API] WARNING: Empty response from AI, stopping loop");
                console.warn("[Chat API] Sending fallback message to user");
                controller.enqueue(
                  encoder.encode(
                    "I'm having trouble formulating a response. Please try again."
                  )
                );
              }
              // No tool calls, we're done
              console.log("[Chat API] No tool calls, conversation complete");
              continueLoop = false;
            }
          }

          if (loopCount >= MAX_LOOPS) {
            console.error("[Chat API] ERROR: Max loop iterations reached!");
            controller.enqueue(
              encoder.encode(
                "\n\n[System: Max tool iterations reached. Stopping here.]"
              )
            );
          }

          console.log(
            `[Chat API] Stream complete. Total text chunks: ${textChunks}`
          );
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
