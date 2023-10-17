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

import { assertValidNavigationJson } from './navigationJson';

describe('assertValidNavigationJson', () => {
  const json = {
    categories: [{ entries: [] }],
  };

  it('should not accept a missing JSON', () => {
    expect(() => assertValidNavigationJson(undefined)).toThrow();
  });

  it('should accept a valid JSON', () => {
    expect(() => assertValidNavigationJson(json)).not.toThrow();
  });

  it('should accept a JSON with additional properties', () => {
    expect(() =>
      assertValidNavigationJson({ ...json, additional: 'foo' }),
    ).not.toThrow();
  });

  it('should not accept a JSON without categories', () => {
    expect(() => assertValidNavigationJson({})).toThrow();
  });

  it('should accept a JSON with additional properties in categories', () => {
    expect(() =>
      assertValidNavigationJson({
        categories: [{ entries: [], additional: 'foo' }],
      }),
    ).not.toThrow();
  });

  it('should not accept a JSON without category entries', () => {
    expect(() => assertValidNavigationJson({ categories: [{}] })).toThrow();
  });

  it('should accept a JSON with additional properties in category entries', () => {
    expect(() =>
      assertValidNavigationJson({
        categories: [{ entries: [{ additional: 'foo' }] }],
      }),
    ).not.toThrow();
  });
});
