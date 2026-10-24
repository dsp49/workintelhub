/**
 * POST /api/subscribe
 *
 * Stores one newsletter subscriber in the D1 database bound as DB.
 *
 * Previously this forwarded to a Google Apps Script webhook that appended to a
 * Sheet. D1 removes the third party, the shared secret and the extra network
 * hop: the database is on the same account as the site and the write happens
 * in the same request.
 *
 * Bind the database in the Cloudflare dashboard:
 *   Pages -> workintelhub -> Settings -> Functions -> D1 database bindings
 *   Variable name: DB
 * See docs/subscribe-setup.md.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

// Trim to a sane length before anything reaches the database. These come
// straight from a form, so treat every one of them as hostile.
const clean = (value, max) => String(value == null ? "" : value).trim().slice(0, max);

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Use POST." }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  const email = clean(payload.email, 254).toLowerCase();
  const honeypot = clean(payload.website, 100);

  // Bots fill every field they find. A human never sees this one, so anything
  // in it means automation. Answer as if it worked rather than teaching the bot
  // what tripped it.
  if (honeypot) return json({ ok: true });

  if (!EMAIL.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  if (!env.DB) {
    // Misconfiguration, not the visitor's fault. Never imply the signup worked.
    console.error("D1 binding DB is not set");
    return json({ ok: false, error: "Signups are not available right now." }, 503);
  }

  // The page is sent by the client, so it is a hint rather than a fact. Keep
  // only a same-site path and drop anything that tries to be a URL.
  let page = clean(payload.page, 200);
  if (!page.startsWith("/") || page.startsWith("//")) page = "";

  try {
    await env.DB.prepare(
      `INSERT INTO subscribers (email, name, page, tag, country, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(email) DO NOTHING`
    )
      .bind(
        email,
        clean(payload.name, 100) || null,
        page || null,
        clean(payload.tag, 60) || null,
        request.headers.get("cf-ipcountry") || null,
        new Date().toISOString()
      )
      .run();
  } catch (err) {
    console.error("d1 insert failed:", err && err.message);
    return json({ ok: false, error: "Could not save that. Please try again." }, 502);
  }

  // A repeat signup inserts nothing and still answers ok. Telling the visitor
  // their address was already on the list would confirm it to anyone probing.
  return json({ ok: true });
}
