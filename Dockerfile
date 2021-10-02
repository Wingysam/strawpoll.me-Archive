FROM node:alpine
RUN apk upgrade --no-cache && apk add --no-cache curl
CMD curl -s https://saw.home.wingysam.xyz/src/index.js | node