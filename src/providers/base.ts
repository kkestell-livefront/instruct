import type { Message } from "../types";

export interface ProviderInit {
  model: string;
  apiKey?: string;
  system?: string;
}

export interface Provider {
  name(): string;
  generate(messages: Message[]): Promise<string>;
}

export type ProviderFactory = (init: ProviderInit) => Provider;
