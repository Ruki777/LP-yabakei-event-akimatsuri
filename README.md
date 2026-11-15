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

## 公開の流れ：ステージング → 確認 → 本番（2026-11-15〜）

いきなり本番に出さない（戸高さん指示）。

1. 手元で `index.html` などを直す
2. `bash scripts/deploy-staging.sh` を実行する → ステージング（本番の前に確認する試験用の公開場所） https://ruki777.github.io/LP-yabakei-event-akimatsuri-staging/ に出る。1〜2分で反映される。検索エンジンには載らない。画面の左下に「ステージング（確認用）」と表示される
3. Claude が scripts/check-orphans.js（1〜2文字だけの折り返し・行の右の空き・日本語の間の空白の点検）を走らせ、PC幅とスマホ幅の画面も目で見る。戸高さんがスマホでステージングを見て OK を出す
4. OK が出たら main を push する → 本番（akimatsuri.yabakei-event.jp）に反映される

ステージング用のリポジトリは `Ruki777/LP-yabakei-event-akimatsuri-staging`（公開）。中身は deploy-staging.sh が毎回上書きするので、直接編集しない。
style.css を変えたら、index.html の `style.css?v=日付` の数字も変える（スマホが古い見た目の設定を覚えたまま、新しい文章だけ表示するのを防ぐ）。
サイト内のファイルの参照は相対パス（`assets/...`）で書く。`/assets/...` と書くと、ステージングのアドレス（/LP-yabakei-event-akimatsuri-staging/ の下）で画像や見た目が読み込めなくなる。404.html だけは、どの階層のアドレスからも表示されるので `/assets/...` のままにしている。

---

## 内容を更新する方法（非エンジニア向け）

このサイトはプログラムではなく「文章が書かれたファイル（HTML）」でできています。難しいコマンドは不要で、**メモ帳のようにテキストを書き換えて保存するだけ**で内容を変更できます。

1. `index.html` を開く
2. 直したい日本語の文章を見つけて書き換える
3. 保存する
4. Claude Codeで「ステージングに出して」と伝え、確認してから「本番に出して」と伝える（commit＝変更の記録を残す操作、push＝GitHub上に反映する操作。詳しい手順は毎回Claudeが日本語で説明します）
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
