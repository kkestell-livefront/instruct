import { Ollama } from "ollama";
import type { Message } from "../types";
import type { Provider, ProviderInit } from "./base";

export function ollamaProvider(init: ProviderInit): Provider {
  const client = new Ollama({
    host: process.env.OLLAMA_HOST, // defaults to http://127.0.0.1:11434
  });

  return {
    name: () => `ollama/${init.model}`,
    async generate(messages: Message[]): Promise<string> {
      const res = await client.chat({
        model: init.model,
        messages: messages.map((m) => ({ role: m.role as any, content: m.content })),
        stream: false,
        format: "json",
        options: { temperature: 0 },
      });

      return res?.message?.content ?? "";
    },
  };
}
