import type { TokenResponse } from 'expo-auth-session';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/** Minimal user claims parsed from the ID token payload. */
export interface UserClaims {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

/** Persisted token payload stored in secure storage. */
export interface StoredTokenPayload {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
  issuedAt: number;
  tokenType: string;
  scope?: string;
}

/** Converts a TokenResponse into a StoredTokenPayload. */
export function toStoredPayload(token: TokenResponse): StoredTokenPayload {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken ?? undefined,
    idToken: token.idToken ?? undefined,
    expiresIn: token.expiresIn ?? undefined,
    issuedAt: token.issuedAt,
    tokenType: token.tokenType,
    scope: token.scope ?? undefined,
  };
}

/** Parse minimal user claims from the JWT id_token payload (no verification). */
export function parseIdTokenClaims(idToken: string): UserClaims | null {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url → base64 → JSON
    const padded = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded)) as Record<string, unknown>;
    if (typeof decoded.sub !== 'string') return null;
    return {
      sub: decoded.sub,
      name: typeof decoded.name === 'string' ? decoded.name : undefined,
      email: typeof decoded.email === 'string' ? decoded.email : undefined,
      picture: typeof decoded.picture === 'string' ? decoded.picture : undefined,
    };
  } catch {
    return null;
  }
}
