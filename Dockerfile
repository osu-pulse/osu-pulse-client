FROM node:alpine as build-stage

WORKDIR /osu-pulse-client

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./ .
RUN yarn web:build


FROM caddy:alpine as serve-stage

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build-stage /osu-pulse-client/dist /osu-pulse-client

