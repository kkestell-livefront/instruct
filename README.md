# Instruct

Node library providing structured output from LLMs.

## Quick Start

```typescript
import { z } from "zod"
import { instructor } from "instruct"

const Contact = z.object({ name: z.string(), email: z.string().email() })

// const client = instructor.fromProvider("openai/gpt-5-nano", { apiKey: "sk-..." });
const client = instructor.fromProvider("ollama/qwen3:30b")

console.log(await client.chat.completions.create({
  response_model: Contact,
  messages: [
    {
      role: "user",
      content: "Contact Jane Doe at <jane@example.com>."
    }
  ]
}))
```