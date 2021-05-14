# Stage 1
FROM node:10-alpine as build-step
WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npm run build-prod

# Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build-step /usr/src/app/dist/exchange-rabbit /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]