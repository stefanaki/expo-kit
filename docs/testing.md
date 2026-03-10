# Testing Conventions

## Stack

| Tool                                                                                       | Role                                               |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| [Jest 29](https://jestjs.io)                                                               | Test runner                                        |
| [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo)                     | Expo preset, transforms RN modules                 |
| [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/) | Component queries and user-event helpers           |
| [expo-router/testing-library](https://docs.expo.dev/router/reference/testing/)             | `renderRouter` for integration-level routing tests |

## Scripts

```sh
pnpm test            # watch mode (local dev)
pnpm test:ci         # non-watch, clean exit (CI)
pnpm test:coverage   # coverage report → coverage/ (git-ignored)
```

## File Organization

```
__tests__/
  setup.tsx            ← shared renderWithProviders + createTestQueryClient
  fixtures/
    auth.ts            ← makeTokenPayload(), makeExpiredTokenPayload()
  integration/
    navigation.test.tsx
  store/
    auth-store.test.ts

components/
  ui/
    __tests__/
      button.test.tsx  ← colocated component test
```

**Rules:**

- Test files must end with `.test.ts(x)` or `.spec.ts(x)` to be collected.
- Never put test files inside `app/` — all files there are treated as routes.
- Use the root `__tests__/` for cross-cutting integration and store tests.
- Colocate component unit tests in a `__tests__/` sibling directory.

## Path Aliases

`@/` and `@tests/` resolve correctly in both app code and tests:

```ts
import { renderWithProviders } from '@tests/setup';
import { Button } from '@/components/ui/button';
```

## Three Test Patterns

Auth note: ID token claims in store are kept as a generic object (`Record<string, unknown>`). Assert specific keys only after runtime checks, matching app usage.

### 1. Component unit test (colocated)

```tsx
// components/ui/__tests__/my-component.test.tsx
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '@tests/setup';
import { MyComponent } from '@/components/ui/my-component';

describe('<MyComponent />', () => {
  it('does the thing', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('expected text')).toBeTruthy();
  });
});
```

- Use `renderWithProviders` to get QueryClient + ThemeProvider automatically.
- Assert on text, roles, or `testID`s — never on class strings or inline styles.
- Prefer `fireEvent` for interactions; avoid snapshot tests on Uniwind components.

### 2. Expo Router integration test

```tsx
// __tests__/integration/some-flow.test.tsx
import { renderRouter, screen } from 'expo-router/testing-library';
import { Slot } from 'expo-router';

function MockLayout() {
  return <Slot />;
}
function MockScreen() {
  return <Text>content</Text>;
}

it('navigates to the right route', () => {
  renderRouter(
    { '(group)/_layout': MockLayout, '(group)/screen': MockScreen },
    { initialUrl: '/screen' }
  );
  expect(screen).toHavePathname('/screen');
  expect(screen.getByText('content')).toBeTruthy();
});
```

- **Layouts must render `<Slot />`** so child routes mount inside them.
- Seed Zustand state before the test via `useAuthStore.setState(...)` and clean up in `afterEach`.
- Assert pathnames with `toHavePathname`, `toHavePathnameWithParams`, or `toHaveSegments`.

### 3. Store / logic unit test

```ts
// __tests__/store/some-store.test.ts
import { act } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/lib/auth';
import { makeTokenPayload } from '../fixtures/auth';

const mockGetItem = SecureStore.getItemAsync as jest.Mock;

beforeEach(() => {
  useAuthStore.setState({ status: 'loading', session: null, user: null, error: null });
  jest.clearAllMocks();
});

it('hydrates to authenticated when a token exists', async () => {
  mockGetItem.mockResolvedValueOnce(JSON.stringify(makeTokenPayload()));
  await act(async () => {
    await useAuthStore.getState().hydrate();
  });
  expect(useAuthStore.getState().status).toBe('authenticated');
});
```

- Always **reset Zustand state** in `beforeEach` using `setState`.
- Always call **`jest.clearAllMocks()`** to prevent mock bleeding between tests.
- Wrap async store actions in `act(async () => { ... })`.

## Mocks (globally registered in `jest.setup.js`)

| Module                            | Behaviour                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `expo-secure-store`               | `getItemAsync` returns `null`; all functions are jest mocks                            |
| `expo-location`                   | Returns a granted permission and `{ 0, 0 }` coordinates                                |
| `expo-crypto`                     | `randomUUID` returns `'test-uuid-1234'`; `digestStringAsync` returns `'mocked-digest'` |
| `@maplibre/maplibre-react-native` | All components render as empty native elements                                         |
| `react-native-safe-area-context`  | Insets are all zero; `SafeAreaProvider`/`SafeAreaListener` pass children through       |
| `@rn-primitives/portal`           | `PortalHost` is a no-op; `Portal` passes children through                              |
| `uniwind`                         | `Uniwind.setTheme` and `Uniwind.updateInsets` are jest mocks                           |

Override any mock for a specific test with `mockResolvedValueOnce` / `mockReturnValueOnce`.

## Coverage

No threshold is enforced at this stage — run `pnpm test:coverage` to inspect
the report. The `coverage/` directory is git-ignored. Add thresholds to
`jest.config.js` under `coverageThreshold` when baseline coverage is established.

## What we don't test here

- **E2E flows** (Maestro / Detox) — handled separately.
- **Snapshot tests** on Uniwind-styled components — prefer behavior assertions.
- **CI workflow** — add `test:ci` to your pipeline script; no extra config needed.
