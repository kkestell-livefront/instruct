import { z } from "zod";

export function parseWithSchema<T>(schema: z.ZodType<T>, text: string): T {
  const raw = text?.trim() ?? "";
  if (raw.length === 0) {
    throw new Error("Empty model response; expected a single JSON object");
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    const preview = raw.length > 200 ? raw.slice(0, 200) + "…" : raw;
    throw new Error(`Failed to parse JSON from model response. Preview: ${preview}`);
  }
  return schema.parse(data);
}
