/**
 * Tattoo Pricing Configuration
 *
 * TODO: Confirm all values with Robert before launching to production.
 * These are placeholder values based on industry standards.
 */

export interface SizeRange {
  minHours: number;
  maxHours: number;
}

export interface PricingConfig {
  // Base hourly rate (in dollars)
  hourlyRate: number;

  // Minimum charge for any tattoo
  minimumCharge: number;

  // Size categories with hour ranges
  sizes: Record<"small" | "medium" | "large" | "xlarge", SizeRange>;

  // Placement modifiers (multiplied against base price)
  placementModifiers: Record<"standard" | "difficult", number>;

  // Color modifiers (multiplied against base price)
  colorModifiers: Record<"blackAndGrey" | "color", number>;

  // Complexity modifiers (multiplied against base price)
  complexityModifiers: Record<"simple" | "moderate" | "intricate", number>;
}

/**
 * Default pricing configuration
 * TODO: Review with Robert and adjust values before launch
 */
export const pricingConfig: PricingConfig = {
  // Base rate: $250/hour (adjust based on Robert's preferred rate)
  hourlyRate: 250,

  // Minimum charge: $200 (covers small flash or quick work)
  minimumCharge: 200,

  // Size categories (hours of work estimated)
  sizes: {
    // Small: 1-2 inch tattoo, typically 30-60 minutes
    small: { minHours: 0.5, maxHours: 1 },

    // Medium: 2-4 inch tattoo, typically 1-2.5 hours
    medium: { minHours: 1, maxHours: 2.5 },

    // Large: 4-6 inch tattoo, typically 2.5-4 hours
    large: { minHours: 2.5, maxHours: 4 },

    // Extra Large: 6+ inch tattoo, typically 4+ hours
    xlarge: { minHours: 4, maxHours: 7 },
  },

  // Placement difficulty modifiers
  // Standard: arm, leg, back, chest, shoulder
  // Difficult: hands, feet, ribs, neck, behind ear (harder to tattoo, longer healing)
  placementModifiers: {
    standard: 1.0,
    difficult: 1.25, // +25% for difficult placements
  },

  // Color vs Black & Grey
  colorModifiers: {
    blackAndGrey: 1.0,
    color: 1.15, // +15% for color work (more time, more materials)
  },

  // Complexity of design
  complexityModifiers: {
    simple: 1.0,      // Simple line work, minimal detail
    moderate: 1.1,    // Standard detail, moderate shading
    intricate: 1.25,  // Heavy detail, fine line work, lots of shading
  },
};

/**
 * Get a copy of the current pricing configuration
 * Useful for testing or exporting settings
 */
export function getPricingConfig(): PricingConfig {
  return structuredClone(pricingConfig);
}
