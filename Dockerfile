# -------- deps --------
    FROM node:20-alpine AS deps
    WORKDIR /app
    
    # 仅复制依赖文件，利用缓存
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # -------- build --------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    ENV NEXT_TELEMETRY_DISABLED=1
    RUN npm run build
    
    # -------- runner --------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV NEXT_TELEMETRY_DISABLED=1
    ENV PORT=3000
    
    # standalone 输出会包含 server.js 以及最小依赖
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    
    # 关键：拷贝 standalone 产物
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]