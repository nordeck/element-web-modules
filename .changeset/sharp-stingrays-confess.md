---
'@nordeck/element-web-guest-module': minor
---

Add support for the new registration endpoint provided by the module.

**Breaking Change:**
The module now requires the `guest_user_homeserver_url` configuration that must
be set to the API endpoint of the Homeserver that should be used to register the
guests.
