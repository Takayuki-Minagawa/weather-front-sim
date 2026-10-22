# Front & Air Mass Weather Simulator

高校地学の学習を目的にした、前線・気団・天気変化のシミュレーターです。  
寒冷前線、温暖前線、停滞前線、閉塞前線の違いを、時間変化と観測値のつながりから視覚的に学べるように設計しています。

このリポジトリのアプリは、実際の気象観測や予報を提供するものではありません。高校教科書レベルの典型的な気象変化を理解するための教育用コンテンツです。

## Features

- 前線の種類ごとに、典型的な天気変化を切り替えて比較できます
- 観測地点と時間を変えながら、気温・気圧・湿度・風の変化を追えます
- 天気図アニメーション、観測グラフ、学習パネル、クイズを一画面で確認できます
- **空の窓**: 観測地点から見上げた空（雲の種類・雨・雷・吹き流しの風向）を、雲の愛称（ひつじ雲、入道雲など）と一緒に表示します
- **予報士チャレンジ**: 「6時間後の気温・気圧・天気を予想する」予報モードと、「24時間の観測記録から前線を当てる」探偵モードでスコアと称号を競えます
- **観天望気 ホント？ウソ？**: 天気のことわざを「当たりそう / 迷信っぽい」で予想してからめくり、科学的な説明を確かめます
- **前線トリビアとバッジ**: 前線の雑学カードと、アプリを探検すると集まる 8 種類のバッジ（記録はブラウザの localStorage のみに保存）
- キーボード操作（← → で 1 時間移動、スペースで再生 / 停止）と、`prefers-reduced-motion` によるアニメーション抑制に対応しています
- ダーク / ライトテーマの切替と、日本語 / 英語の表示切替に対応しています
- ビルド不要の静的サイトなので、GitHub Pages にそのまま公開できます

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- GitHub Actions
- GitHub Pages

## Local Development

ローカルで簡易サーバーを起動する場合:

```bash
npm run serve
```

ブラウザで `http://localhost:4173` を開いて確認します。

JavaScript の構文チェック:

```bash
npm run check:js
```

## Repository Structure

- `index.html`: 画面レイアウト
- `favicon.svg`: ブラウザタブ用のファビコン
- `styles.css`: スタイルとアニメーション
- `js/data.js`: 前線・気団・地点・クイズの定義
- `js/i18n.js`: 日英表示と UI 文言の切替
- `js/simulator.js`: 前線ごとの典型的な観測値を生成するロジック
- `js/charts.js`: 折れ線グラフ（スパークライン）の SVG 生成
- `js/play.js`: 空の窓・予報士チャレンジ・観天望気カード・トリビア・バッジの定義とロジック
- `js/learning.js`: 学習パネルとクイズ表示ロジック
- `js/app.js`: UI 描画とイベント制御
- `.github/workflows/ci.yml`: 構文チェック用ワークフロー
- `.github/workflows/deploy-pages.yml`: GitHub Pages デプロイ用ワークフロー

## Design References

「楽しく学べる」要素を加えるにあたり、次のような既存の教材・研究を参考に内容を整理しました。

| 参考にした考え方 | 出典 | このアプリでの反映 |
| --- | --- | --- |
| 見えないものを可視化し、操作に即座に反応する複数の表現（グラフ・数値・図）を連動させる | [PhET Interactive Simulations](https://www.colorado.edu/csl/programs/phet-interactive-simulations) | 天気図・グラフ・空の窓が同じ時刻で連動 |
| 「予想してから確かめる (Can You Guess)」型の問いと、修了時のバッジ | [Weather Wows (EDULEARN25)](https://library.iated.org/view/KAYE2025WEA) | 予報士チャレンジ、バッジコレクション |
| 予想と実際の差をスコア化する推測ゲーム | ClimoGuesser（気候を推測して得点を競う iOS アプリ） | 予報モードの得点・連続正解・称号 |
| 観天望気は雲や空に関するものほど気象学で説明しやすく、動物に関するものは諸説ある | [ウェザーニュース](https://weathernews.jp/soramagazine/201604/09/)、[東洋経済オンライン](https://toyokeizai.net/articles/-/141844?display=b) | ことわざカードを「当たりやすい / 条件しだい / 根拠ははっきりしない」の 3 段階で判定 |
| 前線という用語はベルゲン学派（ビヤクネスら）が第一次世界大戦期に導入。戦場の前線にたとえたという説明は通説 | [University of Bergen](https://www.uib.no/en/gfi/115011/deciphering-ancestry-cyclones-hencoop)、[Pima Open Pressbooks](https://pimaopen.pressbooks.pub/weatherandclimate/?p=733) | トリビアでは「〜とも言われます」と断定を避けて紹介 |
| 寒冷前線通過時の気温・湿度の急低下、気圧上昇、風向の急変、突風（疾風） | [コトバンク「寒冷前線」](https://kotobank.jp/word/%E5%AF%92%E5%86%B7%E5%89%8D%E7%B7%9A-49779) | トリビア、予報モードの解説 |

## Deployment

このリポジトリは GitHub Actions を使って GitHub Pages へデプロイする構成です。

1. GitHub の `Settings > Pages` を開く
2. `Build and deployment` の `Source` を `GitHub Actions` にする
3. `main` ブランチへ push すると、デプロイワークフローが実行されます

Pages には公開に必要な静的ファイルのみをデプロイし、README や補助ファイルは配信物に含めない構成にしています。

## Notes

- 教育目的のシミュレーションであり、実際の天気予報や防災判断には使用しないでください
- 数値や変化は、理解しやすさを優先した典型例です
- 実況データや外部 API には依存していません
