/**
 * OIDC configuration module.
 * Reads from EXPO_PUBLIC_ env vars so values are embedded at build time.
 * Required: EXPO_PUBLIC_OIDC_ISSUER, EXPO_PUBLIC_OIDC_CLIENT_ID
 * Optional: EXPO_PUBLIC_OIDC_SCOPES, EXPO_PUBLIC_OIDC_AUDIENCE
 */

const issuer = process.env.EXPO_PUBLIC_OIDC_ISSUER;
const clientId = process.env.EXPO_PUBLIC_OIDC_CLIENT_ID;

if (!issuer) {
  console.warn('[OIDC] EXPO_PUBLIC_OIDC_ISSUER is not set. Auth will not work.');
}
if (!clientId) {
  console.warn('[OIDC] EXPO_PUBLIC_OIDC_CLIENT_ID is not set. Auth will not work.');
}

const rawScopes = process.env.EXPO_PUBLIC_OIDC_SCOPES ?? 'openid profile email';

export const oidcConfig = {
  issuer: issuer ?? '',
  clientId: clientId ?? '',
  scopes: rawScopes.split(/[\s,]+/).filter(Boolean),
  audience: process.env.EXPO_PUBLIC_OIDC_AUDIENCE,
} as const;

export type OidcConfig = typeof oidcConfig;
