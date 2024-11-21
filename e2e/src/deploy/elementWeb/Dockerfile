# This dockerfile is used both by the e2e testing and the element-with-modules CI

FROM node:20-bookworm AS builder

ARG ELEMENT_VERSION="master"

WORKDIR /src

# Clone the release tag from element
# Cannot be shallow because Element's build script crashes when cloning an untagged commit
# This change can be reverted after https://github.com/element-hq/element-web/pull/28503
RUN git clone --branch $ELEMENT_VERSION https://github.com/element-hq/element-web.git /src

RUN yarn --network-timeout=200000 install

# Add all configurations
COPY /*.tgz /src/
COPY /build_config.yaml /src
COPY /customisations.json /src

# Build Element
RUN bash /src/scripts/docker-package.sh

# App
FROM nginx:bookworm

COPY --from=builder /src/webapp /app

# Override default nginx config
COPY --from=builder /src/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html \
 && ln -s /app /usr/share/nginx/html
