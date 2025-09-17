import { describe, it, expect } from "bun:test";
import { z } from "zod";
import { instructor } from "../src";

const model = process.env.OPENAI_MODEL
const apiKey = process.env.OPENAI_API_KEY

const UserInfo = z.object({
  name: z.string(),
  age: z.number().int(),
});

describe("OpenAI structured extraction", () => {
  it("creates a client from provider spec", () => {
    const client = instructor.fromProvider(`openai/${model}`, {
      apiKey: apiKey,
    });
    expect(client).toBeTruthy();
  });

  it(
    "extracts typed data from OpenAI",
    async () => {
      const client = instructor.fromProvider(`openai/${model}`, {
        apiKey: apiKey,
      });

      const user = await client.chat.completions.create({
        response_model: UserInfo,
        messages: [
          {
            role: "user",
            content:
              'John Doe is 30 years old.',
          },
        ],
      });

      expect(user).toEqual({ name: "John Doe", age: 30 });
    },
    30000
  );
});
