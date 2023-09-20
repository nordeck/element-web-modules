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
import * as http from 'http';
import { AddressInfo } from 'net';

let server: http.Server;

export async function startWidgetServer({
  homeserverUrl,
}: {
  homeserverUrl: string;
}): Promise<{
  widgetServerUrl: string;
}> {
  console.log(`Starting widget server…`);

  const widgetHtmlTemplate = await readFile(
    require.resolve('./widget.html'),
    'utf-8',
  );

  const widgetHtml = widgetHtmlTemplate.replace(
    /{{HOMESERVER_URL}}/g,
    homeserverUrl,
  );

  server = http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(widgetHtml);
  });
  server.listen();

  const widgetServerUrl = `http://localhost:${
    (server.address() as AddressInfo).port
  }`;
  console.log('Widget server running at', widgetServerUrl);

  return { widgetServerUrl };
}

export async function stopWidgetServer() {
  if (server) {
    server.close();
    console.log('Stopped widget server');
  }
}
