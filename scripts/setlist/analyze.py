import json,sys,numpy as np,librosa
songs=json.load(open('songs.json'))
CLIP=30.0; WIN=14.0
def z(a):
    a=np.asarray(a,float); s=a.std()
    return (a-a.mean())/s if s>1e-9 else a*0
def run(i):
    info=json.load(open(f'full/{i:02d}.info.json'))
    dur=float(info['duration']); heat=info.get('heatmap')
    y,sr=librosa.load(f'full/{i:02d}.mp3',sr=22050,mono=True)
    dur=len(y)/sr
    hop=512
    tempo,bf=librosa.beat.beat_track(y=y,sr=sr,hop_length=hop)
    bf=np.asarray(bf); tempo=float(np.atleast_1d(tempo)[0])
    bt=librosa.frames_to_time(bf,sr=sr,hop_length=hop)
    chroma=librosa.feature.chroma_stft(y=y,sr=sr,hop_length=hop)
    mf=librosa.feature.mfcc(y=y,sr=sr,hop_length=hop,n_mfcc=13)[1:]
    rms=librosa.feature.rms(y=y,hop_length=hop)[0]
    def sync(f): return librosa.util.sync(f,bf,aggregate=np.mean)
    C=sync(chroma); M=sync(mf); R=sync(rms[None,:])[0]
    def nrm(F):
        F=F-F.mean(1,keepdims=True); return F/(np.linalg.norm(F,axis=0,keepdims=True)+1e-9)
    F=np.vstack([nrm(C)*1.0,nrm(M)*0.7]).T
    F=F/ (np.linalg.norm(F,axis=1,keepdims=True)+1e-9)
    S=F@F.T
    nb=len(F); bi=float(np.median(np.diff(bt)))
    n=int(round(WIN/bi))
    nw=nb-n
    W=np.zeros((nw,nw))
    for k in range(n): W+=S[k:k+nw,k:k+nw]
    W/=n
    rep=np.zeros(nw)
    for a in range(nw):
        row=W[a].copy()
        lo=max(0,a-n); hi=min(nw,a+n+1); row[lo:hi]=-1
        vals=[]
        for _ in range(4):
            j=int(np.argmax(row)); 
            if row[j]<0: break
            vals.append(row[j]); row[max(0,j-n):min(nw,j+n+1)]=-1
        rep[a]=np.mean(vals) if vals else 0
    rdb=librosa.amplitude_to_db(R+1e-6)
    en=np.array([rdb[a:a+n].mean() for a in range(nw)])
    # heat
    t0=bt[:nw]
    hw=None
    if heat:
        hs=np.array([h['start_time'] for h in heat]);he=np.array([h['end_time'] for h in heat]);hv=np.array([h['value'] for h in heat])
        def hmean(a,b):
            m=(he>a)&(hs<b); return hv[m].mean() if m.any() else 0
        hw=np.array([hmean(t,t+WIN) for t in t0])
    valid=(t0>=0.12*dur)&(t0+CLIP<=dur-1.0)
    if not valid.any(): valid=(t0+CLIP<=dur)
    def best(score):
        s=np.where(valid,score,-1e9); return int(np.argmax(s))
    a_audio=best(z(rep)+0.8*z(en))
    a_heat=best(hw) if hw is not None else None
    sc=z(rep)+0.8*z(en)+(0.9*z(hw) if hw is not None else 0)
    a_fin=best(sc)
    # same-section occurrences: pick the repeat nearest the YouTube replay peak (or the earliest loud one)
    row=W[a_fin].copy(); row[max(0,a_fin-n):a_fin+n+1]=-1
    top1=float(row.max()); thr=0.9*top1
    occ=[a_fin]
    while True:
        j=int(np.argmax(row))
        if row[j]<thr or row[j]<0.5: break
        if valid[j]: occ.append(j)
        row[max(0,j-n):min(nw,j+n+1)]=-1
        if len(occ)>8: break
    a_pick=a_fin
    if len(occ)>1:
        if hw is not None:
            a_pick=max(occ,key=lambda j:(round(hw[j],2),-j))
        else:
            emax=max(en[j] for j in occ)
            a_pick=min([j for j in occ if en[j]>=emax-1.5])
    a_fin=a_pick
    lead=2  # beats of lead-in before the hook
    sidx=max(0,a_fin-lead)
    start=float(bt[sidx])
    start=min(start,dur-CLIP-0.5); start=max(start,0)
    # how many other windows resemble the chosen one
    sim=W[a_fin].copy(); sim[max(0,a_fin-n):a_fin+n+1]=-1
    reps=0
    while True:
        j=int(np.argmax(sim))
        if sim[j]<0.80*W[a_fin].max() and sim[j]<0.9 : break
        if sim[j]<0.9: break
        reps+=1; sim[max(0,j-n):j+n+1]=-1
        if reps>6: break
    d_heat=abs(bt[a_fin]-bt[a_heat]) if a_heat is not None else None
    d_audio=abs(bt[a_fin]-bt[a_audio])
    # energy percentile of chosen window vs song
    pct=float((en[valid]<en[a_fin]).mean()*100)
    conf='high' if (d_heat is not None and d_heat<=8 and pct>=60 and rep[a_fin]>np.percentile(rep[valid],70)) else ('medium' if (d_heat is None and rep[a_fin]>np.percentile(rep[valid],75) and pct>=55) or (d_heat is not None and d_heat<=20) else 'low')
    sim_heat=float(W[a_fin,a_heat]) if a_heat is not None else None
    # W distribution of repeats
    return dict(sim_heat=(round(sim_heat,3) if sim_heat is not None else None),wmax=round(float(np.sort(W[a_fin])[-1]),3),wmed=round(float(np.median(W[a_fin])),3),i=i,duration=round(dur,1),tempo=round(tempo,1),start=round(start,2),hook_onset=round(float(bt[a_fin]),2),
        audio_only_onset=round(float(bt[a_audio]),2),heat_onset=(round(float(bt[a_heat]),2) if a_heat is not None else None),
        d_heat=(round(float(d_heat),1) if d_heat is not None else None),d_audio=round(float(d_audio),1),
        energy_pct=round(pct),repeats=reps,occurrences=[round(float(bt[j]),1) for j in sorted(occ)],rep_score=round(float(rep[a_fin]),3),has_heatmap=bool(heat),confidence=conf,
        method='librosa beat-sync chroma+MFCC self-similarity (repeated 14s section) + loudness'+(' + YouTube most-replayed heatmap' if heat else ' (no heatmap available)'))
if __name__=='__main__':
    out=json.load(open('analysis.json')) if len(sys.argv)>1 else []
    for i in range(int(sys.argv[1]) if len(sys.argv)>1 else 0, len(songs)):
        r=run(i); r.update(songs[i]); out.append(r); print(i,songs[i]['title'],r['occurrences'],r['start'],r['hook_onset'],r['audio_only_onset'],r['heat_onset'],r['confidence'],flush=True)
    json.dump(out,open('analysis.json','w'),ensure_ascii=False,indent=1)
