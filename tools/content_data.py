"""Shared standard-library helpers for the repository's content tools."""

import hashlib
import json
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def question_fingerprint(question):
    payload = {key: question[key] for key in ("question", "options")}
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def outside_fences(text):
    """Return prose lines; code examples should not be treated as Markdown links."""
    marker = None
    for line in text.splitlines():
        match = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if match:
            if marker is None:
                marker = match[1]
            elif match[1][0] == marker[0] and len(match[1]) >= len(marker) and not match[2].strip():
                marker = None
            continue
        if marker is None:
            yield line


def heading_slug(heading):
    return re.sub(r"[^\w\- ]", "", heading.lower().replace("`", "")).replace(" ", "-")


def markdown_anchors(text):
    headings = [line.lstrip("# ") for line in outside_fences(text) if re.match(r"^#{1,6} ", line)]
    anchors = set(re.findall(r'<a\s+id=["\']([^"\']+)', text))
    seen = {}
    for heading in headings:
        base = heading_slug(heading)
        suffix = seen.get(base, 0)
        anchors.add(base if suffix == 0 else f"{base}-{suffix}")
        seen[base] = suffix + 1
    return anchors


def teaching_lines(text):
    """Exclude document preamble, headings, and navigation-only contents sections."""
    started = False
    contents = False
    fence = None
    for line in text.splitlines():
        match = re.match(r"^\s*(`{3,}|~{3,})(.*)$", line)
        if match and started and not contents:
            if fence is None:
                fence = match[1]
            elif match[1][0] == fence[0] and len(match[1]) >= len(fence) and not match[2].strip():
                fence = None
        if fence is None and re.match(r"^#{1,6} ", line):
            if line.startswith("## "):
                started = True
                contents = line[3:].strip().lower() in {"contents", "table of contents"}
            continue
        if started and not contents and line.strip():
            yield line.strip()
