# End-to-end tests

End-to-end tests for the components in this repository.

## Getting Started

### Prerequisites

Running the e2e tests requires Docker or Podman to be installed.

If using Podman be sure to [set up the `DOCKER_HOST` environment variable](https://node.testcontainers.org/supported-container-runtimes/).

### Running Tests

The e2e tests are testing the guest module for Element and for Synapse.
Make sure to always run `yarn e2e:build` in the root folder before initially running the tests or after changing a component.

1. **Synapse Module**: By default, it uses the image that was built by running `yarn docker:build` in the root folder of this repository.
   Building the container at least once is required to run the tests.
   Alternatively, you can set the `MODULE_CONTAINER_IMAGE` environment variable to use a custom container image for the Synapse Guest Module.
2. **Element Module**: It uses the module that is packaged by `yarn build`.
   Only run this if there are actual changes in the module to not

Afterwards you can run `yarn e2e` to perform the tests.

### Common Issues

> Browser was not installed. Invoke 'Install Playwright Browsers' action to install missing browsers.

If you encounter this message, make sure to install the Browsers via `npx playwright install`.

### Available Scripts

In the project directory, you can run:

- `yarn build`: Run all required build steps for the e2e tests to run.
- `yarn lint`: Run eslint on the tests.
- `yarn depcheck`: Check for missing or unused dependencies.
- `yarn e2e`: Runs the end-to-end tests in a single browser. Pass `--debug` to enable the debug UI. Pass `--ui` to enable the Playwright UI Mode.
