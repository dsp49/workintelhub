"""Normalize vendor homepage screenshots to a uniform 1280x640 (2:1) card image.

Reads any PNG/JPG dropped into images/tools/screenshots/_inbox/ (named <slug>.png)
and writes 1280x640 WebPs to images/tools/screenshots/.

Filenames do not need to be exact. Anything containing the tool name is matched, so
"Screenshot ActivTrak 2026.png" and "activtrak.png" both work. Files that match nothing
are reported rather than guessed at.

Crop rule: keep the top of the page (that is where the hero lives). If the source is
wider than 2:1, trim the sides evenly instead so nothing at the top is lost.
"""
import os, sys, glob
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "images", "tools", "screenshots")
INBOX = os.path.join(OUT, "_inbox")
TARGET_W, TARGET_H = 1280, 640
RATIO = TARGET_W / TARGET_H

SLUGS = ["activtrak", "connecteam", "controlio", "desktime", "intelogos",
         "monitask", "prodoscore", "timechamp", "veriato", "webwork"]


def normalize(src, dest):
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", im.size, "white")
        im = im.convert("RGBA")
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")

    # Full-window browser captures carry chrome we do not want on the page: a
    # scrollbar down the right edge, and sometimes a link tooltip in a bottom
    # corner. Shave those off before framing.
    w, h = im.size
    if w >= 1700:
        im = im.crop((0, 0, w - 20, h - 44))

    w, h = im.size
    if w / h > RATIO:
        # too wide: trim the sides evenly, keep full height
        new_w = int(round(h * RATIO))
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        # too tall: keep the top
        new_h = int(round(w / RATIO))
        im = im.crop((0, 0, w, new_h))

    im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    im.save(dest, "WEBP", quality=82, method=6)
    return im.size


ALIASES = {
    "activtrak": ["activtrak", "activ trak"],
    "connecteam": ["connecteam", "connect team"],
    "controlio": ["controlio"],
    "desktime": ["desktime", "desk time"],
    "timechamp": ["timechamp", "time champ"],
    "intelogos": ["intelogos"],
    "monitask": ["monitask"],
    "prodoscore": ["prodoscore"],
    "veriato": ["veriato"],
    "webwork": ["webwork", "web work", "webwork tracker"],
}


def slug_for(filename):
    """Guess the tool from a filename, however the screenshot tool named it."""
    key = os.path.splitext(os.path.basename(filename))[0].lower()
    key = "".join(c if c.isalnum() else " " for c in key)
    flat = key.replace(" ", "")
    for slug, names in ALIASES.items():
        for n in names:
            if n.replace(" ", "") in flat:
                return slug
    return None


def main():
    os.makedirs(INBOX, exist_ok=True)
    sources = [f for f in sorted(glob.glob(os.path.join(INBOX, "*")))
               if os.path.splitext(f)[1].lower() in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp")]

    claimed, unmatched = {}, []
    for f in sources:
        slug = slug_for(f)
        if slug and slug not in claimed:
            claimed[slug] = f
        elif slug:
            unmatched.append((f, "duplicate of %s" % slug))
        else:
            unmatched.append((f, "name matches no tool"))

    done, missing = [], []
    for slug in SLUGS:
        if slug in claimed:
            src = claimed[slug]
            normalize(src, os.path.join(OUT, slug + ".webp"))
            kb = os.path.getsize(os.path.join(OUT, slug + ".webp")) // 1024
            done.append((slug, "%s -> %d KB" % (os.path.basename(src), kb)))
        elif os.path.exists(os.path.join(OUT, slug + ".webp")):
            done.append((slug, "already normalized"))
        else:
            missing.append(slug)

    for slug, note in done:
        print("  OK        %-12s %s" % (slug, note))
    for slug in missing:
        print("  MISSING   %-12s" % slug)
    for f, why in unmatched:
        print("  UNMATCHED %-12s %s (%s)" % ("", os.path.basename(f), why))

    print("")
    print("%d of %d ready" % (len(done), len(SLUGS)))
    if unmatched:
        print("%d file(s) could not be matched by name. Leave them in _inbox and ask" % len(unmatched))
        print("Claude to identify them, or rename them after the tool they show.")
    return 0 if not missing else 1


if __name__ == "__main__":
    sys.exit(main())
