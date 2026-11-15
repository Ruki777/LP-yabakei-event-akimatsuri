// 文字の並びの点検スクリプト。次の3つを探す。
//  1. 最後の行が1〜2文字だけ（泣き別れ）… 2026-11-15 戸高さん指摘「一文字だけで折り返してるの良くない」
//  2. 折り返した行の右に2文字分を超える空き（左寄せの文だけ）… 同日「変なスペースとか開いてる」
//  3. 日本語と日本語の間の空白 … 同上
//  4. 両端揃えで字間が広がりすぎた行
//
// 使い方：ブラウザでサイトを開き、画面幅を変えながら（360・375・390・414・430・768・1280）、
// このファイルの中身をそのままページ上で実行する（Claude はアプリ内ブラウザの javascript_tool で実行）。
// 戻り値の配列が空なら問題なし。見つかったら、その文の切れ目を見直す（文を短くする／<span class="nw">で語をまとめる）。
// text-wrap:pretty が効かない古いブラウザでも崩れないよう、点検中は一時的に text-wrap を切って測る。
(() => {
  const MAX = 2; // 最後の行がこの文字数以下なら報告
  const style = document.createElement('style');
  // text-wrap-style だけを戻す（text-wrap 全体を指定すると white-space:nowrap まで打ち消してしまう）
  style.textContent = '*{text-wrap-style:auto!important}';
  document.head.appendChild(style);
  const isBlock = el => {
    const d = getComputedStyle(el).display;
    return !d.startsWith('inline') || d === 'inline-block' || d === 'inline-flex';
  };
  const groups = new Map();
  const spaces = [];
  // <br> で意図的に改行した所は「段落の区切り」として扱い、自然に折り返した所だけを見る
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let seg = 0;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === 1) { if (n.tagName === 'BR') seg++; continue; }
    const p = n.parentElement;
    if (!p || !p.offsetParent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.tagName)) continue;
    if (getComputedStyle(p).writingMode.startsWith('vertical')) continue;
    let box = p; while (box && !isBlock(box)) box = box.parentElement;
    if (!groups.has(box)) groups.set(box, []);
    const t = n.textContent;
    for (let i = 0; i < t.length; i++) {
      if (/\s/.test(t[i])) { if (i > 0 && i < t.length - 1 && /[^\x00-\x7F]/.test(t[i - 1]) && /[^\x00-\x7F]/.test(t[i + 1]) && !/[▶→]/.test(t[i + 1])) spaces.push(t.slice(Math.max(0, i - 8), i + 8)); continue; }
      const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
      const rect = r.getClientRects()[0]; if (!rect || !rect.width) continue;
      groups.get(box).push({ ch: t[i], left: rect.left, right: rect.right, top: rect.top, h: rect.height, seg });
    }
  }
  const out = [];
  for (const [box, chars] of groups) {
    const segs = new Map();
    for (const c of chars) { if (!segs.has(c.seg)) segs.set(c.seg, []); segs.get(c.seg).push(c); }
    for (const list of segs.values()) {
      const lines = [];
      for (const c of list) {
        const last = lines[lines.length - 1];
        // 改行の判定：左へ戻ったうえで下へ半行以上ずれたら新しい行（斜めに傾けた見出しを誤検知しないため）
        if (last && !(c.left < last.left - 2 && c.top > last.top + last.h / 2)) { last.text += c.ch; last.left = c.left; last.top = c.top; last.right = c.right; }
        else lines.push({ left: c.left, startLeft: c.left, right: c.right, top: c.top, h: c.h, text: c.ch });
      }
      if (lines.length < 2) continue;
      // 2. 折り返した行の右の空き（中央寄せの文は空きが左右に分かれるので見ない）
      const st = getComputedStyle(box), br = box.getBoundingClientRect();
      const edge = br.right - parseFloat(st.paddingRight), fs = parseFloat(st.fontSize);
      if (!/center/.test(st.textAlign)) lines.slice(0, -1).forEach((l, i) => {
        const gap = (edge - l.right) / fs;
        if (gap > 2.2) out.push({ kind: '右に空き', width: innerWidth, gap: Math.round(gap * 10) / 10, line: l.text.slice(-10), next: lines[i + 1].text.slice(0, 6) });
      });
      // 4. 両端揃えで字間が広がりすぎた行（1文字あたりの幅が文字の大きさの1.3倍超。日本語が中心の行だけ）
      if (st.textAlign === 'justify') lines.slice(0, -1).forEach(l => {
        const jp = (l.text.match(/[^\x00-\x7F]/g) || []).length;
        if (jp >= l.text.length * 0.7 && (edge - (edge - (l.right - l.startLeft))) / l.text.length > fs * 1.3)
          out.push({ kind: '字間が広い', width: innerWidth, line: l.text.slice(0, 20) });
      });
      if (lines.every(l => l.text.length <= 1)) continue; // 1文字ずつ縦に並べる装飾（SAT など）
      if (lines.map(l => l.text).join('').length < 9) continue; // 8文字以下の見出し・バッジ（「入場／無料」など意図して2行にしているもの）
      // 句読点・閉じかっこは文字数に数えない
      const tail = lines[lines.length - 1].text;
      const count = tail.replace(/[。、．，）」』】！？!?)\]・…ー▶]/g, '').length;
      if (count <= MAX) out.push({ kind: '泣き別れ', width: innerWidth, last: tail, text: lines.map(l => l.text).join('').slice(0, 60) });
    }
  }
  spaces.forEach(t => out.push({ kind: '日本語の間の空白', width: innerWidth, text: t }));
  style.remove();
  return out;
})();
