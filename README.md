# Front & Air Mass Weather Simulator

高校地学の学習を目的にした、前線・気団・天気変化のシミュレーターです。  
寒冷前線、温暖前線、停滞前線、閉塞前線の違いを、時間変化と観測値のつながりから視覚的に学べるように設計しています。

このリポジトリのアプリは、実際の気象観測や予報を提供するものではありません。高校教科書レベルの典型的な気象変化を理解するための教育用コンテンツです。

## Features

- 前線の種類ごとに、典型的な天気変化を切り替えて比較できます
- 観測地点と時間を変えながら、気温・気圧・湿度・風の変化を追えます
- 天気図アニメーション、観測グラフ、学習パネル、クイズを一画面で確認できます
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
- `js/learning.js`: 学習パネルとクイズ表示ロジック
- `js/app.js`: UI 描画とイベント制御
- `.github/workflows/ci.yml`: 構文チェック用ワークフロー
- `.github/workflows/deploy-pages.yml`: GitHub Pages デプロイ用ワークフロー

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
