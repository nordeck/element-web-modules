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
import { OpenDeskModuleConfig } from '../config';
import { Room, Widget } from '../global';
import { mockWidgetLayoutStore, mockWidgetStore } from '../test-utils';
import { widgetToggles } from './widgetToggles';

describe('widgetToggles', () => {
  const roomId = '!roomId:example.com';
  const room: Room = { roomId };
  const widgetTypes: OpenDeskModuleConfig['widget_types'] = [
    'com.example.widget',
    'org.example.widget',
  ];

  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      translateString: jest
        .fn()
        .mockImplementation((s, t) => s.replace('%(name)s', t.name)),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('returns no toggles if there is no room', () => {
    mockWidgetStore({
      matrixClient: {
        getRoom: jest.fn().mockReturnValue(null),
        mxcUrlToHttp: jest.fn(),
      },
    });
    expect(widgetToggles(moduleApi, widgetTypes, roomId)).toEqual([]);
  });

  it('returns no toggles if there are no widgets', () => {
    mockWidgetStore({
      getApps: jest.fn().mockReturnValue([]),
      matrixClient: {
        getRoom: jest.fn().mockReturnValue(room),
        mxcUrlToHttp: jest.fn(),
      },
    });
    expect(widgetToggles(moduleApi, widgetTypes, roomId)).toEqual([]);
  });

  describe('when there are widgets', () => {
    const widgets: Array<Widget> = [
      { id: 'com', type: 'com.example.widget' },
      { id: 'org', type: 'org.example.widget' },
    ];

    it('returns no toggles if widget types are missing', () => {
      mockWidgetStore({
        getApps: jest.fn().mockReturnValue(widgets),
        matrixClient: {
          getRoom: jest.fn().mockReturnValue(room),
          mxcUrlToHttp: jest.fn(),
        },
      });
      expect(widgetToggles(moduleApi, undefined, roomId)).toEqual([]);
    });

    it('returns no toggles if widget types are not matching', () => {
      mockWidgetStore({
        getApps: jest
          .fn()
          .mockReturnValue([
            { type: 'com.example.app' },
            { type: 'org.example.app' },
          ]),
        matrixClient: {
          getRoom: jest.fn().mockReturnValue(room),
          mxcUrlToHttp: jest.fn(),
        },
      });
      expect(widgetToggles(moduleApi, widgetTypes, roomId)).toEqual([]);
    });

    it('returns toggles', () => {
      mockWidgetStore({
        getApps: jest.fn().mockReturnValue(widgets),
        matrixClient: {
          getRoom: jest.fn().mockReturnValue(room),
          mxcUrlToHttp: jest.fn(),
        },
      });
      expect(widgetToggles(moduleApi, widgetTypes, roomId).length).toBe(2);
    });
  });

  describe('toggle', () => {
    const avatar_url = 'mxc://example.com/hash';
    const id = 'widget id';
    const name = 'widget name';
    const type = 'com.example.widget';
    const widget: Widget = { avatar_url, id, name, type };

    beforeEach(() => {
      mockWidgetStore({
        getApps: jest.fn().mockReturnValue([widget]),
        matrixClient: {
          getRoom: jest.fn().mockReturnValue(room),
          mxcUrlToHttp: jest.fn(),
        },
      });
    });

    describe('icon', () => {
      const avatarUrl = 'https://example.com/avatar.png';

      beforeEach(() => {
        jest
          .spyOn(window.mxWidgetStore.matrixClient!, 'mxcUrlToHttp')
          .mockReturnValue(avatarUrl);
      });

      it('returns a img-tag with widget name as alt value', () => {
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        expect(toggle.icon).toEqual(
          <img alt={widget.name} height="24" src={avatarUrl} width="24" />,
        );
      });

      it('returns a img-tag with widget type as alt value', () => {
        jest
          .spyOn(window.mxWidgetStore, 'getApps')
          .mockReturnValue([{ avatar_url, id, type }]);
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];

        expect(toggle.icon).toEqual(
          <img alt={widget.type} height="24" src={avatarUrl} width="24" />,
        );
      });

      it('returns a svg-tag', () => {
        jest
          .spyOn(window.mxWidgetStore.matrixClient!, 'mxcUrlToHttp')
          .mockReturnValue(null);
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];

        expect(toggle.icon).toEqual(
          <svg height="24" fill="currentColor" width="24">
            <path d="M16 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3ZM16 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3ZM4 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3Z M8 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          </svg>,
        );
      });
    });

    it('returns a widget ID', () => {
      const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
      expect(toggle.id).toBe(widget.id);
    });

    describe('label', () => {
      it('returns a label with widget name to hide a widget', () => {
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => true });

        expect(toggle.label()).toBe(`Hide ${widget.name}`);
      });

      it('returns a label with widget type to hide a widget', () => {
        jest
          .spyOn(window.mxWidgetStore, 'getApps')
          .mockReturnValue([{ avatar_url, id, type }]);
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => true });

        expect(toggle.label()).toBe(`Hide ${widget.type}`);
      });

      it('returns a label with widget name to show a widget', () => {
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => false });

        expect(toggle.label()).toBe(`Show ${widget.name}`);
      });

      it('returns a label with widget type to show a widget', () => {
        jest
          .spyOn(window.mxWidgetStore, 'getApps')
          .mockReturnValue([{ avatar_url, id, type }]);
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => false });

        expect(toggle.label()).toBe(`Show ${widget.type}`);
      });
    });

    describe('onClick', () => {
      it('hides a widget', () => {
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => true });
        toggle.onClick();

        expect(window.mxWidgetLayoutStore.moveToContainer).toHaveBeenCalledWith(
          room,
          widget,
          'right',
        );
      });

      it('shows a widget', () => {
        const toggle = widgetToggles(moduleApi, widgetTypes, roomId)[0];
        mockWidgetLayoutStore({ isInContainer: () => false });
        toggle.onClick();

        expect(window.mxWidgetLayoutStore.moveToContainer).toHaveBeenCalledWith(
          room,
          widget,
          'top',
        );
      });
    });
  });
});
