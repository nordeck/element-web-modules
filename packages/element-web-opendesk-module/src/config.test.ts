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

import { assertValidOpenDeskModuleConfig } from './config';

describe('assertValidOpenDeskModuleConfig', () => {
  const config = {
    ics_navigation_json_url: 'https://example.com/navigation.json',
    ics_silent_url: 'https://example.com/silent',
    portal_logo_svg_url: 'https://example.com/logo.svg',
    portal_url: 'https://example.com',
  };

  it('should not accept a missing configuration', () => {
    expect(() => assertValidOpenDeskModuleConfig(undefined)).toThrow();
  });

  it('should accept the configuration', () => {
    expect(() => assertValidOpenDeskModuleConfig(config)).not.toThrow();
  });

  it('should accept optional properties', () => {
    expect(() =>
      assertValidOpenDeskModuleConfig({
        ...config,
        custom_css_variables: { '--cpd-color-text-action-accent': 'purple' },
        additional: 'foo',
      }),
    ).not.toThrow();
  });

  it('should accept additional properties', () => {
    expect(() =>
      assertValidOpenDeskModuleConfig({ ...config, additional: 'foo' }),
    ).not.toThrow();
  });

  it.each<Object>([
    { ics_navigation_json_url: undefined },
    { ics_navigation_json_url: null },
    { ics_navigation_json_url: 123 },
    { ics_navigation_json_url: 'no-uri' },
    { ics_silent_url: undefined },
    { ics_silent_url: null },
    { ics_silent_url: 123 },
    { ics_silent_url: 'no-uri' },
    { portal_logo_svg_url: undefined },
    { portal_logo_svg_url: null },
    { portal_logo_svg_url: 123 },
    { portal_logo_svg_url: 'no-uri' },
    { portal_url: undefined },
    { portal_url: null },
    { portal_url: 123 },
    { portal_url: 'no-uri' },
    { custom_css_variables: { '--other-name': 'purple' } },
    { custom_css_variables: { '--cpd-color-blub': null } },
    { custom_css_variables: { '--cpd-color-blub': 123 } },
    { custom_css_variables: { '--cpd-color-blub': '' } },
  ])('should reject wrong configuration permissions %j', (patch) => {
    expect(() =>
      assertValidOpenDeskModuleConfig({ ...config, ...patch }),
    ).toThrow(
      /is required|must be a string|must be a valid uri|to be empty|is not allowed/,
    );
  });
});
