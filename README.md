# Minicraft — 開発用構造
 
[オリジナル](https://github.com/shibanichi/Minicraft-Ver.1.2-) は生成AIを用いて開発されたMinecraft風ゲームです。

## 起動方法

- `index.html` が分割ソース版のエントリーポイントです。GitHub Pages などの静的ホスティング、またはローカルHTTPサーバーから開いてください。
- 例: `python3 -m http.server 8000` → `http://localhost:8000/`
- Three.js r128 はCDNから読み込むため、起動時にインターネット接続が必要です。
- `ミニクラフト_Ver1.5.html` と、それ以前のHTMLは元の単一ファイル版の履歴スナップショットとして変更せず保持します。

## 公開方法（フォーク元のGitHub Pages）

将来的な公開先はフォーク元の [shibanichi/Minicraft-Ver.1.2-](https://github.com/shibanichi/Minicraft-Ver.1.2-) です。**フォーク側でのGitHub Pages公開は想定していません。**

- **最新版（現在Ver1.5）の入口はルートの `index.html`** とし、ページを開くだけでゲームが始められる構成です。従来のHTMLダウンロードは不要になります。
- `index.html` は `src/styles/game.css` および `src/js/` に依存するため、フォーク元へ反映する際はこれらを**まとめて**取り込んでください。
- フォーク元の管理者が変更を取り込んだ後、リポジトリの **Settings → Pages → Build and deployment** で `Deploy from a branch`、公開ブランチ `main`、ディレクトリ `/(root)` を指定すれば、そのブランチの `index.html` がトップページになります。
- 公開予定URL: https://shibanichi.github.io/Minicraft-Ver.1.2-/ （GitHub Pagesの有効化・デプロイ完了後）。
- 今後のバージョンアップ時も新たなバージョン別HTMLを公開入口にせず、**`index.html` と `src/` を最新版として更新**する方針です。旧版HTMLは履歴として残します。

**現在の状況**: フォーク元の `main` にはまだ `index.html` がありません。現段階ではフォークの `develop` にのみ公開用の構造があり、フォーク元への取り込みやPR作成は行っていません。

## ソース構成

- `src/styles/game.css` — 表示レイアウト
- `src/js/01-block-registry.js` — ブロック/アイテムID、初期定義
- `src/js/02-renderer.js` — テクスチャ生成、描画設定、昼夜サイクル
- `src/js/03-world.js` — 地形、チャンク、メッシュ、ブロック操作
- `src/js/04-player-ui.js` — プレイヤー、保存、入力、チェスト、ドロップ
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

依存パッケージなしで、元HTMLと分割後のソースの完全一致、読み込み順、個々のJavaScriptファイルの構文を確認します。これはブラウザでの動作検証を代替しません。

## 未解決課題

レビュー指摘は [GitHub Issues](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues) に10件登録されています。対応状況とソースの対応表は `docs/review-backlog.md` を参照してください。
