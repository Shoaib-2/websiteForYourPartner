export const PROGRESS_COOKIE_NAME = 'journey_progress';
export const LEGACY_PROGRESS_COOKIE_NAME = 'journey_unlocked';
export const MIN_UNLOCKED_DAY = 1;
export const MAX_UNLOCKED_DAY = 8;

const encoder = new TextEncoder();
let cachedKeyPromise: Promise<CryptoKey> | null = null;

function normalizeUnlockedDay(value: number): number {
    if (!Number.isFinite(value)) return MIN_UNLOCKED_DAY;
    return Math.min(MAX_UNLOCKED_DAY, Math.max(MIN_UNLOCKED_DAY, Math.floor(value)));
}

function toBase64Url(bytes: Uint8Array): string {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(bytes).toString('base64url');
    }

    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function getSecret(): string {
    return process.env.PROGRESS_COOKIE_SECRET || 'dev-only-change-me';
}

async function getSigningKey(): Promise<CryptoKey> {
    if (!cachedKeyPromise) {
        cachedKeyPromise = crypto.subtle.importKey(
            'raw',
            encoder.encode(getSecret()),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
    }
    return cachedKeyPromise;
}

async function signPayload(payload: string): Promise<string> {
    const key = await getSigningKey();
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return toBase64Url(new Uint8Array(signature));
}

export async function createSignedProgressCookie(unlockedDay: number): Promise<string> {
    const normalized = normalizeUnlockedDay(unlockedDay);
    const payload = String(normalized);
    const signature = await signPayload(payload);
    return `${payload}.${signature}`;
}

export async function parseSignedProgressCookie(cookieValue: string | undefined): Promise<number | null> {
    if (!cookieValue) return null;
    const [payload, signature] = cookieValue.split('.');
    if (!payload || !signature) return null;
    if (!/^\d+$/.test(payload)) return null;

    const expectedSignature = await signPayload(payload);
    if (signature !== expectedSignature) return null;

    const unlocked = Number(payload);
    if (!Number.isFinite(unlocked) || unlocked < MIN_UNLOCKED_DAY || unlocked > MAX_UNLOCKED_DAY) {
        return null;
    }

    return unlocked;
}

export function parseLegacyProgressCookie(cookieValue: string | undefined): number | null {
    if (!cookieValue) return null;
    if (!/^\d+$/.test(cookieValue)) return null;
    const unlocked = Number(cookieValue);
    if (!Number.isFinite(unlocked) || unlocked < MIN_UNLOCKED_DAY || unlocked > MAX_UNLOCKED_DAY) {
        return null;
    }
    return unlocked;
}
