/**
 * Leads Mapper
 *
 * Converts tool input data to Airtable "Leads" table field format.
 */

export interface LeadInput {
  name: string;
  email: string;
  tattooIdea: string;
  placement?: string;
  size?: string;
  color?: string;
  budget?: string;
  notes?: string;
  priceEstimate?: {
    low: number;
    high: number;
  };
  referencePhotoUrl?: string;
}

export interface AirtableLeadFields {
  [key: string]: unknown;
  Name: string;
  Contact: string;
  TattooStyle: string;
  Placement?: "Arm" | "Leg" | "Back" | "Chest" | "Ribs" | "Hand" | "Foot" | "Neck" | "Other";
  Size?: "Small" | "Medium" | "Large" | "Extra Large";
  Color?: "Color" | "Black & Grey";
  Budget?: string;
  ReferencePhoto?: Array<{
    url: string;
  }>;
  PriceEstimate?: string;
  Status: "New" | "Contacted" | "Booked" | "Completed" | "Not a fit";
  Source: "Chat Widget" | "Instagram" | "Walk-in" | "Referral";
  Notes?: string;
}

/**
 * Normalize placement to valid Airtable select value
 */
function normalizePlacement(
  placement?: string
): "Arm" | "Leg" | "Back" | "Chest" | "Ribs" | "Hand" | "Foot" | "Neck" | "Other" | undefined {
  if (!placement) return undefined;

  const lower = placement.toLowerCase().trim();

  // Direct matches
  if (lower === "arm") return "Arm";
  if (lower === "leg") return "Leg";
  if (lower === "back") return "Back";
  if (lower === "chest") return "Chest";
  if (lower === "ribs") return "Ribs";
  if (lower === "hand") return "Hand";
  if (lower === "foot") return "Foot";
  if (lower === "neck") return "Neck";

  // Fuzzy matches
  if (lower.includes("upper arm") || lower.includes("forearm")) return "Arm";
  if (lower.includes("thigh") || lower.includes("calf") || lower.includes("shin")) return "Leg";
  if (lower.includes("shoulder")) return "Back";
  if (lower.includes("side")) return "Ribs";

  return "Other"; // Default fallback
}

/**
 * Normalize size to valid Airtable select value
 */
function normalizeSize(
  size?: string
): "Small" | "Medium" | "Large" | "Extra Large" | undefined {
  if (!size) return undefined;

  const lower = size.toLowerCase().trim();

  // Direct matches
  if (lower === "small") return "Small";
  if (lower === "medium") return "Medium";
  if (lower === "large") return "Large";
  if (lower === "extra large" || lower === "xl" || lower === "extralarge")
    return "Extra Large";

  // Fuzzy matches
  if (lower === "s") return "Small";
  if (lower === "m") return "Medium";
  if (lower === "l") return "Large";
  if (lower === "xl" || lower === "xxl") return "Extra Large";

  return "Medium"; // Default fallback
}

/**
 * Normalize color to valid Airtable select value
 */
function normalizeColor(color?: string): "Color" | "Black & Grey" | undefined {
  if (!color) return undefined;

  const lower = color.toLowerCase().trim();

  // Black & Grey variations
  if (
    lower.includes("black") ||
    lower.includes("grey") ||
    lower.includes("gray") ||
    lower.includes("bw") ||
    lower.includes("black and grey")
  ) {
    return "Black & Grey";
  }

  // Color variations
  if (
    lower.includes("color") ||
    lower.includes("coloured") ||
    lower.includes("colored") ||
    lower.includes("full color") ||
    lower.includes("full colour")
  ) {
    return "Color";
  }

  return "Color"; // Default fallback
}

/**
 * Map lead input to Airtable fields
 *
 * @param input - Lead information from the tool
 * @returns Fields formatted for Airtable
 */
export function mapLeadToAirtable(input: LeadInput): AirtableLeadFields {
  // Normalize placement to valid Airtable select value
  const placement = normalizePlacement(input.placement);

  // Normalize size to valid Airtable select value
  const size = normalizeSize(input.size);

  // Normalize color to valid Airtable select value
  const color = normalizeColor(input.color);

  // Format price estimate
  let priceEstimate: string | undefined;
  if (input.priceEstimate) {
    priceEstimate = `$${input.priceEstimate.low} - $${input.priceEstimate.high}`;
  }

  // Map reference photo (Airtable attachment field expects array of objects with url)
  const referencePhoto = input.referencePhotoUrl
    ? [{ url: input.referencePhotoUrl }]
    : undefined;

  return {
    Name: input.name,
    Contact: input.email,
    TattooStyle: input.tattooIdea,
    Placement: placement,
    Size: size,
    Color: color,
    Budget: input.budget,
    ReferencePhoto: referencePhoto,
    PriceEstimate: priceEstimate,
    Status: "New",
    Source: "Chat Widget",
    Notes: input.notes,
  };
}

/**
 * Create a summary of the lead for logging
 */
export function summarizeLead(input: LeadInput): string {
  const parts = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Style: ${input.tattooIdea}`,
  ];

  if (input.placement) parts.push(`Placement: ${input.placement}`);
  if (input.size) parts.push(`Size: ${input.size}`);
  if (input.color) parts.push(`Color: ${input.color}`);
  if (input.budget) parts.push(`Budget: ${input.budget}`);
  if (input.priceEstimate) {
    parts.push(
      `Estimate: $${input.priceEstimate.low} - $${input.priceEstimate.high}`
    );
  }

  return parts.join(" | ");
}
