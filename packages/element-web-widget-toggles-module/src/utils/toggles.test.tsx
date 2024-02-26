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
import { ViewRoomOpts } from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import { App } from '@matrix-org/react-sdk-module-api/lib/types/App';
import { render, screen } from '@testing-library/react';
import { toggles } from '.';

describe('toggles', () => {
  const app: App = {
    avatar_url: 'https://example.com/avatar.png',
    id: 'example-app',
    name: 'Example App',
    type: 'com.example.app',
  };

  let moduleApi: jest.Mocked<ModuleApi>;
  let roomId = '!room:example.com';

  beforeEach(() => {
    moduleApi = {
      getAppAvatarUrl: jest.fn(),
      getApps: jest.fn(),
      isAppInContainer: jest.fn(),
      moveAppToContainer: jest.fn(),
      translateString: jest
        .fn()
        .mockImplementation((s, t) => s.replace('%(name)s', t.name)),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('returns no toggles if there are no apps', () => {
    jest.spyOn(moduleApi, 'getApps').mockReturnValue([]);
    expect(toggles(moduleApi, roomId, [])).toEqual([]);
  });

  it('returns no toggles if there are no types', () => {
    jest.spyOn(moduleApi, 'getApps').mockReturnValue([app]);
    expect(toggles(moduleApi, roomId, undefined)).toEqual([]);
  });

  describe('toggle', () => {
    function toggle(): ViewRoomOpts['buttons'][0] {
      return toggles(moduleApi, roomId, [])[0];
    }

    beforeEach(() => {
      jest.spyOn(moduleApi, 'getApps').mockReturnValue([app]);
    });

    describe('icon', () => {
      it('returns img-tag for Jitsi', () => {
        jest
          .spyOn(moduleApi, 'getApps')
          .mockReturnValue([{ ...app, type: 'Jitsi' }]);

        render((toggle().icon as Function)());

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute(
          'src',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiM1QUJGRjIiLz4KICAgIDxwYXRoIGQ9Ik0zIDcuODc1QzMgNi44Mzk0NyAzLjgzOTQ3IDYgNC44NzUgNkgxMS4xODc1QzEyLjIyMyA2IDEzLjA2MjUgNi44Mzk0NyAxMy4wNjI1IDcuODc1VjEyLjg3NUMxMy4wNjI1IDEzLjkxMDUgMTIuMjIzIDE0Ljc1IDExLjE4NzUgMTQuNzVINC44NzVDMy44Mzk0NyAxNC43NSAzIDEzLjkxMDUgMyAxMi44NzVWNy44NzVaIiBmaWxsPSJ3aGl0ZSIvPgogICAgPHBhdGggZD0iTTE0LjM3NSA4LjQ0NjQ0TDE2LjEyMDggNy4xMTAzOUMxNi40ODA2IDYuODM1MDIgMTcgNy4wOTE1OCAxNyA3LjU0NDY4VjEzLjAzOTZDMTcgMTMuNTE5OSAxNi40MjUxIDEzLjc2NjkgMTYuMDc2NyAxMy40MzYzTDE0LjM3NSAxMS44MjE0VjguNDQ2NDRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        );
      });

      it('returns img-tag with app name as alt and app avatar URL as src', () => {
        jest
          .spyOn(moduleApi, 'getAppAvatarUrl')
          .mockReturnValue(app.avatar_url!);

        render((toggle().icon as Function)());

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', app.name);
        expect(img).toHaveAttribute('src', app.avatar_url);
      });

      it('returns img-tag with app type as alt and app avatar URL as src', () => {
        jest
          .spyOn(moduleApi, 'getAppAvatarUrl')
          .mockReturnValue(app.avatar_url!);
        jest
          .spyOn(moduleApi, 'getApps')
          .mockReturnValue([{ ...app, name: undefined }]);

        render((toggle().icon as Function)());

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', app.type);
        expect(img).toHaveAttribute('src', app.avatar_url);
      });

      it('returns svg-tag', () => {
        render((toggle().icon as Function)());
        expect(screen.getByRole('presentation')).toBeInTheDocument();
      });
    });

    describe('id', () => {
      it('returns app ID', () => {
        expect(toggle().id).toBe(app.id);
      });
    });

    describe('label', () => {
      it('returns label with app name to hide', () => {
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(true);
        expect(toggle().label()).toBe(`Hide ${app.name}`);
      });

      it('returns label with app name to show', () => {
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(false);
        expect(toggle().label()).toBe(`Show ${app.name}`);
      });

      it('returns label with app type to hide', () => {
        jest
          .spyOn(moduleApi, 'getApps')
          .mockReturnValue([{ ...app, name: undefined }]);
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(true);

        expect(toggle().label()).toBe(`Hide ${app.type}`);
      });

      it('returns label with app type to show', () => {
        jest
          .spyOn(moduleApi, 'getApps')
          .mockReturnValue([{ ...app, name: undefined }]);
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(false);

        expect(toggle().label()).toBe(`Show ${app.type}`);
      });
    });

    describe('onClick', () => {
      it('hides a widget', () => {
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(true);

        toggle().onClick();

        expect(moduleApi.moveAppToContainer).toHaveBeenCalledWith(
          app,
          'right',
          roomId,
        );
      });

      it('shows a widget', () => {
        jest.spyOn(moduleApi, 'isAppInContainer').mockReturnValue(false);

        toggle().onClick();

        expect(moduleApi.moveAppToContainer).toHaveBeenCalledWith(
          app,
          'top',
          roomId,
        );
      });
    });
  });
});
