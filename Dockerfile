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
ARG NEXT_PUBLIC_CAP_SITE_KEY
ARG CAP_BACKEND_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

ENV AUTH_SECRET=$AUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

ENV NEXT_PUBLIC_CAP_SITE_KEY=$NEXT_PUBLIC_CAP_SITE_KEY
ENV CAP_BACKEND_URL=$CAP_BACKEND_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_CLOUDFRONT_URL
ENV NEXT_PUBLIC_CLOUDFRONT_URL=$NEXT_PUBLIC_CLOUDFRONT_URL
ARG AWS_S3_BUCKET_NAME
ENV AWS_S3_BUCKET_NAME=$AWS_S3_BUCKET_NAME

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