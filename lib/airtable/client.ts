/**
 * Airtable Client
 *
 * REST API client for interacting with Airtable.
 * Uses fetch to avoid additional SDK dependencies.
 */

export interface AirtableRecord {
  fields: Record<string, unknown>;
}

export interface AirtableCreateResponse {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

export interface AirtableError {
  error: {
    type: string;
    message: string;
  };
}

/**
 * Get Airtable configuration from environment
 */
function getAirtableConfig() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!baseId || !apiKey) {
    throw new Error(
      "Airtable configuration missing. Set AIRTABLE_BASE_ID and AIRTABLE_API_KEY in .env.local"
    );
  }

  return { baseId, apiKey };
}

/**
 * Create a record in an Airtable table
 *
 * @param tableName - Name of the table (e.g., "Leads")
 * @param fields - Record fields as key-value pairs
 * @returns Created record with ID and timestamp
 */
export async function createAirtableRecord(
  tableName: string,
  fields: Record<string, unknown>
): Promise<AirtableCreateResponse> {
  const { baseId, apiKey } = getAirtableConfig();

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  console.log(`[Airtable] Creating record in table "${tableName}"`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
      }),
    });

    const data = (await response.json()) as
      | { records: AirtableCreateResponse[] }
      | AirtableError;

    // Check if response indicates an error
    if ("error" in data) {
      const error = data as AirtableError;
      throw new Error(
        `Airtable API error: ${error.error.type} - ${error.error.message}`
      );
    }

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const records = (data as { records: AirtableCreateResponse[] }).records;
    if (!records || records.length === 0) {
      throw new Error("No record returned from Airtable");
    }

    const record = records[0];
    console.log(`[Airtable] Record created with ID: ${record.id}`);

    return record;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[Airtable] Failed to create record:`, errorMessage);
    throw error;
  }
}

/**
 * Update a record in Airtable
 * (Not currently used but available for future enhancements)
 */
export async function updateAirtableRecord(
  tableName: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<AirtableCreateResponse> {
  const { baseId, apiKey } = getAirtableConfig();

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`;

  console.log(`[Airtable] Updating record ${recordId} in table "${tableName}"`);

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    const data = (await response.json()) as
      | AirtableCreateResponse
      | AirtableError;

    if ("error" in data) {
      const error = data as AirtableError;
      throw new Error(
        `Airtable API error: ${error.error.type} - ${error.error.message}`
      );
    }

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    console.log(`[Airtable] Record updated: ${recordId}`);
    return data as AirtableCreateResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[Airtable] Failed to update record:`, errorMessage);
    throw error;
  }
}

/**
 * Validate that Airtable is configured
 * Call this at startup to catch configuration errors early
 */
export function validateAirtableConfig(): boolean {
  try {
    getAirtableConfig();
    console.log("[Airtable] Configuration validated");
    return true;
  } catch (error) {
    console.error("[Airtable] Configuration error:", error);
    return false;
  }
}
