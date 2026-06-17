# Authentication & progress sync — setup

The app works with **no** auth configured: progress stays in `localStorage` and
no "Sign in" button appears. Adding the env vars below switches on sign-in and
cloud sync — completed topics then follow the user across devices.

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. Once created, open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy `.env.local.example` to `.env.local` and paste both values.

## 2. Create the progress table

Open **SQL Editor** in Supabase, paste the contents of
`supabase/migrations/0001_progress.sql`, and run it. This creates the
`progress` table with row-level security (each user sees only their own rows).

## 3. Set redirect URLs

In **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (and your production URL)
- **Redirect URLs**: add
  - `http://localhost:3000/auth/callback`
  - `https://YOUR-DOMAIN/auth/callback`

## 4. Enable providers (Authentication → Providers)

### GitHub

1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**.
2. **Authorization callback URL**:
   `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Paste the Client ID + secret into Supabase's GitHub provider and enable it.

### Google

1. Google Cloud Console → **APIs & Services → Credentials → OAuth client ID**
   (type: Web application).
2. **Authorized redirect URI**:
   `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Paste the Client ID + secret into Supabase's Google provider and enable it.

### Email magic link

Enabled by default. Supabase's built-in email sender is rate-limited and fine
for testing; for production add your own SMTP under **Project Settings → Auth →
SMTP**.

## 5. Run it

```bash
pnpm dev
```

Visit `/login`, sign in, and toggle a topic complete — it'll persist to the
`progress` table. Sign in on another device to see the same progress.

## How sync works

`localStorage` stays the single source the UI reads. `components/progress/
ProgressSync.tsx` mirrors it to Supabase: on sign-in it pulls cloud rows and
**unions** them with local progress (nothing is lost), then every later change
is pushed as a delta. See `lib/utils/roadmap-progress.ts` for the storage
format.
