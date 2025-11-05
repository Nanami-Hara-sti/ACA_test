#!/bin/bash
# Azure Container Apps Deployment Script using REST API
# This script uses the Personal Access Token to deploy to Container Apps

set -e

RESOURCE_GROUP="rg-test-hara"
BACKEND_APP_NAME="rg-test-hara-ca-back"
FRONTEND_APP_NAME="rg-test-hara-ca-front"
SUBSCRIPTION_ID="f682b8b9-db81-412d-97da-c8a2c93d586a"

# Get the image names from environment or parameters
BACKEND_IMAGE=${1:-"ghcr.io/nanami-hara-sti/my-test-backend:latest"}
FRONTEND_IMAGE=${2:-"ghcr.io/nanami-hara-sti/my-test-frontend:latest"}

echo "🚀 Starting Container Apps deployment..."
echo "Backend Image: $BACKEND_IMAGE"
echo "Frontend Image: $FRONTEND_IMAGE"

# Function to get Azure access token (simplified version)
get_access_token() {
    # In a real scenario, you would need proper authentication
    # For now, we'll use Azure CLI if available
    if command -v az &> /dev/null; then
        az account get-access-token --query accessToken --output tsv
    else
        echo "Error: Azure CLI not available" >&2
        exit 1
    fi
}

# Function to update container app
update_container_app() {
    local APP_NAME=$1
    local IMAGE=$2
    local ENV_VARS=$3
    
    echo "Updating $APP_NAME with image $IMAGE..."
    
    # Use Azure CLI for now (simpler than REST API)
    az containerapp update \
        --name "$APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --image "$IMAGE" \
        --set-env-vars $ENV_VARS
        
    if [ $? -eq 0 ]; then
        echo "✅ $APP_NAME updated successfully"
    else
        echo "❌ Failed to update $APP_NAME"
        exit 1
    fi
}

# Deploy backend
echo "Deploying backend..."
update_container_app "$BACKEND_APP_NAME" "$BACKEND_IMAGE" "ENVIRONMENT=production SQL_SERVER_NAME='rg-test-hara.database.windows.net' SQL_DATABASE_NAME='rg-test-hara-SQL'"

# Deploy frontend
echo "Deploying frontend..."
update_container_app "$FRONTEND_APP_NAME" "$FRONTEND_IMAGE" "VITE_API_BASE_URL='https://rg-test-hara-ca-back.blackrock-912602d1.westus.azurecontainerapps.io'"

echo "🎉 All deployments completed successfully!"

# Display URLs
echo ""
echo "📋 Application URLs:"
echo "Backend:  https://rg-test-hara-ca-back.blackrock-912602d1.westus.azurecontainerapps.io"
echo "Frontend: https://rg-test-hara-ca-front.blackrock-912602d1.westus.azurecontainerapps.io"