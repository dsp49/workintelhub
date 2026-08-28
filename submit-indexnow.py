#!/usr/bin/env python
"""Push every sitemap URL to IndexNow.

IndexNow is a ping: Bing, Yandex, Seznam and Naver accept a list of URLs and
crawl them without waiting to rediscover the site. Google does not participate,
so Search Console still has to be done by hand, but this is the fastest route
into Bing, and Bing is what backs DuckDuckGo and ChatGPT search.

    python submit-indexnow.py            submit every URL in sitemap.xml
    python submit-indexnow.py --dry-run  print what would be sent
"""
import io
import os
import sys
import json
import urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.abspath(__file__))
HOST = "workintelhub.com"
ENDPOINT = "https://api.indexnow.org/indexnow"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def key():
    for f in os.listdir(ROOT):
        if len(f) == 36 and f.endswith(".txt") and all(c in "0123456789abcdef" for c in f[:32]):
            return f[:32]
    raise SystemExit("no IndexNow key file found in the site root")


def urls():
    tree = ET.parse(os.path.join(ROOT, "sitemap.xml"))
    return [e.text.strip() for e in tree.getroot().findall(".//s:loc", NS)]


def main():
    k = key()
    u = urls()
    payload = {
        "host": HOST,
        "key": k,
        "keyLocation": "https://%s/%s.txt" % (HOST, k),
        "urlList": u,
    }
    print("host      : %s" % HOST)
    print("key file  : %s" % payload["keyLocation"])
    print("urls      : %d" % len(u))

    if "--dry-run" in sys.argv:
        for x in u[:5]:
            print("   %s" % x)
        print("   ... dry run, nothing sent")
        return 0

    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(ENDPOINT, data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            code = r.status
            text = r.read().decode("utf-8", "replace")[:300]
    except urllib.error.HTTPError as e:
        code = e.code
        text = e.read().decode("utf-8", "replace")[:300]

    print("response  : HTTP %s %s" % (code, text))
    # 200 accepted, 202 accepted but key not yet verified
    if code in (200, 202):
        print("submitted. Bing and Yandex will crawl from here.")
        return 0
    print("not accepted. Check that the key file is live at the URL above.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
