/**
 * Airtable Module
 * Exports all Airtable-related functionality
 */

export {
  createAirtableRecord,
  updateAirtableRecord,
  validateAirtableConfig,
  type AirtableRecord,
  type AirtableCreateResponse,
} from "./client";

export {
  mapLeadToAirtable,
  summarizeLead,
  type LeadInput,
  type AirtableLeadFields,
} from "./leads-mapper";
