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

const anthropic = (apiKey: string) =>
  new Anthropic({
    apiKey,
  });

const anthropicProvider: AIProvider = {
  async generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult> {
    const client = anthropic(params.apiKey);

    // Note: Tools integration can be added in the future by properly mapping
    // NormalizedTool to Anthropic's Tool format with correct input_schema types
    const response = (await client.messages.create({
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
    })) as Anthropic.Message;

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
  },

  async *streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
    const client = anthropic(params.apiKey);

    // Note: Tools integration can be added in the future by properly mapping
    // NormalizedTool to Anthropic's Tool format with correct input_schema types
    const stream = client.messages.stream({
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
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield {
          type: "text",
          data: event.delta.text,
        };
      } else if (event.type === "content_block_stop" && event.index !== null) {
        // Tool calls are available after stream completion
        // For now, we emit text only during streaming
      }
    }
  },
};

export default anthropicProvider;
