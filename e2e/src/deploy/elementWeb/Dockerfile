FROM node:20-bullseye as builder

### ARG ELEMENT_VERSION="v1.11.46"
ARG USE_CUSTOM_SDKS=true
ARG REACT_SDK_REPO="https://github.com/nordeck/matrix-react-sdk.git"
ARG REACT_SDK_BRANCH="nic/feat/ms5-widget-toggles"
ARG JS_SDK_REPO="https://github.com/nordeck/matrix-js-sdk.git"
ARG JS_SDK_BRANCH="nic/feat/ms5-widget-toggles"
ARG ELEMENT_WEB_REPO="https://github.com/nordeck/element-web.git"
ARG ELEMENT_BRANCH="nic/feat/ms5-widget-toggles"

RUN apt-get update && apt-get install -y git dos2unix

WORKDIR /src

# Clone the release tag from element
RUN git clone --depth 1 --branch $ELEMENT_BRANCH $ELEMENT_WEB_REPO /src

RUN dos2unix /src/scripts/docker-link-repos.sh && bash /src/scripts/docker-link-repos.sh

RUN yarn --network-timeout=200000 install

# Add all configurations
COPY /*.tgz /src/
COPY /build_config.yaml /src
COPY /customisations.json /src

# Build Element
### RUN bash /src/scripts/docker-package.sh
RUN VERSION=${ELEMENT_BRANCH} yarn build
RUN echo ${ELEMENT_BRANCH} > /src/webapp/version

# Workaround for https://github.com/vector-im/element-web/issues/25941
RUN sed -i 's/emitter.emit("closed")/emitter.emit("DISABLED")/' webapp/bundles/*/bundle.js

# App
FROM nginx:bookworm

COPY --from=builder /src/webapp /app

# Override default nginx config
COPY --from=builder /src/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html \
 && ln -s /app /usr/share/nginx/html
