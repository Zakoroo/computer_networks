#!/usr/bin/env python3
"""Report known source-format findings and fail on changed/new content findings."""

import argparse
import json
from content_data import ROOT
from validate_content import validate


def main():
    argparse.ArgumentParser(description=__doc__).parse_args()
    expected = json.loads((ROOT / 'packaging/content-findings.json').read_text(encoding='utf-8'))
    findings, topics = validate(baseline='HEAD')
    current = {'errors': findings.errors, 'warnings': findings.warnings}
    for kind, messages in current.items():
        for message in messages:
            print(f'KNOWN {kind[:-1].upper()}: {message}' if message in expected[kind] else f'NEW {kind[:-1].upper()}: {message}')
    if any(sorted(current[key]) != sorted(expected[key]) for key in expected):
        raise SystemExit('Content findings differ from the documented baseline; review instead of suppressing them.')
    print(f'{topics} topics: no additional findings. Strict validator still has {len(findings.errors)} known errors.')


if __name__ == '__main__':
    main()
