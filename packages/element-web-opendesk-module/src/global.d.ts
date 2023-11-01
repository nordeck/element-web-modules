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

import 'styled-components';

type Container = 'right' | 'top';

type Room = {
  roomId: string;
};

type Widget = {
  avatar_url?: string;
  id: string;
  name?: string;
  type: string;
};

declare global {
  interface Window {
    mxWidgetLayoutStore: {
      isInContainer: (
        room: Room,
        widget: Widget,
        container: Container,
      ) => boolean;
      moveToContainer: (
        room: Room,
        widget: Widget,
        container: Container,
      ) => void;
    };
    mxWidgetStore: {
      getApps: (roomId: string) => Array<Widget>;
      matrixClient?: {
        getRoom: (roomId: string | undefined) => Room | null;
        mxcUrlToHttp: (
          mxcUrl: string,
          width?: number,
          height?: number,
        ) => string | null;
      };
    };
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    compound: {
      color: {
        bgCanvasDefault: string;
        textActionAccent: string;
        textPrimary: string;
      };
      font: {
        bodyMdSemibold: string;
      };
    };
    navbar: {
      border: string;
      boxShadow: string;
      color: string;
      height: string;
      hoverBackgroundColor: string;
      offsetHeight: string;
    };
  }
}
