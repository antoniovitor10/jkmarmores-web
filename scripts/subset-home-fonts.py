from pathlib import Path
import subprocess
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
Path('.maestri').mkdir(exist_ok=True)
for name in ['serif-latin-400','sans-latin-variable']:
    path='public/fonts/instrument-'+name+'.woff2'
    original=Path('.maestri')/('original-'+name+'.woff2')
    original.write_bytes(subprocess.check_output(['git','show','c4edeaf:'+path]))
    font=TTFont(original, recalcTimestamp=False)
    if name.startswith('sans'):
        instantiateVariableFont(font, {'wght': 400}, inplace=True)
        path='public/fonts/instrument-sans-latin-400.woff2'
    chars=''.join(chr(i) for i in range(32,127))+'ÀÁÂÃÇÉÊÍÓÔÕÚÜàáâãçéêíóôõúü–—‘’“”…'
    options=subset.Options()
    options.flavor='woff2'
    options.hinting=False
    sub=subset.Subsetter(options=options)
    sub.populate(text=chars)
    sub.subset(font)
    font.flavor='woff2'
    font.save(path)
    print(path,Path(path).stat().st_size)
