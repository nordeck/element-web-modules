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
import { shouldShowComponent } from './shouldShowComponent';

describe('shouldShowComponent', () => {
  describe.each`
    extra_config                         | test_guest
    ${{}}                                | ${'@guest-asdf'}
    ${{ guest_user_prefix: '@custom-' }} | ${'@custom-asdf'}
  `('with $extra_config config', ({ extra_config, test_guest }) => {
    let config: GuestModuleConfig;

    beforeEach(() => {
      config = {
        ...extra_config,
      };
    });

    it.each([
      'UIComponent.sendInvites',
      'UIComponent.roomCreation',
      'UIComponent.spaceCreation',
      'UIComponent.exploreRooms',
      'UIComponent.roomOptionsMenu',
    ])('should reject %s for guests', (component) => {
      expect(shouldShowComponent(config, test_guest, component)).toBe(false);
    });

    it.each(['UIComponent.filterContainer', 'UIComponent.addIntegrations'])(
      'should accept %s for guests',
      (component) => {
        expect(shouldShowComponent(config, test_guest, component)).toBe(true);
      },
    );

    it.each([
      'UIComponent.sendInvites',
      'UIComponent.roomCreation',
      'UIComponent.spaceCreation',
      'UIComponent.exploreRooms',
      'UIComponent.roomOptionsMenu',
      'UIComponent.filterContainer',
      'UIComponent.addIntegrations',
    ])('should accept %s for normal users', (component) => {
      expect(shouldShowComponent(config, '@userid', component)).toBe(true);
    });
  });
});
