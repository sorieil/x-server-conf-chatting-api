FROM node:lts-alpine as production
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000
RUN yarn global add pm2
RUN yarn global typescript
RUN pm2 install typescript
COPY package*.json ./
RUN yarn
COPY . .
RUN tsc
CMD ["pm2-docker", "start", "ecosystem.config.js", "--env=production"]

