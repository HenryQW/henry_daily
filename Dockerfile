FROM node:alpine
WORKDIR /app/
COPY . .

RUN rm -rf node_modules .git .vscode .gitignore && \
  apk add --update --no-cache build-base bash curl python &&\
  mkdir -p /opt && \
  curl -sL "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2" | tar jx && \
  mv phantomjs-2.1.1-linux-x86_64 /opt/phantomjs && \
  ln -s /opt/phantomjs/bin/phantomjs /usr/bin/phantomjs && \
  curl -sL "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar zx -C / && \
  npm install && \
  apk del build-base bash curl python gcc make g++ bash && \
  rm -rf /usr/share/man /tmp/* /var/tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]
