FROM node:18-alpine

WORKDIR /app
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
RUN yarn config set npmRegistryServer https://registry.yarnpkg.com
RUN yarn

ADD . /app

EXPOSE 3000

CMD ["yarn", "start:prod"]
