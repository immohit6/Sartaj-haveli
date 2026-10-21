# Sartaj Royal Group website

Plain static site (no build step). Netlify serves the files in this folder as they are.

- `index.html` and the venue, packages, gallery and contact pages are the public site.
- `admin/index.html` is the owner-only admin (sign-in through Supabase).
- `supabase-config.js` holds the public Supabase URL and anon key (safe to be public).
- Day-to-day content (prices, photos, phone, menu, dates) is edited in `/admin` and lives in Supabase, not in this repo.
