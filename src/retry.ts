export type RetryOptions = {
    retries?: number // total attempts = retries + 1
    baseDelayMs?: number // initial backoff
    factor?: number // exponential factor
    maxDelayMs?: number // cap
    jitter?: boolean // add ±50% jitter
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
    const { retries = 3, baseDelayMs = 200, factor = 2, maxDelayMs = 5_000, jitter = true } = opts

    let attempt = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            return await fn()
        } catch (err) {
            if (attempt >= retries) throw err
            const raw = Math.min(baseDelayMs * factor ** attempt, maxDelayMs)
            const delay = jitter ? Math.max(0, raw * (0.75 + Math.random() * 0.5)) : raw
            await sleep(delay)
            attempt++
        }
    }
}
