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

import { ModuleApi } from '@matrix-org/react-sdk-module-api/lib/ModuleApi';
import { RuntimeModule } from '@matrix-org/react-sdk-module-api/lib/RuntimeModule';
import {
  WIDGET_LIFECYCLE_MODULE_CONFIG_KEY,
  WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE,
  WidgetLifecycleModuleConfig,
  assertValidWidgetLifecycleModuleConfig,
} from './config';

export class WidgetLifecycleModule extends RuntimeModule {
  private config: WidgetLifecycleModuleConfig;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    const rawConfig = this.moduleApi.getConfigValue(
      WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE,
      WIDGET_LIFECYCLE_MODULE_CONFIG_KEY,
    );

    assertValidWidgetLifecycleModuleConfig(rawConfig);
    this.config = rawConfig;

    // TODO: register lifecycles
  }
}
