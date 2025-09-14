FROM node:current-alpine3.22

RUN apk update && apk upgrade
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json .
RUN npm install 

COPY index.js . 

CMD [ "npm", "start" ]