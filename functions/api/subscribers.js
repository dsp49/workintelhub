/**
 * GET /api/subscribers
 *
 * Reads the subscriber list. This is personal data, so it is behind a token
 * that lives only in ADMIN_TOKEN on the Cloudflare side.
 *
 *   Authorization: Bearer <ADMIN_TOKEN>
 *
 * ?format=csv returns a download instead of JSON.
 * ?limit=N    caps rows, default 1000, max 10000.
 *
 * Worth knowing: a bearer token is the floor, not the ceiling. Putting
 * Cloudflare Access in front of /admin/* gives real SSO and an audit trail,
 * and costs nothing for a handful of users. See docs/subscribe-setup.md.
 */

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

// Compare every character even after a mismatch, so how long the answer takes
// says nothing about how much of the token was right.
function tokensMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const csvCell = (value) => {
  const s = value == null ? "" : String(value);
  // A leading =, +, - or @ makes Excel treat the cell as a formula. Prefix a
  // quote so an address someone chose cannot execute in a spreadsheet.
  const safe = /^[=+\-@]/.test(s) ? "'" + s : s;
  return '"' + safe.replace(/"/g, '""') + '"';
};

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ ok: false, error: "Use GET." }, 405);
  }

  if (!env.ADMIN_TOKEN) {
    console.error("ADMIN_TOKEN is not set");
    return json({ ok: false, error: "Not available." }, 503);
  }

  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!tokensMatch(token, env.ADMIN_TOKEN)) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  if (!env.DB) {
    console.error("D1 binding DB is not set");
    return json({ ok: false, error: "Not available." }, 503);
  }

  const url = new URL(request.url);
  const asked = parseInt(url.searchParams.get("limit") || "1000", 10);
  const limit = Number.isFinite(asked) ? Math.min(Math.max(asked, 1), 10000) : 1000;

  let rows;
  try {
    const out = await env.DB.prepare(
      `SELECT email, name, page, tag, country, created_at
         FROM subscribers
        ORDER BY created_at DESC
        LIMIT ?1`
    )
      .bind(limit)
      .all();
    rows = out.results || [];
  } catch (err) {
    console.error("d1 select failed:", err && err.message);
    return json({ ok: false, error: "Query failed." }, 502);
  }

  if (url.searchParams.get("format") === "csv") {
    const head = ["email", "name", "page", "tag", "country", "created_at"];
    const body = [head.join(",")]
      .concat(rows.map((r) => head.map((k) => csvCell(r[k])).join(",")))
      .join("\r\n");
    return new Response(body, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="subscribers.csv"',
        "cache-control": "no-store",
      },
    });
  }

  return json({ ok: true, count: rows.length, subscribers: rows });
}
