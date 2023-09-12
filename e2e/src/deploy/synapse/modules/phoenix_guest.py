# TODO: This file is only temporary and will be moved to a proper module in this repository

import random
import string
from typing import Any, Dict, Optional
from synapse.module_api import ModuleApi, ProfileInfo
from synapse.types import UserID, create_requester


class GuestAuthProvider:
    _USER_ID_PREFIX = "guest-"

    def __init__(self, config: dict, api: ModuleApi):
        self.api = api
        self.config = config
        self.profile_handler = api._hs.get_profile_handler()

        self.display_name_suffix = config.get('display_name_suffix', ' (Guest)')

        self.api.register_password_auth_provider_callbacks(
            get_username_for_registration=self.get_username_for_registration,
            get_displayname_for_registration=self.get_displayname_for_registration
        )
        self.api.register_third_party_rules_callbacks(
            on_profile_update=self.profile_update
        )

    async def get_username_for_registration(
        self,
        uia_results: Dict[str, Any],
        params: Dict[str, Any],
    ) -> Optional[str]:
        random_string = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32))
        return self._USER_ID_PREFIX + random_string

    async def get_displayname_for_registration(
        self,
        uia_results: Dict[str, Any],
        params: Dict[str, Any],
    ) -> Optional[str]:
        first_name = params.get('phoenix_guest_first_name')
        last_name = params.get('phoenix_guest_surname')
        if first_name is not None and last_name is not None:
            # sets display name from params submitted by fork
            return first_name + ' ' + last_name + self.display_name_suffix
        else:
            # no display name is set
            return None

    async def profile_update(
        self,
        user_id: str,
        new_profile: ProfileInfo,
        by_admin: bool,
        deactivation: bool,
    ) -> None:
        user_is_guest = user_id.startswith('@' + self._USER_ID_PREFIX)
        if user_is_guest:
            new_profile_display_name = '' if new_profile.display_name is None else new_profile.display_name
            guest_display_name_not_valid = not new_profile_display_name.endswith(self.display_name_suffix)
            if guest_display_name_not_valid:
                user_id_1 = UserID.from_string(user_id)
                requester = create_requester(user_id_1)
                guest_display_name = new_profile_display_name + self.display_name_suffix
                await self.profile_handler.set_displayname(user_id_1, requester, guest_display_name)
