# Element Web Guest Module

A module to allow guests to register with Element using the [Module API](https://www.npmjs.com/package/@matrix-org/react-sdk-module-api).

Users get a link to an [ask to join](https://spec.matrix.org/v1.11/client-server-api/#mroomjoin_rules) room, enter their name, and can participate in the room without any further registration.

This was initially created to allow non-organisation members to join [NeoDateFix](https://github.com/nordeck/matrix-meetings) meeting rooms, even if they don't have a user account in the private and potentially non-federated homeserver.

This module depends on having the `feature_ask_to_join` set to `true` in Element Web's `config.json` and `disable_guests` set to false:

```json
  "disable_guests": false,
  "features": {
    "feature_ask_to_join": true
  },
```

Guest users...

- ... have a **real user account** on the Homeserver.
- ... get a **username** with the (configurable) pattern `@guest-<random-identifier>`.
- ... have a **display name** that always includes the (configurable) suffix ` (Guest)`.
- ... are **restricted** in what they can do (can't create rooms or participate in direct messages on the homeserver).
- ... are only **temporary** and will be deactivated after a lifetime of (configurable) 24 hours.

## Requirements

The minimal Element version to use this module is `1.11.84`.

## Install the Element Module

> This module requires the [Synapse Guest Module](https://github.com/nordeck/element-web-modules/tree/main/packages/synapse-guest-module) to be installed.

Checkout Element and setup the development environment according to [their documentation](https://github.com/vector-im/element-web/#building-from-source).
Go into the `element-web` folder and create a `build_config.yaml` file with the following content:

```yaml
modules:
  - '@nordeck/element-web-guest-module@^1.0.0'
```

Also create a `customisations.json` file with the following content:

```json
{
  "src/customisations/ComponentVisibility.ts": "node_modules/@nordeck/element-web-guest-module/customisations/ComponentVisibility.ts"
}
```

Build Element and deploy your custom version as described by the original documentation.
In case you want to create a docker-based build process, you might find inspiration in the setup [we use for our e2e tests](../../e2e/src/deploy/elementWeb/Dockerfile).

## Configure the Element Module

The module provides required configuration options:

- `guest_user_homeserver_url` - the public API endpoint of the homeserver where the guest users are created at.

There are also other optional configuration options:

- `guest_user_prefix` - the prefix that was used to register the users. Should match the configuration in the module (note that this includes the `@`!). Default: `@guest-`.
- `skip_single_sign_on` - if true, the user is forwarded to the normal login page when clicking “I already have an account”. Only use this if no SSO setup is configured. Default: `false`.

Example configuration:

```json
{
  "net.nordeck.element_web.module.guest": {
    "config": {
      "guest_user_homeserver_url": "https://matrix.local/",
      "guest_user_prefix": "@guest-"
      // ... add more optional configurations
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
   # │  ├─ customisations.json
   # │  ├─ package.json
   # ├─ matrix-react-sdk/
   # │  ├─ ...
   # ├─ matrix-js-sdk/
   # │  ├─ ...
   # ├─ element-web-modules/
   # │  ├─ packages
   # │  │  ├─ element-web-guest-module
   # │  │  │  ├─ build/
   # │  │  │  │  ├─ ...
   # │  │  │  ├─ package.json
   # │  │  │  ├─ ...
   # │  ├─ package.json

   modules:
     - 'file:../element-web-modules/packages/element-web-guest-module'
   ```

4. (In the `element-web` folder) Create a `customisations.json` with the following content:

   ```json
   {
     "src/customisations/ComponentVisibility.ts": "node_modules/@nordeck/element-web-guest-module/customisations/ComponentVisibility.ts"
   }
   ```

5. (In the `element-web` folder) Run `yarn start` and access it at `http://localhost:8080`

> **Important**: You must run `yarn build` in this repo and restart Element after each change in the module.
