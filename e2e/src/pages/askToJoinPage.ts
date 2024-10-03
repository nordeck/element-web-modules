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

import { Locator, Page, expect } from '@playwright/test';

export class AskToJoinPage {
  public readonly requestInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.requestInput = page.getByRole('textbox');
    this.continueButton = page.getByRole('button', {
      name: 'Request access',
    });
    this.cancelButton = page.getByRole('button', {
      name: 'Cancel request',
    });
  }

  async submitRequest(request: string) {
    await this.requestInput.fill(request);
    await Promise.all([this.continueButton.click()]);
    await expect(this.cancelButton).toBeVisible();
  }
}
