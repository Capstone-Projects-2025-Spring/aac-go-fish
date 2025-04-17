FROM node:23.11-bookworm-slim@sha256:f2cf744a59dcdd05b354754704a527de9fb0c5d8e924b0fc3628dedc23573c39 AS builder
WORKDIR /app

ARG REACT_APP_BACKEND_DOMAIN
ENV REACT_APP_BACKEND_DOMAIN=bankruptcyassociation.com

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./
RUN npm run build

FROM node:23.11-bookworm-slim@sha256:f2cf744a59dcdd05b354754704a527de9fb0c5d8e924b0fc3628dedc23573c39 AS dev
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]


FROM nginx:1.27.4-alpine@sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591 AS prod

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=metadata ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
