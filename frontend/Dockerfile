# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# VITE_API_URL vazio → axios usa URLs relativas → Nginx proxia para o backend
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build

# ── Stage 2: serve com Nginx ──────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
