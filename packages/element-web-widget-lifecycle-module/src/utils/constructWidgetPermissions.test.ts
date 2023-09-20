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

import {
  constructWidgetPermissions,
  sortLongestMatchLast,
} from './constructWidgetPermissions';

describe('constructWidgetPermissions', () => {
  it('should find exact match', () => {
    expect(
      constructWidgetPermissions(
        { 'https://a.com/': { preload_approved: true } },
        'https://a.com/',
      ),
    ).toEqual({ preload_approved: true });
  });

  it('should find glob match', () => {
    expect(
      constructWidgetPermissions(
        { 'https://a.com/*': { preload_approved: true } },
        'https://a.com/some_path_unknown',
      ),
    ).toEqual({ preload_approved: true });
  });

  it('should merge multiple permissions', () => {
    expect(
      constructWidgetPermissions(
        {
          'https://b.com/path': {
            preload_approved: false,
            capabilities_approved: ['org.matrix.msc2762.timeline:*'],
          },
          'https://b.com/*': {
            preload_approved: true,
            identity_approved: true,
            capabilities_approved: ['org.matrix.msc2931.navigate'],
          },
        },
        'https://b.com/path',
      ),
    ).toEqual({
      preload_approved: false,
      identity_approved: true,
      capabilities_approved: ['org.matrix.msc2762.timeline:*'],
    });
  });

  it('should skip unknown url', () => {
    expect(
      constructWidgetPermissions(
        { 'https://a.com/': { preload_approved: true } },
        'https://a.com/some_path_unknown',
      ),
    ).toEqual({});
  });
});

describe('sortLongestMatchLast', () => {
  it('should sort longest match last', () => {
    expect(
      [
        'org.matrix.msc2762.receive.state_event:*',
        'org.matrix.msc2762.receive.*',
        'org.matrix.msc2762.receive.state_event:m.custom*',
        'org.matrix.msc2762.receive.state_event:m.custom#state_key',
        'org.matrix.msc2762.receive.state_event:m.custom#*',
        '*',
      ].sort(sortLongestMatchLast),
    ).toEqual([
      '*',
      'org.matrix.msc2762.receive.*',
      'org.matrix.msc2762.receive.state_event:*',
      'org.matrix.msc2762.receive.state_event:m.custom*',
      'org.matrix.msc2762.receive.state_event:m.custom#*',
      'org.matrix.msc2762.receive.state_event:m.custom#state_key',
    ]);
  });
});
