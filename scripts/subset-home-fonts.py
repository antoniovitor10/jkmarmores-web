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
    font=TTFont(original)
    if name.startswith('sans'): instantiateVariableFont(font, {'wght': (400,600)}, inplace=True)
    chars=''.join(chr(i) for i in range(32,127))+'ÀÁÂÃÇÉÊÍÓÔÕÚÜàáâãçéêíóôõúü–—‘’“”…'
    options=subset.Options()
    options.flavor='woff2'
    sub=subset.Subsetter(options=options)
    sub.populate(text=chars if name.startswith('sans') else '0123456789A escolha começa no detalhe.PEDRA Da matéria à forma. Chapa Borda Acabamento Peça aplicada')
    sub.subset(font)
    font.flavor='woff2'
    font.save(path)
    print(path,Path(path).stat().st_size)
