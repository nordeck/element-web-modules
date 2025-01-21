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

import fetch from 'cross-fetch';
import { randomBytes } from 'crypto';
import { readFile, rm } from 'fs/promises';
import path from 'path';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

let container: StartedTestContainer | undefined;

function randB64Bytes(numBytes: number): string {
  return randomBytes(numBytes).toString('base64').replace(/=*$/, '');
}

export async function startSynapse({
  containerImage = 'matrixdotorg/synapse:latest',
  moduleContainerImage = 'ghcr.io/nordeck/synapse-guest-module',
}: { containerImage?: string; moduleContainerImage?: string } = {}): Promise<{
  synapseUrl: string;
  synapseHostUrl: string;
  registrationSecret: string;
}> {
  console.log(`Starting synapse… (${containerImage})`);

  const registrationSecret = randB64Bytes(16);
  const macaroonSecret = randB64Bytes(16);
  const formSecret = randB64Bytes(16);
  const signingKey = `ed25519 x ${randB64Bytes(32)}`;

  const homeserverConfigTemplate = await readFile(
    require.resolve('./homeserver.yaml'),
    'utf-8',
  );
  const homeserverConfig = homeserverConfigTemplate
    .replace(/{{REGISTRATION_SECRET}}/g, registrationSecret)
    .replace(/{{MACAROON_SECRET_KEY}}/g, macaroonSecret)
    .replace(/{{FORM_SECRET}}/g, formSecret);

  // Load the module from the docker container to the local folder
  const modulesFolder = await loadModuleToTmp(moduleContainerImage);

  container = await new GenericContainer(containerImage)
    // Load addition python modules from the /modules folder
    .withEnvironment({ PYTHONPATH: '/modules' })
    .withCopyFilesToContainer([
      { source: require.resolve('./log.config'), target: '/data/log.config' },
    ])
    .withCopyDirectoriesToContainer([
      {
        source: modulesFolder,
        target: '/modules',
      },
    ])
    .withCopyContentToContainer([
      {
        target: '/data/homeserver.yaml',
        content: homeserverConfig.replace(
          /{{HOMESERVER_URL}}/g,
          'http://localhost:8008',
        ),
      },
      {
        target: '/data/localhost.signing.key',
        content: signingKey,
      },
    ])
    .withTmpFs({ '/data/media_store': 'rw,mode=777' })
    .withExposedPorts(8008)
    .withWaitStrategy(Wait.forAll([]))
    .withEntrypoint([
      '/bin/sh',
      '-c',
      'while [ ! -f /test_containers_ready ]; do sleep 0.1; done; ./start.py',
    ])
    .start();

  const synapseUrl = `http://${container.getHost()}:${container.getMappedPort(
    8008,
  )}`;

  const ipAddress = getIpAddress(container);
  const synapseHostUrl = `http://${ipAddress}:8008`;

  await container.copyContentToContainer([
    {
      target: '/data/homeserver.yaml',
      content: homeserverConfig.replace(/{{HOMESERVER_URL}}/g, synapseUrl),
    },
    {
      target: '/test_containers_ready',
      content: 'READY',
    },
  ]);

  let status;
  do {
    ({ status } = await fetch(path.posix.join(synapseUrl, '/health')).catch(
      (_) => ({ status: undefined }),
    ));
  } while (status !== 200);

  console.log('Synapse running at', synapseUrl);

  return { synapseUrl, synapseHostUrl, registrationSecret };
}

export async function stopSynapse() {
  if (container) {
    await container.stop();

    console.log('Stopped synapse');
  }
}

async function loadModuleToTmp(containerImage: string): Promise<string> {
  const modulesFolder = path.resolve(__dirname, './.tmp/modules');

  await rm(path.resolve(modulesFolder, './*'), {
    recursive: true,
    force: true,
  });

  await new GenericContainer(containerImage)
    .withBindMounts([
      {
        source: modulesFolder,
        target: '/modules',
        mode: 'rw',
      },
    ])
    .start();

  return modulesFolder;
}

function getIpAddress(container: StartedTestContainer): string {
  try {
    // First try to return the Docker IP address
    return container.getIpAddress('bridge');
  } catch {
    // Ignore
  }

  // Try the Podman IP address otherwise
  return container.getIpAddress('podman');
}
