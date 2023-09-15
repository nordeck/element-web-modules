/*
 * Copyright 2023 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GuestModuleConfig } from './config';

const GUEST_INVISIBLE_COMPONENTS = [
  'UIComponent.sendInvites',
  'UIComponent.roomCreation',
  'UIComponent.spaceCreation',
  'UIComponent.exploreRooms',
  'UIComponent.roomOptionsMenu',
  // TODO: UIComponent.AddIntegrations does hide the whole integrations sidebar,
  // where it should only hide the buttons and slash command. If this gets fixed
  // in element we can disable it also for guests.
  //UIComponent.AddIntegrations,
];

function getGuestUserPrefix(config: GuestModuleConfig): string {
  return config.guest_user_prefix ?? '@guest-';
}

/**
 * A function that can be called from a `ComponentVisibility` customisation. It
 * returns true, if the `userId` should see the `component`.
 *
 * @param config - the configuration of the module
 * @param userId - the id of the user to check
 * @param component - the name of the component that is checked
 * @returns true, if the user should see the component
 */
export function shouldShowComponent(
  config: GuestModuleConfig,
  userId: string,
  component: string,
): boolean {
  const components = userId.startsWith(getGuestUserPrefix(config))
    ? GUEST_INVISIBLE_COMPONENTS
    : [];

  const shouldShow = !components.includes(component);
  return shouldShow;
}
