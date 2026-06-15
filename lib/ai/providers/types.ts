/**
 * Shared types for AI provider implementations
 */

export interface NormalizedMessage {
  role: "user" | "assistant";
  content: string;
}

export interface NormalizedTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface GenerateResponseParams {
  messages: NormalizedMessage[];
  systemPrompt: string;
  tools?: NormalizedTool[];
  apiKey: string;
  model: string;
  maxTokens?: number;
}

export interface GenerateResponseResult {
  text: string;
  toolCalls: ToolCall[];
  stopReason?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * AIProvider interface that all providers must implement
 */
export interface AIProvider {
  /**
   * Generate a response from the AI provider
   */
  generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult>;

  /**
   * Stream a response from the AI provider (returns an async iterable)
   */
  streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }>;
}
