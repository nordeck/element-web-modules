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
  RoomPreviewOpts,
  RoomViewLifecycle,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import { waitFor } from '@testing-library/react';
import { GuestModule } from './GuestModule';

describe('GuestModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      translateString: jest.fn().mockImplementation((s) => s),
      registerTranslations: jest.fn(),
      openDialog: jest.fn(),
      overwriteAccountAuth: jest.fn(),
      navigatePermalink: jest.fn(),
      getConfigValue: jest.fn().mockReturnValue({}),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should register custom translations', () => {
    new GuestModule(moduleApi);

    expect(moduleApi.registerTranslations).toBeCalledWith({
      'Request room access': {
        en: 'Request room access',
        de: expect.any(String),
      },
      'Creating your account...': {
        en: 'Creating your account...',
        de: expect.any(String),
      },
      'Continue as guest': {
        en: 'Continue as guest',
        de: expect.any(String),
      },
      Name: {
        en: 'Name',
        de: expect.any(String),
      },
      'I already have an account.': {
        en: 'I already have an account.',
        de: expect.any(String),
      },
      'The account creation failed.': {
        en: 'The account creation failed.',
        de: expect.any(String),
      },
    });
  });

  it('should react to the RoomViewLifecycle.PreviewRoomNotLoggedIn lifecycle', () => {
    const module = new GuestModule(moduleApi);

    const opts: RoomPreviewOpts = { canJoin: false };
    module.emit(
      RoomViewLifecycle.PreviewRoomNotLoggedIn,
      opts,
      '!room-id:matrix.local',
    );

    expect(opts).toEqual({ canJoin: true });
  });

  it('should react to the RoomViewLifecycle.JoinFromRoomPreview lifecycle', async () => {
    moduleApi.getConfigValue.mockImplementation((namespace, key) => {
      if (
        namespace === 'net.nordeck.element_web.module.guest' &&
        key === 'config'
      ) {
        return { skip_single_sign_on: false };
      }

      return undefined;
    });

    moduleApi.openDialog.mockResolvedValue({
      didOkOrSubmit: true,
      model: { accountAuthInfo: { userId: '!guest:matrix.local' } },
    });

    const module = new GuestModule(moduleApi);

    module.emit(RoomViewLifecycle.JoinFromRoomPreview, '!room-id:matrix.local');

    expect(moduleApi.openDialog).toBeCalledWith(
      {
        title: 'Request room access',
        actionLabel: 'Continue as guest',
        canSubmit: false,
      },
      expect.any(Function),
      { config: { skip_single_sign_on: false } },
    );

    // await that openDialog was finished so we can validate the
    // "absence" of a call
    await moduleApi.openDialog.mock.results[0];

    expect(moduleApi.overwriteAccountAuth).toBeCalledWith({
      userId: '!guest:matrix.local',
    });

    await waitFor(() => {
      expect(moduleApi.navigatePermalink).toBeCalledWith(
        'https://matrix.to/#/!room-id:matrix.local',
        true,
      );
    });
  });

  it.each([
    { didOkOrSubmit: false, model: {} },
    { didOkOrSubmit: true, model: {} },
  ])(
    'should reject the RoomViewLifecycle.JoinFromRoomPreview lifecycle with %p',
    async (result) => {
      moduleApi.openDialog.mockResolvedValue(result);

      const module = new GuestModule(moduleApi);

      module.emit(
        RoomViewLifecycle.JoinFromRoomPreview,
        '!room-id:matrix.local',
      );

      expect(moduleApi.openDialog).toBeCalledWith(
        {
          title: 'Request room access',
          actionLabel: 'Continue as guest',
          canSubmit: false,
        },
        expect.any(Function),
        { config: {} },
      );

      // await that openDialog was finished so we can validate the
      // "absence" of a call
      await moduleApi.openDialog.mock.results[0];

      expect(moduleApi.overwriteAccountAuth).not.toBeCalled();
    },
  );
});
