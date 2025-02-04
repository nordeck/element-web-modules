/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
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

import { assertValidWidgetTogglesModuleConfig } from './config';

describe('assertValidWidgetTogglesModuleConfig', () => {
  it('should reject a missing configuration', () => {
    expect(() => assertValidWidgetTogglesModuleConfig(undefined)).toThrow();
  });

  it('should accept an empty configuration', () => {
    expect(() => assertValidWidgetTogglesModuleConfig({})).not.toThrow();
  });

  it('should accept a valid configuration', () => {
    expect(() =>
      assertValidWidgetTogglesModuleConfig({ types: ['com.example.*'] }),
    ).not.toThrow();
  });

  it('should accept additional properties', () => {
    expect(() =>
      assertValidWidgetTogglesModuleConfig({
        additional_properties: 'example',
      }),
    ).not.toThrow();
  });

  it.each<object>([
    { types: '' },
    { types: 123 },
    { types: [] },
    { types: null },
    { types: {} },
  ])('should reject wrong configuration %j', (patch) => {
    expect(() => assertValidWidgetTogglesModuleConfig(patch)).toThrow(
      /must be an array|does not contain 1 required value/,
    );
  });
});
