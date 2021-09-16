FROM node:12-alpine
WORKDIR /rs-cart-api-main
COPY package.json ./
RUN npm install && npm run build && npm cache clean --force
COPY * ./

CMD yarn start:prod
