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

from asyncio import Future
from typing import Awaitable, Tuple, TypeVar
from unittest.mock import Mock

from synapse.module_api import ModuleApi

from synapse_guest_module import GuestModule

TV = TypeVar("TV")


def make_awaitable(result: TV) -> Awaitable[TV]:
    """
    Makes an awaitable, suitable for mocking an `async` function.
    This uses Futures as they can be awaited multiple times so can be returned
    to multiple callers.
    This function has been copied directly from Synapse's tests code.
    """
    future = Future()  # type: ignore
    future.set_result(result)
    return future


def create_module() -> Tuple[GuestModule, Mock]:
    # Create a mock based on the ModuleApi spec, but override some mocked functions
    # because some capabilities are needed for running the tests.
    module_api = Mock(spec=ModuleApi)

    # If necessary, give parse_config some configuration to parse.
    config = GuestModule.parse_config({})

    module = GuestModule(config, module_api)

    return module, module_api
