/**
 * Expo Router integration test — tab navigation.
 *
 * Pattern: use renderRouter with inline mock routes; assert on the active
 * pathname and visible screen content. Auth store is seeded via setState.
 */
import { renderRouter, screen } from 'expo-router/testing-library';
import { act } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { Text, View } from 'react-native';

import { useAuthStore } from '@/store/auth-store';
import { makeTokenPayload } from '../fixtures/auth';

function MockIndex() {
  return (
    <View>
      <Text>Home Tab</Text>
    </View>
  );
}

function MockDetails() {
  return (
    <View>
      <Text>Details Tab</Text>
    </View>
  );
}

function MockSettings() {
  return (
    <View>
      <Text>Settings Tab</Text>
    </View>
  );
}

// Layout must render <Slot /> so child routes are mounted inside it.
function MockTabLayout() {
  return <Slot />;
}

describe('Tab navigation', () => {
  beforeEach(() => {
    // Seed authenticated state so protected routes are reachable.
    act(() => {
      useAuthStore.setState({
        status: 'authenticated',
        session: makeTokenPayload(),
        user: { sub: 'test-user-id', name: 'Test User', email: 'test@example.com' },
        error: null,
      });
    });
  });

  afterEach(() => {
    act(() => {
      useAuthStore.setState({
        status: 'unauthenticated',
        session: null,
        user: null,
        error: null,
      });
    });
  });

  it('renders the index route at / by default', async () => {
    renderRouter(
      {
        '(tabs)/_layout': MockTabLayout,
        '(tabs)/index': MockIndex,
        '(tabs)/details': MockDetails,
        '(tabs)/settings': MockSettings,
      },
      { initialUrl: '/' }
    );

    expect(screen).toHavePathname('/');
  });

  it('can navigate directly to the details route', async () => {
    renderRouter(
      {
        '(tabs)/_layout': MockTabLayout,
        '(tabs)/index': MockIndex,
        '(tabs)/details': MockDetails,
        '(tabs)/settings': MockSettings,
      },
      { initialUrl: '/details' }
    );

    expect(screen).toHavePathname('/details');
    expect(screen.getByText('Details Tab')).toBeTruthy();
  });
});
