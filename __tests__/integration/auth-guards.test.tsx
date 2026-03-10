/**
 * Integration tests — authentication route guards.
 *
 * Tests that protected routes redirect to the login screen when the user is
 * unauthenticated, and render their content when authenticated.
 *
 * Pattern: seed Zustand auth state, render via renderRouter with lightweight
 * guard components that replicate the production guard logic exactly, then
 * assert on the resulting pathname.
 */
import { act } from '@testing-library/react-native';
import { Slot, useRouter } from 'expo-router';
import { renderRouter, screen } from 'expo-router/testing-library';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { useAuthStore } from '@/lib/auth';
import { makeTokenPayload } from '../fixtures/auth';

// ─── Minimal inline replicas of the production guard logic ───────────────────
// These mirror the useEffect + early-return pattern in details.tsx and
// new-screen.tsx without importing their heavy UI dependencies.

function GuardedDetails() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login?returnTo=%2F(tabs)%2Fdetails' as any);
    }
  }, [router, status]);

  if (status !== 'authenticated') return null;

  return (
    <View>
      <Text>Details Content</Text>
    </View>
  );
}

function GuardedNewScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login?returnTo=%2F(stack)%2Fnew-screen' as any);
    }
  }, [router, status]);

  if (status !== 'authenticated') return null;

  return (
    <View>
      <Text>New Screen Content</Text>
    </View>
  );
}

function MockLogin() {
  return (
    <View>
      <Text>Sign in</Text>
    </View>
  );
}

function MockLayout() {
  return <Slot />;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setUnauthenticated() {
  useAuthStore.setState({ status: 'unauthenticated', session: null, user: null, error: null });
}

function setAuthenticated() {
  useAuthStore.setState({
    status: 'authenticated',
    session: makeTokenPayload(),
    user: { sub: 'test-user', name: 'Test User', email: 'test@example.com' },
    error: null,
  });
}

const routes = {
  _layout: MockLayout,
  '(tabs)/_layout': MockLayout,
  '(tabs)/details': GuardedDetails,
  '(stack)/_layout': MockLayout,
  '(stack)/new-screen': GuardedNewScreen,
  '(auth)/_layout': MockLayout,
  '(auth)/login': MockLogin,
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Auth route guards', () => {
  afterEach(() => {
    setUnauthenticated();
  });

  describe('Details screen /(tabs)/details', () => {
    it('redirects to login when unauthenticated', async () => {
      setUnauthenticated();

      renderRouter(routes, { initialUrl: '/details' });

      await screen.findByText('Sign in');
      expect(screen).toHavePathname('/login');
    });

    it('renders content when authenticated', async () => {
      setAuthenticated();

      renderRouter(routes, { initialUrl: '/details' });

      await act(async () => {});

      expect(screen).toHavePathname('/details');
      expect(screen.getByText('Details Content')).toBeTruthy();
    });
  });

  describe('New Screen /(stack)/new-screen', () => {
    it('redirects to login when unauthenticated', async () => {
      setUnauthenticated();

      renderRouter(routes, { initialUrl: '/new-screen' });

      await screen.findByText('Sign in');
      expect(screen).toHavePathname('/login');
    });

    it('renders content when authenticated', async () => {
      setAuthenticated();

      renderRouter(routes, { initialUrl: '/new-screen' });

      await act(async () => {});

      expect(screen).toHavePathname('/new-screen');
      expect(screen.getByText('New Screen Content')).toBeTruthy();
    });
  });

  describe('Post-login return target', () => {
    it('encodes the details returnTo param in the redirect URL', async () => {
      setUnauthenticated();

      renderRouter(routes, { initialUrl: '/details' });

      await screen.findByText('Sign in');
      // The redirect URL should contain the encoded return path
      expect(screen.toJSON()).toBeTruthy();
      expect(screen).toHavePathname('/login');
      // Search param is part of the URL — verify via the rendered pathname search
      expect(screen).toHaveSearchParams(expect.objectContaining({ returnTo: '/(tabs)/details' }));
    });
  });
});
