#!/usr/bin/env python3
"""Merge the clip library (built on the Mac by library/bin/process.py) into the site.

  python3 -I scripts/setlist/import-library.py <library dir> [--no-copy]

- Copies every finished clip to public/setlist/clips/<id>.mp3 (they are already cut to 30 s and loudness-normalized).
- Rewrites the library songs (ids lib-*) in src/data/setlist-songs.json; the hand-made prototype songs stay first in each style.
- Explicit flag: from Apple only (iTunes Search API trackExplicitness). A song is explicit when Apple lists it as
  'explicit' or 'cleaned' (an edited copy of an explicit original), matched on the real artist (covers/tributes ignored);
  clean when Apple only has 'notExplicit';
  when Apple has no match the song counts as clean and explicitSource says 'apple:no-match'.
  Lookups are cached in <library>/itunes-cache.json (the API allows ~20 requests a minute).
"""
import json, os, re, shutil, sys, time, unicodedata, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIB = os.path.abspath(os.path.expanduser(sys.argv[1]))
COPY = '--no-copy' not in sys.argv
DATA = os.path.join(ROOT, 'src', 'data', 'setlist-songs.json')
CLIPS = os.path.join(ROOT, 'public', 'setlist', 'clips')
CACHE = os.path.join(LIB, 'itunes-cache-v2.json')

NEW_STYLES = [
    {"flow": "reception", "id": "dance", "name": "Dance & EDM", "nameRu": "Танцевальная и EDM", "blurb": "Big drops, big hands", "blurbRu": "Клубные хиты", "emoji": "🪩", "color": "#3f7fd1"},
]


def norm(s):
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9а-яё ]+', ' ', s).strip()


cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}


def apple(title, artist, language):
    """Apple's ratings for this song by this artist (covers, tributes and karaoke versions are ignored)."""
    key = f'{title}|{artist}|{language}'
    if key in cache:
        return cache[key]
    t = re.sub(r'\(.*?\)', '', title)
    toks = [w for w in norm(t).split() if len(w) > 1]
    a0 = [w for w in norm(re.split(r'\b(?:ft|feat|featuring)\b|&|,', artist)[0]).split() if len(w) > 1][:2]
    found = []
    for cc in (['US', 'RU'] if language == 'ru' else ['US']):
        u = 'https://itunes.apple.com/search?' + urllib.parse.urlencode(dict(term=f'{t} {artist}', entity='song', limit=15, country=cc))
        res = None
        for attempt in range(4):
            try:
                res = json.load(urllib.request.urlopen(u, timeout=20))['results']
                break
            except Exception:
                time.sleep(15)
        if res is None:
            return None  # API trouble: do not cache, try again next run
        for r in res:
            tn = norm(r.get('trackName', ''))
            an = norm(r.get('artistName', ''))
            if re.search(r'karaoke|tribute|cover|instrumental|lullaby|string quartet|in the style', tn + ' ' + an + ' ' + norm(r.get('collectionName', ''))):
                continue
            if sum(w in tn for w in toks) / max(1, len(toks)) >= 0.7 and (not a0 or all(w in an for w in a0)):
                found.append(r.get('trackExplicitness'))
        time.sleep(1.5)
    cache[key] = sorted(set(map(str, found)))
    json.dump(cache, open(CACHE, 'w'), ensure_ascii=False, indent=1)
    return cache[key]


def verdict(found):
    if found is None:
        return None, 'apple:lookup-failed'
    if 'explicit' in found or 'cleaned' in found:
        return True, 'apple:' + ('explicit' if 'explicit' in found else 'cleaned')  # a cleaned edit means the original is explicit
    if found:
        return False, 'apple:notExplicit'
    return False, 'apple:no-match'


data = json.load(open(DATA))
styles = {s['id'] for s in data['styles']}
for st in NEW_STYLES:
    if st['id'] not in styles:
        # keep reception styles together: insert before the first ceremony style
        i = next((k for k, s in enumerate(data['styles']) if s['flow'] == 'ceremony'), len(data['styles']))
        data['styles'].insert(i, st)
styles = {s['id']: s for s in data['styles']}

rows = {}
for line in open(os.path.join(LIB, 'manifest.jsonl')):
    r = json.loads(line)
    if r['id'] not in rows or r['status'] == 'ok':
        rows[r['id']] = r
ok = [r for r in rows.values() if r['status'] == 'ok' and os.path.exists(os.path.join(LIB, r['clip_file']))]

proto = [s for s in data['songs'] if not s['id'].startswith('lib-')]
lang_of = lambda s: 'ru' if s['style'].startswith('ru') or s['style'] == 'c-russian' else 'en'
missing_apple = 0
for s in proto:
    s.setdefault('source', 'youtube-proof-of-concept')
    ex, src = verdict(apple(s['title'], s['artist'], lang_of(s)))
    if ex is None:
        missing_apple += 1
    else:
        s['explicit'], s['explicitSource'] = ex, src

lib = []
order = {k: i for i, k in enumerate(styles)}
for r in sorted(ok, key=lambda r: (order.get(r['genre'], 99), int(r['id'].rsplit('-', 1)[1]))):
    if r['genre'] not in styles:
        print('unknown genre', r['genre'], r['id'])
        continue
    ex, src = verdict(apple(r['title'], r['artist'], r.get('language', 'en')))
    if ex is None:
        missing_apple += 1
        ex, src = bool(r.get('explicit')), 'apple:lookup-failed'
    song = {
        'id': r['id'], 'flow': styles[r['genre']]['flow'], 'style': r['genre'], 'title': r['title'], 'artist': r['artist'],
        'explicit': ex, 'explicitSource': src, 'clip': f"/setlist/clips/{r['id']}.mp3", 'sourceUrl': r['source_url'],
        'source': r.get('source', 'youtube-proof-of-concept'), 'year': r.get('year'), 'language': r.get('language', 'en'),
        'hookStartSec': r['hook_start_sec'], 'hookOnsetSec': r['hook_onset_sec'], 'songDurationSec': r['song_duration_sec'],
        'confidence': r['confidence'], 'method': r['method'], 'heatmapPeakSec': r.get('heatmap_peak_sec'),
        'audioOnlySec': r.get('audio_only_sec', 0), 'repeatOccurrencesSec': r.get('repeat_occurrences_sec', []),
    }
    lib.append(song)
    if COPY:
        os.makedirs(CLIPS, exist_ok=True)
        shutil.copyfile(os.path.join(LIB, r['clip_file']), os.path.join(CLIPS, f"{r['id']}.mp3"))

# Keep songs grouped by style in style order; prototype songs first inside each style.
songs = proto + lib
songs.sort(key=lambda s: (order.get(s['style'], 99), s['id'].startswith('lib-')))
data['songs'] = songs
json.dump(data, open(DATA, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print('songs', len(songs), 'library', len(lib), 'skipped', len(rows) - len(ok), 'apple lookups failed', missing_apple)
print(dict(Counter(s['style'] for s in songs)))
print('explicit', dict(Counter(s.get('explicitSource', '?') for s in songs)))
