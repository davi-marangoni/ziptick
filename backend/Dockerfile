# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# Apenas dependências de produção
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Código compilado
COPY --from=builder /app/dist ./dist

# Migrations SQL — o migrate.js compilado em dist/db/ resolve '../migration'
# logo espera encontrar os arquivos em dist/migration/
COPY --from=builder /app/src/migration ./dist/migration

# Diretório de uploads persistido via volume
RUN mkdir -p uploads

EXPOSE 3002

# Roda migrations e depois sobe o servidor
CMD ["sh", "-c", "node dist/db/migrate.js && node dist/index.js"]
