import { NextRequest, NextResponse } from 'next/server';
import { consumeRateLimit } from '@/lib/rateLimit';
import {
    createSignedProgressCookie,
    LEGACY_PROGRESS_COOKIE_NAME,
    MAX_UNLOCKED_DAY,
    MIN_UNLOCKED_DAY,
    parseLegacyProgressCookie,
    parseSignedProgressCookie,
    PROGRESS_COOKIE_NAME
} from '@/lib/progressCookie';

interface ProgressPayload {
    dayCompleted?: number;
}

function getClientKey(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const agent = request.headers.get('user-agent') || 'unknown';
    return `${ip}:${agent.slice(0, 80)}`;
}

async function getCurrentUnlockedDay(request: NextRequest): Promise<number> {
    const signed = await parseSignedProgressCookie(request.cookies.get(PROGRESS_COOKIE_NAME)?.value);
    if (signed !== null) {
        return signed;
    }
    const legacy = parseLegacyProgressCookie(request.cookies.get(LEGACY_PROGRESS_COOKIE_NAME)?.value);
    return legacy ?? MIN_UNLOCKED_DAY;
}

function setProgressCookie(response: NextResponse, cookieValue: string) {
    response.cookies.set(PROGRESS_COOKIE_NAME, cookieValue, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 120
    });

    // Remove unsigned legacy cookie once a signed value exists.
    response.cookies.set(LEGACY_PROGRESS_COOKIE_NAME, '', {
        path: '/',
        maxAge: 0
    });
}

function isValidCompletedDay(day: number): boolean {
    return Number.isInteger(day) && day >= MIN_UNLOCKED_DAY && day <= MAX_UNLOCKED_DAY;
}

export async function GET(request: NextRequest) {
    const unlocked = await getCurrentUnlockedDay(request);
    const response = NextResponse.json({ ok: true, unlocked });

    // Opportunistic migration from unsigned to signed cookie.
    const hasSignedCookie = Boolean(request.cookies.get(PROGRESS_COOKIE_NAME)?.value);
    if (!hasSignedCookie) {
        const signedValue = await createSignedProgressCookie(unlocked);
        setProgressCookie(response, signedValue);
    }

    return response;
}

export async function POST(request: NextRequest) {
    const rateLimit = consumeRateLimit(`progress:${getClientKey(request)}`, 25, 60_000);
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { ok: false, error: 'Too many progress updates. Please try again in a minute.' },
            { status: 429 }
        );
    }

    let payload: ProgressPayload = {};

    try {
        payload = (await request.json()) as ProgressPayload;
    } catch {
        payload = {};
    }

    if (typeof payload.dayCompleted !== 'number' || !isValidCompletedDay(payload.dayCompleted)) {
        return NextResponse.json({ ok: false, error: 'Invalid completed day' }, { status: 400 });
    }

    const currentUnlocked = await getCurrentUnlockedDay(request);
    const completedDay = Math.floor(payload.dayCompleted);

    if (completedDay < currentUnlocked) {
        return NextResponse.json({ ok: true, unlocked: currentUnlocked, alreadyUnlocked: true });
    }

    // Only allow unlocking one day ahead from the current signed state.
    if (completedDay !== currentUnlocked) {
        return NextResponse.json(
            { ok: false, error: 'Progress step is out of sequence' },
            { status: 409 }
        );
    }

    const nextUnlocked = Math.min(MAX_UNLOCKED_DAY, currentUnlocked + 1);
    const signedValue = await createSignedProgressCookie(nextUnlocked);
    const response = NextResponse.json({ ok: true, unlocked: nextUnlocked });
    setProgressCookie(response, signedValue);

    return response;
}
