---
'@nordeck/element-web-opendesk-module': minor
---

Move the configuration parameters for the banner and hide it if not configured.

**Breaking Change:**
The configuration parameters for the banner (`ics_navigation_json_url`,
`ics_silent_url`, `portal_logo_svg_url`, `portal_url`) were moved to a `banner`
object. You must update your configuration in order to still display the banner.
