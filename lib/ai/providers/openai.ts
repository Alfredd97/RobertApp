/**
 * OpenAI ChatGPT AI Provider
 * Implements the AIProvider interface for OpenAI's GPT models
 */

import {
  AIProvider,
  GenerateResponseParams,
  GenerateResponseResult,
  ToolCall,
} from "./types";

interface OpenAIMessage {
  role: "user" | "assistant";
  content: string;
}

interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string | null;
    };
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: {
        name: string;
        arguments: string;
      };
    }>;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    type: string;
    message: string;
  };
}

const openaiProvider: AIProvider = {
  async generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult> {
    const model = params.model || "gpt-4-turbo";
    const endpoint = "https://api.openai.com/v1/chat/completions";

    // Map normalized messages to OpenAI format
    const messages: OpenAIMessage[] = params.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Map normalized tools to OpenAI format
    const tools: OpenAITool[] | undefined = params.tools
      ? params.tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        }))
      : undefined;

    // Build request body
    const requestBody: Record<string, unknown> = {
      model,
      messages,
      max_tokens: params.maxTokens || 1024,
      temperature: 1,
    };

    if (tools && tools.length > 0) {
      requestBody.tools = tools;
      requestBody.tool_choice = "auto";
    }

    console.log("[OpenAI] Making request to:", model);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as OpenAIResponse;
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = (await response.json()) as OpenAIResponse;

      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message}`);
      }

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from OpenAI API");
      }

      let text = "";
      const toolCalls: ToolCall[] = [];

      const choice = data.choices[0];

      // Extract text content
      if (choice.message.content) {
        text = choice.message.content;
      }

      // Extract tool calls
      if (choice.tool_calls && choice.tool_calls.length > 0) {
        for (const toolCall of choice.tool_calls) {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            toolCalls.push({
              name: toolCall.function.name,
              input: args,
            });
          } catch (e) {
            console.error(
              "[OpenAI] Failed to parse tool call arguments:",
              toolCall.function.arguments
            );
          }
        }
      }

      console.log(
        `[OpenAI] Response: ${text.length} chars, ${toolCalls.length} tool calls`
      );

      return {
        text,
        toolCalls,
        stopReason: choice.finish_reason,
        usage: {
          inputTokens: data.usage?.prompt_tokens || 0,
          outputTokens: data.usage?.completion_tokens || 0,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[OpenAI] Error:", errorMessage);
      throw error;
    }
  },

  async *streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
    const model = params.model || "gpt-4-turbo";
    const endpoint = "https://api.openai.com/v1/chat/completions";

    // Map normalized messages to OpenAI format
    const messages: OpenAIMessage[] = params.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Map normalized tools to OpenAI format
    const tools: OpenAITool[] | undefined = params.tools
      ? params.tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          },
        }))
      : undefined;

    // Build request body
    const requestBody: Record<string, unknown> = {
      model,
      messages,
      max_tokens: params.maxTokens || 1024,
      temperature: 1,
      stream: true,
    };

    if (tools && tools.length > 0) {
      requestBody.tools = tools;
      requestBody.tool_choice = "auto";
    }

    console.log("[OpenAI] Starting stream to:", model);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorText}`
        );
      }

      if (!response.body) {
        throw new Error("No response body from OpenAI API");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("[OpenAI] Stream complete");
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i];

          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              continue;
            }

            try {
              const json = JSON.parse(data) as {
                choices: Array<{
                  delta?: {
                    content?: string;
                    tool_calls?: Array<{
                      index: number;
                      id: string;
                      type: string;
                      function: {
                        name: string;
                        arguments: string;
                      };
                    }>;
                  };
                }>;
              };

              const choice = json.choices[0];
              if (!choice) continue;

              // Handle text content
              if (choice.delta?.content) {
                console.log(
                  "[OpenAI] Text delta:",
                  choice.delta.content.substring(0, 30)
                );
                yield {
                  type: "text",
                  data: choice.delta.content,
                };
              }

              // Handle tool calls
              if (choice.delta?.tool_calls) {
                for (const toolCall of choice.delta.tool_calls) {
                  // OpenAI streams tool calls in parts; reconstruct them
                  // Note: Full tool call parsing requires collecting all deltas
                  // For now, we yield partial data - the full implementation would buffer these
                  if (
                    toolCall.function.name &&
                    toolCall.function.arguments
                  ) {
                    try {
                      const args = JSON.parse(toolCall.function.arguments);
                      yield {
                        type: "tool_call",
                        data: {
                          name: toolCall.function.name,
                          input: args,
                        },
                      };
                    } catch (e) {
                      console.error(
                        "[OpenAI] Failed to parse tool arguments:",
                        toolCall.function.arguments
                      );
                    }
                  }
                }
              }
            } catch (e) {
              console.error("[OpenAI] Failed to parse stream chunk:", data);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("[OpenAI] Stream error:", errorMessage);
      throw error;
    }
  },
};

export default openaiProvider;
