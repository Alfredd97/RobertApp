/**
 * Tattoo Price Estimation Engine
 *
 * Pure function that calculates price ranges based on tattoo characteristics.
 * Never generates random prices—all math is deterministic.
 */

import { pricingConfig } from "./config";

export interface EstimationInput {
  size: "small" | "medium" | "large" | "xlarge";
  placement: "standard" | "difficult";
  color: "blackAndGrey" | "color";
  complexity: "simple" | "moderate" | "intricate";
}

export interface EstimationResult {
  low: number;
  high: number;
  disclaimer: string;
}

/**
 * Round a price to the nearest $10
 */
function roundToNearest10(price: number): number {
  return Math.round(price / 10) * 10;
}

/**
 * Estimate tattoo price based on characteristics
 *
 * Algorithm:
 * 1. Get size hour range from config
 * 2. Multiply by hourly rate
 * 3. Apply placement modifier
 * 4. Apply color modifier
 * 5. Apply complexity modifier
 * 6. Enforce minimum charge
 * 7. Round to nearest $10
 *
 * @param input - Tattoo characteristics (size, placement, color, complexity)
 * @returns Price range (low, high) and disclaimer text
 */
export function estimateTattooPrice(input: EstimationInput): EstimationResult {
  const { size, placement, color, complexity } = input;

  // Validate inputs
  if (!["small", "medium", "large", "xlarge"].includes(size)) {
    throw new Error(`Invalid size: ${size}`);
  }
  if (!["standard", "difficult"].includes(placement)) {
    throw new Error(`Invalid placement: ${placement}`);
  }
  if (!["blackAndGrey", "color"].includes(color)) {
    throw new Error(`Invalid color: ${color}`);
  }
  if (!["simple", "moderate", "intricate"].includes(complexity)) {
    throw new Error(`Invalid complexity: ${complexity}`);
  }

  // Get base hour range from size
  const sizeRange = pricingConfig.sizes[size];
  const minHours = sizeRange.minHours;
  const maxHours = sizeRange.maxHours;

  // Get all modifiers
  const placementMod = pricingConfig.placementModifiers[placement];
  const colorMod = pricingConfig.colorModifiers[color];
  const complexityMod = pricingConfig.complexityModifiers[complexity];

  // Calculate combined modifier
  const combinedModifier = placementMod * colorMod * complexityMod;

  // Calculate price range (hourly rate × hours × modifiers)
  const baseMinPrice = pricingConfig.hourlyRate * minHours * combinedModifier;
  const baseMaxPrice = pricingConfig.hourlyRate * maxHours * combinedModifier;

  // Apply minimum charge
  const minPrice = Math.max(baseMinPrice, pricingConfig.minimumCharge);
  const maxPrice = Math.max(baseMaxPrice, pricingConfig.minimumCharge);

  // Round to nearest $10
  const low = roundToNearest10(minPrice);
  const high = roundToNearest10(maxPrice);

  // Build disclaimer
  const disclaimer =
    "This is an estimate based on your description. Final pricing will be confirmed during your consultation with Robert. Factors like design complexity, revisions, and placement may affect the final quote.";

  return {
    low,
    high,
    disclaimer,
  };
}

/**
 * Format the price estimate for display
 *
 * @param result - Result from estimateTattooPrice
 * @returns Formatted string like "$250 - $500"
 */
export function formatPriceRange(result: EstimationResult): string {
  return `$${result.low} - $${result.high}`;
}

/**
 * Create a human-readable summary of the estimation
 *
 * @param input - The input parameters
 * @param result - The estimation result
 * @returns A formatted summary string
 */
export function createEstimateSummary(
  input: EstimationInput,
  result: EstimationResult
): string {
  const priceRange = formatPriceRange(result);

  return `Based on a ${input.size} ${input.placement} placement ${input.color === "blackAndGrey" ? "black & grey" : "color"} ${input.complexity} design, we'd estimate **${priceRange}**.\n\n${result.disclaimer}`;
}
