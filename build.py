#!/usr/bin/env python
"""
build.py -- inject the shared header and footer into every page.

Why a build step and not a JavaScript include:
    This is a static site. If the header and footer were fetched with JavaScript,
    crawlers would see an empty nav on first render and the internal links in the
    footer would stop passing signal reliably. A build step keeps the shipped HTML
    fully static while still giving us one place to edit.

Usage:
    python build.py          rebuild every page from partials/
    python build.py --check  report which pages are out of date, change nothing

Edit partials/header.html and partials/footer.html, then run this before committing.

Path tokens available inside the partials:
    {{BASE}}       ""             at root, "../" inside blogs/
    {{HOME}}       ""             on index.html, "index.html" on other root pages,
                                  "../index.html" inside blogs/
    {{HOME_HREF}}  "/"            everywhere, the logo link
"""
import io
import os
import re
import sys
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))
START = "<!-- BUILD:%s -->"
END = "<!-- /BUILD:%s -->"


def read(path):
    with io.open(path, encoding="utf-8") as fh:
        return fh.read()


def write(path, text):
    with io.open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(text)


def pages():
    out = [os.path.join(ROOT, f) for f in
           ("index.html", "404.html", "about.html", "editorial-policy.html",
            "contact.html", "privacy-policy.html", "terms.html")]
    out += sorted(glob.glob(os.path.join(ROOT, "blogs", "*.html")))
    out += sorted(glob.glob(os.path.join(ROOT, "topics", "*.html")))
    return [p for p in out if os.path.exists(p)]


def tokens_for(path):
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    in_sub = "/" in rel
    is_index = rel == "index.html"
    return {
        "{{BASE}}": "../" if in_sub else "",
        "{{HOME}}": "../index.html" if in_sub else ("" if is_index else "index.html"),
        "{{HOME_HREF}}": "/",
    }


def render(partial_text, path):
    out = partial_text
    for token, value in tokens_for(path).items():
        out = out.replace(token, value)
    return out.rstrip("\n")


def block(name, body):
    return "%s\n%s\n%s" % (START % name, body, END % name)


def splice(html, name, rendered, fallback_pattern):
    """Replace an existing BUILD block, or first-time-wrap the raw element."""
    marked = re.compile(
        re.escape(START % name) + r".*?" + re.escape(END % name), re.S)
    new = block(name, rendered)
    if marked.search(html):
        return marked.sub(lambda _: new, html, count=1), "updated"
    m = re.search(fallback_pattern, html, re.S)
    if m:
        return html[:m.start()] + new + html[m.end():], "wrapped"
    return html, "MISSING"


def main():
    check = "--check" in sys.argv
    header = read(os.path.join(ROOT, "partials", "header.html"))
    footer = read(os.path.join(ROOT, "partials", "footer.html"))

    changed, stale, missing = 0, [], []
    for path in pages():
        original = read(path)
        html = original
        html, h_state = splice(html, "header", render(header, path),
                               r'<header class="site-header">.*?</header>')
        html, f_state = splice(html, "footer", render(footer, path),
                               r'<footer class="site-footer">.*?</footer>')
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        if "MISSING" in (h_state, f_state):
            missing.append("%s (header=%s footer=%s)" % (rel, h_state, f_state))
        if html != original:
            stale.append(rel)
            if not check:
                write(path, html)
                changed += 1

    total = len(pages())
    if check:
        print("checked %d pages" % total)
        print("out of date: %s" % (", ".join(stale) if stale else "none"))
    else:
        print("built %d of %d pages" % (changed, total))
    if missing:
        print("COULD NOT PLACE BLOCK:")
        for m in missing:
            print("  " + m)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
