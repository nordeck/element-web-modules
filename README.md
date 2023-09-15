# Element Web Guest Module

![CI](https://github.com/nordeck/element-web-guest-module/workflows/CI/badge.svg)

A module for Element to login as a guest.
Users get a link to a public room, enter their name, and can participate in the room without any further registration.
This was initially created to allow non-organisation members to join [NeoDateFix](https://github.com/nordeck/matrix-meetings) meeting rooms, even if they don't have a user account in the private and potentially non-federated homeserver.

<img src="./docs/guest-login.gif" alt="A video of a user "  width="500" />

Guest users...

- ... have a **real user account** on the Homeserver.
- ... get a **username** with the (configurable) pattern `@guest-<random-identifier>`.
- ... have a **display name** that always includes the (configurable) suffix ` (Guest)`.
- ... are **restricted** in what they can do (can't create rooms or participate in direct messages on the homeserver).

## Getting Started

Development on the module happens at [GitHub](https://github.com/nordeck/element-web-guest-module).

### How to Install

You need to install two modules, one each for Element and Synapse to get all features:

- See the [Readme of the `element-web-guest-module`](./element-web-guest-module/README.md) for instructions on how to install it in Element.
- See the [Readme of the `synapse-guest-module`](./synapse-guest-module/README.md) for instructions on how to install it in your Synapse homeserver.

### How to Contribute

Please take a look at our [Contribution Guidelines](https://github.com/nordeck/.github/blob/main/docs/CONTRIBUTING.md).

### Requirements

You need to install Node.js (`>= 20.0.0`, prefer using an LTS version) and run
`yarn` to work on this package.
The minimal Element version to use this module is `1.11.40`.

### Installation

After checkout, run `yarn install` to download the required dependencies

> **Warning** Do not use `npm install` when working with this package.

### Available Scripts

In the project directory, you can run:

- `yarn build`: Build the production version of the modules.
- `yarn test`: Watch all files for changes and run tests.
- `yarn tsc`: Check TypeScript types for errors in the modules.
- `yarn lint`: Run eslint on the module.
- `yarn prettier:write`: Run prettier on all files to format them.
- `yarn depcheck`: Check for missing or unused dependencies.
- `yarn deduplicate`: Deduplicate dependencies in the `yarn.lock` file.
- `yarn changeset`: Generate a changeset that provides a description of a
  change.
- `yarn docker:build`: Builds a container from the output of `yarn build`.

### Versioning

This package uses automated versioning.
Each change should be accompanied with a specification of the impact (`patch`, `minor`, or `major`) and a description of the change.
Use `yarn changeset` to generate a new changeset for a pull request.
Learn more in the [`.changeset` folder](./.changeset).

Once the change is merged to `main`, a “Version Packages” pull request will be created.
As soon as the project maintainers merged it, the package will be released and the container is published.

## License

This project is licensed under [APACHE 2.0](./LICENSE).

## Sponsors

<p align="center">
   <a href="https://www.cio.bund.de/Webs/CIO/DE/digitale-loesungen/digitale-souveraenitaet/souveraener-arbeitsplatz/souverarner-arbeitsplatz-node.html"><img src="./docs/logos/OpenDesk_Logo_Claim_farbig.svg" alt="openDesk" width="20%"></a>
   &nbsp;&nbsp;&nbsp;&nbsp;
   <a href="https://www.nordeck.net/"><img src="./docs/logos/nordecklogo.png" alt="Nordeck" width="20%"></a>
</p>

This project is part of [openDesk](https://www.cio.bund.de/Webs/CIO/DE/digitale-loesungen/digitale-souveraenitaet/souveraener-arbeitsplatz/souverarner-arbeitsplatz-node.html).
