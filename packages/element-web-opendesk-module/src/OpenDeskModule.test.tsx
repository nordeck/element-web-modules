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
  RoomViewLifecycle,
  ViewRoomOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import {
  WrapperLifecycle,
  WrapperOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WrapperLifecycle';
import { render, screen } from '@testing-library/react';
import { Fragment } from 'react';
import { OpenDeskModule } from './OpenDeskModule';
import { applyStyles, widgetToggles } from './utils';

jest.mock('./utils/applyStyles');

const mockedWidgetToggles = 'mocked-widget-toggles';
jest.mock('./utils/widgetToggles', () => ({
  widgetToggles: jest.fn().mockImplementation(() => mockedWidgetToggles),
}));

describe('OpenDeskModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    jest.clearAllMocks();

    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue({
        banner: {
          ics_navigation_json_url: 'https://example.com/navigation.json',
          ics_silent_url: 'https://example.com/silent',
          portal_logo_svg_url: 'https://example.com/logo.svg',
          portal_url: 'https://example.com',
        },
      }),
      registerTranslations: jest.fn(),
      translateString: jest.fn().mockImplementation((s) => s),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should register custom translations', () => {
    new OpenDeskModule(moduleApi);

    expect(moduleApi.registerTranslations).toBeCalledWith({
      'Hide %(name)s': {
        en: 'Hide %(name)s',
        de: expect.any(String),
      },
      'Portal logo': {
        en: 'Portal logo',
        de: expect.any(String),
      },
      'Show %(name)s': {
        en: 'Show %(name)s',
        de: expect.any(String),
      },
      'Show menu': {
        en: 'Show menu',
        de: expect.any(String),
      },
      'Show portal': {
        en: 'Show portal',
        de: expect.any(String),
      },
      'room|header|n_people_asking_to_join': {
        en: {
          one: 'Asking to join',
          other: '%(count)s people asking to join',
        },
        de: {
          one: expect.any(String),
          other: expect.any(String),
        },
      },
      'room|knock_denied_subtitle': {
        en: 'As you have been denied access, you cannot rejoin unless you are invited by the admin or moderator of the group.',
        de: expect.any(String),
      },
      'room|knock_denied_title': {
        en: 'You have been denied access',
        de: expect.any(String),
      },
      'room_settings|security|publish_room': {
        en: 'Make this room visible in the public room directory.',
        de: expect.any(String),
      },
      'room_settings|security|publish_space': {
        en: 'Make this space visible in the public room directory.',
        de: expect.any(String),
      },
    });
  });

  it('should apply custom styles if configured', () => {
    moduleApi.getConfigValue.mockReturnValue({
      custom_css_variables: { '--cpd-color-text-action-accent': 'purple' },
    });

    new OpenDeskModule(moduleApi);

    expect(applyStyles).toBeCalledWith({
      '--cpd-color-text-action-accent': 'purple',
    });
  });

  it('should react to the WrapperLifecycle.Wrapper lifecycle', () => {
    const module = new OpenDeskModule(moduleApi);

    const wrapperOpts: WrapperOpts = { Wrapper: Fragment };
    module.emit(WrapperLifecycle.Wrapper, wrapperOpts);

    expect(wrapperOpts).not.toEqual({ Wrapper: Fragment });

    render(
      <wrapperOpts.Wrapper>
        <p>Matrix Chat</p>
      </wrapperOpts.Wrapper>,
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('Matrix Chat')).toBeInTheDocument();
  });

  it('should skip calling the wrapper if no banner is configured', () => {
    moduleApi.getConfigValue.mockReturnValue({});

    const module = new OpenDeskModule(moduleApi);

    const wrapperOpts: WrapperOpts = { Wrapper: Fragment };
    module.emit(WrapperLifecycle.Wrapper, wrapperOpts);

    expect(wrapperOpts).toEqual({ Wrapper: Fragment });
  });

  it('should listen on the RoomViewLifecycle.ViewRoom lifecycle', () => {
    const widgetTypes = ['com.example.widget', 'org.example.widget'];
    moduleApi.getConfigValue.mockReturnValue({ widget_types: widgetTypes });

    const module = new OpenDeskModule(moduleApi);
    const viewRoomOpts: ViewRoomOpts = { buttons: [] };
    const roomId = '!room:example.com';
    module.emit(RoomViewLifecycle.ViewRoom, viewRoomOpts, roomId);

    expect(widgetToggles).toHaveBeenCalledWith(moduleApi, widgetTypes, roomId);
    expect(viewRoomOpts.buttons).toBe(mockedWidgetToggles);
  });

  it('should not listen on the RoomViewLifecycle.ViewRoom lifecycle', () => {
    const module = new OpenDeskModule(moduleApi);
    module.emit(RoomViewLifecycle.ViewRoom, {});

    expect(widgetToggles).not.toHaveBeenCalled();
  });
});
