import json,subprocess,os,glob,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from loudnorm import cut  # two-pass loudness normalization, required for every clip
WT=os.path.expanduser('~/Documents/GitHub/dans-events-setlist')
A=json.load(open('analysis.json')); S=json.load(open('songs.json')); ids=open('ids.txt').read().split()
for f in glob.glob(f'{WT}/public/setlist/clips/*.mp3'): os.remove(f)
STY=[
 ("reception","pop","Pop hits","Поп-хиты","Today's and 2000s party songs","Популярные песни для танцев","🎉","#d94f3d"),
 ("reception","8090","80s & 90s","80-е и 90-е","Big singalong throwbacks","Хиты, которые поют все вместе","🕺","#c2518f"),
 ("reception","rock","Classic rock & Motown","Рок и ретро-соул","Rock, soul and disco classics","Рок, соул и диско","🎸","#b8802a"),
 ("reception","hiphop","R&B & hip-hop","R&B и хип-хоп","Club favorites","Клубные хиты","🎤","#6e56cf"),
 ("reception","latin","Latin","Латино","Reggaeton, salsa, merengue","Реггетон, сальса, меренге","🌴","#1f9d8a"),
 ("reception","country","Country","Кантри","Country dance floor","Кантри для танцпола","🤠","#a56b3a"),
 ("reception","slow","Slow dances","Медленные танцы","English-language ballads","Баллады на английском","💞","#c4577a"),
 ("reception","ru-pop","Russian pop","Русская эстрада","Soviet and 90s-2000s pop hits","Хиты 90-х и 2000-х","🎶","#c03a3a"),
 ("reception","ru-folk","Russian folk","Народные песни","Folk songs everyone knows","Народные песни, которые знают все","🪆","#d0782e"),
 ("reception","ru-slow","Russian slow dances","Русские медляки","Slow dances in Russian","Медленные песни на русском","🌹","#a8456b"),
 ("ceremony","c-classical","Classical & strings","Классика и струнные","Timeless wedding classics","Свадебная классика","🎻","#b39a6b"),
 ("ceremony","c-acoustic","Pop songs, instrumental","Поп-хиты без слов","Favorite songs played on strings","Любимые песни в инструментальной версии","🪕","#a68a7a"),
 ("ceremony","c-piano","Piano & modern","Фортепиано","Gentle modern piano","Нежное современное фортепиано","🎹","#8f9bb3"),
 ("ceremony","c-joy","Joyful exit songs","Весёлый выход","Happy songs for the recessional","Радостные песни для выхода молодых","🎊","#d4a24c"),
 ("ceremony","c-russian","Russian & traditional","Русская и традиционная","Waltzes, Ave Maria, romance","Вальс, Аве Мария, романс","🕊️","#9a8bb0"),
]
ctr={};songs=[]
for a,s in zip(A,S):
    i=a['i']; st=s['style']; ctr[st]=ctr.get(st,0)+1; fid=f"{st}-{ctr[st]}"
    out=f"{WT}/public/setlist/clips/{fid}.mp3"
    cut(f'full/{i:02d}.mp3',a['start'],out)
    d=dict(id=fid,flow=s['flow'],style=st,title=s['title'],artist=s['artist'],explicit=s['explicit'])
    if 'moment' in s: d['moment']=s['moment']
    d.update(clip=f"/setlist/clips/{fid}.mp3",sourceUrl=f"https://www.youtube.com/watch?v={ids[i]}",hookStartSec=round(a['start'],1),hookOnsetSec=a['hook_onset'],songDurationSec=a['duration'],confidence=a['confidence'],method=a['method'],heatmapPeakSec=a['heat_onset'],audioOnlySec=a['audio_only_onset'],repeatOccurrencesSec=a['occurrences'])
    songs.append(d)
styles=[dict(flow=f,id=i,name=n,nameRu=nr,blurb=b,blurbRu=br,emoji=e,color=c) for f,i,n,nr,b,br,e,c in STY]
json.dump(dict(styles=styles,songs=songs),open(f'{WT}/src/data/setlist-songs.json','w'),ensure_ascii=False,indent=1)
print(len(songs))
