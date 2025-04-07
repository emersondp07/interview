FROM node:22.14.0-alpine

WORKDIR /app

EXPOSE 3000

RUN npm install -g pnpm && \
  npm install serverless -g

RUN pnpm install --frozen-lockfile --no-verify-store-integrity

CMD [ "pnpm", "start:dev", "--host", "0.0.0.0" ]