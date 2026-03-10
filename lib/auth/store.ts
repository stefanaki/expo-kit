import * as AuthSession from 'expo-auth-session';
import { create } from 'zustand';

import { isTokenFresh, refreshTokens, revokeToken } from '@/lib/auth/oidc';
import { clearTokenPayload, loadTokenPayload, saveTokenPayload } from '@/lib/auth/storage';
import { parseIdTokenClaims, toStoredPayload } from '@/lib/auth/types';
import type { AuthStatus, StoredTokenPayload, UserClaims } from '@/lib/auth/types';

interface AuthState {
  status: AuthStatus;
  session: StoredTokenPayload | null;
  user: UserClaims | null;
  error: string | null;

  /** Hydrate stored session from SecureStore on app start. */
  hydrate: () => Promise<void>;

  /** Persist a newly obtained token payload and update state. */
  signIn: (payload: StoredTokenPayload) => Promise<void>;

  /** Revoke tokens (best-effort), clear storage, reset state. */
  signOut: (discovery?: AuthSession.DiscoveryDocument | null) => Promise<void>;

  /** Refresh the access token if it is near expiry. */
  refreshIfNeeded: (discovery: AuthSession.DiscoveryDocument) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  session: null,
  user: null,
  error: null,

  hydrate: async () => {
    try {
      const payload = await loadTokenPayload();
      if (!payload) {
        set({ status: 'unauthenticated', session: null, user: null });
        return;
      }
      const user = payload.idToken ? parseIdTokenClaims(payload.idToken) : null;
      set({ status: 'authenticated', session: payload, user });
    } catch {
      set({ status: 'unauthenticated', session: null, user: null });
    }
  },

  signIn: async (payload) => {
    await saveTokenPayload(payload);
    const user = payload.idToken ? parseIdTokenClaims(payload.idToken) : null;
    set({ status: 'authenticated', session: payload, user, error: null });
  },

  signOut: async (discovery) => {
    const { session } = get();

    // Best-effort token revocation
    if (discovery && session) {
      if (session.refreshToken) {
        await revokeToken(session.refreshToken, 'refresh_token', discovery);
      }
      await revokeToken(session.accessToken, 'access_token', discovery);
    }

    await clearTokenPayload();
    set({ status: 'unauthenticated', session: null, user: null, error: null });
  },

  refreshIfNeeded: async (discovery) => {
    const { session } = get();
    if (!session) return;
    if (isTokenFresh(session)) return;

    const updated = await refreshTokens(session, discovery);
    if (updated) {
      await saveTokenPayload(updated);
      const user = updated.idToken ? parseIdTokenClaims(updated.idToken) : get().user;
      set({ session: updated, user });
    } else {
      // Refresh failed — treat as signed out
      await clearTokenPayload();
      set({ status: 'unauthenticated', session: null, user: null });
    }
  },

  /** Persist a raw TokenResponse (convenience wrapper used by login screen). */
  signInWithTokenResponse: async (tokenResponse: AuthSession.TokenResponse) => {
    const payload = toStoredPayload(tokenResponse);
    await get().signIn(payload);
  },
}));
