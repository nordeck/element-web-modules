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

import { ModuleApi, RuntimeModule } from '@matrix-org/react-sdk-module-api';
import {
  RoomViewLifecycle,
  ViewRoomListener,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import {
  WIDGET_TOGGLES_MODULE_CONFIG_KEY,
  WIDGET_TOGGLES_MODULE_CONFIG_NAMESPACE,
  WidgetTogglesModuleConfig,
  assertValidWidgetTogglesModuleConfig,
} from './config';
import { toggles } from './utils';

export class WidgetTogglesModule extends RuntimeModule {
  private readonly config: WidgetTogglesModuleConfig;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    this.moduleApi.registerTranslations({
      'Hide %(name)s': {
        en: 'Hide %(name)s',
        de: 'Verberge %(name)s',
      },
      'Show %(name)s': {
        en: 'Show %(name)s',
        de: 'Zeige %(name)s',
      },
    });

    const config = this.moduleApi.getConfigValue(
      WIDGET_TOGGLES_MODULE_CONFIG_NAMESPACE,
      WIDGET_TOGGLES_MODULE_CONFIG_KEY,
    );

    assertValidWidgetTogglesModuleConfig(config);

    this.config = config;

    if (this.config.types) {
      this.on(RoomViewLifecycle.ViewRoom, this.onViewRoom);
    }
  }

  protected onViewRoom: ViewRoomListener = (viewRoomOpts, roomId) => {
    viewRoomOpts.buttons = toggles(this.moduleApi, roomId, this.config.types);
  };
}
