#!/bin/bash

# Container Apps デプロイスクリプト
# 実行前に以下を設定してください:
# 1. Azure CLI ログイン: az login
# 2. サブスクリプションの設定: az account set --subscription "YOUR-SUBSCRIPTION-ID"

set -e

# 変数設定
RESOURCE_GROUP="rg-test-hara-ca"
LOCATION="westus"
ENVIRONMENT_NAME="cae-test-hara"
BACKEND_APP_NAME="rg-test-hara-ca-back"
FRONTEND_APP_NAME="rg-test-hara-ca-front"
CONTAINER_REGISTRY="YOUR-REGISTRY-NAME.azurecr.io"  # 必要に応じて更新

echo "🚀 Container Apps へのデプロイを開始します..."

# 1. Container Registry にイメージをプッシュ
echo "📦 Container Registry にイメージをプッシュしています..."

# バックエンドイメージをタグ付けしてプッシュ
docker tag test-backend-prod:latest $CONTAINER_REGISTRY/test-backend-prod:latest
docker push $CONTAINER_REGISTRY/test-backend-prod:latest

# フロントエンドイメージをタグ付けしてプッシュ  
docker tag test-frontend-prod:latest $CONTAINER_REGISTRY/test-frontend-prod:latest
docker push $CONTAINER_REGISTRY/test-frontend-prod:latest

# 2. バックエンドアプリをデプロイ
echo "🔧 バックエンドアプリをデプロイしています..."
az containerapp create \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $CONTAINER_REGISTRY/test-backend-prod:latest \
  --target-port 8000 \
  --ingress 'external' \
  --env-vars ENVIRONMENT=production PORT=8000 \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 1 \
  --max-replicas 3

# バックエンドのURLを取得
BACKEND_URL=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
echo "✅ バックエンドURL: https://$BACKEND_URL"

# 3. フロントエンドアプリをデプロイ
echo "🎨 フロントエンドアプリをデプロイしています..."
az containerapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $CONTAINER_REGISTRY/test-frontend-prod:latest \
  --target-port 3000 \
  --ingress 'external' \
  --env-vars NODE_ENV=production VITE_API_BASE_URL=https://$BACKEND_URL \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 1 \
  --max-replicas 3

# フロントエンドのURLを取得
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo "🎉 デプロイ完了！"
echo "📱 フロントエンドURL: https://$FRONTEND_URL"
echo "🔧 バックエンドURL: https://$BACKEND_URL"

# 4. 動作確認
echo "🔍 動作確認中..."
curl -s https://$BACKEND_URL/api/health | python3 -m json.tool