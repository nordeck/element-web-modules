# @nordeck/element-web-guest-module

## 1.0.0

### Major Changes

- a05ce45: First stable release.

## 0.2.1

### Patch Changes

- 344b7bf: Update the repository name

## 0.2.0

### Minor Changes

- 27680cd: Add support for the new registration endpoint provided by the module.

  **Breaking Change:**
  The module now requires the `guest_user_homeserver_url` configuration that must
  be set to the API endpoint of the Homeserver that should be used to register the
  guests.

## 0.1.1

### Patch Changes

- 37b1885: Fix the published npm package to include all files.

## 0.1.0

### Minor Changes

- b43b066: Disable certain homeserver-wide actions (create room, invite user) for guest users.

## 0.0.1

### Patch Changes

- Add initial version.
