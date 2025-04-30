# —— 建置階段 —— 
FROM node:18-alpine AS builder
WORKDIR /app

# 1) 複製並安裝所有依賴（含 devDependencies）
COPY package*.json ./
RUN npm ci

# 2) 複製原始碼並編譯
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# —— 執行階段 —— 
FROM node:18-alpine AS runner
WORKDIR /app

# 3) 只安裝 production 依賴
COPY package*.json ./
RUN npm ci --omit=dev

# 4) 複製編譯後程式
COPY --from=builder /app/dist ./dist

# 5) 預設環境變數（可被 docker run --env-file 覆寫）
ENV PORT=3000

EXPOSE 3000
CMD ["node", "dist/index.js"]
