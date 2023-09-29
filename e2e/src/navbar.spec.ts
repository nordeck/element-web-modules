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

import { expect } from '@playwright/test';
import { test } from './fixtures';
import { getElementWebUrl } from './util';

test.describe('Navbar Module', () => {
  test('renders the link to the portal', async ({ page }) => {
    await page.goto(getElementWebUrl());
    const navigation = page.getByRole('navigation');
    const link = navigation.getByRole('link', { name: 'Show portal' });
    await expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
