import { describe, it, expect } from 'bun:test'
import { z } from 'zod'
import { instructor } from '@/index'

const model = process.env.OLLAMA_MODEL || 'qwen3:4b'

const UserInfo = z.object({
    name: z.string(),
    age: z.number().int(),
})

describe('Ollama structured extraction', () => {
    it('creates a client from provider spec', () => {
        const client = instructor.fromProvider(`ollama/${model}`)
        expect(client).toBeTruthy()
    })

    it('extracts typed data from Ollama', async () => {
        const client = instructor.fromProvider(`ollama/${model}`)

        const user = await client.chat.completions.create({
            response_model: UserInfo,
            messages: [
                {
                    role: 'user',
                    content: 'John Doe is 30 years old.',
                },
            ],
        })

        expect(user).toEqual({ name: 'John Doe', age: 30 })
    }, 30000)
})
