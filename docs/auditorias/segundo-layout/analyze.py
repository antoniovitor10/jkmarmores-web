import json,gzip,statistics
from pathlib import Path
base=Path(__file__).parent
summary={}
for mode in ['antes','depois']:
 runs=[]
 for p in sorted((base/mode).glob('*/mobile-entrada-trace.json.gz')):
  es=json.loads(gzip.decompress(p.read_bytes()))['traceEvents'];data=json.loads((p.parent/'mobile-entrada.json').read_text(encoding='utf-8'))['entry'];paint=next(e['ts'] for e in es if e['name']=='firstContentfulPaint');origin=paint-data['paints']['first-contentful-paint']*1000
  layouts=[{'atMs':(e['ts']-origin)/1000,'durationMs':e['dur']/1000,**e['args']['beginData']} for e in es if e['name']=='Layout' and e.get('dur',0)>30000 and 0<=e['ts']-origin<3000000]
  scripts=[{'atMs':(e['ts']-origin)/1000,'durationMs':e['dur']/1000,'url':e.get('args',{}).get('data',{}).get('url')} for e in es if e['name']=='EvaluateScript' and e.get('dur',0)>50000 and 0<=e['ts']-origin<3000000]
  runs.append({'run':p.parent.name,'layouts':layouts,'scripts':scripts})
 summary[mode]=runs
(base/'layouts-comparados.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
