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

import { applyStyles } from './applyStyles';

describe('applyStyles', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should apply the styles to the head', () => {
    applyStyles({
      '--cpd-color-text-action-accent': 'green',
      '--cpd-color-text-critical-primary': 'red',
    });

    expect(document.getElementsByTagName('style').item(0)?.outerHTML)
      .toMatchInlineSnapshot(`
"<style type="text/css">
      .cpd-theme-light.cpd-theme-light.cpd-theme-light.cpd-theme-light,
      .cpd-theme-dark.cpd-theme-dark.cpd-theme-dark.cpd-theme-dark,
      .cpd-theme-light-hc.cpd-theme-light-hc.cpd-theme-light-hc.cpd-theme-light-hc,
      .cpd-theme-dark-hc.cpd-theme-dark-hc.cpd-theme-dark-hc.cpd-theme-dark-hc {
        --cpd-color-text-action-accent: green; --cpd-color-text-critical-primary: red
      }
    </style>"
`);
  });
});
