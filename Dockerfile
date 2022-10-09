FROM node:16.17.1-alpine3.16

ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

RUN npm install -g pnpm@7 modclean

USER node

WORKDIR /home/node

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --production

COPY --chown=node:node index.js ./

EXPOSE 3000

CMD [ "dumb-init", "node", "index.js" ]
