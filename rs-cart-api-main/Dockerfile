FROM node:12-alpine AS base
WORKDIR /app

#Dependencies
COPY package*.json ./
RUN npm install

#Build
WORKDIR /app
COPY . .
RUN npm run build

#Application
FROM node:12-alpine AS application
COPY --from=base /app/package*.json ./
RUN npm install --only=production
RUN npm install pm2 -g
COPY --from=base /app/dist ./dist

USER node
ENV PORT=4000
EXPOSE 4000
ENTRYPOINT [ "node", "dist/main.js" ]




# COPY package*.json ./
# RUN npm install && npm run build && npm cache clean --force
# COPY * ./
# USER node
# EXPOSE 4000
# ENTRYPOINT [ "node", "dist/main.js" ]
