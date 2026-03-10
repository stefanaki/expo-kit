/**
 * Fixture helpers for auth store state.
 *
 * Use these to seed deterministic auth state in tests without relying on
 * real SecureStore or network calls.
 */
import type { StoredTokenPayload } from '@/lib/auth/types';

/** Builds a fake base64url-encoded JWT with the given claims (no signature). */
function makeJwt(claims: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const payload = Buffer.from(JSON.stringify(claims))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${payload}.test-sig`;
}

export const MOCK_USER_CLAIMS = {
  sub: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  picture: 'https://example.com/avatar.png',
} as const;

/** A valid-looking token payload with a decodable ID token. */
export function makeTokenPayload(overrides: Partial<StoredTokenPayload> = {}): StoredTokenPayload {
  return {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: makeJwt(MOCK_USER_CLAIMS),
    tokenType: 'Bearer',
    issuedAt: Math.floor(Date.now() / 1000),
    expiresIn: 3600,
    scope: 'openid profile email',
    ...overrides,
  };
}

/** A token payload that is expired (issued 2 hours ago, expires in 3600s). */
export function makeExpiredTokenPayload(
  overrides: Partial<StoredTokenPayload> = {}
): StoredTokenPayload {
  return makeTokenPayload({
    issuedAt: Math.floor(Date.now() / 1000) - 7200,
    expiresIn: 3600,
    ...overrides,
  });
}
