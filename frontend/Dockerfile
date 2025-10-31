# ---- 1. ベースステージ (依存関係のインストール) ----
# このステージを開発用と本番用ビルドで共有する
FROM node:22-alpine as base
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci # npm installより高速で再現性が高い


# ---- 2. 開発用ステージ ----
# devコンテナーはこのステージを使う
FROM base as development
COPY frontend/ ./
EXPOSE 3000
# 開発サーバーを起動
CMD ["npm", "start"]


# ---- 3. 本番用ステージ ----
# 本番イメージをビルドする時だけ、このステージを使う
FROM base as builder
COPY frontend/ ./
# 本番用の静的ファイルをビルド
RUN npm run build

# nginxを使ってビルド成果物を配信
FROM nginx:stable-alpine as production
COPY --from=builder /workspace/frontend/dist /usr/share/nginx/html
# nginxの設定ファイルをコピー
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
