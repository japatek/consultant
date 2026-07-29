# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json tsconfig.json ./
# RUN npm ci
# COPY src ./src
# RUN npm run build

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# COPY package*.json ./
# RUN npm ci --only=production
# COPY --from=builder /app/dist ./dist

# EXPOSE 8080
# ENV PORT=8080
# CMD ["node", "dist/index.js"]


# Comment for deploy and build with github actions

FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# 1. Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# 2. Copy the pre-built dist folder from your GitHub repository
COPY dist ./dist

# 3. Expose port and run the server
EXPOSE 8080
ENV PORT=8080
CMD ["node", "dist/index.js"]