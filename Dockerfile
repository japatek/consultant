FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --maxsockets=1 || npm ci --maxsockets=1 || npm ci --maxsockets=1

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. DECLARE BUILD-TIME VARIABLES HERE
ARG AUTH_SECRET
ARG DATABASE_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV AUTH_SECRET=$AUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p ./public && cp -r /app/public/* ./public 2>/dev/null || true

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]