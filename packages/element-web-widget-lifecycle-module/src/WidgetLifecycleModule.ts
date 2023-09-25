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
import { RuntimeModule } from '@matrix-org/react-sdk-module-api/lib/RuntimeModule';
import {
  ApprovalListener,
  ApprovalOpts,
  CapabilitiesListener,
  CapabilitiesOpts,
  WidgetInfo,
  WidgetLifecycle,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/WidgetLifecycle';
import {
  WIDGET_LIFECYCLE_MODULE_CONFIG_KEY,
  WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE,
  WidgetLifecycleModuleConfig,
  assertValidWidgetLifecycleModuleConfig,
} from './config';
import { constructWidgetPermissions, matchPattern } from './utils';

export class WidgetLifecycleModule extends RuntimeModule {
  private config: WidgetLifecycleModuleConfig;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    const rawConfig = this.moduleApi.getConfigValue(
      WIDGET_LIFECYCLE_MODULE_CONFIG_NAMESPACE,
      WIDGET_LIFECYCLE_MODULE_CONFIG_KEY,
    );

    assertValidWidgetLifecycleModuleConfig(rawConfig);
    this.config = rawConfig ?? {};

    this.on(WidgetLifecycle.PreLoadRequest, this.preloadListener);
    this.on(WidgetLifecycle.IdentityRequest, this.identityListener);
    this.on(WidgetLifecycle.CapabilitiesRequest, this.capabilitiesListener);
  }

  protected preloadListener: ApprovalListener = (
    approvalOpts: ApprovalOpts,
    widgetInfo: WidgetInfo,
  ) => {
    const url = cleanupUrl(widgetInfo.templateUrl);
    const configuration = constructWidgetPermissions(this.config, url);

    if (configuration.preload_approved) {
      approvalOpts.approved = true;
    }
  };

  protected identityListener: ApprovalListener = (
    approvalOpts: ApprovalOpts,
    widgetInfo: WidgetInfo,
  ) => {
    const url = cleanupUrl(widgetInfo.templateUrl);
    const configuration = constructWidgetPermissions(this.config, url);

    if (configuration.identity_approved) {
      approvalOpts.approved = configuration.identity_approved;
    }
  };

  protected capabilitiesListener: CapabilitiesListener = (
    capabilitiesOpts: CapabilitiesOpts,
    widgetInfo: WidgetInfo,
    requestedCapabilities: Set<string>,
  ) => {
    const url = cleanupUrl(widgetInfo.templateUrl);
    const configuration = constructWidgetPermissions(this.config, url);

    const capabilitiesApproved = configuration.capabilities_approved;

    if (!capabilitiesApproved) {
      return;
    }

    const approvedCapabilities =
      capabilitiesOpts.approvedCapabilities ?? new Set<string>();

    for (const requestedCapability of requestedCapabilities) {
      if (isApproved(capabilitiesApproved, requestedCapability)) {
        approvedCapabilities.add(requestedCapability);
      }
    }

    capabilitiesOpts.approvedCapabilities = approvedCapabilities;
  };
}

export function isApproved(
  approvedCapabilities: string[],
  capability: string,
): boolean {
  return approvedCapabilities.some((c) => matchPattern(capability, c));
}

function cleanupUrl(widgetTemplateUrl: string): string {
  const widgetUrl = new URL(widgetTemplateUrl);
  widgetUrl.search = '';
  widgetUrl.hash = '';
  return widgetUrl.toString();
}
