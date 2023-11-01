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

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

type Props = {
  children: ReactNode;
};

function Wrapper({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

function mockWidgetLayoutStore(
  partial: Partial<Window['mxWidgetLayoutStore']>,
) {
  window.mxWidgetLayoutStore = {
    isInContainer: jest.fn(),
    moveToContainer: jest.fn(),
    ...partial,
  };
}

function mockWidgetStore(partial: Partial<Window['mxWidgetStore']>) {
  window.mxWidgetStore = {
    getApps: jest.fn(),
    matrixClient: {
      getRoom: jest.fn(),
      mxcUrlToHttp: jest.fn(),
    },
    ...partial,
  };
}

function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: Wrapper, ...options });
}

export { mockWidgetLayoutStore, mockWidgetStore, renderWithTheme };
