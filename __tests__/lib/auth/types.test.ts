/**
 * Unit tests for lib/auth/types helpers.
 *
 * Focuses on parseIdTokenClaims, which splits and base64url-decodes a JWT
 * payload without network calls or crypto.
 */
import { parseIdTokenClaims, toStoredPayload } from '@/lib/auth';

// Minimal fixture helpers — intentionally not re-using fixtures/auth.ts so
// these tests have zero external dependencies.
function makeIdToken(claims: Record<string, unknown>): string {
  const encode = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${encode({ alg: 'none' })}.${encode(claims)}.sig`;
}

describe('parseIdTokenClaims', () => {
  it('extracts sub, name, email and picture from a valid id_token', () => {
    const token = makeIdToken({
      sub: 'user-123',
      name: 'Alice',
      email: 'alice@example.com',
      picture: 'https://example.com/avatar.png',
    });

    const claims = parseIdTokenClaims(token);

    expect(claims).toEqual({
      sub: 'user-123',
      name: 'Alice',
      email: 'alice@example.com',
      picture: 'https://example.com/avatar.png',
    });
  });

  it('returns a result with only sub when optional claims are absent', () => {
    const token = makeIdToken({ sub: 'user-456' });

    const claims = parseIdTokenClaims(token);

    expect(claims?.sub).toBe('user-456');
    expect(claims?.name).toBeUndefined();
    expect(claims?.email).toBeUndefined();
  });

  it('returns null when the token has fewer than 3 parts', () => {
    expect(parseIdTokenClaims('only.two')).toBeNull();
    expect(parseIdTokenClaims('one')).toBeNull();
  });

  it('returns null when the payload is not valid JSON', () => {
    // Header.notBase64JSON.sig
    expect(parseIdTokenClaims('header.!!!.sig')).toBeNull();
  });

  it('returns null when sub is missing from the payload', () => {
    const token = makeIdToken({ email: 'no-sub@example.com' });

    expect(parseIdTokenClaims(token)).toBeNull();
  });
});

describe('toStoredPayload', () => {
  it('maps all TokenResponse fields to StoredTokenPayload', () => {
    const fakeToken = {
      accessToken: 'acc',
      refreshToken: 'ref',
      idToken: 'id',
      expiresIn: 3600,
      issuedAt: 1000000,
      tokenType: 'Bearer',
      scope: 'openid',
    } as any;

    const payload = toStoredPayload(fakeToken);

    expect(payload.accessToken).toBe('acc');
    expect(payload.refreshToken).toBe('ref');
    expect(payload.idToken).toBe('id');
    expect(payload.expiresIn).toBe(3600);
    expect(payload.issuedAt).toBe(1000000);
    expect(payload.tokenType).toBe('Bearer');
    expect(payload.scope).toBe('openid');
  });

  it('stores undefined for optional fields that are null on the response', () => {
    const fakeToken = {
      accessToken: 'acc',
      refreshToken: null,
      idToken: null,
      expiresIn: null,
      issuedAt: 1000000,
      tokenType: 'Bearer',
      scope: null,
    } as any;

    const payload = toStoredPayload(fakeToken);

    expect(payload.refreshToken).toBeUndefined();
    expect(payload.idToken).toBeUndefined();
    expect(payload.expiresIn).toBeUndefined();
    expect(payload.scope).toBeUndefined();
  });
});
