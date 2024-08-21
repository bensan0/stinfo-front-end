FROM node as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod


FROM nginx:stable-alpine3.20 as production-stage
COPY --from=build-stage /app/dist /app/stinfo-front
RUN mkdir -p /etc/nginx/logs \
    && chmod 777 /etc/nginx/logs
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]