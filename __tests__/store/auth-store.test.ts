/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Auth store unit tests — hydration and sign-in/sign-out flows.
 *
 * Pattern: mock `expo-secure-store` at the module level (done in jest.setup.js),
 * then control return values per-test with mockResolvedValue. Reset Zustand
 * state before each test with setState to keep tests independent.
 */
import { act } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';

import { useAuthStore } from '@/lib/auth';
import { makeTokenPayload, makeExpiredTokenPayload, MOCK_USER_CLAIMS } from '../fixtures/auth';

const mockGetItem = SecureStore.getItemAsync as jest.Mock;
const mockSetItem = SecureStore.setItemAsync as jest.Mock;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.Mock;

function resetStore() {
  useAuthStore.setState({
    status: 'loading',
    session: null,
    user: null,
    error: null,
  });
}

describe('useAuthStore', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  describe('hydrate()', () => {
    it('sets status to unauthenticated when no token is stored', async () => {
      mockGetItem.mockResolvedValueOnce(null);

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().status).toBe('unauthenticated');
      expect(useAuthStore.getState().session).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('sets status to authenticated when a valid token is stored', async () => {
      const payload = makeTokenPayload();
      mockGetItem.mockResolvedValueOnce(JSON.stringify(payload));

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      const state = useAuthStore.getState();
      expect(state.status).toBe('authenticated');
      expect(state.session?.accessToken).toBe(payload.accessToken);
      expect(state.user?.sub).toBe(MOCK_USER_CLAIMS.sub);
      expect(state.user?.email).toBe(MOCK_USER_CLAIMS.email);
    });

    it('sets status to unauthenticated when SecureStore throws', async () => {
      mockGetItem.mockRejectedValueOnce(new Error('SecureStore unavailable'));

      await act(async () => {
        await useAuthStore.getState().hydrate();
      });

      expect(useAuthStore.getState().status).toBe('unauthenticated');
    });
  });

  describe('signIn()', () => {
    it('persists the payload and marks state as authenticated', async () => {
      const payload = makeTokenPayload();
      mockSetItem.mockResolvedValueOnce(undefined);

      await act(async () => {
        await useAuthStore.getState().signIn(payload);
      });

      expect(mockSetItem).toHaveBeenCalledTimes(1);
      const state = useAuthStore.getState();
      expect(state.status).toBe('authenticated');
      expect(state.session).toEqual(payload);
      expect(state.user?.sub).toBe(MOCK_USER_CLAIMS.sub);
    });
  });

  describe('signOut()', () => {
    it('clears storage and resets state to unauthenticated', async () => {
      // Start from an authenticated state.
      const payload = makeTokenPayload();
      useAuthStore.setState({
        status: 'authenticated',
        session: payload,
        user: { sub: MOCK_USER_CLAIMS.sub },
        error: null,
      });

      mockDeleteItem.mockResolvedValueOnce(undefined);

      await act(async () => {
        // Pass null discovery to skip provider end-session calls.
        await useAuthStore.getState().signOut(null);
      });

      expect(mockDeleteItem).toHaveBeenCalledTimes(1);
      const state = useAuthStore.getState();
      expect(state.status).toBe('unauthenticated');
      expect(state.session).toBeNull();
      expect(state.user).toBeNull();
    });
  });

  describe('refreshIfNeeded()', () => {
    it('does nothing when there is no session', async () => {
      const mockDiscovery = {} as any;
      await act(async () => {
        await useAuthStore.getState().refreshIfNeeded(mockDiscovery);
      });
      // No calls to SecureStore — nothing to refresh.
      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it('does nothing when the token is still fresh', async () => {
      const payload = makeTokenPayload({ issuedAt: Math.floor(Date.now() / 1000) });
      useAuthStore.setState({ status: 'authenticated', session: payload, user: null, error: null });

      const mockDiscovery = {} as any;
      await act(async () => {
        await useAuthStore.getState().refreshIfNeeded(mockDiscovery);
      });

      expect(mockSetItem).not.toHaveBeenCalled();
    });

    it('updates session when the token is expired and refresh succeeds', async () => {
      const expiredPayload = makeExpiredTokenPayload();
      useAuthStore.setState({
        status: 'authenticated',
        session: expiredPayload,
        user: { sub: MOCK_USER_CLAIMS.sub },
        error: null,
      });

      const freshPayload = makeTokenPayload({ accessToken: 'refreshed-access-token' });
      const oidcModule = require('@/lib/auth/oidc');
      jest.spyOn(oidcModule, 'isTokenFresh').mockReturnValueOnce(false);
      jest.spyOn(oidcModule, 'refreshTokens').mockResolvedValueOnce(freshPayload);
      mockSetItem.mockResolvedValueOnce(undefined);

      const mockDiscovery = { tokenEndpoint: 'https://example.com/token' } as any;
      await act(async () => {
        await useAuthStore.getState().refreshIfNeeded(mockDiscovery);
      });

      expect(mockSetItem).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState().session?.accessToken).toBe('refreshed-access-token');
      expect(useAuthStore.getState().status).toBe('authenticated');

      jest.restoreAllMocks();
    });

    it('signs out when the token is expired and refresh fails', async () => {
      const expiredPayload = makeExpiredTokenPayload();
      useAuthStore.setState({
        status: 'authenticated',
        session: expiredPayload,
        user: { sub: MOCK_USER_CLAIMS.sub },
        error: null,
      });

      const oidcModule = require('@/lib/auth/oidc');
      jest.spyOn(oidcModule, 'isTokenFresh').mockReturnValueOnce(false);
      jest.spyOn(oidcModule, 'refreshTokens').mockResolvedValueOnce(null);
      mockDeleteItem.mockResolvedValueOnce(undefined);

      const mockDiscovery = { tokenEndpoint: 'https://example.com/token' } as any;
      await act(async () => {
        await useAuthStore.getState().refreshIfNeeded(mockDiscovery);
      });

      expect(mockDeleteItem).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState().status).toBe('unauthenticated');
      expect(useAuthStore.getState().session).toBeNull();

      jest.restoreAllMocks();
    });
  });
});
