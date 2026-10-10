# ミニクラフト (Minicraft)

生成AIを用いて開発されたMinecraft風ブラウザゲームです。最新版はルートの `index.html` を入口として公開できます。

## 起動方法

- `index.html` が分割ソース版のエントリーポイントです。GitHub Pages などの静的ホスティング、またはローカルHTTPサーバーから開いてください。
- 例: `python3 -m http.server 8000` → `http://localhost:8000/`
- Three.js r128 はCDNから読み込むため、起動時にインターネット接続が必要です。
- `ミニクラフト_Ver1.5.html` と、それ以前のHTMLは元の単一ファイル版の履歴スナップショットとして変更せず保持します。

## GitHub Pagesで公開する

このリポジトリは**ビルドや専用サーバーなし**で公開できます。最新版のVer1.5を起動する `index.html` と、その依存ファイル `src/` はリポジトリのルートに配置済みです。

リポジトリ管理者が変更を `main` に取り込んだ後、次の手順だけで公開できます。

1. [Settings → Pages](https://github.com/shibanichi/Minicraft-Ver.1.2-/settings/pages) を開く。
2. **Build and deployment → Source** で **Deploy from a branch** を選ぶ。
3. **Branch** を `main`、**Folder** を `/(root)` にし、**Save** を押す。
4. GitHub Pages のデプロイが成功すれば、以下のURLでゲームを開けます。

**公開予定URL:** https://shibanichi.github.io/Minicraft-Ver.1.2-/

> 現時点ではフォーク元でPagesは未設定です。上記URLは公開設定が完了するまでは利用できません。

公開される `index.html` が常に最新版の入口です。以前のバージョン（`ミニクラフト_Ver*.html`）は比較用として残してあります。今後の更新では新バージョンのコードを `index.html` と `src/` に反映してください。

`.nojekyll` により、GitHub Pagesからそのまま静的ファイルを配信します。アセットは相対パスで参照しているため、リポジトリ名が含まれるPagesのサブパスでも読み込めます。GitHub Actionsによる自動デプロイの追加設定は必要ありません。

## ソース構成

- `src/styles/game.css` — 表示レイアウト
- `src/js/01-block-registry.js` — ブロック/アイテムID、初期定義
- `src/js/02-renderer.js` — テクスチャ生成、描画設定、昼夜サイクル
- `src/js/03-world.js` — 地形、チャンク、メッシュ、ブロック操作
- `src/js/04-0-player-ui.js` — プレイヤー状態、セーブ、ホットバー・装備
- `src/js/04-1-input.js` — キーボード、マウス、画面入力
- `src/js/04-2-containers.js` — チェストとアイテム移動
- `src/js/04-3-dropped-items.js` — 地面に落ちたアイテム、拾得
- `src/js/05-entities.js` — Mob、矢、雲、ブロック光
- `src/js/06-circuits.js` — レッドストーン回路、ピストン、TNT
- `src/js/07-fluids.js` — 水・溶岩、バケツ、流体メッシュ
- `src/js/08-game-loop.js` — 物理、メインループ
- `src/js/09-inventory.js` — インベントリ/クラフトUI
- `src/js/10-resource-packs.js` — ZIP/PNGテクスチャ適用
- `src/js/11-settings.js` — 設定画面

**移行段階の構造**: JavaScriptはES Modules化しておらず、読み込み順が固定された従来型スクリプトです。各ファイルが共有するグローバル状態・初期化順は元ソースと同一です。独立モジュール化や責務分離、状態更新APIの統一は後続作業として扱います。詳細は `docs/architecture.md` を参照してください。

## 検証

`node --test tests/*.test.mjs`

依存パッケージなしで、元HTMLと分割後のソースの完全一致、読み込み順、個々のJavaScriptファイルの構文、およびPages公開時のローカルアセット参照と配置を確認します。これはWebGLを含むブラウザ動作検証を代替しません。

## 未解決課題

レビュー指摘は [GitHub Issues](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues) に10件登録されています。対応状況とソースの対応表は `docs/review-backlog.md` を参照してください。
