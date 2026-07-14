/**
 * High-level AI Client
 * Abstracts away provider-specific logic
 * All provider logic is isolated in lib/ai/providers/
 */

import { getProvider, NormalizedMessage, ToolCall } from "./providers";
import { getTools } from "@/lib/tools/registry";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatParams {
  messages: ChatMessage[];
  systemPrompt: string;
  model?: string;
  maxTokens?: number;
}

export interface ChatResult {
  text: string;
  toolCalls: ToolCall[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * Get the API key for the configured provider
 */
function getApiKeyForProvider(provider: string): string {
  let apiKey: string | undefined;

  switch (provider.toLowerCase()) {
    case "anthropic":
      apiKey = process.env.ANTHROPIC_API_KEY;
      break;
    case "openai":
      apiKey = process.env.OPENAI_API_KEY;
      break;
    case "gemini":
      apiKey = process.env.GEMINI_API_KEY;
      break;
    default:
      apiKey = undefined;
  }

  if (!apiKey) {
    throw new Error(
      `API key not configured for provider '${provider}'. ` +
        `Please set ${provider.toUpperCase()}_API_KEY in your .env.local file.`
    );
  }

  return apiKey;
}

/**
 * Generate a chat response using the configured AI provider
 */
export async function generateChatResponse(
  params: ChatParams
): Promise<ChatResult> {
  const aiProvider = process.env.AI_PROVIDER || "anthropic";
  const apiKey = getApiKeyForProvider(aiProvider);
  const provider = getProvider(aiProvider);

  const result = await provider.generateResponse({
    messages: params.messages,
    systemPrompt: params.systemPrompt,
    tools: getTools(),
    apiKey,
    model: params.model || "claude-sonnet-4-6",
    maxTokens: params.maxTokens,
  });

  return {
    text: result.text,
    toolCalls: result.toolCalls,
    usage: result.usage,
  };
}

/**
 * Stream a chat response using the configured AI provider
 */
export async function* streamChatResponse(
  params: ChatParams
): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
  const aiProvider = process.env.AI_PROVIDER || "anthropic";
  const apiKey = getApiKeyForProvider(aiProvider);
  const provider = getProvider(aiProvider);

  yield* provider.streamResponse({
    messages: params.messages,
    systemPrompt: params.systemPrompt,
    tools: getTools(),
    apiKey,
    model: params.model || "claude-sonnet-4-6",
    maxTokens: params.maxTokens,
  });
}
