#!/usr/bin/env bash
# Publica versoes do site em out/<n>/ para comparacao (jkmarmores.com.br/1/, /2/, /3/).
# Roda no deploy depois do build principal. Para tirar uma versao do ar, remova a linha dela.
set -euo pipefail

# rota|commit (ou "atual" para o build desta execucao)|rotulo
VERSOES=(
  "1|cc06d32|Versão 1 · cc06d32 · cena 3D original"
  "2|173ca94|Versão 2 · 173ca94 · configurador imersivo"
  "3|atual|Versão 3 · atual"
)

RAIZ="$(pwd)"
TMP="$(mktemp -d)"
cp -r out "$TMP/atual-out"

for item in "${VERSOES[@]}"; do
  IFS="|" read -r rota commit rotulo <<< "$item"
  echo "== /$rota/ ($commit)"
  if [ "$commit" = "atual" ]; then
    origem="$TMP/atual-out"
  else
    git worktree add --detach "$TMP/$rota" "$commit"
    (cd "$TMP/$rota" && npm ci --no-audit --no-fund && npx next build)
    origem="$TMP/$rota/out"
  fi
  python3 "$RAIZ/scripts/versoes/relativize.py" "$origem" "out/$rota" "$rotulo"
  if [ "$commit" != "atual" ]; then git worktree remove --force "$TMP/$rota"; fi
done

rm -rf "$TMP"
