FROM node:24-alpine AS build
WORKDIR /app
COPY package.* .
RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine AS prod
WORKDIR /app
COPY *.env ./
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist

EXPOSE 8000
CMD ["npm", "run", "start"]
# CMD ["/bin/sh"]
