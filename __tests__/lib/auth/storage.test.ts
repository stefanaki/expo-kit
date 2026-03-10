/**
 * Unit tests for lib/auth/storage — SecureStore persistence helpers.
 *
 * expo-secure-store is mocked globally in jest.setup.js. Per-test return
 * values are controlled with mockResolvedValueOnce / mockRejectedValueOnce.
 */
import * as SecureStore from 'expo-secure-store';

import { clearTokenPayload, loadTokenPayload, saveTokenPayload } from '@/lib/auth';
import { makeTokenPayload } from '../../fixtures/auth';

const mockGet = SecureStore.getItemAsync as jest.Mock;
const mockSet = SecureStore.setItemAsync as jest.Mock;
const mockDelete = SecureStore.deleteItemAsync as jest.Mock;

beforeEach(() => jest.clearAllMocks());

describe('saveTokenPayload', () => {
  it('serialises the payload to JSON and writes to SecureStore', async () => {
    const payload = makeTokenPayload();
    mockSet.mockResolvedValueOnce(undefined);

    await saveTokenPayload(payload);

    expect(mockSet).toHaveBeenCalledTimes(1);
    const [key, value] = mockSet.mock.calls[0];
    expect(key).toBe('oidc_token_payload');
    expect(JSON.parse(value)).toEqual(payload);
  });
});

describe('loadTokenPayload', () => {
  it('returns null when nothing is stored', async () => {
    mockGet.mockResolvedValueOnce(null);

    const result = await loadTokenPayload();

    expect(result).toBeNull();
  });

  it('returns the parsed payload when a valid value is stored', async () => {
    const payload = makeTokenPayload();
    mockGet.mockResolvedValueOnce(JSON.stringify(payload));

    const result = await loadTokenPayload();

    expect(result).toEqual(payload);
  });

  it('returns null when the stored value is corrupt JSON', async () => {
    mockGet.mockResolvedValueOnce('not-valid-json{{{');

    const result = await loadTokenPayload();

    expect(result).toBeNull();
  });
});

describe('clearTokenPayload', () => {
  it('calls SecureStore.deleteItemAsync with the correct key', async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    await clearTokenPayload();

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith('oidc_token_payload');
  });
});
