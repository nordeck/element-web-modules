FROM node:20-bookworm AS builder

ARG ELEMENT_VERSION="master"

WORKDIR /src

# Clone the release tag from element
RUN git clone --depth 1 --branch $ELEMENT_VERSION https://github.com/element-hq/element-web.git /src

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
