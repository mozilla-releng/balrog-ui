FROM node:current

COPY .neutrinorc.js package.json webpack.config.js /app/
COPY src/ /app/src/

WORKDIR /app
