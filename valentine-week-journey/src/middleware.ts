import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    LEGACY_PROGRESS_COOKIE_NAME,
    MAX_UNLOCKED_DAY,
    MIN_UNLOCKED_DAY,
    parseLegacyProgressCookie,
    parseSignedProgressCookie,
    PROGRESS_COOKIE_NAME
} from '@/lib/progressCookie';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/^\/day\/(\d+)/);
    if (!match) {
        return NextResponse.next();
    }

    const day = Number(match[1]);
    if (!Number.isFinite(day) || day < MIN_UNLOCKED_DAY || day > MAX_UNLOCKED_DAY) {
        return NextResponse.next();
    }

    if (day === MIN_UNLOCKED_DAY) {
        return NextResponse.next();
    }

    const signed = await parseSignedProgressCookie(request.cookies.get(PROGRESS_COOKIE_NAME)?.value);
    const legacy = parseLegacyProgressCookie(request.cookies.get(LEGACY_PROGRESS_COOKIE_NAME)?.value);
    const unlocked = signed ?? legacy ?? MIN_UNLOCKED_DAY;

    if (day > unlocked) {
        const url = request.nextUrl.clone();
        url.pathname = '/journey';
        url.searchParams.set('locked', '1');
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/day/:path*']
};
