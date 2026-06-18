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
    content: {
      parts: GeminiPart[];
    };
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
      throw new Error("No response from Gemini API");
    }

    let text = "";
    const toolCalls: ToolCall[] = [];

    // Parse response
    const candidate = data.candidates[0];
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
    console.log("[Gemini] Received response");

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
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
        console.log("[Gemini] No content in candidate");
      }
    } else {
      console.log("[Gemini] No candidates in response");
    }
  },
};

export default geminiProvider;
