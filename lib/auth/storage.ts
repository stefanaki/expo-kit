import { TokenResponseConfig } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'oidc_token_payload';

export async function saveTokenPayload(payload: TokenResponseConfig): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(payload));
}

export async function loadTokenPayload(): Promise<TokenResponseConfig | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TokenResponseConfig;
  } catch {
    return null;
  }
}

export async function clearTokenPayload(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
