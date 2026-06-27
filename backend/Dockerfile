FROM node:22-alpine

WORKDIR /app/backend
ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN --mount=type=secret,id=npm_ca,required=false \
    if [ -f /run/secrets/npm_ca ]; then \
      npm_config_cafile=/run/secrets/npm_ca npm ci --omit=dev; \
    else \
      npm ci --omit=dev; \
    fi

COPY --chown=node:node backend/dev-tgju-server.mjs ./

USER node
EXPOSE 8000

CMD ["node", "dev-tgju-server.mjs"]
