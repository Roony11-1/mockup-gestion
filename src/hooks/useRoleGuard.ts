import { useEffect, useMemo } from 'react';
import { useSession } from './useSession';
import type { Role } from '../lib/types';

/**
 * Client-side guard for this static prototype. The original project has no
 * backend; session and role checks have always been enforced in the browser.
 * Operations are also validated inside the data store, not only in the UI.
 */
export function useRoleGuard(allowedRoles: Role[]) {
  const { session, loading } = useSession();
  const allowedKey = allowedRoles.join('|');

  const allowedSet = useMemo(() => new Set(allowedKey.split('|') as Role[]), [allowedKey]);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      const reason = encodeURIComponent('sesion');
      window.location.replace(`/?motivo=${reason}`);
    }
  }, [loading, session]);

  if (loading) {
    return { session: null, loading: true, denied: false };
  }

  if (!session) {
    return { session: null, loading: true, denied: false };
  }

  return { session, loading: false, denied: !allowedSet.has(session.role) };
}
