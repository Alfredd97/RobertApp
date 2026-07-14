/**
 * Tool Handler
 *
 * Executes tool calls and returns results.
 * This is provider-agnostic—the same handlers work with any AI provider.
 */

import { ToolCall } from "@/lib/ai/providers/types";
import {
  estimateTattooPrice,
  EstimationInput,
  createEstimateSummary,
} from "@/lib/pricing/estimate";
import { createAirtableRecord } from "@/lib/airtable/client";
import {
  mapLeadToAirtable,
  summarizeLead,
  type LeadInput,
} from "@/lib/airtable/leads-mapper";

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

/**
 * Handler for estimate_tattoo_price tool
 */
function handleEstimateTattooPrice(
  input: Record<string, unknown>
): ToolResult {
  try {
    const estimationInput = input as EstimationInput;
    const result = estimateTattooPrice(estimationInput);
    const summary = createEstimateSummary(estimationInput, result);

    return {
      success: true,
      data: {
        priceRange: `$${result.low} - $${result.high}`,
        disclaimer: result.disclaimer,
        summary,
        raw: result,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handler for suggest_booking tool
 */
function handleSuggestBooking(input: Record<string, unknown>): ToolResult {
  try {
    const reason = (input.reason as string) || "discuss your tattoo idea";
    return {
      success: true,
      data: {
        message: `I'd recommend booking a consultation with Robert to ${reason}. You can reach him via WhatsApp or Instagram DM from the contact section below, or email hello@robertsink.tattoo.`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Handler for capture_lead_info tool
 *
 * Saves lead information to Airtable CRM.
 * Gracefully handles Airtable failures—user experience is never impacted.
 */
async function handleCaptureLeadInfo(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const name = input.name as string;
    const email = input.email as string;
    const tattooIdea = input.tattooIdea as string;
    const placement = (input.placement as string) || undefined;
    const size = (input.size as string) || undefined;
    const color = (input.color as string) || undefined;
    const budget = (input.budget as string) || undefined;
    const notes = (input.notes as string) || undefined;
    const priceEstimate = input.priceEstimate as
      | { low: number; high: number }
      | undefined;
    const referencePhotoUrl = (input.referencePhotoUrl as string) || undefined;

    // Build lead input
    const leadInput: LeadInput = {
      name,
      email,
      tattooIdea,
      placement,
      size,
      color,
      budget,
      notes,
      priceEstimate,
      referencePhotoUrl,
    };

    // Log locally for debugging
    console.log("[Tool] Captured lead info:", summarizeLead(leadInput));

    // Try to save to Airtable, but don't fail the tool if it errors
    let airtableSuccess = false;
    let airtableRecordId: string | undefined;

    try {
      // Map to Airtable format
      const airtableFields = mapLeadToAirtable(leadInput);

      // Create record in Airtable
      const record = await createAirtableRecord("Leads", airtableFields);
      airtableRecordId = record.id;
      airtableSuccess = true;

      console.log(
        `[Tool] Lead saved to Airtable with record ID: ${airtableRecordId}`
      );
    } catch (airtableError) {
      // Log the error but continue—never break the chat experience
      console.error(
        "[Tool] Failed to save lead to Airtable:",
        airtableError instanceof Error ? airtableError.message : "Unknown error"
      );
      // Continue anyway—return success to user
    }

    return {
      success: true,
      data: {
        message: `Thanks! I've noted your interest. Robert will reach out to you at ${email} to discuss your tattoo idea.`,
        leadData: leadInput,
        airtableRecordId,
        airtableSaved: airtableSuccess,
      },
    };
  } catch (error) {
    // This shouldn't happen, but catch any unexpected errors
    console.error(
      "[Tool] Error in capture_lead_info:",
      error instanceof Error ? error.message : "Unknown error"
    );
    // Still return success to maintain user experience
    return {
      success: true,
      data: {
        message: `Thanks! I've noted your interest. Robert will reach out to you soon.`,
      },
    };
  }
}

/**
 * Execute a tool call and return the result
 *
 * This function is async because some tools (like capture_lead_info)
 * make API calls to external services (Airtable).
 *
 * @param toolCall - The tool call from the AI
 * @returns The tool result
 */
export async function executeTool(toolCall: ToolCall): Promise<ToolResult> {
  console.log(`[Tool] Executing: ${toolCall.name}`, toolCall.input);

  switch (toolCall.name) {
    case "estimate_tattoo_price":
      return handleEstimateTattooPrice(toolCall.input);
    case "suggest_booking":
      return handleSuggestBooking(toolCall.input);
    case "capture_lead_info":
      return await handleCaptureLeadInfo(toolCall.input);
    default:
      return {
        success: false,
        error: `Unknown tool: ${toolCall.name}`,
      };
  }
}

/**
 * Format a tool result for display to the user
 * (when the AI needs to communicate the tool result)
 *
 * @param toolName - Name of the tool that was called
 * @param result - The result from executing the tool
 * @returns Formatted message for the user
 */
export function formatToolResult(toolName: string, result: ToolResult): string {
  if (!result.success) {
    return `Error calling ${toolName}: ${result.error}`;
  }

  switch (toolName) {
    case "estimate_tattoo_price": {
      const data = result.data as Record<string, unknown>;
      return data.summary as string;
    }
    case "suggest_booking": {
      const data = result.data as Record<string, unknown>;
      return data.message as string;
    }
    case "capture_lead_info": {
      const data = result.data as Record<string, unknown>;
      return data.message as string;
    }
    default:
      return JSON.stringify(result.data);
  }
}
