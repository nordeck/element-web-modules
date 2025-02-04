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

import { assertValidWidgetLifecycleModuleConfig } from './config';

describe('assertValidWidgetLifecycleModuleConfig', () => {
  it('should accept an missing configuration', () => {
    expect(() =>
      assertValidWidgetLifecycleModuleConfig(undefined),
    ).not.toThrow();
  });

  it('should accept an empty configuration', () => {
    expect(() => assertValidWidgetLifecycleModuleConfig({})).not.toThrow();
  });

  it('should accept undefined', () => {
    expect(() =>
      assertValidWidgetLifecycleModuleConfig({
        'https://localhost': {
          preload_approved: undefined,
          identity_approved: undefined,
          capabilities_approved: undefined,
        },
        'https://localhost/b.html': {},
      }),
    ).not.toThrow();
  });

  it('should accept the configuration', () => {
    expect(() =>
      assertValidWidgetLifecycleModuleConfig({
        'https://localhost': {
          preload_approved: true,
          identity_approved: false,
          capabilities_approved: [],
        },
      }),
    ).not.toThrow();
  });

  it('should accept additional properties', () => {
    expect(() =>
      assertValidWidgetLifecycleModuleConfig({
        'https://localhost': {
          preload_approved: true,
          identity_approved: false,
          capabilities_approved: ['capability'],
          additional: 'tmp',
        },
      }),
    ).not.toThrow();
  });

  it.each<object>([
    { preload_approved: null },
    { preload_approved: 123 },
    { identity_approved: null },
    { identity_approved: 123 },
    { capabilities_approved: null },
    { capabilities_approved: 123 },
    { capabilities_approved: [undefined] },
    { capabilities_approved: [null] },
    { capabilities_approved: [123] },
    { capabilities_approved: [''] },
  ])('should reject wrong configuration permissions %j', (patch) => {
    expect(() =>
      assertValidWidgetLifecycleModuleConfig({
        'https://localhost': {
          preload_approved: true,
          identity_approved: false,
          capabilities_approved: ['capability'],
          ...patch,
        },
      }),
    ).toThrow(/must be a|must not be a|not allowed to be empty/);
  });
});
