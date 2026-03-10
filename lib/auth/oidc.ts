/**
 * OIDC service helpers.
 *
 * This module exports hooks and plain async helpers for:
 *  - building a redirect URI
 *  - using the auth request/code-exchange flow
 *  - refreshing tokens
 *  - revoking tokens
 *  - building an end-session URL
 *  - web popup completion bootstrap (call once at app root)
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { oidcConfig } from '@/config/oidc';
import type { StoredTokenPayload } from './types';
import { toStoredPayload } from './types';

// Must be called before any auth request on web to close the popup.
export function maybeCompleteAuthSession() {
  WebBrowser.maybeCompleteAuthSession();
}

/** Build the redirect URI for the current platform. */
export function buildRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    scheme: 'my-expo-app',
    path: 'auth/callback',
  });
}

/**
 * Hook that returns the auto-discovered OIDC discovery document.
 * Returns null while loading.
 */
export function useOidcDiscovery() {
  return AuthSession.useAutoDiscovery(oidcConfig.issuer);
}

/**
 * Hook that sets up an auth request for Authorization Code + PKCE.
 * Returns [request, response, promptAsync].
 */
export function useOidcAuthRequest(discovery: AuthSession.DiscoveryDocument | null) {
  const redirectUri = buildRedirectUri();

  const extraParams: Record<string, string> = {};
  if (oidcConfig.audience) {
    extraParams['audience'] = oidcConfig.audience;
  }

  return AuthSession.useAuthRequest(
    {
      clientId: oidcConfig.clientId,
      scopes: oidcConfig.scopes as string[],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams,
    },
    discovery
  );
}

/**
 * Exchange an authorization code for tokens.
 * Returns a StoredTokenPayload on success.
 */
export async function exchangeCode(
  code: string,
  request: AuthSession.AuthRequest,
  discovery: AuthSession.DiscoveryDocument
): Promise<StoredTokenPayload> {
  const redirectUri = buildRedirectUri();
  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: oidcConfig.clientId,
      code,
      redirectUri,
      extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
    },
    { tokenEndpoint: discovery.tokenEndpoint! }
  );
  return toStoredPayload(tokenResponse);
}

/**
 * Refresh an access token using a refresh token.
 * Returns an updated StoredTokenPayload or null if refresh fails.
 */
export async function refreshTokens(
  payload: StoredTokenPayload,
  discovery: AuthSession.DiscoveryDocument
): Promise<StoredTokenPayload | null> {
  if (!payload.refreshToken || !discovery.tokenEndpoint) return null;
  try {
    const tokenResponse = await AuthSession.refreshAsync(
      {
        clientId: oidcConfig.clientId,
        refreshToken: payload.refreshToken,
      },
      { tokenEndpoint: discovery.tokenEndpoint }
    );
    return toStoredPayload(tokenResponse);
  } catch {
    return null;
  }
}

/**
 * Check whether the stored token is still fresh (not expired within margin).
 */
export function isTokenFresh(payload: StoredTokenPayload, secondsMargin = 60): boolean {
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

/**
 * Build the provider end-session URL when supported.
 * Returns null if neither the override nor discovery endpoint is available.
 */
export function buildEndSessionUrl(
  idToken: string | undefined,
  discovery: AuthSession.DiscoveryDocument,
  postLogoutRedirectUri?: string
): string | null {
  const endpoint =
    oidcConfig.endSessionEndpointOverride ||
    (discovery as { end_session_endpoint?: string }).end_session_endpoint;

  if (!endpoint) return null;

  const url = new URL(endpoint);
  if (idToken) url.searchParams.set('id_token_hint', idToken);
  if (postLogoutRedirectUri)
    url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);

  return url.toString();
}

/**
 * Open the provider end-session URL in the browser (best-effort).
 */
export async function performEndSession(
  idToken: string | undefined,
  discovery: AuthSession.DiscoveryDocument
): Promise<void> {
  const url = buildEndSessionUrl(idToken, discovery);
  if (!url) return;
  try {
    await WebBrowser.openAuthSessionAsync(url, buildRedirectUri());
  } catch {
    // Best-effort
  }
}
