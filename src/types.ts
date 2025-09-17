export type Role = 'system' | 'user' | 'assistant'

export interface Message {
    role: Role
    content: string
}

export interface CreateArgs<T> {
    response_model: import('zod').ZodType<T>
    messages: Message[]
}

export interface ChatAPI {
    completions: {
        create<T>(args: CreateArgs<T>): Promise<T>
    }
}
