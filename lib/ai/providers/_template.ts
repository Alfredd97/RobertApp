/**
 * TEMPLATE: AI Provider Implementation
 *
 * To add a new AI provider:
 * 1. Copy this file and rename it (e.g., openai.ts, gemini.ts)
 * 2. Fill in the TODO sections below
 * 3. Add your provider to the registry in index.ts:
 *    - Import: import yourProvider from "./yourprovider";
 *    - Register: yourProvider: yourProvider,
 * 4. Set the AI_PROVIDER environment variable to your provider key
 *
 * Example:
 *   AI_PROVIDER=openai
 */

import {
  AIProvider,
  GenerateResponseParams,
  GenerateResponseResult,
  ToolCall,
} from "./types";

/**
 * TODO: Import your AI provider's SDK
 * Example:
 *   import OpenAI from "openai";
 */

const yourProvider: AIProvider = {
  async generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult> {
    /**
     * TODO: Initialize your provider's client
     * Example:
     *   const client = new OpenAI({ apiKey: params.apiKey });
     */

    /**
     * TODO: Map NormalizedMessage[] to your provider's message format
     * params.messages is an array of { role: "user" | "assistant", content: string }
     *
     * Map it to your provider's format. For example, OpenAI uses:
     *   { role: "user" | "assistant", content: string }
     */

    /**
     * TODO: Map NormalizedTool[] to your provider's tool format
     * params.tools is an array of { name, description, input_schema }
     *
     * Map it to your provider's format. For example:
     *   {
     *     type: "function",
     *     function: {
     *       name: tool.name,
     *       description: tool.description,
     *       parameters: tool.input_schema,
     *     }
     *   }
     */

    /**
     * TODO: Call your provider's API
     * Example:
     *   const response = await client.chat.completions.create({
     *     model: params.model,
     *     max_tokens: params.maxTokens,
     *     system: params.systemPrompt,
     *     messages: mappedMessages,
     *     tools: mappedTools,
     *   });
     */

    /**
     * TODO: Extract text and tool calls from the response
     * Your provider will return tool calls in a different format.
     * Map them to ToolCall[] = { name, input }[]
     *
     * Example from OpenAI:
     *   const text = response.choices[0].message.content || "";
     *   const toolCalls = (response.choices[0].message.tool_calls || []).map(tc => ({
     *     name: tc.function.name,
     *     input: JSON.parse(tc.function.arguments),
     *   }));
     */

    // Placeholder return - replace with actual implementation
    return {
      text: "TODO: Implement generateResponse",
      toolCalls: [],
      stopReason: "stop",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  },

  async *streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
    /**
     * TODO: Implement streaming response
     * Similar to generateResponse, but:
     * 1. Use your provider's streaming API
     * 2. Yield events as they arrive
     *
     * Example:
     *   for await (const chunk of stream) {
     *     if (chunk is text) {
     *       yield { type: "text", data: chunk.content };
     *     } else if (chunk is tool call) {
     *       yield { type: "tool_call", data: { name, input } };
     *     }
     *   }
     */

    yield {
      type: "text",
      data: "TODO: Implement streamResponse",
    };
  },
};

export default yourProvider;
