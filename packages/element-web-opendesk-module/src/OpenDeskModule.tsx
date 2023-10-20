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
import { applyStyles } from './utils/applyStyles';

export class OpenDeskModule extends RuntimeModule {
  private readonly config: OpenDeskModuleConfig;
  private readonly Wrapper: WrapperOpts['Wrapper'];

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

    if (config.custom_css_variables) {
      applyStyles(config.custom_css_variables);
    }

    // TODO: This should be a functional component. Element calls `ReactDOM.render` and uses the
    // return value as a reference to the MatrixChat component. Then they call a function on this
    // reference. This is deprecated behavior and only works if the root component is a class. Since
    // our component is now the root it must be class and it must also forward the calls the are
    // meant for the MatrixChat component. Element should be changed so it uses Ref's and pass this
    // to the MatrixChat so that any parent components don't interfere with this logic.
    this.Wrapper = class Wrapper extends React.Component {
      private readonly ref = React.createRef<{
        showScreen: (...args: unknown[]) => unknown;
      }>();

      public showScreen(...args: unknown[]) {
        return this.ref.current?.showScreen(...args);
      }

      render() {
        // Add the ref to our only children -> the MatrixChat component
        const children =
          React.Children.only(this.props.children) &&
          React.isValidElement<{ ref: unknown }>(this.props.children) &&
          'ref' in this.props.children &&
          !this.props.children.ref
            ? React.cloneElement(this.props.children, { ref: this.ref })
            : this.props.children;

        return (
          <ThemeProvider theme={theme}>
            <Navbar config={config} moduleApi={moduleApi} />
            <MatrixChatWrapper>{children}</MatrixChatWrapper>
          </ThemeProvider>
        );
      }
    };

    this.on(WrapperLifecycle.Wrapper, this.onWrapper);
  }

  protected onWrapper: WrapperListener = (wrapperOpts) => {
    wrapperOpts.Wrapper = this.Wrapper;
  };
}
