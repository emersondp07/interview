FROM node:22-bullseye-slim

WORKDIR /app

COPY . .

RUN yarn install

RUN npx prisma generate

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]