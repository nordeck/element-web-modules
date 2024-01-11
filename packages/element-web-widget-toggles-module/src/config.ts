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

import Joi from 'joi';

export const WIDGET_TOGGLES_MODULE_CONFIG_NAMESPACE =
  'net.nordeck.element_web.module.widget_toggles';

export const WIDGET_TOGGLES_MODULE_CONFIG_KEY = 'config';

export interface WidgetTogglesModuleConfig {
  /**
   * The types of the widgets that should have a toggle.
   * @example `["com.example.*"]`
   */
  types?: Array<string>;
}

const widgetTogglesModuleConfigSchema = Joi.object({
  types: Joi.array().items(Joi.string().required()),
})
  .unknown()
  .required();

export function assertValidWidgetTogglesModuleConfig(
  config: unknown,
): asserts config is WidgetTogglesModuleConfig {
  const result = widgetTogglesModuleConfigSchema.validate(config);

  if (result.error) {
    throw new Error(
      `Errors in the module configuration in "${WIDGET_TOGGLES_MODULE_CONFIG_NAMESPACE}".${WIDGET_TOGGLES_MODULE_CONFIG_KEY}: ${result.error.message}`,
    );
  }
}
