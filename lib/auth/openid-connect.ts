/**
 * OIDC service helpers for shared token operations.
 */

import * as AuthSession from 'expo-auth-session';
import type { TokenResponseConfig } from 'expo-auth-session';

import { oidcConfig } from '@/config/openid-connect';

export type IdTokenClaims = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  updated_at?: number;
};

/** Parse claims from the JWT id_token payload (no verification). */
export function parseIdTokenClaims(idToken: string): IdTokenClaims | null {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as IdTokenClaims;
  } catch {
    return null;
  }
}

/**
 * Exchange an authorization code for tokens.
 * Returns a TokenResponseConfig on success.
 */
export async function exchangeCode(
  code: string,
  request: AuthSession.AuthRequest,
  discovery: AuthSession.DiscoveryDocument
): Promise<TokenResponseConfig> {
  return await AuthSession.exchangeCodeAsync(
    {
      clientId: oidcConfig.clientId,
      code,
      redirectUri: oidcConfig.redirectUri,
      extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
    },
    { tokenEndpoint: discovery.tokenEndpoint! }
  );
}

/**
 * Refresh an access token using a refresh token.
 * Returns an updated TokenResponseConfig or null if refresh fails.
 */
export async function refreshTokens(
  payload: TokenResponseConfig,
  discovery: AuthSession.DiscoveryDocument
): Promise<TokenResponseConfig | null> {
  if (!payload.refreshToken || !discovery.tokenEndpoint) return null;
  try {
    return await AuthSession.refreshAsync(
      {
        clientId: oidcConfig.clientId,
        refreshToken: payload.refreshToken,
      },
      { tokenEndpoint: discovery.tokenEndpoint }
    );
  } catch {
    return null;
  }
}

/**
 * Check whether the stored token is still fresh (not expired within margin).
 */
export function isTokenFresh(payload: TokenResponseConfig, secondsMargin = 60): boolean {
  if (typeof payload.issuedAt !== 'number') return false;
  return AuthSession.TokenResponse.isTokenFresh(
    { expiresIn: payload.expiresIn, issuedAt: payload.issuedAt },
    secondsMargin
  );
}

/**
 * Attempt to revoke a token (access or refresh).
 * Silently ignores errors if revocation endpoint is unavailable.
 */
export async function revokeToken(
  token: string,
  hint: 'access_token' | 'refresh_token',
  discovery: AuthSession.DiscoveryDocument
): Promise<void> {
  if (!discovery.revocationEndpoint) return;
  try {
    await AuthSession.revokeAsync(
      {
        clientId: oidcConfig.clientId,
        token,
        tokenTypeHint:
          hint === 'access_token'
            ? AuthSession.TokenTypeHint.AccessToken
            : AuthSession.TokenTypeHint.RefreshToken,
      },
      { revocationEndpoint: discovery.revocationEndpoint }
    );
  } catch {
    // Best-effort; ignore
  }
}
