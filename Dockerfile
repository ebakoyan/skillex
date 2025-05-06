FROM node:22.15.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx nest build

EXPOSE $APP_PORT
EXPOSE $APP_PORT_DEBUG

CMD ["sh", "-c", "node dist/common/db/migrate.js && npx nest start --debug 0.0.0.0:$APP_PORT_DEBUG --watch"]
