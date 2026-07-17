/**
 * Anthropic Claude AI Provider
 * Implements the AIProvider interface for Claude models
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  AIProvider,
  GenerateResponseParams,
  GenerateResponseResult,
  ToolCall,
} from "./types";
import { getTools } from "@/lib/tools/registry";

const anthropic = (apiKey: string) =>
  new Anthropic({
    apiKey,
  });

const anthropicProvider: AIProvider = {
  async generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult> {
    const client = anthropic(params.apiKey);

    // Build request with optional tools
    const tools = params.tools || getTools();
    const createParams: Parameters<typeof client.messages.create>[0] = {
      model: params.model,
      max_tokens: params.maxTokens || 1024,
      system: [
        {
          type: "text",
          text: params.systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: params.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    // Add tools if available
    if (tools && tools.length > 0) {
      createParams.tools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema as Anthropic.Tool.InputSchema,
      }));
    }

    console.log("[Anthropic] Making request to:", params.model);

    try {
      const response = (await client.messages.create(createParams)) as Anthropic.Message;

      let text = "";
      const toolCalls: ToolCall[] = [];

      for (const block of response.content) {
        if (block.type === "text") {
          text += block.text;
        } else if (block.type === "tool_use") {
          toolCalls.push({
            name: block.name,
            input: block.input as Record<string, unknown>,
          });
        }
      }

      console.log(
        `[Anthropic] Response: ${text.length} chars, ${toolCalls.length} tool calls`
      );

      return {
        text,
        toolCalls,
        stopReason: response.stop_reason ?? undefined,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheCreationInputTokens:
            response.usage.cache_creation_input_tokens ?? undefined,
          cacheReadInputTokens: response.usage.cache_read_input_tokens ?? undefined,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[Anthropic] Error:", errorMessage);
      throw error;
    }
  },

  async *streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
    const client = anthropic(params.apiKey);

    // Build request with optional tools
    const tools = params.tools || getTools();
    const streamParams: Parameters<typeof client.messages.stream>[0] = {
      model: params.model,
      max_tokens: params.maxTokens || 1024,
      system: [
        {
          type: "text",
          text: params.systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: params.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    // Add tools if available
    if (tools && tools.length > 0) {
      streamParams.tools = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema as Anthropic.Tool.InputSchema,
      }));
    }

    console.log("[Anthropic] Starting stream to:", params.model);

    try {
      const stream = client.messages.stream(streamParams);
      const toolCalls: Map<number, { name: string; input: Record<string, unknown> }> = new Map();
      let toolInputBuffer: Record<number, string> = {};
      let textChunks = 0;

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          textChunks++;
          console.log(
            `[Anthropic] Text delta (${textChunks}):`,
            event.delta.text.substring(0, 50)
          );
          yield {
            type: "text",
            data: event.delta.text,
          };
        } else if (event.type === "content_block_start") {
          // Track tool uses by index
          if (event.content_block.type === "tool_use") {
            const index = event.index;
            console.log(`[Anthropic] Tool use started: ${event.content_block.name}`);
            toolCalls.set(index, {
              name: event.content_block.name,
              input: {},
            });
            toolInputBuffer[index] = "";
          }
        } else if (
          event.type === "content_block_delta" &&
          event.delta.type === "input_json_delta"
        ) {
          // Accumulate tool input JSON
          const index = event.index;
          toolInputBuffer[index] = (toolInputBuffer[index] || "") + event.delta.partial_json;
        } else if (event.type === "content_block_stop") {
          // Tool input is complete, parse and yield
          const toolCall = toolCalls.get(event.index);
          if (toolCall && toolInputBuffer[event.index]) {
            try {
              toolCall.input = JSON.parse(toolInputBuffer[event.index]);
              console.log(`[Anthropic] Yielding tool call: ${toolCall.name}`);
              yield {
                type: "tool_call",
                data: toolCall,
              };
            } catch (e) {
              console.error(
                "[Anthropic] Failed to parse tool input:",
                toolInputBuffer[event.index]
              );
            }
          }
        }
      }

      console.log("[Anthropic] Stream complete");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[Anthropic] Stream error:", errorMessage);
      throw error;
    }
  },
};

export default anthropicProvider;
