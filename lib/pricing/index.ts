/**
 * Pricing Module
 * Exports all pricing-related functionality
 */

export {
  pricingConfig,
  getPricingConfig,
  type PricingConfig,
  type SizeRange,
} from "./config";

export {
  estimateTattooPrice,
  formatPriceRange,
  createEstimateSummary,
  type EstimationInput,
  type EstimationResult,
} from "./estimate";
