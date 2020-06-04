FROM node:lts-alpine as production
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4001
RUN yarn global add pm2
RUN yarn global typescript
RUN pm2 install typescript
COPY package*.json ./
RUN yarn --silent
COPY ./src .
COPY ecosystem.config.json .
COPY tsconfig.json .
COPY typings.d.ts .
RUN tsc
RUN rm -rf ./src
RUN rm typings.d.ts tsconfig.json
RUN yarn global remove typescript
CMD ["pm2-docker", "start", "ecosystem.config.json", "--env", "production"]

