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

/**
 * Append extra styles to the `<head>` of Element. This should only be used for
 * setting compound css variables (ex: `--cpd-color-*`).
 *
 * @param cssVariableColors - a map of css variables (example: `{"--cpd-color-text-action-accent": "red"}`)
 */
export function applyStyles(cssVariableColors: Record<string, string>) {
  const colorsString = Object.entries(cssVariableColors)
    .map(([variable, value]) => `${variable}: ${value}`)
    .join('; ');

  const styles = document.createElement('style');
  styles.setAttribute('type', 'text/css');
  styles.innerHTML = `
      .cpd-theme-light.cpd-theme-light.cpd-theme-light.cpd-theme-light,
      .cpd-theme-dark.cpd-theme-dark.cpd-theme-dark.cpd-theme-dark,
      .cpd-theme-light-hc.cpd-theme-light-hc.cpd-theme-light-hc.cpd-theme-light-hc,
      .cpd-theme-dark-hc.cpd-theme-dark-hc.cpd-theme-dark-hc.cpd-theme-dark-hc {
        ${colorsString}
      }
    `;
  document.head.appendChild(styles);
}
