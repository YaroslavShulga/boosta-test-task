# Production image: compiled NestJS app with production dependencies only.
# Used by the root docker-compose.yml. The dev image is Dockerfile.dev.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
# Installed on the same Alpine (musl) base as the runtime, so argon2's native binary matches.
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
USER node
EXPOSE 3000
# Pending migrations (dist/database/migrations) are applied on start (DB_MIGRATIONS_RUN).
CMD ["node", "dist/main.js"]
