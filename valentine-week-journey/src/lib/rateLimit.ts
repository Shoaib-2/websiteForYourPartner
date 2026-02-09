interface RateBucket {
    count: number;
    resetAt: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

type RateLimitStore = Map<string, RateBucket>;

const globalRateLimit = globalThis as typeof globalThis & {
    __journeyRateLimitStore?: RateLimitStore;
};

const store: RateLimitStore = globalRateLimit.__journeyRateLimitStore ?? new Map<string, RateBucket>();
if (!globalRateLimit.__journeyRateLimitStore) {
    globalRateLimit.__journeyRateLimitStore = store;
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        const nextBucket: RateBucket = {
            count: 1,
            resetAt: now + windowMs
        };
        store.set(key, nextBucket);
        return {
            allowed: true,
            remaining: Math.max(0, limit - nextBucket.count),
            resetAt: nextBucket.resetAt
        };
    }

    existing.count += 1;
    store.set(key, existing);

    const allowed = existing.count <= limit;
    return {
        allowed,
        remaining: Math.max(0, limit - existing.count),
        resetAt: existing.resetAt
    };
}
