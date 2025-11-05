#!/bin/bash

# Container Apps シンプルデプロイ（GitHub Container Registry使用）
# 前提: GitHub Actions が設定されてイメージが ghcr.io にプッシュされている

set -e

# 変数設定（実際の値に更新してください）
RESOURCE_GROUP="rg-test-hara-ca"
ENVIRONMENT_NAME="cae-test-hara"
BACKEND_APP_NAME="rg-test-hara-ca-back"
FRONTEND_APP_NAME="rg-test-hara-ca-front"

echo "🚀 Container Apps への直接デプロイを開始します..."

# 1. バックエンドアプリをデプロイ（既存のGHCRイメージを使用）
echo "🔧 バックエンドアプリをデプロイしています..."
az containerapp create \
  --name $BACKEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image ghcr.io/nanami-hara-sti/aca_test/backend:latest \
  --target-port 8000 \
  --ingress 'external' \
  --env-vars ENVIRONMENT=production \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --registry-server ghcr.io

# バックエンドのURLを取得
BACKEND_URL=$(az containerapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
echo "✅ バックエンドURL: https://$BACKEND_URL"

# 2. フロントエンドアプリをデプロイ
echo "🎨 フロントエンドアプリをデプロイしています..."
az containerapp create \
  --name $FRONTEND_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image ghcr.io/nanami-hara-sti/aca_test/frontend:latest \
  --target-port 3000 \
  --ingress 'external' \
  --env-vars VITE_API_BASE_URL=https://$BACKEND_URL \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --registry-server ghcr.io

# フロントエンドのURLを取得
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo "🎉 デプロイ完了！"
echo "📱 フロントエンドURL: https://$FRONTEND_URL"
echo "🔧 バックエンドURL: https://$BACKEND_URL"

# 3. 動作確認
echo "🔍 動作確認中..."
sleep 10  # コンテナ起動待ち
curl -f https://$BACKEND_URL/api/health || echo "⚠️  バックエンドがまだ起動中です"