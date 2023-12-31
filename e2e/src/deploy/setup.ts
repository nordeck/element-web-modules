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

import { FullConfig } from '@playwright/test';
import { startElementWeb } from './elementWeb';
import { startSynapse } from './synapse';
import { startWidgetServer } from './widgets';

export default async function globalSetup(_config: FullConfig) {
  const { synapseUrl, registrationSecret } = await startSynapse({
    moduleContainerImage: process.env.MODULE_CONTAINER_IMAGE,
  });
  process.env.SYNAPSE_URL = synapseUrl;
  process.env.SYNAPSE_REGISTRATION_SECRET = registrationSecret;

  const { widgetServerUrl } = await startWidgetServer({
    homeserverUrl: synapseUrl,
  });
  process.env.WIDGET_SERVER_URL = widgetServerUrl;

  const { elementWebUrl } = await startElementWeb({
    homeserverUrl: synapseUrl,
    widgetServerUrl,
  });
  process.env.ELEMENT_WEB_URL = elementWebUrl;
}
