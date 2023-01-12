FROM node:alpine as build-stage

WORKDIR /dtts-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./ .
RUN yarn run build


FROM caddy:alpine as serve-stage

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build-stage /dtts-client/dist /dtts-client

