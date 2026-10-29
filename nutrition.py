#!/usr/bin/env python3
"""Print per-serving macros from a recipe page's schema.org nutrition, as the recipes.json `macros` object.
Usage: python3 nutrition.py <url>   -> {"calories":..,"protein_g":..,"carbs_g":..,"fat_g":..,"source":"recipe"}
Exits 1 (prints nothing) if the page has no nutrition; then estimate from the ingredients (see ROUTINE.md)
and set "source": "estimated"."""
import json, re, sys, urllib.request
def num(v):
    m = re.search(r'[\d.]+', str(v or ''))
    return round(float(m.group())) if m else None
def find(o):
    if isinstance(o, dict):
        if isinstance(o.get('nutrition'), dict): return o['nutrition']
        o = list(o.values())
    if isinstance(o, list):
        for x in o:
            n = find(x)
            if n: return n
def main(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    h = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
    for blk in re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', h, re.S):
        try: n = find(json.loads(blk))
        except Exception: continue
        if n and num(n.get('calories')) is not None:
            print(json.dumps({'calories': num(n.get('calories')), 'protein_g': num(n.get('proteinContent')),
                              'carbs_g': num(n.get('carbohydrateContent')), 'fat_g': num(n.get('fatContent')), 'source': 'recipe'}))
            return 0
    return 1
if __name__ == '__main__': sys.exit(main(sys.argv[1]))
