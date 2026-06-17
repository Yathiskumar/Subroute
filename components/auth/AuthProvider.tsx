"use client";

import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthState = {
  user: User | null;
  session: Session | null;
  /** false until the first auth check resolves — avoids UI flicker. */
  loading: boolean;
  /** true when env vars are missing, i.e. auth isn't configured. */
  disabled: boolean;
};

const AuthContext = React.createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  disabled: true,
});

export function useAuth() {
  return React.useContext(AuthContext);
}

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(CONFIGURED);

  React.useEffect(() => {
    if (!CONFIGURED) return;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = React.useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      disabled: !CONFIGURED,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
