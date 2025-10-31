# Red Hat License Manager

Red Hat製品のライセンス情報を管理するWebアプリケーションです。

## 機能

- Red Hat製品の価格表表示
- ダッシュボード機能
- データ分析機能
- レスポンシブデザイン対応

## 技術スタック

### フロントエンド
- React 19.1.1
- Vite (rolldown-vite@7.1.14)
- カスタムCSS（TailwindCSSからの移行）

### バックエンド
- Python 3.12
- FastAPI
- Azure SQL Database (pyodbc)
- Azure Identity (DefaultAzureCredential)
- JWT認証

### インフラ
- Docker & Docker Compose
- Azure Container Apps (本番環境)

## 開発環境のセットアップ

### 前提条件
- Docker & Docker Compose
- Node.js (開発時)
- Python 3.12+ (開発時)

### 起動方法

1. リポジトリをクローン
```bash
git clone <repository-url>
cd test
```

2. Docker Composeで起動
```bash
docker compose up -d
```

3. アプリケーションにアクセス
- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:8001

### 環境変数

以下の環境変数を設定してください：

```env
# 認証設定
AUTH_SERVER_JWKS_URL=<JWKS URL>
AUTH_ISSUER=<認証サーバーのIssuer>
API_AUDIENCE=<APIのAudience>

# データベース設定
SQL_SERVER_NAME=<Azure SQL Serverの名前>
SQL_DATABASE_NAME=<データベース名>
```

## プロジェクト構造

```
├── backend/              # FastAPI バックエンド
│   ├── Dockerfile
│   ├── main.py          # メインアプリケーション
│   └── requirements.txt
├── frontend/            # React フロントエンド
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.jsx      # メインコンポーネント
│   │   ├── components/  # UIコンポーネント
│   │   └── styles/      # スタイルファイル
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml   # 開発環境用
└── .github/            # GitHub Actions
```

## デプロイ

本番環境はAzure Container Appsにデプロイされます。

## ライセンス

このプロジェクトは内部使用のためのものです。