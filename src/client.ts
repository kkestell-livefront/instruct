import { parseWithSchema } from './parsing'
import type { Provider, ProviderInit } from './providers/base'
import { ollamaProvider } from './providers/ollama'
import { openAIProvider } from './providers/openai'
import { retry } from './retry'
import type { ChatAPI, CreateArgs } from './types'

type ProviderSpec = `${'openai' | 'ollama'}/${string}`

const registry = new Map<string, (init: ProviderInit) => Provider>([
    ['openai', openAIProvider],
    ['ollama', ollamaProvider],
])

export class InstructorClient {
    private provider: Provider

    private constructor(provider: Provider) {
        this.provider = provider
    }

    static fromProvider(
        spec: ProviderSpec,
        init: Omit<ProviderInit, 'model'> & { model?: string } = {},
    ) {
        const [vendor, model] = spec.split('/') as [string, string | undefined]
        const factory = registry.get(vendor)
        if (!factory) throw new Error(`Unknown provider: ${vendor}`)
        if (!model) throw new Error(`Model missing in provider spec: ${spec}`)

        const provider = factory({ model, apiKey: init.apiKey })
        return new InstructorClient(provider)
    }

    readonly chat: ChatAPI = {
        completions: {
            create: async <T>(args: CreateArgs<T>): Promise<T> => {
                return retry(
                    async () => {
                        const text = await this.provider.generate(args.messages)
                        return parseWithSchema(args.response_model, text)
                    },
                    { retries: 3, baseDelayMs: 250, factor: 2, maxDelayMs: 2000, jitter: true },
                )
            },
        },
    }
}

export const instructor = {
    fromProvider: InstructorClient.fromProvider,
}
