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

import { generatePassword } from './generatePassword';

describe('generatePassword', () => {
  it('should generate a password', () => {
    expect(generatePassword()).toHaveLength(128);
  });

  it('should generate unique passwords for each call', () => {
    const password0 = generatePassword();
    const password1 = generatePassword();

    expect(password0).not.toEqual(password1);
  });
});
