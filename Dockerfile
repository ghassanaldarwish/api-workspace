FROM node:20-alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production
RUN npm prune --production
RUN npm i rimraf

FROM node:20-alpine
ENV NODE_ENV=production
RUN addgroup -g 1001 -S user_group
RUN adduser -S application -u 1001
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder --chown=application:user_group /app/node_modules ./node_modules
COPY --from=builder --chown=application:user_group /app/build ./build
COPY --from=builder --chown=application:user_group /app/package.json ./package.json
COPY --from=builder --chown=application:user_group /app/package-lock.json ./package-lock.json
EXPOSE 4444
CMD ["npm","run", "start"]
