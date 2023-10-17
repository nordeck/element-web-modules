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
import {
  WrapperLifecycle,
  WrapperOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WrapperLifecycle';
import { render, screen } from '@testing-library/react';
import { OpenDeskModule } from './OpenDeskModule';

describe('OpenDeskModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue({
        ics_navigation_json_url: 'https://example.com/navigation.json',
        ics_silent_url: 'https://example.com/silent',
        portal_logo_svg_url: 'https://example.com/logo.svg',
        portal_url: 'https://example.com',
      }),
      registerTranslations: jest.fn(),
      translateString: jest.fn().mockImplementation((s) => s),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should register custom translations', () => {
    new OpenDeskModule(moduleApi);
    expect(moduleApi.registerTranslations).toBeCalledWith({
      'Portal logo': {
        en: 'Portal logo',
        de: expect.any(String),
      },
      'Show portal': {
        en: 'Show portal',
        de: expect.any(String),
      },
    });
  });

  it('should react to the WrapperLifecycle.Wrapper lifecycle', () => {
    const module = new OpenDeskModule(moduleApi);

    const wrapperOpts: WrapperOpts = { Wrapper: React.Fragment };
    module.emit(WrapperLifecycle.Wrapper, wrapperOpts);

    render(<wrapperOpts.Wrapper>Matrix Chat</wrapperOpts.Wrapper>);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Matrix Chat')).toBeInTheDocument();
  });
});
