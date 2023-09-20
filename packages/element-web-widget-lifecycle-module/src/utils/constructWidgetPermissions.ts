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

import { WidgetConfiguration, WidgetLifecycleModuleConfig } from '../config';
import { matchPattern } from './matchPattern';

/**
 * Returns the {@link WidgetConfiguration} for widget.
 *
 * If multiple {@link WidgetConfiguration}s match the url, the configurations
 * are merged. The most specific match wins for each setting.
 *
 * @param config - the module configuration
 * @param widgetUrl - the widget url
 */
export function constructWidgetPermissions(
  config: WidgetLifecycleModuleConfig,
  widgetUrl: string,
): WidgetConfiguration {
  const widgetPermissionsMatched = Object.keys(config).filter((pattern) =>
    matchPattern(widgetUrl, pattern),
  );

  return widgetPermissionsMatched
    .sort(sortLongestMatchLast)
    .reduce((prev, key) => ({ ...prev, ...config[key] }), {});
}

export function sortLongestMatchLast(a: string, b: string) {
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}
