import { describe, it, expect } from 'bun:test'
import { instructor } from '@/index'

describe('provider registry', () => {
    it('supports openai and ollama', () => {
        expect(() =>
            instructor.fromProvider('openai/gpt-5-nano', { apiKey: 'sk-test' }),
        ).not.toThrow()
        expect(() => instructor.fromProvider('ollama/llama3')).not.toThrow()
    })

    it('throws clearly on unknown provider', () => {
        expect(() => instructor.fromProvider('unknown/foo' as any)).toThrow(/Unknown provider/)
    })

    it('throws if model is omitted', () => {
        expect(() => instructor.fromProvider('openai' as any)).toThrow(/Model missing/)
    })
})
