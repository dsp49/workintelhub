# Subscribe form: Cloudflare D1 setup

The subscribe form posts to `/api/subscribe`, which writes one row to a D1
database. `/api/subscribers` reads the list back, and `/admin/subscribers` is a
small page that shows it and exports CSV.

---

## How this deploys, and why it was broken

**workintelhub is a Worker with static assets, not a Pages project.** That one
fact explains why `/api/subscribe` answered 404 for months while every static
page served fine: a `functions/` directory is a *Pages* convention. On a Worker
it is just a folder, never routed, never executed.

So the routing Pages would have done by filename is explicit here:

| File | Role |
|---|---|
| `src/worker.js` | entry point; maps `/api/*` to the handlers, everything else to `env.ASSETS` |
| `functions/api/*.js` | the handlers, unchanged, imported and bundled into the Worker |
| `wrangler.jsonc` | `main`, the assets config, and the `DB` binding |
| `.assetsignore` | keeps source, tooling and docs from being served as files |

`run_worker_first: ["/api/*"]` in `wrangler.jsonc` is load-bearing. Without it
the asset handler answers first and `/api/*` 404s before the Worker sees it.

`.assetsignore` listing `functions` is also load-bearing: the asset directory is
the repo root, so without it the handler source would be publicly fetchable
rather than executed.

---

## 1. The database

Already created: name `workintelhub`, ID
`72c88f3f-bac5-4d02-9471-27eea0595398`, with the `subscribers` table in place.
It is bound as `DB` in `wrangler.jsonc`, so there is nothing to click in the
dashboard.

The schema lives in
[`migrations/0001_create_subscribers.sql`](../migrations/0001_create_subscribers.sql).
To reapply it:

```
npx wrangler d1 execute workintelhub --remote --file=./migrations/0001_create_subscribers.sql
```

---

## 2. The admin token

`ADMIN_TOKEN` is a **secret**, so it is not in `wrangler.jsonc` and must never
be committed. Generate one:

```
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Set it either in the dashboard, **Workers & Pages -> workintelhub -> Settings
-> Variables and Secrets -> Add -> Secret**, or from a terminal:

```
npx wrangler secret put ADMIN_TOKEN
```

Save the value somewhere. It is unreadable once stored.

---

## 3. Deploy

Pushing to `main` deploys, through the Worker's git integration. To deploy by
hand instead:

```
npx wrangler deploy
```

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
