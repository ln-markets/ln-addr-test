FROM node:16.17.0-alpine3.16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apk update && apk add \
    -U python3 \
    make 
WORKDIR /home/node/app

COPY package*.json ./
RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3003

CMD [ "node", "index.js" ]