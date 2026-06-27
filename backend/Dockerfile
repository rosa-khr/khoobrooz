FROM node:22-alpine

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

COPY backend/dev-tgju-server.mjs ./

EXPOSE 8000

CMD ["node", "dev-tgju-server.mjs"]
