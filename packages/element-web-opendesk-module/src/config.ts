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

export const OPENDESK_MODULE_CONFIG_NAMESPACE =
  'net.nordeck.element_web.module.opendesk';

export const OPENDESK_MODULE_CONFIG_KEY = 'config';

export interface OpenDeskModuleConfig {
  /**
   * The URL of the navigation.json file that contains the navigation structure for the user.
   * @example `https://example.com/navigation.json`
   */
  ics_navigation_json_url: string;

  /**
   * The URL of the silent endpoint that is used via inline frame to log in the user.
   * @example `https://example.com/silent`
   */
  ics_silent_url: string;

  /**
   * The URL of the portal logo.svg file.
   * @example `https://example.com/logo.svg`
   */
  portal_logo_svg_url: string;

  /**
   * The URL of the portal.
   * @example `https://example.com`
   */
  portal_url: string;
}

const openDeskModuleConfigSchema = Joi.object<OpenDeskModuleConfig, true>({
  ics_navigation_json_url: Joi.string().uri().required(),
  ics_silent_url: Joi.string().uri().required(),
  portal_logo_svg_url: Joi.string().uri().required(),
  portal_url: Joi.string().uri().required(),
})
  .unknown()
  .required();

export function assertValidOpenDeskModuleConfig(
  config: unknown,
): asserts config is OpenDeskModuleConfig {
  const result = openDeskModuleConfigSchema.validate(config);

  if (result.error) {
    throw new Error(
      `Errors in the module configuration in "${OPENDESK_MODULE_CONFIG_NAMESPACE}".${OPENDESK_MODULE_CONFIG_KEY}: ${result.error.message}`,
    );
  }
}
