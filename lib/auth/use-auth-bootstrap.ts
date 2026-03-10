import { useEffect } from 'react';

import { useAuthStore } from '@/lib/auth/store';

/**
 * Call once in the root layout to hydrate the auth store from secure storage.
 */
export function useAuthBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
