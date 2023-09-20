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

import { matchPattern } from './matchPattern';

describe('matchPattern', () => {
  it.each([
    '*',
    'org.matrix.msc2762.receive.*',
    'org.matrix.msc2762.receive.state_event:*',
    'org.matrix.msc2762.receive.state_event:m.custom*',
    'org.matrix.msc2762.receive.state_event:m.custom#*',
    'org.matrix.msc2762.receive.state_event:m.custom#state_key',
    'org.matrix.msc2762.receive.state_event:m.custom#state_key*',
  ])('should match %s', (pattern) => {
    expect(
      matchPattern(
        'org.matrix.msc2762.receive.state_event:m.custom#state_key',
        pattern,
      ),
    ).toBe(true);
  });

  it.each([
    'org.matrix.msc2762.receive.state_event:',
    'org.matrix.msc2762.receive.state_event:m.custom',
    'org.matrix.msc2762.receive.state_event:m.custom#other_key',
    'org.matrix.msc2762.receive.*:m.custom#state_key',
    'org.matrix.msc2762.receive.room_event:m.custom',
  ])('should not match %s', (pattern) => {
    expect(
      matchPattern(
        'org.matrix.msc2762.receive.state_event:m.custom#state_key',
        pattern,
      ),
    ).toBe(false);
  });
});
