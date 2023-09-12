# Element Web Guest Module

A module to allow guests to register with Element using the [Module API](https://www.npmjs.com/package/@matrix-org/react-sdk-module-api).

## Install the Element Module

Checkout Element and setup the development environment according to [their documentation](https://github.com/vector-im/element-web/#building-from-source).
Go into the `element-web` folder and create a `build_config.yaml` file with the following content:

```yaml
modules:
  - '@nordeck/element-web-guest-module@^1.0.0'
```

Build Element and deploy your custom version as described by the original documentation.

## Configure the Element Module

There are also other optional configuration options:

- `guest_user_prefix` - the prefix that was used to register the users. Should match the configuration in the module (note that this includes the `@`!). Default: `@guest-`.
- `skip_single_sign_on` - if true, the user is forwarded to the normal login page when clicking “I already have an account”. Only use this if no SSO setup is configured. Default: `false`.

Example configuration:

```json
{
  "net.nordeck.element_web.module.guest": {
    "config": {
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
   # ├─ element-web-guest-module/
   # │  ├─ element-web-guest-module
   # │  │  ├─ build/
   # │  │  │  ├─ ...
   # │  │  ├─ package.json
   # │  │  ├─ ...
   # │  ├─ package.json

   modules:
     - 'file:../element-web-guest-module/element-web-guest-module'
   ```

4. (In the `element-web` folder) Run `yarn start` and access it at `http://localhost:8080`

> **Important**: You must run `yarn build` in this repo and restart Element after each change in the module.
