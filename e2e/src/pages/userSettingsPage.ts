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

import { Locator, Page } from '@playwright/test';

export class UserSettingsPage {
  public readonly displayNameInput: Locator;
  private readonly saveDisplayNameButton: Locator;
  private readonly closeDialogButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly userMenuButton: Locator,
  ) {
    this.displayNameInput = page.getByRole('textbox', { name: 'Display Name' });
    this.saveDisplayNameButton = page.getByRole('button', { name: 'Save' });
    this.closeDialogButton = page.getByRole('button', { name: 'Close dialog' });
  }

  async open() {
    await this.userMenuButton.click();

    const userMenu = this.page.getByRole('menu');
    await userMenu.getByRole('menuitem', { name: 'All settings' }).click();

    await this.page.getByRole('dialog', { name: 'settings' }).waitFor();
  }

  async changeDisplayName(name: string) {
    await this.displayNameInput.fill(name);
    await this.saveDisplayNameButton.click();
  }

  async close() {
    await this.closeDialogButton.click();
  }
}
