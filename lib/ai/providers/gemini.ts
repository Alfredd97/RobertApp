/**
 * Google Gemini AI Provider
 * Implements the AIProvider interface for Google's Generative AI models
 * Get a free API key at: https://aistudio.google.com/app/apikey
 */

import {
  AIProvider,
  GenerateResponseParams,
  GenerateResponseResult,
  ToolCall,
} from "./types";

interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

interface GeminiRequest {
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  contents: GeminiMessage[];
  tools?: Array<{
    functionDeclarations: GeminiFunctionDeclaration[];
  }>;
  generationConfig?: {
    maxOutputTokens?: number;
  };
}

interface GeminiPart {
  text?: string;
  functionCall?: {
    name: string;
    args: Record<string, unknown>;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts: GeminiPart[];
    };
    finishReason?: string;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

const geminiProvider: AIProvider = {
  async generateResponse(
    params: GenerateResponseParams
  ): Promise<GenerateResponseResult> {
    const model = params.model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey}`;

    // Map normalized messages to Gemini format
    const contents: GeminiMessage[] = params.messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Build the request
    const request: GeminiRequest = {
      systemInstruction: {
        parts: [{ text: params.systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: params.maxTokens || 1024,
      },
    };

    // Add tools if provided
    if (params.tools && params.tools.length > 0) {
      request.tools = [
        {
          functionDeclarations: params.tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          })),
        },
      ];
    }

    // Make the API request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = (await response.json()) as GeminiResponse;

    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("[Gemini] No candidates returned:", JSON.stringify(data, null, 2));
      throw new Error("No response from Gemini API");
    }

    let text = "";
    const toolCalls: ToolCall[] = [];

    // Parse response
    const candidate = data.candidates[0];
    console.log("[Gemini] Candidate finish reason:", candidate.finishReason);

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          text += part.text;
        } else if (part.functionCall) {
          toolCalls.push({
            name: part.functionCall.name,
            input: part.functionCall.args,
          });
        }
      }
    } else {
      console.error("[Gemini] No content parts in candidate");
      console.error("[Gemini] Finish reason:", candidate.finishReason);

      // Handle empty responses
      if (candidate.finishReason === "SAFETY") {
        text = "I appreciate your interest, but I'm unable to respond to that right now.";
      } else {
        text = "I'm having trouble formulating a response. Please try again.";
      }
    }

    return {
      text,
      toolCalls,
      stopReason: "stop",
      usage: {
        inputTokens: 0, // Gemini API doesn't return token counts in REST API
        outputTokens: 0,
      },
    };
  },

  async *streamResponse(
    params: GenerateResponseParams
  ): AsyncIterable<{ type: "text" | "tool_call"; data: string | ToolCall }> {
    const model = params.model || "gemini-1.5-flash";
    // Use the regular generateContent endpoint (streaming endpoint may have compatibility issues)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${params.apiKey}`;

    // Map normalized messages to Gemini format
    const contents: GeminiMessage[] = params.messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Build the request
    const request: GeminiRequest = {
      systemInstruction: {
        parts: [{ text: params.systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: params.maxTokens || 1024,
      },
    };

    // Add tools if provided
    if (params.tools && params.tools.length > 0) {
      request.tools = [
        {
          functionDeclarations: params.tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema,
          })),
        },
      ];
    }

    console.log("[Gemini] Starting request to:", model);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log("[Gemini] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = `Gemini API error: ${response.status} - ${(errorData as Record<string, unknown>).error || "Unknown error"}`;
      console.error("[Gemini]", errorMsg);
      throw new Error(errorMsg);
    }

    // Parse the full response and yield text in chunks for streaming effect
    const data = (await response.json()) as GeminiResponse;
    console.log("[Gemini] Received response:", JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      console.log("[Gemini] Candidate:", JSON.stringify(candidate, null, 2));

      if (candidate.content && candidate.content.parts) {
        console.log("[Gemini] Found", candidate.content.parts.length, "parts");
        for (const part of candidate.content.parts) {
          if (part.text) {
            console.log("[Gemini] Yielding text:", part.text.substring(0, 50));
            yield {
              type: "text",
              data: part.text,
            };
          } else if (part.functionCall) {
            console.log("[Gemini] Yielding function call:", part.functionCall.name);
            yield {
              type: "tool_call",
              data: {
                name: part.functionCall.name,
                input: part.functionCall.args,
              },
            };
          }
        }
      } else {
        console.error("[Gemini] No content in candidate. Stop reason:", candidate.finishReason);
        console.error("[Gemini] Full candidate:", JSON.stringify(candidate, null, 2));

        // Check if this is a safety/content filter block
        if (candidate.finishReason === "SAFETY") {
          yield {
            type: "text",
            data: "I appreciate your interest, but I'm unable to respond to that at the moment. Please try rephrasing your question.",
          };
        } else if (!candidate.content) {
          yield {
            type: "text",
            data: "I'm having trouble formulating a response. Please try again.",
          };
        }
      }
    } else {
      console.error("[Gemini] No candidates in response");
      console.error("[Gemini] Full response:", JSON.stringify(data, null, 2));
      throw new Error("No candidates returned from Gemini API");
    }
  },
};

export default geminiProvider;
