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

// This file is exported as-is. It will be used by the Element build as a
// TypeScript file. We don't actually depend on the matrix-react-sdk, though
// all relevant and testable code is imported from the bundled module.

/* eslint-disable no-undef */
// @ts-nocheck

/*
 * This file hides the UI features that are also disabled via the Synapse module.
 * This should eventually also be moved to the Module API, see also
 * https://github.com/matrix-org/matrix-react-sdk-module-api/pull/12
 */

import {
  GUEST_MODULE_CONFIG_KEY,
  GUEST_MODULE_CONFIG_NAMESPACE,
  GuestModuleConfig,
  assertValidGuestModuleConfig,
  shouldShowComponent as shouldShowComponentShared,
} from '@nordeck/element-web-guest-module';
// The next two imports are a hack to make it work after React SDK was merged into Element Web.
// The idea is to start with matrix-js-sdk, that is placed into node_modules, and
// then use a relative path to import something from /src in Element Web.
// /src in Element Web is now what previously matrix-react-sdk was.
// matrix-js-sdk should be relatively safe, as Element Web uses it itself.
import { MatrixClientPeg } from 'matrix-js-sdk/../../src/MatrixClientPeg';
import SdkConfig from 'matrix-js-sdk/../../src/SdkConfig';

export function getConfig(): GuestModuleConfig {
  const rawConfig =
    SdkConfig.get(GUEST_MODULE_CONFIG_NAMESPACE)?.[GUEST_MODULE_CONFIG_KEY] ??
    {};

  assertValidGuestModuleConfig(rawConfig);

  return rawConfig;
}

/**
 * Determines whether or not the active MatrixClient user should be able to use
 * the given UI component. If shown, the user might still not be able to use the
 * component depending on their contextual permissions. For example, invite options
 * might be shown to the user but they won't have permission to invite users to
 * the current room: the button will appear disabled.
 * @param {UIComponent} component The component to check visibility for.
 * @returns {boolean} True (default) if the user is able to see the component, false
 * otherwise.
 */
function shouldShowComponent(component: UIComponent): boolean {
  const config = getConfig();
  const myUserId = MatrixClientPeg.safeGet().getSafeUserId();

  return shouldShowComponentShared(config, myUserId, component);
}

// This interface summarises all available customisation points and also marks
// them all as optional. This allows customisers to only define and export the
// customisations they need while still maintaining type safety.
export interface IComponentVisibilityCustomisations {
  shouldShowComponent?: typeof shouldShowComponent;
}

// A real customisation module will define and export one or more of the
// customisation points that make up the interface above.
export const ComponentVisibilityCustomisations: IComponentVisibilityCustomisations =
  { shouldShowComponent };
