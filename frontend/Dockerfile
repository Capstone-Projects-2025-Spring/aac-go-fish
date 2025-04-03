# Stage 1: Build the React app
FROM node:23.11-bookworm-slim@sha256:f2cf744a59dcdd05b354754704a527de9fb0c5d8e924b0fc3628dedc23573c39 AS builder
WORKDIR /app

ARG REACT_APP_BACKEND_DOMAIN
ENV REACT_APP_BACKEND_DOMAIN localhost/api

# Leverage caching by installing dependencies first
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code and build for production
COPY . ./
RUN npm run build

# Stage 2: Development environment
FROM node:23.11-bookworm-slim@sha256:f2cf744a59dcdd05b354754704a527de9fb0c5d8e924b0fc3628dedc23573c39 AS dev
WORKDIR /app

# Install dependencies again for development
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the full source code
COPY . ./

# Expose port for the development server
EXPOSE 3000

CMD ["npm", "start"]


# Stage 3: Production environment
FROM nginx:1.27.4-alpine@sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591 AS prod

# Copy the production build artifacts from the build stage
COPY --from=builder /app/build /usr/share/nginx/html

COPY --from=metadata ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
