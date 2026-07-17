/**
 * Tool Registry
 *
 * Centralized registry of all available tools for the AI assistant.
 * Tools are provider-agnostic and get transformed to provider-specific formats.
 */

import { NormalizedTool } from "@/lib/ai/providers/types";

/**
 * Define all available tools here
 * Each tool must have:
 * - name: Unique identifier
 * - description: What the tool does
 * - input_schema: JSON Schema describing the parameters
 */

const estimateTattooPrice: NormalizedTool = {
  name: "estimate_tattoo_price",
  description:
    "Estimate the price range for a tattoo based on size, placement, color, and complexity. Returns a price range with a disclaimer that final pricing is confirmed during consultation.",
  input_schema: {
    type: "object",
    properties: {
      size: {
        type: "string",
        enum: ["small", "medium", "large", "xlarge"],
        description:
          "Size of the tattoo. small=1-2 inches, medium=2-4 inches, large=4-6 inches, xlarge=6+ inches",
      },
      placement: {
        type: "string",
        enum: ["standard", "difficult"],
        description:
          "Placement difficulty. standard=arm/leg/back/chest/shoulder. difficult=hands/feet/ribs/neck/behind ear",
      },
      color: {
        type: "string",
        enum: ["blackAndGrey", "color"],
        description:
          "Color style. blackAndGrey=monochrome. color=full color or colored ink",
      },
      complexity: {
        type: "string",
        enum: ["simple", "moderate", "intricate"],
        description:
          "Design complexity. simple=line work/minimal detail. moderate=standard detail/shading. intricate=heavy detail/fine lines",
      },
    },
    required: ["size", "placement", "color", "complexity"],
  },
};

const suggestBooking: NormalizedTool = {
  name: "suggest_booking",
  description:
    "Suggest that the customer book an appointment. This helps guide conversation toward the booking flow.",
  input_schema: {
    type: "object",
    properties: {
      reason: {
        type: "string",
        description: "Why booking is being suggested (e.g., 'discuss custom design')",
      },
    },
    required: ["reason"],
  },
};

const captureLeadInfo: NormalizedTool = {
  name: "capture_lead_info",
  description:
    "Capture and log lead information for follow-up by Robert. Saves to Airtable CRM automatically.",
  input_schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Customer's name",
      },
      email: {
        type: "string",
        description: "Customer's email address",
      },
      tattooIdea: {
        type: "string",
        description: "Description of what they want tattooed",
      },
      placement: {
        type: "string",
        description:
          "Where on their body they want the tattoo (e.g., arm, ribs, chest)",
      },
      size: {
        type: "string",
        enum: ["small", "medium", "large", "xlarge"],
        description: "Estimated size of the tattoo",
      },
      color: {
        type: "string",
        enum: ["blackAndGrey", "color"],
        description: "Color preference: black & grey or color",
      },
      budget: {
        type: "string",
        description: "Customer's budget if discussed (e.g., '$300-500')",
      },
      priceEstimate: {
        type: "object",
        description:
          "If a price estimate was calculated via estimate_tattoo_price, include it here",
        properties: {
          low: {
            type: "number",
            description: "Minimum estimated price in dollars",
          },
          high: {
            type: "number",
            description: "Maximum estimated price in dollars",
          },
        },
      },
      referencePhotoUrl: {
        type: "string",
        description: "URL to a reference photo if customer uploaded one",
      },
      notes: {
        type: "string",
        description: "Any additional context or special requests",
      },
    },
    required: ["name", "email", "tattooIdea"],
  },
};

const updateLeadInfo: NormalizedTool = {
  name: "update_lead_info",
  description:
    "Update an existing lead's information in Airtable CRM after initial capture. Use this to add optional details like placement, size, color, budget after the initial conversation.",
  input_schema: {
    type: "object",
    properties: {
      recordId: {
        type: "string",
        description: "The Airtable record ID of the lead to update (from capture_lead_info)",
      },
      email: {
        type: "string",
        description: "Customer's email (used to verify which record to update)",
      },
      placement: {
        type: "string",
        description:
          "Where on their body they want the tattoo (e.g., arm, ribs, chest)",
      },
      size: {
        type: "string",
        enum: ["small", "medium", "large", "xlarge"],
        description: "Estimated size of the tattoo",
      },
      color: {
        type: "string",
        enum: ["blackAndGrey", "color"],
        description: "Color preference: black & grey or color",
      },
      budget: {
        type: "string",
        description: "Customer's budget if discussed (e.g., '$300-500')",
      },
      priceEstimate: {
        type: "object",
        description:
          "If a price estimate was calculated via estimate_tattoo_price, include it here",
        properties: {
          low: {
            type: "number",
            description: "Minimum estimated price in dollars",
          },
          high: {
            type: "number",
            description: "Maximum estimated price in dollars",
          },
        },
      },
      referencePhotoUrl: {
        type: "string",
        description: "URL to a reference photo if customer uploaded one",
      },
      notes: {
        type: "string",
        description: "Any additional context or special requests",
      },
    },
    required: ["recordId", "email"],
  },
};

/**
 * Complete registry of all tools
 * Add new tools to this array and they'll be automatically available
 */
export const allTools: NormalizedTool[] = [
  estimateTattooPrice,
  suggestBooking,
  captureLeadInfo,
  updateLeadInfo,
];

/**
 * Get all tools
 */
export function getTools(): NormalizedTool[] {
  return allTools;
}

/**
 * Get a specific tool by name
 */
export function getTool(name: string): NormalizedTool | undefined {
  return allTools.find((tool) => tool.name === name);
}

/**
 * Get tool names only
 */
export function getToolNames(): string[] {
  return allTools.map((tool) => tool.name);
}
