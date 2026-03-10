# Expo Kit

An Expo Router starter kit for building production-ready React Native apps (iOS and Android) with a modular feature architecture, OIDC authentication, i18n, typed UI primitives, map support, and a practical testing setup.

## Highlights

- Expo SDK 55 + React Native 0.83 + React 19
- File-based routing with Expo Router
- OIDC auth flow (Authorization Code + PKCE) via `expo-auth-session`
- Global auth/session state with Zustand + SecureStore persistence
- Server state with TanStack Query + Axios API client
- Localized UI with i18next (`en`, `el`) and locale formatting helpers
- Reusable UI primitives (`button`, `input`, `card`, `label`, `text`, `map`)
- Native map integration via MapLibre
- Jest + Testing Library + Expo Router integration tests

## Tech Stack

- Runtime: Expo, React Native, Expo Router
- State/Data: Zustand, TanStack Query, Axios
- Styling: Tailwind v4 + Uniwind + class-variance-authority
- Auth: expo-auth-session, expo-secure-store
- Localization: i18next, react-i18next, expo-localization, date-fns
- Maps: @maplibre/maplibre-react-native
- Testing: Jest, jest-expo, @testing-library/react-native, expo-router/testing-library

## Project Structure

```text
app/                         # Expo Router screens and layouts
  (auth)/                    # Login flow
  (tabs)/                    # Home, details, settings
  (stack)/                   # Additional stack screens
components/
  ui/                        # Reusable design-system primitives
config/                      # App-wide config (i18n, OIDC, query client)
features/
  map/                       # Map feature and marker demo UI
  tasks/                     # Feature module (types/repository/store/components)
i18n/                        # Translation resources (en, el)
lib/
  api/                       # Axios client and auth header interceptor
  auth/                      # OIDC helpers, store, token types, storage
  locale/                    # Locale detection + format utilities
  theme-context.tsx          # Light/dark/system theme state
__tests__/                   # Integration, store, auth, shared test setup
docs/                        # Focused docs (auth, features, testing)
```

## Routing Overview

- `/(tabs)/index`: home screen with navigation entry points
- `/(tabs)/details`: guarded screen showing the MapLibre marker example
- `/(tabs)/settings`: theme controls, account state, locale formatting samples, sign out
- `/(stack)/new-screen`: tasks list backed by React Query
- `/(auth)/login`: OIDC sign-in screen

Guarded routes redirect unauthenticated users to `/(auth)/login` and preserve a `returnTo` destination.

## Authentication (OIDC)

The app uses a provider-agnostic OIDC implementation with Authorization Code + PKCE.

Core modules:

- `config/openid-connect.ts`: environment-driven OIDC config
- `lib/auth/oidc.ts`: discovery, auth request, code exchange, refresh, revocation helpers
- `lib/auth/store.ts`: auth state machine, hydration, sign-in/sign-out, refresh-if-needed
- `lib/auth/storage.ts`: token payload persistence in SecureStore

### Required environment variables

Copy `.env.example` to `.env.local` and set:

- `EXPO_PUBLIC_OIDC_ISSUER`
- `EXPO_PUBLIC_OIDC_CLIENT_ID`

Optional:

- `EXPO_PUBLIC_OIDC_SCOPES` (default: `openid profile email`)
- `EXPO_PUBLIC_OIDC_AUDIENCE`

See `docs/auth.md` for provider setup notes and redirect URI allowlist details.

## API/Data Layer

- `lib/api/index.ts` configures `apiClient` with:
  - `EXPO_PUBLIC_API_BASE_URL` as base URL (warns when unset)
  - JSON defaults and request timeout
  - Automatic `Authorization: Bearer <token>` header from auth store
- `features/tasks/repository.ts` demonstrates feature-level query/mutation hooks.
  - Current demo endpoints target JSONPlaceholder `/todos`.

## Feature Module Pattern

Each feature follows a consistent module boundary:

- `types.ts`: DTOs/contracts
- `repository.ts`: query/mutation hooks (server I/O)
- `store.ts`: UI-only local state (Zustand)
- `components/`: presentational components
- `index.ts`: barrel exports

See `docs/features.md` for conventions and examples.

## Localization

- i18n is initialized in `config/i18n.ts`.
- Resources live in `i18n/en.ts` and `i18n/el.ts`.
- Locale utilities in `lib/locale` provide:
  - language normalization
  - date/relative time formatting
  - number/currency/percentage formatting

`app/_layout.tsx` wires locale bootstrap on startup.

## Theming and Styling

- Global tokens are in `global.css`.
- Theme mode (`light` / `dark` / `system`) is managed by `lib/theme-context.tsx`.
- Uniwind theme and safe-area insets are synchronized in `app/_layout.tsx`.
- UI components use `class-variance-authority` variants and utility merging via `lib/utils.ts`.

## Maps

- `components/ui/map.tsx` exposes composable map primitives:
  - `Map`, `MapMarker`, `MapControls`, `MapRoute`, `MapUserLocation`
- `features/map/components/layer-markers-example.tsx` is the map demo used in `/(tabs)/details`.

## Testing

Test stack and conventions are documented in `docs/testing.md`.

Key points:

- `jest-expo` preset with global mocks in `jest.setup.js`
- `@tests/*` and `@/*` aliases available in tests
- `app/` is ignored by Jest test collection (to avoid route-file conflicts)
- Integration tests cover navigation and auth guards
- Store and auth utility tests validate token/session behavior

Run tests with:

```sh
pnpm test
pnpm test:ci
pnpm test:coverage
```

## Getting Started

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure environment

```sh
cp .env.example .env.local
```

Fill in your OIDC provider values.

### 3. Start the app

```sh
pnpm start
```

Useful platform commands:

```sh
pnpm ios
pnpm android
pnpm start:dev-client
```

## Quality Commands

```sh
pnpm lint
pnpm format
pnpm test:ci
```

## EAS Build Profiles

`eas.json` includes three profiles:

- `development` (dev client, internal distribution)
- `preview` (internal distribution)
- `production` (auto increment enabled)

Use scripts:

```sh
pnpm build:dev
pnpm build:preview
pnpm build:prod
```

## Notes

- Native directories (`ios/`, `android/`) are present for custom native workflows.
- A number of examples (tasks API, map markers) are intentionally demo-oriented and ready to be replaced with product-specific integrations.
