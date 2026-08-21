/**
 * POST /api/subscribe
 *
 * Takes the homepage subscribe form and appends the address to a Google Sheet.
 *
 * The browser never talks to Google directly. It posts here, and this function
 * forwards to the Apps Script webhook using a URL held in an environment
 * variable. That keeps the webhook out of public JavaScript, lets validation run
 * somewhere a visitor cannot edit, and avoids the CORS problems Apps Script has.
 *
 * Set SHEETS_WEBHOOK_URL in the Cloudflare Pages dashboard:
 *   Settings -> Environment variables -> Production (and Preview)
 * See docs/subscribe-setup.md for the Apps Script side.
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

  const email = String(payload.email || "").trim().toLowerCase();
  const honeypot = String(payload.website || "").trim();

  // Bots fill every field they find. A human never sees this one, so anything
  // in it means automation. Answer as if it worked rather than teaching the bot
  // what tripped it.
  if (honeypot) return json({ ok: true });

  if (!EMAIL.test(email) || email.length > 254) {
    return json({ ok: false, error: "That does not look like an email address." }, 400);
  }

  if (!env.SHEETS_WEBHOOK_URL) {
    // Misconfiguration, not the visitor's fault. Never imply the signup worked.
    console.error("SHEETS_WEBHOOK_URL is not set");
    return json({ ok: false, error: "Signups are not available right now." }, 503);
  }

  const record = {
    // The Apps Script web app has to accept unauthenticated requests, so this
    // shared secret is what stops a stranger who finds the URL writing rows.
    secret: env.SHEETS_SECRET || "",
    email,
    created_at: new Date().toISOString(),
    source: String(payload.source || "").slice(0, 200),
    country: request.headers.get("cf-ipcountry") || "",
  };

  try {
    const res = await fetch(env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("sheet webhook returned", res.status);
      return json({ ok: false, error: "Could not save that. Please try again." }, 502);
    }
    // Apps Script answers 200 even when it refuses, so the body is the real
    // status. Without this a wrong secret would look like a successful signup.
    const result = await res.json().catch(() => null);
    if (!result || result.ok !== true) {
      console.error("sheet webhook rejected:", result && result.error);
      return json({ ok: false, error: "Could not save that. Please try again." }, 502);
    }
  } catch (err) {
    console.error("sheet webhook failed:", err && err.message);
    return json({ ok: false, error: "Could not save that. Please try again." }, 502);
  }

  return json({ ok: true });
}
