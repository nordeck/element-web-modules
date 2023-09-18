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

export const GUEST_MODULE_CONFIG_NAMESPACE =
  'net.nordeck.element_web.module.guest';
export const GUEST_MODULE_CONFIG_KEY = 'config';

/**
 * Use `USE_REGISTER_ENDPOINT` to activate the legacy mode that uses the
 * Client-Server API registration endpoint instead or the endpoint that our
 * Synapse module provides. This is needed for backwards-compatibility reasons.
 */
export const LEGACY_REGISTRATION_MODE_URI = 'USE_REGISTER_ENDPOINT';

/**
 * Configurations for the guest module.
 */
export interface GuestModuleConfig {
  /**
   * The URL of the homeserver where the guest users should be registered. This
   * must have the `synapse-guest-module` installed.
   * @example `https://synapse.local`
   *
   * @remark If the URL is set to `USE_REGISTER_ENDPOINT`, this activates a legacy
   *         mode that will call the original register endpoint. This is only
   *         supposed to be used with a legacy synapse module implementation.
   */
  guest_user_homeserver_url: string;

  /**
   * If true, the user will be forwarded to the login page instead of to the SSO
   * login. This is only required if the home server has no SSO support.
   * @defaultValue `false`
   */
  skip_single_sign_on?: boolean;

  /**
   * The username-prefix that identifies guest users.
   * @defaultValue `@guest-`
   */
  guest_user_prefix?: string;
}

const guestModuleConfigSchema = Joi.object<GuestModuleConfig, true>({
  guest_user_homeserver_url: Joi.string()
    .uri()
    .allow(LEGACY_REGISTRATION_MODE_URI)
    .required(),
  skip_single_sign_on: Joi.boolean(),
  guest_user_prefix: Joi.string().pattern(/@[a-zA-Z-_1-9]+/),
}).unknown();

/**
 * Validates that the config has a valid structure for a {@link GuestModuleConfig}.
 */
export function assertValidGuestModuleConfig(
  config: unknown,
): asserts config is GuestModuleConfig {
  const result = guestModuleConfigSchema.validate(config);

  if (result.error) {
    throw new Error(
      `Errors in the module configuration in "${GUEST_MODULE_CONFIG_NAMESPACE}".${GUEST_MODULE_CONFIG_KEY}: ${result.error.message}`,
    );
  }
}
