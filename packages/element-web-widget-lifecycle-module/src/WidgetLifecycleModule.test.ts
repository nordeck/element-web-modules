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
import { WidgetLifecycleModule } from './WidgetLifecycleModule';

describe('WidgetLifecycleModule', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue({}),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should start the module without exploding', () => {
    expect(() => new WidgetLifecycleModule(moduleApi)).not.toThrow();
  });
});
