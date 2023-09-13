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

export class LoginFormPage {
  public readonly nameInput: Locator;
  private readonly alreadyAccountLink: Locator;
  private readonly continueButton: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.alreadyAccountLink = page.getByRole('link', {
      name: 'I already have an account',
    });
    this.continueButton = page.getByRole('button', {
      name: 'Continue as guest',
    });
    this.loadingSpinner = page.getByRole('progressbar');
  }

  async continueAsGuest(name: string) {
    await this.nameInput.fill(name);
    await Promise.all([
      this.continueButton.click(),
      this.loadingSpinner.waitFor(),
    ]);
    await expect(this.loadingSpinner).toBeHidden();
  }

  async continueWithAccount() {
    await this.alreadyAccountLink.click();
  }
}
