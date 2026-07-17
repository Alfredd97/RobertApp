/**
 * AI Provider Registry
 * Maps provider keys to their implementations
 * Add new providers here after implementing the AIProvider interface
 */

import { AIProvider } from "./types";
import anthropicProvider from "./anthropic";
import geminiProvider from "./gemini";
import openaiProvider from "./openai";

/**
 * Registry of available AI providers
 * To add a new provider:
 * 1. Create a new file in this directory implementing AIProvider
 * 2. Import it here
 * 3. Add it to the providers map below
 * 4. Set AI_PROVIDER environment variable to your provider key
 */
export const providers: Record<string, AIProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
  openai: openaiProvider,
};

/**
 * Get a provider by key, with helpful error message if not found
 */
export function getProvider(key: string): AIProvider {
  const provider = providers[key];
  if (!provider) {
    const availableKeys = Object.keys(providers);
    throw new Error(
      `Unknown AI_PROVIDER '${key}'. Available providers: ${availableKeys.join(", ")}`
    );
  }
  return provider;
}

/**
 * Get list of registered provider keys
 */
export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}

export * from "./types";
