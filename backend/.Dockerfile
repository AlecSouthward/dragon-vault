FROM node:24.4.1-alpine3.22 AS builder

WORKDIR /dragon_vault_backend

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

FROM node:24.4.1-alpine3.22

WORKDIR /dragon_vault_backend

COPY --from=builder /dragon_vault_backend /dragon_vault_backend

EXPOSE 8080

CMD ["node", "src/server.js"]