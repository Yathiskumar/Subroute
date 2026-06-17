"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

type Provider = "github" | "google";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.01 3.25 9.26 7.76 10.76.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.16.69-3.83-1.34-3.83-1.34-.51-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.72-1.52-2.52-.29-5.18-1.26-5.18-5.62 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.13 1.17.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.17-1.48 3.12-1.17 3.12-1.17.62 1.57.23 2.73.12 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.67 5.33-5.2 5.61.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .3.21.66.79.55 4.51-1.5 7.75-5.75 7.75-10.76C23.33 5.57 18.27.5 12 .5z"
      />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.96h5.27c-.23 1.4-1.62 4.1-5.27 4.1-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.78 3.55 14.74 2.6 12.18 2.6 6.92 2.6 2.66 6.86 2.66 12.1s4.26 9.5 9.52 9.5c5.5 0 9.13-3.86 9.13-9.3 0-.62-.07-1.1-.16-1.6z"
      />
    </svg>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const hadError = searchParams.get("error") === "auth";

  const [pending, setPending] = React.useState<Provider | "email" | null>(null);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    hadError ? "Something went wrong signing you in. Please try again." : null,
  );

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : undefined;

  const signInWith = async (provider: Provider) => {
    setError(null);
    setPending(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setError(error.message);
      setPending(null);
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending("email");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setError(error.message);
      setPending(null);
      return;
    }
    setSent(true);
    setPending(null);
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-surface-elevated p-6 text-center">
        <Mail className="mx-auto mb-3 h-8 w-8 text-accent" />
        <p className="text-sm text-foreground">
          Check <span className="font-medium">{email}</span> for a sign-in link.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  const btn =
    "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface disabled:opacity-60";

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => signInWith("github")}
          disabled={pending !== null}
          className={btn}
        >
          {pending === "github" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GithubIcon className="h-4 w-4" />
          )}
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={() => signInWith("google")}
          disabled={pending !== null}
          className={btn}
        >
          {pending === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-xs uppercase tracking-wide text-muted">or</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>

      <form onSubmit={signInWithEmail} className="space-y-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending !== null || !email}
          className={cn(btn, "bg-accent/10 hover:bg-accent/15")}
        >
          {pending === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Email me a sign-in link
        </button>
      </form>

      <p className="pt-2 text-center text-xs text-muted">
        We only use your account to save learning progress.
      </p>
    </div>
  );
}
