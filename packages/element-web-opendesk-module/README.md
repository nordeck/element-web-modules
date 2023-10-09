# Element Web openDesk Module

A module for Element to provide openDesk specific functionality.

It uses the [Module API](https://www.npmjs.com/package/@matrix-org/react-sdk-module-api) to add the openDesk navbar.

<img src="./docs/navbar.png" alt="openDesk navbar" />

## Requirements

The minimal Element version to use this module is `1.11.41`.

## Install the Element Module

Checkout Element and setup the development environment according to [their documentation](https://github.com/vector-im/element-web/#building-from-source).
Go into the `element-web` folder and create a `build_config.yaml` file with the following content:

```yaml
modules:
  - '@nordeck/element-web-widget-opendesk-module@^0.0.1'
```

Build Element and deploy your custom version as described by the original documentation.
In case you want to create a docker-based build process, you might find inspiration in the setup [we use for our e2e tests](../../e2e/src/deploy/elementWeb/Dockerfile).

## Configure the Element Module

The module provides required configuration options:

- `ics_navigation_json_url` - The URL of the `navigation.json` file that contains the navigation structure for the user.
- `ics_silent_url` - The URL of the silent endpoint that is used via inline frame to log in the user.
- `portal_logo_svg_url` - The URL of the portal `logo.svg` file.
- `portal_url` - The URL of the portal.

Example configuration:

```json
{
  "net.nordeck.element_web.module.opendesk": {
    "config": {
      "ics_navigation_json_url": "https://example.com/navigation.json",
      "ics_silent_url": "https://example.com/silent",
      "portal_logo_svg_url": "https://example.com/logo.svg",
      "portal_url": "https://example.com"
    }
  }
}
```

## Running the Element Module Locally

1. Run `yarn build` in this repository.

2. Checkout Element and setup the development environment according to [their documentation](https://github.com/vector-im/element-web/#building-from-source).

3. (In the `element-web` folder) Create a `build_config.yaml` with the following content:

   ```yaml
   # Directory structure:
   # <your projects folder>/
   # ├─ element-web/
   # │  ├─ ...
   # │  ├─ build_config.yaml
   # │  ├─ package.json
   # ├─ matrix-react-sdk/
   # │  ├─ ...
   # ├─ matrix-js-sdk/
   # │  ├─ ...
   # ├─ element-web-modules/
   # │  ├─ packages
   # │  │  ├─ element-web-opendesk-module
   # │  │  │  ├─ build/
   # │  │  │  │  ├─ ...
   # │  │  │  ├─ package.json
   # │  │  │  ├─ ...
   # │  ├─ package.json

   modules:
     - 'file:../element-web-modules/packages/element-web-opendesk-module'
   ```

4. (In the `element-web` folder) Run `yarn start` and access it at `http://localhost:8080`

> **Important**: You must run `yarn build` in this repo and restart Element after each change in the module.
