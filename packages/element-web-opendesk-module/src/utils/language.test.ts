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

import { language } from './language';

describe('language', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns "en" if key does not exist', () => {
    expect(language()).toBe('en');
  });

  it('returns "de-DE" if settings language is "de"', () => {
    localStorage.setItem('mx_local_settings', '{"language":"de"}');
    expect(language()).toBe('de-DE');
  });

  it('returns "en" if settings language is not supported', () => {
    localStorage.setItem('mx_local_settings', '{"language":"fr"}');
    expect(language()).toBe('en');
  });
});
