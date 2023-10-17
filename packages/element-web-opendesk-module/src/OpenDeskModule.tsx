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
  WrapperLifecycle,
  WrapperListener,
  WrapperOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WrapperLifecycle';
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

export class OpenDeskModule extends RuntimeModule {
  private readonly config: OpenDeskModuleConfig;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    this.moduleApi.registerTranslations({
      'Portal logo': {
        en: 'Portal logo',
        de: 'Portal Logo',
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

    this.on(WrapperLifecycle.Wrapper, this.onWrapper);
  }

  protected Wrapper: WrapperOpts['Wrapper'] = ({ children }) => (
    <ThemeProvider theme={theme}>
      <Navbar config={this.config} moduleApi={this.moduleApi} />
      <MatrixChatWrapper>{children}</MatrixChatWrapper>
    </ThemeProvider>
  );

  protected onWrapper: WrapperListener = (wrapperOpts) => {
    wrapperOpts.Wrapper = this.Wrapper;
  };
}
