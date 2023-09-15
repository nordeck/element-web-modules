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

import { APIRequestContext } from '@playwright/test';
import { getSynapseUrl } from './config';
import { registerUser } from './registerUser';

export async function deactivateAllUsers(
  request: APIRequestContext,
): Promise<void> {
  const { credentials } = await registerUser('admin', true);

  const url = `${getSynapseUrl()}/_synapse/admin/v2/users?limit=1000`;
  const response = await request.get(url, {
    headers: {
      authorization: `Bearer ${credentials.accessToken}`,
    },
  });

  const result = (await response.json()) as {
    users: Array<{ name: string }>;
  };

  // sort this admin user user last
  const users = result.users
    .filter((u) => u.name !== credentials.userId)
    .concat({ name: credentials.userId });

  for (const { name: userId } of users) {
    const url = `${getSynapseUrl()}/_synapse/admin/v1/deactivate/${userId}`;
    const response = await request.post(url, {
      headers: {
        authorization: `Bearer ${credentials.accessToken}`,
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Cannot deactivate user ${userId}`);
    }
  }
}
