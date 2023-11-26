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
  RoomViewLifecycle,
  ViewRoomListener,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import {
  WrapperLifecycle,
  WrapperListener,
  WrapperOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WrapperLifecycle';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { MatrixChatWrapper } from './components/MatrixChatWrapper';
import { Navbar } from './components/Navbar';
import {
  OPENDESK_MODULE_CONFIG_KEY,
  OPENDESK_MODULE_CONFIG_NAMESPACE,
  OpenDeskModuleConfig,
  assertValidOpenDeskModuleConfig,
} from './config';
import { theme } from './theme';
import { applyStyles, widgetToggles } from './utils';

export class OpenDeskModule extends RuntimeModule {
  private readonly config: OpenDeskModuleConfig;
  private readonly Wrapper: WrapperOpts['Wrapper'] = React.Fragment;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    this.moduleApi.registerTranslations({
      'Hide %(name)s': {
        en: 'Hide %(name)s',
        de: 'Verberge %(name)s',
      },
      'Portal logo': {
        en: 'Portal logo',
        de: 'Portal Logo',
      },
      'Show %(name)s': {
        en: 'Show %(name)s',
        de: 'Zeige %(name)s',
      },
      'Show menu': {
        en: 'Show menu',
        de: 'Menü anzeigen',
      },
      'Show portal': {
        en: 'Show portal',
        de: 'Portal anzeigen',
      },
    });

    const config = this.moduleApi.getConfigValue(
      OPENDESK_MODULE_CONFIG_NAMESPACE,
      OPENDESK_MODULE_CONFIG_KEY,
    );

    assertValidOpenDeskModuleConfig(config);

    this.config = config;

    if (config.custom_css_variables) {
      applyStyles(config.custom_css_variables);
    }

    if (this.config.banner) {
      const bannerConfig = this.config.banner;

      this.Wrapper = function Wrapper({ children }) {
        return (
          <ThemeProvider theme={theme}>
            <Navbar config={bannerConfig} moduleApi={moduleApi} />
            <MatrixChatWrapper>{children}</MatrixChatWrapper>
          </ThemeProvider>
        );
      };

      this.on(WrapperLifecycle.Wrapper, this.onWrapper);
    }

    if (config.widget_types) {
      this.on(RoomViewLifecycle.ViewRoom, this.onViewRoom);
    }
  }

  protected onViewRoom: ViewRoomListener = (viewRoomOpts, roomId) => {
    viewRoomOpts.buttons = widgetToggles(
      this.moduleApi,
      this.config.widget_types,
      roomId,
    );
  };

  protected onWrapper: WrapperListener = (wrapperOpts) => {
    wrapperOpts.Wrapper = this.Wrapper;
  };
}
