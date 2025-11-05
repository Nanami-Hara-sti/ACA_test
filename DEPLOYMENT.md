# Container Apps デプロイメントガイド

## 🚀 GitHub Container Registry を使用したデプロイ

このプロジェクトは GitHub Actions と GitHub Container Registry (GHCR) を使用して Azure Container Apps にデプロイします。

## 📋 前提条件

### 1. Azureリソースの準備
Azureポータルまたは Azure CLI で以下のリソースを作成してください：

```bash
# リソースグループの作成
az group create --name rg-test-hara --location westus

# Container Apps 環境の作成
az containerapp env create \
  --name ca-env-test \
  --resource-group rg-test-hara \
  --location westus
```

### 2. Azure Service Principal の作成（OpenID Connect用）
GitHub Actions からAzureにアクセスするためのService Principalを作成：

```bash
# Service Principal を作成
az ad sp create-for-rbac \
  --name "sp-github-containerapp" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-test-hara \
  --sdk-auth

# Federated credential を設定
az ad app federated-credential create \
  --id {client-id} \
  --parameters '{
    "name": "github-federated-credential",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:Nanami-Hara-sti/ACA_test:ref:refs/heads/main",
    "description": "GitHub Actions federated credential",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 3. GitHubリポジトリのSecretsとVariablesの設定

#### **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets)
- `AZURE_CLIENT_ID`: Service PrincipalのClient ID
- `AZURE_TENANT_ID`: Azure AD Tenant ID  
- `AZURE_SUBSCRIPTION_ID`: Azure Subscription ID

#### **Repository Variables** (Settings → Secrets and variables → Actions → Variables)
- `AZURE_RESOURCE_GROUP`: `rg-test-hara`
- `AZURE_CONTAINER_APP_ENVIRONMENT`: `ca-env-test`
- `BACKEND_APP_NAME`: `rg-test-hara-ca-back`
- `FRONTEND_APP_NAME`: `rg-test-hara-ca-front`

## 🔄 デプロイの流れ

### 自動デプロイ
1. `main`ブランチにコードをプッシュ
2. GitHub Actions が自動実行される
3. Docker イメージが GHCR にプッシュされる
4. Container Apps にデプロイされる

### 手動デプロイ
1. GitHub リポジトリの Actions タブ
2. "Build, Push to GHCR and Deploy to Container Apps" ワークフロー
3. "Run workflow" をクリック

## 📊 デプロイ後の確認

デプロイが完成すると、GitHub Actions のログに以下のURLが表示されます：
- Backend URL: `https://rg-test-hara-ca-back.{region}.azurecontainerapps.io`
- Frontend URL: `https://rg-test-hara-ca-front.{region}.azurecontainerapps.io`

### API動作確認
```bash
# ヘルスチェック
curl https://rg-test-hara-ca-back.{region}.azurecontainerapps.io/api/health

# 製品データ取得
curl https://rg-test-hara-ca-back.{region}.azurecontainerapps.io/api/products
```

## 🛠️ トラブルシューティング

### Container Apps のログ確認
```bash
# バックエンドのログ
az containerapp logs show \
  --name rg-test-hara-ca-back \
  --resource-group rg-test-hara

# フロントエンドのログ  
az containerapp logs show \
  --name rg-test-hara-ca-front \
  --resource-group rg-test-hara
```

### Container Apps の状態確認
```bash
# アプリの状態確認
az containerapp show \
  --name rg-test-hara-ca-back \
  --resource-group rg-test-hara \
  --query "{name:name,status:properties.runningStatus,url:properties.configuration.ingress.fqdn}"
```

### GitHub Container Registry の確認
リポジトリの Packages タブで Docker イメージが正しくプッシュされているか確認してください。

## 📝 設定ファイル

### API URL設定
フロントエンドのAPI URL設定は以下のファイルで管理されています：
- `frontend/src/config/api.js`

### Docker設定
- バックエンド: `backend/Dockerfile`
- フロントエンド: `frontend/Dockerfile`

### GitHub Actions
- ワークフロー: `.github/workflows/deploy.yml`