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

import { assertValidGuestModuleConfig } from './config';

describe('assertValidGuestModuleConfig', () => {
  it('should accept an empty configuration', () => {
    expect(() => assertValidGuestModuleConfig({})).not.toThrow();
  });

  it('should accept undefined', () => {
    expect(() =>
      assertValidGuestModuleConfig({
        skip_single_sign_on: undefined,
        guest_user_prefix: undefined,
      }),
    ).not.toThrow();
  });

  it('should accept the configuration', () => {
    expect(() =>
      assertValidGuestModuleConfig({
        skip_single_sign_on: true,
        guest_user_prefix: '@other-',
      }),
    ).not.toThrow();
  });

  it('should accept additional properties', () => {
    expect(() =>
      assertValidGuestModuleConfig({
        skip_single_sign_on: true,
        guest_user_prefix: '@other-',
        additional: 'tmp',
      }),
    ).not.toThrow();
  });

  it.each<Object>([
    { skip_single_sign_on: null },
    { skip_single_sign_on: 123 },
    { guest_user_prefix: null },
    { guest_user_prefix: 123 },
    { guest_user_prefix: '' },
    { guest_user_prefix: '!' },
  ])('should reject wrong configuration permissions %j', (patch) => {
    expect(() =>
      assertValidGuestModuleConfig({
        skip_single_sign_on: true,
        guest_user_prefix: '@guest-',
        ...patch,
      }),
    ).toThrow(/must be a|match the required pattern|not allowed to be empty/);
  });
});
