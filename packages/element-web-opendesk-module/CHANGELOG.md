# @nordeck/element-web-opendesk-module

## 0.5.0

### Minor Changes

- c63e67b: Launcher icon color when expanded is now configurable

## 0.4.0

### Minor Changes

- 13ee5ae: Remove widget toggles

  **Breaking Change:**
  The module does not support the widget toggles anymore.
  The widget toggles are an own module now. See https://www.npmjs.com/package/@nordeck/element-web-widget-toggles-module.

## 0.3.0

### Minor Changes

- b7c4063: Refactor the wrapper implementation.

  **Breaking Change:**
  This module requires at least Element 1.11.50.
  The module did break the navigation feature in prior Element versions.

## 0.2.0

### Minor Changes

- 0c96da9: Introduce widget toggles

## 0.1.0

### Minor Changes

- b75ff6a: Move the configuration parameters for the banner and hide it if not configured.

  **Breaking Change:**
  The configuration parameters for the banner (`ics_navigation_json_url`,
  `ics_silent_url`, `portal_logo_svg_url`, `portal_url`) were moved to a `banner`
  object. You must update your configuration in order to still display the banner.

### Patch Changes

- 11119b8: Accept a navigation entry with a `null` icon.

## 0.0.2

### Patch Changes

- f242b54: Customize the Element theme with configurable colors.
- 383769a: Add support for future Element versions.

## 0.0.1

### Patch Changes

- a75901d: Add initial version.
