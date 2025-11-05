import os
import jwt
import pyodbc
import uvicorn
import struct
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from azure.identity import DefaultAzureCredential
from functools import lru_cache
from dotenv import load_dotenv

# .env ファイルから環境変数を読み込む
load_dotenv()

# --- 認証 (JWT検証) の設定 ---
# aca_test_development_steps.md の内容
AUTH_SERVER_JWKS_URL = os.environ.get("AUTH_SERVER_JWKS_URL")
AUTH_ISSUER = os.environ.get("AUTH_ISSUER")
API_AUDIENCE = os.environ.get("API_AUDIENCE")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # 実際には使わないがFastAPIに必要

@lru_cache() # JWKSは一度取得したらキャッシュする
def get_jwks_client():
    # JWKS URLが設定されていない場合はエラーを出す
    if not AUTH_SERVER_JWKS_URL:
        raise HTTPException(status_code=500, detail="AUTH_SERVER_JWKS_URL is not set")
    return jwt.PyJWKClient(AUTH_SERVER_JWKS_URL)

# FastAPIの「依存関係」としてトークンを検証する関数
async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        jwks_client = get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=AUTH_ISSUER,
            audience=API_AUDIENCE
        )
        return data.get("email") # 検証OK。Emailを返す
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token is invalid: {e}")

# --- DB接続の設定 ---
def get_db_connection():
    server_name = os.environ.get("SQL_SERVER_NAME")
    db_name = os.environ.get("SQL_DATABASE_NAME")

    # (重要) Azureへの認証
    # ローカル実行時: VSCodeやAzure CLIのログイン情報が使われる
    # ACA(本番)実行時: マネージドIDが使われる
    credential = DefaultAzureCredential()

    # 接続文字列の作成
    driver = "{ODBC Driver 18 for SQL Server}"
    conn_str = f"DRIVER={driver};SERVER={server_name};DATABASE={db_name};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30"

    try:
        # アクセストークンを取得
        token_bytes = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
        token_struct = struct.pack(f"<I{len(token_bytes)}s", len(token_bytes), token_bytes)

        # トークンを使って pyodbc 接続
        conn = pyodbc.connect(conn_str, attrs_before={1256: token_struct})
        return conn
    except Exception as e:
        # 接続失敗時に詳細なエラーをログに出力
        print(f"DB Connection Error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database connection failed: {e}")


# --- FastAPIアプリの初期化 ---
app = FastAPI()

# CORS設定 (aca_test_development_steps.md フェーズ2-1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # ローカルのReactアプリ (CRA)
        "http://localhost:5173", # ローカルのReactアプリ (Vite)
        "http://localhost:3001", # Docker Compose フロントエンド
        "https://react-test.company.com" # 将来の本番フロント
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- APIエンドポイントの定義 ---

@app.get("/api/health") # 動作確認用
def health_check():
    return {
        "status": "ok",
        "service": "Red Hat License Manager API",
        "version": "1.0.0",
        "environment": os.environ.get("ENVIRONMENT", "development")
    }

@app.get("/api/products") # 製品データ取得用（認証なし・デモ用）
def get_products():
    """Red Hat製品一覧を取得（デモデータ）"""
    demo_products = [
        {
            "category": "RHEL",
            "sku": "RH00001", 
            "name": "Red Hat Enterprise Linux Server, Standard",
            "price_std": "¥102,700",
            "price_offer": "¥92,000",
            "sockets": "2",
            "cores": "N/A", 
            "support": "Standard",
            "uom": "Per 2 Sockets"
        },
        {
            "category": "OpenShift",
            "sku": "MW00123",
            "name": "Red Hat OpenShift Platform Plus, Standard", 
            "price_std": "¥2,580,000",
            "price_offer": "¥2,322,000",
            "sockets": "N/A",
            "cores": "100",
            "support": "Standard", 
            "uom": "Per 100 Cores"
        },
        {
            "category": "Ansible",
            "sku": "SV00456",
            "name": "Red Hat Ansible Automation Platform",
            "price_std": "¥1,935,000", 
            "price_offer": "¥1,741,500",
            "sockets": "N/A",
            "cores": "N/A",
            "support": "Premium",
            "uom": "Per 100 Nodes"
        }
    ]
    
    return {
        "success": True,
        "message": "Products retrieved successfully", 
        "data": demo_products,
        "count": len(demo_products)
    }

@app.get("/api/test-db") # DB接続テスト用
def test_db():
# def test_db(user_email: str = Depends(verify_token)):
    try:
        # DB設定がない場合はモックレスポンス
        if not os.environ.get("SQL_SERVER_NAME"):
            return {
                "success": True,
                "message": "DB test (mock mode - no database configured)",
                "data": "mock_data_sample", 
                "environment": os.environ.get("ENVIRONMENT", "development")
            }
            
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 SkuSelected FROM SelectionHistory")
        row = cursor.fetchone()
        conn.close()
        return {
            "success": True,
            "message": f"DB connected successfully",
            "data": row[0] if row else "No data",
            "environment": os.environ.get("ENVIRONMENT", "development")
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"DB connection failed: {str(e)}",
            "data": None,
            "environment": os.environ.get("ENVIRONMENT", "development")
        }

# aca_test_development_steps.md の /api/upload
@app.post("/api/upload")
def upload_file():
# def upload_file(user_email: str = Depends(verify_token)): # 認証必須
    # 開発環境では認証をスキップ
    user_email = "test@example.com"  # デモ用
    
    # デモ用の簡単な応答
    return {
        "success": True,
        "message": f"File upload endpoint ready (user: {user_email})",
        "note": "This is a demo endpoint for Container Apps deployment test"
    }

# サーバー起動 (ローカル実行用)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
