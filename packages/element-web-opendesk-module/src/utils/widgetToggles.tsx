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

import { ModuleApi } from '@matrix-org/react-sdk-module-api';
import { ViewRoomOpts } from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import styled from 'styled-components';
import { OpenDeskModuleConfig } from '../config';
import { Widget } from '../global';

type Props = { $pinned: boolean };

const Img = styled.img<Props>`
  border-color: ${({ theme }) => theme.compound.color.textActionAccent};
  border-radius: 50%;
  border-style: solid;
  border-width: ${({ $pinned }) => ($pinned ? '2px' : '0px')};
  box-sizing: border-box;
  height: 24px;
  width: 24px;
`;

const Svg = styled.svg<Props>`
  height: 24px;
  fill: ${({ $pinned }) =>
    $pinned ? 'var(--cpd-color-text-action-accent)' : 'currentColor'};
  width: 24px;
`;

function isMatching(
  widgetTypes: OpenDeskModuleConfig['widget_types'],
  widget: Widget,
): boolean {
  if (!widgetTypes) {
    return false;
  }

  return !!widget.type.match(new RegExp(widgetTypes.join('|'), 'i'));
}

function widgetAvatarUrl(widget: Widget): string | null {
  if (widget.type.match(/jitsi/i)) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjQiIGZpbGw9IiM1QUJGRjIiLz4KICAgIDxwYXRoIGQ9Ik0zIDcuODc1QzMgNi44Mzk0NyAzLjgzOTQ3IDYgNC44NzUgNkgxMS4xODc1QzEyLjIyMyA2IDEzLjA2MjUgNi44Mzk0NyAxMy4wNjI1IDcuODc1VjEyLjg3NUMxMy4wNjI1IDEzLjkxMDUgMTIuMjIzIDE0Ljc1IDExLjE4NzUgMTQuNzVINC44NzVDMy44Mzk0NyAxNC43NSAzIDEzLjkxMDUgMyAxMi44NzVWNy44NzVaIiBmaWxsPSJ3aGl0ZSIvPgogICAgPHBhdGggZD0iTTE0LjM3NSA4LjQ0NjQ0TDE2LjEyMDggNy4xMTAzOUMxNi40ODA2IDYuODM1MDIgMTcgNy4wOTE1OCAxNyA3LjU0NDY4VjEzLjAzOTZDMTcgMTMuNTE5OSAxNi40MjUxIDEzLjc2NjkgMTYuMDc2NyAxMy40MzYzTDE0LjM3NSAxMS44MjE0VjguNDQ2NDRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  }

  if (window.mxWidgetStore.matrixClient && widget.avatar_url) {
    return window.mxWidgetStore.matrixClient.mxcUrlToHttp(
      widget.avatar_url,
      24,
      24,
    );
  }

  return null;
}

function widgetNameOrType(widget: Widget): string {
  return widget.name ?? widget.type;
}

export function widgetToggles(
  moduleApi: ModuleApi,
  widgetTypes: OpenDeskModuleConfig['widget_types'],
  roomId: string,
): ViewRoomOpts['buttons'] {
  const buttons: ViewRoomOpts['buttons'] = [];
  const room = window.mxWidgetStore.matrixClient?.getRoom(roomId);

  if (room) {
    const widgets = window.mxWidgetStore.getApps(roomId);

    widgets.forEach((widget) => {
      const avatarUrl = widgetAvatarUrl(widget);
      const nameOrType = widgetNameOrType(widget);

      if (isMatching(widgetTypes, widget)) {
        buttons.push({
          icon: () => {
            const isPinned = window.mxWidgetLayoutStore.isInContainer(
              room,
              widget,
              'top',
            );

            return avatarUrl ? (
              <Img $pinned={isPinned} alt={nameOrType} src={avatarUrl} />
            ) : (
              <Svg $pinned={isPinned} role="presentation">
                <path d="M16 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3ZM16 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM4 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3Z M8 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
              </Svg>
            );
          },
          id: widget.id,
          label: () =>
            window.mxWidgetLayoutStore.isInContainer(room, widget, 'top')
              ? moduleApi.translateString('Hide %(name)s', { name: nameOrType })
              : moduleApi.translateString('Show %(name)s', {
                  name: nameOrType,
                }),
          onClick: () => {
            const isPinned = window.mxWidgetLayoutStore.isInContainer(
              room,
              widget,
              'top',
            );

            if (isPinned) {
              window.mxWidgetLayoutStore.moveToContainer(room, widget, 'right');
            } else {
              window.mxWidgetLayoutStore.moveToContainer(room, widget, 'top');
            }
          },
        });
      }
    });
  }

  return buttons;
}
