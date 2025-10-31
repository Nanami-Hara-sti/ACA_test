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

# (重要) FastAPIの「依存関係」としてトークンを検証する関数
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
        "https://react-test.company.com" # 将来の本番フロント
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- APIエンドポイントの定義 ---

@app.get("/api/health") # 動作確認用
def health_check():
    return {"status": "ok"}

@app.get("/api/test-db") # DB接続テスト用
def test_db(user_email: str = Depends(verify_token)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT TOP 1 SkuSelected FROM SelectionHistory")
        row = cursor.fetchone()
        conn.close()
        return {"message": f"DB connected successfully as {user_email}", "data": row[0] if row else "No data"}
    except Exception as e:
        # get_db_connection内でHTTPExceptionが送出されるはずだが、念のため
        raise HTTPException(status_code=500, detail=f"DB query failed: {e}")

# aca_test_development_steps.md の /api/upload
@app.post("/api/upload")
def upload_file(user_email: str = Depends(verify_token)): # 認証必須
    # この時点で user_email に認証済みユーザーのEmailが入っている
    
    # ... ここにファイル保存とDB保存のロジックを実装 ...
    
    return {"message": "File uploaded successfully by " + user_email}

# サーバー起動 (ローカル実行用)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
