import { OpenAI } from 'openai'
import type { Message } from '../types'
import type { Provider, ProviderInit } from './base'

export function openAIProvider(init: ProviderInit): Provider {
    const client = new OpenAI({
        apiKey: init.apiKey || process.env.OPENAI_API_KEY,
    })

    return {
        name: () => `openai/${init.model}`,
        async generate(messages: Message[]): Promise<string> {
            const sys: Message = {
                role: 'system',
                content: init.system ?? 'You are a helpful assistant who returns JSON.',
            }

            const res = await client.chat.completions.create({
                model: init.model,
                messages: [sys, ...messages],
                response_format: { type: 'json_object' },
            })

            return res.choices[0]?.message?.content ?? ''
        },
    }
}
