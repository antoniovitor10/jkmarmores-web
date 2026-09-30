"""Instancia Work Sans Light e gera subset WOFF2 latino/português.

Fonte e licença: https://github.com/google/fonts/tree/main/ofl/worksans
Uso: python scripts/subset-work-sans.py caminho/WorkSans[wght].ttf
Dependências de preparação: fonttools, brotli. Não participa do build.
"""
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont(sys.argv[1], recalcTimestamp=False)
instantiateVariableFont(font, {'wght': 300}, inplace=True)
options = subset.Options()
options.flavor = 'woff2'
options.hinting = False
sub = subset.Subsetter(options=options)
# Latin-1 inclui os acentos portugueses; pontuação e sinal de euro adicionais.
sub.populate(unicodes=list(range(0x20, 0x100)) + list(range(0x2000, 0x2070)) + [0x20AC])
sub.subset(font)
font.flavor = 'woff2'
destination = Path('public/fonts/work-sans-latin-300.woff2')
font.save(destination)
print(destination, destination.stat().st_size)
