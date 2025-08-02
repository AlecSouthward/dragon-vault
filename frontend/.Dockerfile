FROM nginx:1.29.0-alpine3.22-slim

WORKDIR /dragon_vault_frontend

COPY . .

RUN npm install && npm run build && npm install -g serve

CMD ["serve", "-s", "build"]