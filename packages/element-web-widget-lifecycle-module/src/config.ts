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

import Joi from 'joi';

export const WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE =
  'net.nordeck.element_web.module.widget_lifecycle';
export const WIDGET_LIFECYCLE_MODULE_CONFIG_KEY = 'widget_permissions';

export interface WidgetConfiguration {
  /**
   * If true, the widget preload request is approved.
   */
  preload_approved?: boolean;

  /**
   * If true, the widget identity request is approved.
   */
  identity_approved?: boolean;

  /**
   * All listed widget capabilities are approved.
   */
  capabilities_approved?: string[];
}

const widgetLifecycleConfigurationSchema = Joi.object<
  WidgetConfiguration,
  true
>({
  preload_approved: Joi.boolean(),
  identity_approved: Joi.boolean(),
  capabilities_approved: Joi.array().items(Joi.string()),
}).unknown();

/**
 * Configurations for the widget lifecycle module.
 */
export interface WidgetLifecycleModuleConfig {
  /**
   * A configuration for each widget url.
   */
  [widgetUrl: string]: WidgetConfiguration;
}

const widgetLifecycleModuleConfigSchema = Joi.object<
  WidgetLifecycleModuleConfig,
  true
>().pattern(Joi.string().required(), widgetLifecycleConfigurationSchema);

/**
 * Validates that the config has a valid structure for a {@link WidgetLifecycleModuleConfig}.
 */
export function assertValidWidgetLifecycleModuleConfig(
  config: unknown,
): asserts config is WidgetLifecycleModuleConfig | undefined {
  const result = widgetLifecycleModuleConfigSchema.validate(config);

  if (result.error) {
    throw new Error(
      `Errors in the module configuration in "${WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE}".${WIDGET_LIFECYCLE_MODULE_CONFIG_KEY}: ${result.error.message}`,
    );
  }
}
