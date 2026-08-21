# Subscribe form: Google Sheet setup

The homepage form posts to `/api/subscribe`, a Cloudflare Pages Function, which
forwards the address to a Google Apps Script webhook that appends a row to a
Sheet. The browser never sees the webhook URL.

Three steps. Ten minutes.

---

## 1. Create the Sheet

New Google Sheet, name it something like `workintelhub subscribers`.

Put these headers in row 1, in this order:

| A | B | C | D |
|---|---|---|---|
| email | created_at | source | country |

The script writes columns in that order, so do not rearrange them.

---

## 2. Add the Apps Script

Two ways to get here, and either works because the script opens the Sheet by ID
rather than relying on being attached to one:

- From the Sheet: **Extensions -> Apps Script**
- Or standalone: **script.google.com -> New project**

Delete whatever is in `Code.gs` and paste this in full.

```js
/**
 * workintelhub subscribe endpoint.
 * Appends one subscriber per request to the first sheet of the target Sheet.
 */

const SHARED_SECRET = 'CHANGE-ME-TO-A-LONG-RANDOM-STRING';

// From your Sheet URL, the part between /d/ and /edit:
// https://docs.google.com/spreadsheets/d/THIS-PART-HERE/edit
const SHEET_ID = 'PASTE-YOUR-SHEET-ID-HERE';


function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply({ ok: false, error: 'no body' });
    }

    const body = JSON.parse(e.postData.contents);

    // The web app must accept unauthenticated requests, so this is what stops
    // a stranger who finds the URL writing rows.
    if (body.secret !== SHARED_SECRET) {
      return reply({ ok: false, error: 'forbidden' });
    }

    const email = String(body.email || '').trim().toLowerCase();
    if (!email || email.indexOf('@') < 1) {
      return reply({ ok: false, error: 'bad email' });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    // Skip duplicates rather than collecting the same address twice.
    // Read only the rows that exist: getRange('A2:A') would pull a million
    // empty cells on every request.
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).trim().toLowerCase() === email) {
          return reply({ ok: true, duplicate: true });
        }
      }
    }

    sheet.appendRow([
      email,
      body.created_at || new Date().toISOString(),
      body.source || '',
      body.country || ''
    ]);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}


// Opening the web app URL in a browser sends a GET. Answer something sensible
// instead of an error page, but never reveal anything about the sheet.
function doGet() {
  return reply({ ok: false, error: 'This endpoint accepts POST only.' });
}


function reply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Change `SHARED_SECRET` to a long random string. Generate one however you like,
for example in a terminal:

```
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Then **Deploy -> New deployment**:

- Type: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**

"Anyone" sounds alarming but is required: Cloudflare calls it without a Google
login. The shared secret is what actually protects it, which is why it must not
be guessable.

Copy the **Web app URL**. It looks like
`https://script.google.com/macros/s/AKfy.../exec`.

---

## 3. Tell Cloudflare about it

In the Cloudflare dashboard: **Pages -> workintelhub -> Settings ->
Environment variables**. Add to **Production** and **Preview**:

| Name | Value |
|---|---|
| `SHEETS_WEBHOOK_URL` | the Apps Script Web app URL |
| `SHEETS_SECRET` | the same random string you put in the script |

Mark both as **encrypted**. Redeploy for them to take effect: environment
variables are read at request time, but an existing deployment will not pick up
newly added variables until it is rebuilt.

---

## Testing

After deploying, from any terminal:

```
curl -X POST https://workintelhub.com/api/subscribe \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","source":"manual test"}'
```

Expect `{"ok":true}` and a new row in the Sheet. Then check the failure path:

```
curl -X POST https://workintelhub.com/api/subscribe \
  -H "content-type: application/json" \
  -d '{"email":"not-an-email"}'
```

Expect a 400 and `{"ok":false,"error":"That does not look like an email address."}`.

---

## What this does not do

A Sheet stores addresses. It does not send email, and it has no unsubscribe
mechanism. Before sending anything to this list you still need:

- **Double opt-in.** Right now a signup is recorded immediately, so anyone can
  enter someone else's address. A confirmation click fixes that.
- **An unsubscribe link in every email**, plus a physical postal address. Both
  are required by CAN-SPAM in the US.
- **SPF, DKIM, and DMARC** on the sending domain, or the mail lands in spam.

Most of that arrives free with an email service such as Buttondown or Kit, which
would also replace this whole setup. Worth revisiting once the list is worth
sending to.

---

## Where the data lives

Addresses sit in a Google Sheet on a personal Google account. That has
consequences worth being deliberate about:

- Anyone with access to that Google account can read the whole list.
- Sharing the Sheet link shares the personal data of everyone on it.
- Google is a data processor for it, which the privacy policy names.

Keep the Sheet private, do not share it more widely than needed, and delete
addresses on request.
