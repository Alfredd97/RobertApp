# AI System Configuration

This directory contains the AI provider system and agent configuration for Robert's Ink.

## Quick Start

### Changing Agent Behavior

Edit `/lib/ai/system-prompts.ts` to modify how the AI assistant behaves. This is your single source of truth for agent instructions.

**Example: Modifying the default prompt**

```typescript
// lib/ai/system-prompts.ts

export const systemPrompts = {
  default: `You are a helpful assistant for ROBERT'S INK...
  
  // Edit the prompt here to change the agent's behavior
  // Change tone, add new instructions, add context, etc.
  `,
};
```

### Adding New Prompts (Roles)

```typescript
export const systemPrompts = {
  default: `...current prompt...`,
  
  // Add a new role
  sales: `You are a sales-focused assistant for ROBERT'S INK...
    Be persuasive and highlight special offers and booking benefits.`,
    
  bookingAssistant: `You help customers understand and schedule tattoo appointments...
    Be specific about pricing, placement considerations, and healing time.`,
};
```

Then use it by passing the role in the API query:
```javascript
// In your chat component or frontend:
fetch('/api/chat?role=sales', {
  method: 'POST',
  body: JSON.stringify({ messages })
})
```

## How It Works

1. **System Prompts** (`system-prompts.ts`)
   - Contains all agent instructions
   - Easy to modify without touching code
   - Supports multiple roles/contexts

2. **AI Client** (`client.ts`)
   - High-level interface for chat
   - Handles provider abstraction
   - Manages API key lookup

3. **Providers** (`providers/`)
   - Currently: `anthropic.ts`, `gemini.ts`
   - Template: `_template.ts` for adding new providers
   - Registry: `index.ts` maps provider keys to implementations

4. **Chat Route** (`/app/api/chat/route.ts`)
   - Imports system prompt from `system-prompts.ts`
   - Passes it to the AI client
   - Supports role-based prompts via query param

## File Structure

```
lib/ai/
├── system-prompts.ts          # Agent instructions (EDIT THIS!)
├── client.ts                  # High-level AI client
├── providers/
│   ├── types.ts               # Interface definitions
│   ├── index.ts               # Provider registry
│   ├── anthropic.ts           # Anthropic provider
│   ├── gemini.ts              # Google Gemini provider
│   ├── _template.ts           # Template for new providers
│   └── README.md              # Provider docs
└── README.md                  # This file

app/api/chat/
└── route.ts                   # Chat API endpoint
```

## Common Tasks

### Change the agent's personality
Edit `system-prompts.ts` → modify the `default` prompt

### Make the agent more helpful
Edit `system-prompts.ts` → add more context/instructions

### Add availability info
Edit `system-prompts.ts` → add to "Contact Information" section

### Switch AI providers
Edit `.env.local`:
```bash
# Use Gemini instead of Anthropic
AI_PROVIDER=gemini
```

### Add a new AI provider
1. Copy `providers/_template.ts`
2. Rename and implement it
3. Register it in `providers/index.ts`
4. Set `AI_PROVIDER` in `.env.local`

## Environment Variables

```bash
# Provider selection
AI_PROVIDER=anthropic  # or 'gemini'

# API Keys
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...

# Optional
AI_MODEL=gemini-2.5-flash  # override default model
```

## Tips

- Keep prompts concise but clear
- Be specific about the agent's role and constraints
- Use examples in prompts for better results
- Test changes by clearing chat history and trying new queries
- For Gemini: prompts can be longer (higher context limit)
- For Anthropic: use cache_control for system prompt (cost optimization)

---

**Questions?** Check the provider-specific docs in `providers/README.md`
