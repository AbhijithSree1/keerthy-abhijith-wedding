#!/usr/bin/env bash
# Install the full font families this artwork uses.
#
# Not a convenience. Chromium cannot embed a unicode-range subset woff2 into a
# PDF as a real font — it falls back to Type3 glyph procedures, which print
# perfectly and then arrive in every design tool as unselectable shapes. With
# the complete families installed, `local()` in fonts.css resolves to them and
# the type survives as type all the way to Inkscape.
#
# All three are SIL Open Font License and free to redistribute.
set -euo pipefail

DEST="${1:-$HOME/.fonts}"
mkdir -p "$DEST"

UA="Mozilla/5.0"
FAMILIES=(
  "Great+Vibes"
  "Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400"
  "Cinzel:wght@400;500;600"
)

css=""
for f in "${FAMILIES[@]}"; do
  css+=$(curl -sS -A "$UA" "https://fonts.googleapis.com/css2?family=$f")
done

i=0
while read -r url; do
  i=$((i + 1))
  curl -sS --max-time 30 -o "$DEST/gf-$i.ttf" "$url"
done < <(grep -o "https://fonts.gstatic.com[^)]*" <<<"$css" | sort -u)

fc-cache -f >/dev/null
echo "installed $i faces into $DEST"
fc-list : family | tr ',' '\n' | sort -u | grep -iE "cinzel|cormorant|great vibes"
