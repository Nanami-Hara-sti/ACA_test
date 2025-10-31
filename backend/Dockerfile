# ベースイメージ
FROM python:3.12-slim

WORKDIR /workspace/backend

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    apt-transport-https \
    ca-certificates \
    lsb-release

# 1. Azure CLI のインストール (az login のため)
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# 2. Microsoft ODBC Driver の GPG キーを追加
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg

# 3. Microsoft の Debian リポジトリを追加
RUN echo "deb [signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/mssql-release.list

# 4. パッケージリストを再更新し、ODBCドライバと開発ツールをインストール
# (ACCEPT_EULA=Y が重要です)
RUN apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev

# Pythonライブラリのインストール
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
