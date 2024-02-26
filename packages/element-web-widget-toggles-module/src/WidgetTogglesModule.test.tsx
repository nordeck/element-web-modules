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

import { ModuleApi } from '@matrix-org/react-sdk-module-api';
import {
  RoomViewLifecycle,
  ViewRoomOpts,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import { WidgetTogglesModule } from './WidgetTogglesModule';
import { toggles } from './utils';

const mockedToggles = 'mocked-toggles';

jest.mock('./utils/toggles', () => ({
  toggles: jest.fn().mockImplementation(() => mockedToggles),
}));

describe('WidgetTogglesModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    jest.clearAllMocks();

    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue({}),
      registerTranslations: jest.fn(),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should register custom translations', () => {
    new WidgetTogglesModule(moduleApi);

    expect(moduleApi.registerTranslations).toHaveBeenCalledWith({
      'Hide %(name)s': {
        en: 'Hide %(name)s',
        de: 'Verberge %(name)s',
      },
      'Show %(name)s': {
        en: 'Show %(name)s',
        de: 'Zeige %(name)s',
      },
    });
  });

  it('should listen to the RoomViewLifecycle.ViewRoom lifecycle', () => {
    const types = ['com.example.*'];
    moduleApi.getConfigValue.mockReturnValue({ types });

    const module = new WidgetTogglesModule(moduleApi);
    const viewRoomOpts: ViewRoomOpts = { buttons: [] };
    const roomId = '!room:example.com';
    module.emit(RoomViewLifecycle.ViewRoom, viewRoomOpts, roomId);

    expect(toggles).toHaveBeenCalledWith(moduleApi, roomId, types);
    expect(viewRoomOpts.buttons).toBe(mockedToggles);
  });

  it('should not listen to the RoomViewLifecycle.ViewRoom lifecycle', () => {
    const module = new WidgetTogglesModule(moduleApi);
    module.emit(RoomViewLifecycle.ViewRoom);

    expect(toggles).not.toHaveBeenCalled();
  });
});
