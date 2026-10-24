# Subscribe form: Cloudflare D1 setup

The subscribe form posts to `/api/subscribe`, a Cloudflare Pages Function, which
writes one row to a D1 database. D1 is Cloudflare's SQLite, on the same account
that already serves the site, so there is no third party, no shared secret and
no extra network hop.

`/api/subscribers` reads the list back, and `/admin/subscribers` is a small page
that shows it and exports CSV.

---

## 0. First: make Functions actually deploy

**This is the step that was missing.** `/api/subscribe` returned 404 on the live
site even though `functions/api/subscribe.js` was committed, which means the
Pages project was not building Functions at all. Check this before anything
else, or the rest of the setup will look correct and still not work.

In **Pages -> workintelhub -> Settings -> Builds & deployments**:

- The project must be **connected to the GitHub repo**, not Direct Upload. A
  Direct Upload project never builds Functions.
- **Root directory** must be empty or `/`. If it points at a subfolder,
  Cloudflare looks for `functions/` inside that subfolder and finds nothing.
- **Build output directory** must be `/` (this site has no build step that
  emits to `dist`).

Then redeploy and confirm:

```
curl -i https://workintelhub.com/api/subscribe
```

**405** with `{"ok":false,"error":"Use POST."}` means Functions are live.
**404** means they still are not, and nothing below will help yet.

---

## 1. Create the database

**Workers & Pages -> D1 -> Create database**, name it `workintelhub`.

Open it, go to the **Console** tab, and paste the contents of
[`migrations/0001_create_subscribers.sql`](../migrations/0001_create_subscribers.sql).
Run it once. That creates the `subscribers` table and its index.

Or from a terminal, if you use Wrangler:

```
npx wrangler d1 execute workintelhub --remote --file=./migrations/0001_create_subscribers.sql
```

---

## 2. Bind it to the site

**Pages -> workintelhub -> Settings -> Functions -> D1 database bindings**.
Add, for **Production** and **Preview**:

| Variable name | D1 database |
|---|---|
| `DB` | `workintelhub` |

The variable name must be exactly `DB`; that is what the function reads.

---

## 3. Set the admin token

Generate a long random string:

```
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Settings -> Environment variables**, add to **Production** and **Preview**,
marked **encrypted**:

| Name | Value |
|---|---|
| `ADMIN_TOKEN` | the random string |

**Redeploy.** Bindings and variables are read at request time, but an existing
deployment does not pick up newly added ones until it is rebuilt.

---

## 4. Check it

```
curl -X POST https://workintelhub.com/api/subscribe \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","name":"Test","page":"/","tag":"manual"}'
```

Expect `{"ok":true}`. Run it twice: the second is also `{"ok":true}` but adds no
row, because `email` is UNIQUE and the insert is `ON CONFLICT DO NOTHING`.

Then the failure path:

```
curl -X POST https://workintelhub.com/api/subscribe \
  -H "content-type: application/json" -d '{"email":"nope"}'
```

Expect **400** and `{"ok":false,"error":"invalid_email"}`.

And reading back:

```
curl https://workintelhub.com/api/subscribers \
  -H "authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Viewing the list

Open **https://workintelhub.com/admin/subscribers**, paste the admin token, and
the list loads newest first with a **Download CSV** button. The token is kept in
`sessionStorage`, so it is gone when the tab closes.

The page is `noindex`, disallowed in `robots.txt`, and served `no-store`. It is
not linked from anywhere on the site.

### Worth doing: put Cloudflare Access in front of it

A bearer token is the floor. Anyone who gets the string gets the whole list, and
there is no audit trail. **Zero Trust -> Access -> Applications**, add a
self-hosted application for `workintelhub.com/admin/*`, policy "emails match
your address". That gives real login and an access log, and is free at this
scale. The token check stays as defence in depth.

---

## What gets stored

| Column | Source |
|---|---|
| `email` | the form, lower-cased, UNIQUE |
| `name` | the form, optional |
| `page` | `location.pathname` the signup came from |
| `tag` | the hidden topic tag already on each form |
| `country` | Cloudflare's `cf-ipcountry` header |
| `created_at` | server time, ISO 8601 UTC |

The name field is optional on purpose. A required name costs signups, and an
address with no name is still a subscriber.

---

## What this still does not do

D1 stores addresses. It does not send email, and there is no unsubscribe. Before
sending anything to this list you need:

- **Double opt-in.** A signup is recorded immediately, so anyone can enter
  someone else's address. A confirmation click fixes that.
- **An unsubscribe link in every email**, plus a physical postal address. Both
  are required by CAN-SPAM in the US.
- **SPF, DKIM and DMARC** on the sending domain, or the mail lands in spam.

Most of that comes free with an email service such as Buttondown or Kit. D1 is
the right place to *collect* addresses; it is not a sending platform.

---

## Where the data lives

Addresses sit in D1 on the Cloudflare account that serves the site. Fewer
parties than the old Google Sheet setup, but the obligations are the same:

- Anyone with access to the Cloudflare account can read the whole list.
- Anyone with `ADMIN_TOKEN` can read the whole list.
- The privacy policy names who processes this data; keep it accurate.
- Delete addresses on request:
  `DELETE FROM subscribers WHERE email = 'someone@example.com';`
