import { useEffect } from 'react';

import { maybeCompleteAuthSession } from '@/lib/auth/oidc';
import { useAuthStore } from '@/lib/auth/store';

// Close web popup on mount (no-op on native).
maybeCompleteAuthSession();

/**
 * Call once in the root layout to hydrate the auth store from secure storage
 * and to handle web popup completion.
 */
export function useAuthBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
