FROM node:24-alpine3.22 AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM gcr.io/distroless/nodejs24-debian12:nonroot-amd64 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER nonroot:nonroot
CMD ["dist/server.js"]
