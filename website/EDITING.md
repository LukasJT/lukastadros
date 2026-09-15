# Editing the website

Open `/admin` and sign in with the ChatGPT account that owns this site. The owner sees an **Edit site** link on each page.

- Expand Page text to edit headings, biography, introductions, and empty-state messages.
- Upload a portrait or photos for coursework, projects, and travel albums. Add a description for each photo. The portrait caption is in Page text → Home.
- Add a destination with its latitude and longitude to create a travel pin. Add photos to its album.
- Select **Save changes** to apply the edits to the website. Uploads are staged until you save. Removing an image from a page unlinks it; its stored file is retained.
- **View site** opens a separate tab. Refresh that tab after saving.
- If another editor tab saved first, the server rejects the stale update instead of overwriting it. Your unsaved draft remains in the editor.

Text and media metadata live in D1; photos live in R2. Redeployments do not replace edited content. JPEG, PNG, and WebP inputs up to 25 MB are resized to 2400px and re-encoded on the device; the upload API accepts at most 10 MB.

## Authorization and operations

The server checks the dispatch-authenticated, site-scoped user ID against `ADMIN_USER_ID` on every write and protects writes with an exact `SITE_ORIGIN` check. Never put owner credentials or secrets in source. At first sign-in, the verified email must match OWNER_EMAIL (provisioned from the Sites owner record); the site-scoped ID is then pinned in owner_identity. Other visitors cannot claim ownership. With neither an explicit owner ID nor a pinned identity nor a provisioned owner email, editing is denied. The site access policy remains unchanged. `/api/session` returns only the currently signed-in user's ID for owner provisioning; it cannot assign privileges.

Production needs `DB`, `PHOTOS`, `SITE_ORIGIN`, and either `ADMIN_USER_ID` or the initial `OWNER_EMAIL`. Schema migrations under `drizzle/` must remain append-only after deployment. Local development uses its own credentials and storage; do not reuse production identity locally.

Run `node --test tests/content.test.mjs`, `npx tsc --noEmit`, and `npm run build` to validate changes. Optional WebMCP read/stage tools feature-detect browser support and never publish changes automatically.

