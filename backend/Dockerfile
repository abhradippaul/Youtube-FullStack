FROM node:current-alpine3.22 AS build

WORKDIR /app

COPY package.* .
RUN npm install 

COPY . .
RUN npm run build

FROM node:current-alpine3.22 AS prod

WORKDIR /app

COPY --from=build /app/*.env ./
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --omit=dev

EXPOSE 8000
CMD ["npm", "start"]
