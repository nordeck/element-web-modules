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

import { readFile } from 'fs/promises';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

let container: StartedTestContainer | undefined;

export async function startElementWeb({
  homeserverUrl,
  widgetServerUrl,
  version = 'v1.11.48-rc.1',
}: {
  homeserverUrl: string;
  widgetServerUrl: string;
  version?: string;
}): Promise<{ elementWebUrl: string }> {
  console.log(`Starting element web… (version ${version})`);

  const elementWebConfigTemplate = await readFile(
    require.resolve('./config.json'),
    'utf-8',
  );
  const elementWebConfig = elementWebConfigTemplate
    .replace(/{{HOMESERVER_URL}}/g, homeserverUrl)
    .replace(/{{WIDGET_SERVER_URL}}/g, widgetServerUrl);

  const elementContainer = await GenericContainer.fromDockerfile(__dirname)
    .withBuildArgs({ ELEMENT_VERSION: version })
    .build();

  container = await elementContainer
    .withCopyContentToContainer([
      { target: '/app/config.json', content: elementWebConfig },
    ])
    .withExposedPorts(80)
    .withWaitStrategy(Wait.forHttp('/', 80))
    .start();

  const elementWebUrl = `http://${container.getHost()}:${container.getMappedPort(
    80,
  )}`;

  console.log('Element web running at', elementWebUrl);

  return { elementWebUrl };
}

export async function stopElementWeb() {
  if (container) {
    await container.stop();

    console.log('Stopped element web');
  }
}
