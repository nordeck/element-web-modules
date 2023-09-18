FROM node:20-bullseye as builder

ARG ELEMENT_VERSION="v1.11.40"

WORKDIR /src

# Clone the release tag from element
RUN git clone --depth 1 --branch $ELEMENT_VERSION https://github.com/vector-im/element-web.git /src

RUN yarn --network-timeout=200000 install

# Add all configurations
COPY /module.tgz /src
COPY /build_config.yaml /src
COPY /customisations.json /src

# Build Element
RUN bash /src/scripts/docker-package.sh

# Workaround for https://github.com/vector-im/element-web/issues/25941
RUN sed -i 's/emitter.emit("closed")/emitter.emit("DISABLED")/' webapp/bundles/*/bundle.js

# App
FROM nginx:bookworm

COPY --from=builder /src/webapp /app

# Override default nginx config
COPY --from=builder /src/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html \
 && ln -s /app /usr/share/nginx/html