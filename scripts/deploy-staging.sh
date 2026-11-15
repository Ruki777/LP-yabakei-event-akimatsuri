#!/bin/bash
# ステージング（本番の前に確認する試験用の公開場所）へ、今の手元のサイトを出す。
# 2026-11-15 戸高さん指示「いきなり本番ではなくステージングで直して公開して」から作成。
#
# 公開先：https://ruki777.github.io/LP-yabakei-event-akimatsuri-staging/
# 本番（akimatsuri.yabakei-event.jp）には一切触れない。本番に出すのは、確認のあと main を push したときだけ。
#
# やること：
#   1. 一時フォルダにステージング用リポジトリを取ってくる
#   2. その中の前回分を git rm で外し（履歴には残る）、今の手元のサイトのファイルを写す
#   3. ステージングだけの変更：検索エンジンに載せない指定・本番ドメインの設定（CNAME）を外す・画面の隅に「確認用」の表示
#   4. 記録して送る（--force は使わない）
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
REPO="https://github.com/Ruki777/LP-yabakei-event-akimatsuri-staging.git"
TMP="$(mktemp -d)"
git clone -q "$REPO" "$TMP/site" 2>/dev/null
cd "$TMP/site"
git rm -rq --ignore-unmatch . >/dev/null
for f in index.html 404.html .nojekyll assets; do cp -R "$SRC/$f" .; done
printf 'User-agent: *\nDisallow: /\n' > robots.txt
python3 - <<'EOF'
import re
tag = ('<meta name="robots" content="noindex,nofollow">\n'
       '<style>#stg-label{position:fixed;left:8px;bottom:8px;z-index:9999;background:#1E3F7A;color:#fff;'
       'font:700 12px/1.6 sans-serif;padding:4px 10px;border-radius:6px;opacity:.9;pointer-events:none}</style>\n')
label = '<div id="stg-label">ステージング（確認用）</div>\n'
for p in ['index.html', '404.html']:
    s = open(p, encoding='utf-8').read()
    s = re.sub(r'<meta name="robots"[^>]*>\n?', '', s)
    s = s.replace('<head>', '<head>\n' + tag, 1)
    s = s.replace('</body>', label + '</body>', 1)
    open(p, 'w', encoding='utf-8').write(s)
EOF
git add -A
REV="$(git -C "$SRC" rev-parse --short HEAD)"
DIRTY="$(git -C "$SRC" status --porcelain -- index.html 404.html assets | head -1)"
MSG="ステージング更新：本番リポジトリ ${REV}"; [ -n "$DIRTY" ] && MSG="$MSG ＋未記録の変更"
git -c user.name="$(git -C "$SRC" config user.name)" -c user.email="$(git -C "$SRC" config user.email)" commit -qm "$MSG" || { echo "変更なし"; exit 0; }
git push -q origin HEAD:main
echo "ステージングに送りました：https://ruki777.github.io/LP-yabakei-event-akimatsuri-staging/ （反映まで1〜2分）"
