# OIDC Authentication Setup

This app uses provider-agnostic OpenID Connect (Authorization Code + PKCE) via `expo-auth-session`.

## Required environment variables

Copy `.env.example` to `.env.local` and fill in your values:

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_OIDC_ISSUER` | ✅ | OIDC issuer base URL (e.g. `https://accounts.example.com`) |
| `EXPO_PUBLIC_OIDC_CLIENT_ID` | ✅ | Public client ID registered with your provider |
| `EXPO_PUBLIC_OIDC_SCOPES` | optional | Space/comma-separated scopes. Default: `openid profile email` |
| `EXPO_PUBLIC_OIDC_AUDIENCE` | optional | Audience for providers that require it (e.g. Auth0 APIs) |

## Redirect URI allowlist

You must register the following URIs as allowed redirect/callback URLs with your OIDC provider:

| Platform | URI |
|---|---|
| Native (dev build / production) | `my-expo-app://auth/callback` |
| Expo Go | `exp://127.0.0.1:8081/--/auth/callback` |

The scheme `my-expo-app` comes from the `expo.scheme` field in [app.json](app.json).

## Provider setup notes

- **Auth0**: Create a _Native_ application. Add the URIs above to "Allowed Callback URLs".
- **Keycloak**: Create a _public_ client with Standard Flow enabled. Add the URIs to "Valid Redirect URIs".
- **Generic OIDC**: Ensure the provider supports Authorization Code + PKCE for public clients.

## Guarded routes

The following routes redirect to `/(auth)/login` when unauthenticated, and restore the original destination after sign-in:

- `/(tabs)/details`
- `/(stack)/new-screen`

Logout is available from `/(tabs)/settings`. It always clears local tokens and performs best-effort token revocation when discovery data is available.

> **Note**: Sign-out is local to the app. The user's provider session may remain active.
