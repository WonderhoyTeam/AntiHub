import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

/**
 * Universal OIDC callback handler
 * Handles OAuth callbacks for all providers (linux_do, github, pocketid)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle OAuth error
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error)}`, FRONTEND_URL)
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/auth?error=missing_oauth_params', FRONTEND_URL)
    );
  }

  try {
    // Call backend OIDC callback endpoint
    const response = await fetch(
      `${API_BASE_URL}/api/auth/oidc/${provider}/callback`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `${provider} authentication failed`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in, user } = data;

    // Create redirect URL with user info for localStorage sync
    const redirectUrl = new URL('/dashboard', FRONTEND_URL);
    redirectUrl.searchParams.set('login', 'success');
    redirectUrl.searchParams.set('token', access_token);
    redirectUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(user)));

    if (refresh_token) {
      redirectUrl.searchParams.set('refresh_token', refresh_token);
    }
    if (expires_in) {
      redirectUrl.searchParams.set('expires_in', String(expires_in));
    }

    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Set httpOnly cookies as backup
    redirectResponse.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    if (refresh_token) {
      redirectResponse.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    redirectResponse.cookies.set('user', JSON.stringify(user), {
      httpOnly: false, // Allow client-side access to user info
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return redirectResponse;
  } catch (error) {
    console.error(`[OIDC Callback] ${provider} failed:`, error);
    const errorMessage = error instanceof Error ? error.message : `${provider}_callback_failed`;
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, FRONTEND_URL)
    );
  }
}

// Support POST method as well (some OAuth providers use POST for callbacks)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  return GET(request, { params });
}
