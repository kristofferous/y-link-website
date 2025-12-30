import json
import os
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


SITEMAP_URL = os.environ.get("SITEMAP_URL", "https://www.y-link.no/sitemap.xml")
SITE_PROPERTY = os.environ.get("GC_SITE_URL", "sc-domain:y-link.no")
API_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"


def load_env_from_local(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def fetch_sitemap_urls(sitemap_url: str) -> list[str]:
    with urllib.request.urlopen(sitemap_url) as response:
        content = response.read()
    root = ET.fromstring(content)
    namespace = ""
    if root.tag.startswith("{"):
        namespace = root.tag.split("}")[0].strip("{")
    ns = {"ns": namespace} if namespace else {}
    urls = []
    for loc in root.findall(".//ns:loc" if namespace else ".//loc", ns):
        if loc.text:
            urls.append(loc.text.strip())
    return urls


def filter_content_urls(urls: list[str]) -> list[str]:
    filtered = []
    for url in urls:
        path = urllib.parse.urlparse(url).path.rstrip("/")
        if path.startswith("/guides/") or path.startswith("/blog/"):
            filtered.append(url)
    return sorted(set(filtered))


def inspect_url(access_token: str, inspection_url: str, site_url: str) -> dict:
    payload = {
        "inspectionUrl": inspection_url,
        "siteUrl": site_url,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_ENDPOINT,
        data=data,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    load_env_from_local(Path(".env.local"))
    access_token = os.environ.get("GC_ACCESS_TOKEN")
    if not access_token:
        raise SystemExit("Missing GC_ACCESS_TOKEN in environment or .env.local")

    urls = fetch_sitemap_urls(SITEMAP_URL)
    targets = filter_content_urls(urls)
    print(f"Found {len(targets)} guide/blog URLs in sitemap.")

    for index, url in enumerate(targets, start=1):
        try:
            inspect_url(access_token, url, SITE_PROPERTY)
            print(f"[{index}/{len(targets)}] inspected: {url}")
        except Exception as exc:
            print(f"[{index}/{len(targets)}] failed: {url} ({exc})")
        time.sleep(0.2)


if __name__ == "__main__":
    main()
