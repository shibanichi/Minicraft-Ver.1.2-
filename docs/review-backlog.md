# コードレビュー指摘・GitHub Issue対応表

対象: `ミニクラフト_Ver1.5.html` @ `b31891459f17ba8988aac1ba1c69c59d5590d21c`

> 2026-10-10に10件すべてGitHub Issuesへ登録済み。各項目は**未修正のレビュー指摘**であり、静的解析に基づく指摘と実機検証を要する性能上の懸念を区別する。

| Issue | 種類 | 優先度 | 指摘 | 元ソース行 | 完了条件 |
| --- | --- | --- | --- | --- | --- |
| [#1](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/1) Bug | High | ポーズ中もゲーム処理と入力が継続 | L624–715, L1207–1236 | 更新停止とUI操作の分離、再開時のdt補正 |
| [#2](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/2) Bug | High | レッドストーンランプの切替後にブロック光が更新されない | L525–529, L781–820, L931–935, L1017–1020 | 単体/バッチ更新をまたぐ光源失効・メッシュ更新 |
| [#3](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/3) Bug | Critical | ブロック基本IDが8bitを超過し表示処理が例外停止 | L60–123, L140–145, L610–611, L1257–1270 | IDと状態の分離、全件カタログと保存の境界値テスト |
| [#4](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/4) Bug | High | クリーパー爆発でコンテナ状態が孤立する | L850–856, L987–993 | 破壊処理のコンテナドロップ・削除一元化 |
| [#5](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/5) Bug | Medium | クラフト投入中に再読込すると素材が消失 | L551–555, L1320–1325 | クラフト欄の保存または素材返却、数量不変条件 |
| [#6](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/6) Bug | Medium | 描画距離変更が移動するまで反映されない | L531–540, L1515 | 距離設定変更で読み込みキューを再作成 |
| [#7](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/7) Bug | Medium | HPと昼夜時刻がセーブに含まれない | L245–247, L551–555 | 保存項目・旧保存データの移行テスト |
| [#8](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/8) Bug | Low | 夜間の月の角度が固定される | L260–272 | 夜フェーズを使った角度計算 |
| [#9](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/9) Performance | Medium | ブロック操作でメッシュ/照明再生成が過大になる可能性 | L525–540, L783–805 | 計測基準の追加とバッチ局所化 |
| [#10](https://github.com/surumeneco/Minicraft-Ver.1.2-/issues/10) Refactor | High | 単一HTMLにUI・世界状態・描画・回路・保存が集中 | 全体 | 機能別分割、更新責務の明示、静的パリティ検証 |

## 対応時の注意

- 「メッシュ/照明再生成が過大」は性能実測が必要で、現段階では懸念事項。
- 挙動が変わる修正は、構造分割とは別Issue/別コミットとして扱う。
- 各Issueに再現手順・期待結果・受入条件を記載済み。実機検証後に必要な補完を行う。
- #10のファイル物理分割は `f22de6d` で実施済み。残る共有状態や更新契約の責務分離は未実施。
