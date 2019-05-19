FROM node:11-alpine

WORKDIR /app/
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk add --update --no-cache --virtual build-dependencies build-base bash curl python &&\
  mkdir -p /opt && \
  curl -sL "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2" | tar jx && \
  mv phantomjs-2.1.1-linux-x86_64 /opt/phantomjs && \
  ln -s /opt/phantomjs/bin/phantomjs /usr/bin/phantomjs && \
  curl -sL "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar zx -C / && \
  npm i && \
  apk del build-dependencies  && \
  rm -rf /usr/share/man /tmp/* /var/tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 3000
CMD ["npm", "run", "deploy"]
