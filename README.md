# 耶馬溪ジビエフェス2026 特設サイト（akimatsuri.yabakei-event.jp）

「耶馬溪ジビエフェス2026（第17回 耶馬溪観光秋まつり）」の1イベント専用サイトです。
GitHub Pages（GitHubが無料で提供する、静的なHTMLサイトをそのまま公開できる仕組み）で、
サブドメイン `akimatsuri.yabakei-event.jp` として公開する想定で作られています。

このリポジトリは**サブドメイン専用**です。耶馬溪のイベントをまとめて案内する本体サイト
（`yabakei-event.jp`）は別リポジトリ `LP-yabakei-event` で管理されています。
このサイトのヘッダーの「耶馬溪イベント」リンクは、その本体サイトに絶対URLで飛びます。

外部のライブラリやGoogle Fontsは一切読み込んでいません（表示が速く、依存が少ないシンプルな作りです）。

---

## フォルダ構成

```
LP-yabakei-event-akimatsuri/
  index.html            … 本ページ（唯一のページ。開催概要・内容・アクセス・お問い合わせ）
  assets/css/style.css  … サイト全体で使う共通デザイン（色・レイアウト）
  assets/img/           … 写真（past-festival.jpg：ヒーロー背景兼OG画像／CONTENTSカード4枚：past-festival.jpg・kagura.jpg・usobukuro.jpg・mochimaki.webp）
  CNAME                 … 独自ドメイン設定用（中身は akimatsuri.yabakei-event.jp の1行のみ）
  404.html              … 存在しないページにアクセスされたときの案内ページ
  robots.txt / sitemap.xml … 検索エンジン向けの案内ファイル
  .nojekyll              … GitHub Pagesの内部処理（Jekyll変換）を無効にする空ファイル
```

---

## 内容を更新する方法（非エンジニア向け）

このサイトはプログラムではなく「文章が書かれたファイル（HTML）」でできています。難しいコマンドは不要で、**メモ帳のようにテキストを書き換えて保存するだけ**で内容を変更できます。

1. `index.html` を開く
2. 直したい日本語の文章を見つけて書き換える
3. 保存する
4. Claude Codeで「この変更をコミット・pushして」と伝える（commit＝変更の記録を残す操作、push＝GitHub上に反映する操作。詳しい手順は毎回Claudeが日本語で説明します）
5. pushが終わると、数分でサイトに反映されます

---

## チラシ画像に差し替える手順

デザイナーのチラシ画像ができたら、ヒーロー（トップの写真背景）の代わりにチラシ画像を主役として表示できます。

1. できあがったチラシ画像を `assets/img/flyer.jpg` という名前で `assets/img/` フォルダに入れる
   （1枚あたり300KB〜500KB程度に縮小してから入れることをおすすめします。サイトの表示速度が遅くならないようにするためです）
2. `index.html` 内、ヒーローセクション（`<section class="hero">`）のすぐ下にある、次のコメントアウトされたブロックを見つける

   ```html
   <!-- チラシが完成したらこのコメントを外し、assets/img/flyer.jpg を置く
   <section class="flyer">
     <div class="container">
       <img src="/assets/img/flyer.jpg" alt="耶馬溪ジビエフェス2026 チラシ">
     </div>
   </section>
   -->
   ```

3. `<!--` と `-->` を削除して、中の `<section class="flyer">...</section>` を有効にする
4. 保存してコミット・push

対応するCSS（`.flyer` クラス：中央寄せ・最大幅720px・角丸・影）は `assets/css/style.css` にすでに用意されています。

---

## ドメイン設定（akimatsuri.yabakei-event.jp）の要点

このサイトは独自のサブドメイン `akimatsuri.yabakei-event.jp` で公開する前提で作られています。

- `CNAME` ファイルに `akimatsuri.yabakei-event.jp` と書いてあることで、GitHub Pages側に「このドメインで公開してほしい」と伝えています。
- 実際にこのドメインでアクセスできるようにするには、**ドメインの管理会社側でのDNS設定**（サブドメインのCNAMEレコード追加）が別途必要です（GitHub Pagesの標準的なドメイン接続手順に従います）。この設定はGitHubリポジトリの管理者権限が必要な操作のため、設定時に改めてご相談ください。
- ドメイン設定が完了するまでは、GitHubが自動で発行する `https://（GitHubユーザー名）.github.io/（リポジトリ名）/` のようなURLで確認できます。

---

## 注意事項

- 本サイトに掲載している情報（日時・会場など）は、プロジェクト側の確定情報にもとづいています。内容を変更する際は、必ず正しい情報かどうかを確認してから書き換えてください。
- 予備日は「11月29日（日）」とだけ表記し、「延期」「順延」とは書かない運用です（確定していない表現を避けるため）。
