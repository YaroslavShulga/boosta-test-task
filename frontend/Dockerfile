# Production image: `next build` with `output: "standalone"`, run by the minimal server.js.
# Used by the root docker-compose.yml. The dev image is Dockerfile.dev.

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# public/ is optional (git doesn't keep an empty folder), but the runtime stage copies it.
RUN mkdir -p public
# The `/api/*` rewrite destination is serialized into the build output (routes manifest),
# so the backend address is needed at build time, not only at runtime.
ARG BACKEND_URL=http://backend:3000
ENV BACKEND_URL=${BACKEND_URL}
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001 \
    HOSTNAME=0.0.0.0
ARG BACKEND_URL=http://backend:3000
# Read at runtime by serverFetch (Server Components call the API directly).
ENV BACKEND_URL=${BACKEND_URL}
# standalone doesn't include public/ and .next/static; server.js serves them from here.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3001
CMD ["node", "server.js"]
