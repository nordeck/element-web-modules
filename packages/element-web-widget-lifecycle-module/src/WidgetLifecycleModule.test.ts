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
  ApprovalOpts,
  CapabilitiesOpts,
  WidgetInfo,
  WidgetLifecycle,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WidgetLifecycle';
import { WidgetLifecycleModule } from '../src/WidgetLifecycleModule';

describe('WidgetLifecycleModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue({}),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  describe('WidgetLifecycle.PreLoadRequest', () => {
    it('should approve preloading', () => {
      moduleApi.getConfigValue.mockImplementation((namespace, key) => {
        if (
          namespace === 'net.nordeck.element_web.module.widget_lifecycle' &&
          key === 'widget_permissions'
        ) {
          return {
            'https://example.com/': { preload_approved: true },
          };
        }

        return undefined;
      });

      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: undefined };
      module.emit(WidgetLifecycle.PreLoadRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: true });
    });

    it('should reject preloading', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: undefined };
      module.emit(WidgetLifecycle.PreLoadRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: undefined });
    });

    it('should not override existing value', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: true };
      module.emit(WidgetLifecycle.PreLoadRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: true });
    });
  });

  describe('WidgetLifecycle.IdentityRequest', () => {
    it('should approve preloading', () => {
      moduleApi.getConfigValue.mockImplementation((namespace, key) => {
        if (
          namespace === 'net.nordeck.element_web.module.widget_lifecycle' &&
          key === 'widget_permissions'
        ) {
          return {
            'https://example.com/': { identity_approved: true },
          };
        }

        return undefined;
      });

      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: undefined };
      module.emit(WidgetLifecycle.IdentityRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: true });
    });

    it('should reject preloading', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: undefined };
      module.emit(WidgetLifecycle.IdentityRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: undefined });
    });

    it('should not override existing value', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: ApprovalOpts = { approved: true };
      module.emit(WidgetLifecycle.IdentityRequest, opts, mockWidgetInfo());

      expect(opts).toEqual({ approved: true });
    });
  });

  describe('WidgetLifecycle.CapabilitiesRequest', () => {
    it('should approve capabilities', () => {
      moduleApi.getConfigValue.mockImplementation((namespace, key) => {
        if (
          namespace === 'net.nordeck.element_web.module.widget_lifecycle' &&
          key === 'widget_permissions'
        ) {
          return {
            'https://example.com/': {
              capabilities_approved: ['org.matrix.msc2931.navigate'],
            },
          };
        }

        return undefined;
      });

      const module = new WidgetLifecycleModule(moduleApi);

      const opts: CapabilitiesOpts = { approvedCapabilities: undefined };
      module.emit(
        WidgetLifecycle.CapabilitiesRequest,
        opts,
        mockWidgetInfo(),
        new Set([
          'org.matrix.msc2931.navigate',
          'org.matrix.msc2762.timeline:*',
        ]),
      );

      expect(opts).toEqual({
        approvedCapabilities: new Set(['org.matrix.msc2931.navigate']),
      });
    });

    it('should not approve capabilities', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: CapabilitiesOpts = { approvedCapabilities: undefined };
      module.emit(
        WidgetLifecycle.CapabilitiesRequest,
        opts,
        mockWidgetInfo(),
        new Set([
          'org.matrix.msc2931.navigate',
          'org.matrix.msc2762.timeline:*',
        ]),
      );

      expect(opts).toEqual({ approvedCapabilities: undefined });
    });

    it('should not override existing value when approving', () => {
      moduleApi.getConfigValue.mockImplementation((namespace, key) => {
        if (
          namespace === 'net.nordeck.element_web.module.widget_lifecycle' &&
          key === 'widget_permissions'
        ) {
          return {
            'https://example.com/': {
              capabilities_approved: ['org.matrix.msc2931.navigate'],
            },
          };
        }

        return undefined;
      });

      const module = new WidgetLifecycleModule(moduleApi);

      const opts: CapabilitiesOpts = {
        approvedCapabilities: new Set([
          'org.matrix.msc2762.send.state_event:m.room.name',
        ]),
      };
      module.emit(
        WidgetLifecycle.CapabilitiesRequest,
        opts,
        mockWidgetInfo(),
        new Set([
          'org.matrix.msc2931.navigate',
          'org.matrix.msc2762.timeline:*',
        ]),
      );

      expect(opts).toEqual({
        approvedCapabilities: new Set([
          'org.matrix.msc2762.send.state_event:m.room.name',
          'org.matrix.msc2931.navigate',
        ]),
      });
    });

    it('should not override existing value when not approving', () => {
      const module = new WidgetLifecycleModule(moduleApi);

      const opts: CapabilitiesOpts = {
        approvedCapabilities: new Set([
          'org.matrix.msc2762.send.state_event:m.room.name',
        ]),
      };
      module.emit(
        WidgetLifecycle.CapabilitiesRequest,
        opts,
        mockWidgetInfo(),
        new Set([
          'org.matrix.msc2931.navigate',
          'org.matrix.msc2762.timeline:*',
        ]),
      );

      expect(opts).toEqual({
        approvedCapabilities: new Set([
          'org.matrix.msc2762.send.state_event:m.room.name',
        ]),
      });
    });
  });
});

function mockWidgetInfo(patch: Partial<WidgetInfo> = {}): WidgetInfo {
  return {
    creatorUserId: '@user-id',
    type: 'm.custom',
    id: 'widget-id',
    name: null,
    title: null,
    templateUrl: 'https://example.com',
    origin: 'https://example.com',
    ...patch,
  };
}
