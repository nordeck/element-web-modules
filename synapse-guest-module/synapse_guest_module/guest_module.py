# Copyright 2023 Nordeck IT + Consulting GmbH
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import secrets
import string
from typing import Any, Dict, Optional

from synapse.module_api import ModuleApi, ProfileInfo
from synapse.module_api.errors import ConfigError
from synapse.types import UserID

from synapse_guest_module.config import GuestModuleConfig

logger = logging.getLogger("synapse.contrib." + __name__)


class GuestModule:
    def __init__(self, config: GuestModuleConfig, api: ModuleApi):
        self._api = api
        self._config = config

        self._api.register_password_auth_provider_callbacks(
            get_username_for_registration=self.get_username_for_registration,
            get_displayname_for_registration=self.get_displayname_for_registration,
        )
        self._api.register_third_party_rules_callbacks(
            on_profile_update=self.profile_update
        )

    @staticmethod
    def parse_config(config: Dict[str, Any]) -> GuestModuleConfig:
        """Parse the module configuration"""

        user_id_prefix = config.get("user_id_prefix", "guest-")
        if not isinstance(user_id_prefix, str):
            raise ConfigError("Config option 'user_id_prefix' must be a string")

        display_name_suffix = config.get("display_name_suffix", " (Guest)")
        if not isinstance(display_name_suffix, str):
            raise ConfigError("Config option 'display_name_suffix' must be a string")

        return GuestModuleConfig(
            user_id_prefix,
            display_name_suffix,
        )

    async def get_username_for_registration(
        self,
        uia_results: Dict[str, Any],
        params: Dict[str, Any],
    ) -> Optional[str]:
        """Returns the username that should be assigned to the user that used
        the registration endpoint. We only support the registration of guest
        users that always have the (configurable) `@guest-` prefix.
        """
        random_string = "".join(
            secrets.choice(string.ascii_letters + string.digits) for _ in range(32)
        )
        return self._config.user_id_prefix + random_string

    async def get_displayname_for_registration(
        self,
        uia_results: Dict[str, Any],
        params: Dict[str, Any],
    ) -> Optional[str]:
        """Returns the default displayname of the registered user. We expect
        the client to set the displayname after the registration, so we don"t
        return anything here.

        The guest suffix will be added by `profile_update(...)`.
        """
        return None

    async def profile_update(
        self,
        user_id: str,
        new_profile: ProfileInfo,
        by_admin: bool,
        deactivation: bool,
    ) -> None:
        """Is called whenever a profile is updated. We check that a guest user
        always contains the configured suffix (default ` (Guest)`) and add it if
        it is missing.
        """
        user_is_guest = user_id.startswith("@" + self._config.user_id_prefix)
        if user_is_guest:
            new_profile_display_name = (
                "" if new_profile.display_name is None else new_profile.display_name
            )
            guest_display_name_not_valid = not new_profile_display_name.endswith(
                self._config.display_name_suffix
            )
            if guest_display_name_not_valid:
                user_id_1 = UserID.from_string(user_id)
                guest_display_name = (
                    new_profile_display_name.strip() + self._config.display_name_suffix
                )
                await self._api.set_displayname(user_id_1, guest_display_name)
