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
import styled from 'styled-components';
import { WidgetTogglesModuleConfig } from '../config';

type Props = { $isInContainer: boolean };

const Img = styled.img<Props>`
  border-color: ${() => 'var(--cpd-color-text-action-accent)'};
  border-radius: 50%;
  border-style: solid;
  border-width: ${({ $isInContainer }) => ($isInContainer ? '2px' : '0px')};
  box-sizing: border-box;
  height: 24px;
  width: 24px;
`;

const Svg = styled.svg<Props>`
  height: 24px;
  fill: ${({ $isInContainer }) =>
    $isInContainer ? 'var(--cpd-color-text-action-accent)' : 'currentColor'};
  width: 24px;
`;

function avatarUrl(app: App, moduleApi: ModuleApi): string | null {
  if (app.type.match(/jitsi/i)) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiM1QUJGRjIiLz4KICAgIDxwYXRoIGQ9Ik0zIDcuODc1QzMgNi44Mzk0NyAzLjgzOTQ3IDYgNC44NzUgNkgxMS4xODc1QzEyLjIyMyA2IDEzLjA2MjUgNi44Mzk0NyAxMy4wNjI1IDcuODc1VjEyLjg3NUMxMy4wNjI1IDEzLjkxMDUgMTIuMjIzIDE0Ljc1IDExLjE4NzUgMTQuNzVINC44NzVDMy44Mzk0NyAxNC43NSAzIDEzLjkxMDUgMyAxMi44NzVWNy44NzVaIiBmaWxsPSJ3aGl0ZSIvPgogICAgPHBhdGggZD0iTTE0LjM3NSA4LjQ0NjQ0TDE2LjEyMDggNy4xMTAzOUMxNi40ODA2IDYuODM1MDIgMTcgNy4wOTE1OCAxNyA3LjU0NDY4VjEzLjAzOTZDMTcgMTMuNTE5OSAxNi40MjUxIDEzLjc2NjkgMTYuMDc2NyAxMy40MzYzTDE0LjM3NSAxMS44MjE0VjguNDQ2NDRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  }

  return moduleApi.getAppAvatarUrl(app);
}

function isInContainer(
  app: App,
  moduleApi: ModuleApi,
  roomId: string,
): boolean {
  return (
    moduleApi.isAppInContainer(app, 'center', roomId) ||
    moduleApi.isAppInContainer(app, 'top', roomId)
  );
}

function isMatching(
  app: App,
  types: WidgetTogglesModuleConfig['types'],
): boolean {
  if (!types) return false;
  return !!app.type.match(new RegExp(types.join('|'), 'i'));
}

export function toggles(
  moduleApi: ModuleApi,
  roomId: string,
  types: WidgetTogglesModuleConfig['types'],
): ViewRoomOpts['buttons'] {
  const apps = moduleApi.getApps(roomId);
  const buttons: ViewRoomOpts['buttons'] = [];

  apps.forEach((app) => {
    if (isMatching(app, types)) {
      const appAvatarUrl = avatarUrl(app, moduleApi);
      const appNameOrType = app.name ?? app.type;

      buttons.push({
        icon: () =>
          appAvatarUrl ? (
            <Img
              $isInContainer={isInContainer(app, moduleApi, roomId)}
              alt={appNameOrType}
              src={appAvatarUrl}
            />
          ) : (
            <Svg
              $isInContainer={isInContainer(app, moduleApi, roomId)}
              role="presentation"
            >
              <path d="M16 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3ZM16 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM4 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3Z M8 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
            </Svg>
          ),
        id: app.id,
        label: () =>
          moduleApi.translateString(
            isInContainer(app, moduleApi, roomId)
              ? 'Hide %(name)s'
              : 'Show %(name)s',
            { name: appNameOrType },
          ),
        onClick: () =>
          isInContainer(app, moduleApi, roomId)
            ? moduleApi.moveAppToContainer(app, 'right', roomId)
            : moduleApi.moveAppToContainer(app, 'top', roomId),
      });
    }
  });

  return buttons;
}
