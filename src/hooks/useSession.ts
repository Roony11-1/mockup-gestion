import { useEffect, useState } from 'react';
import { getSession } from '../lib/session';
import type { Session } from '../lib/types';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
  }, []);

  return { session, loading };
}
