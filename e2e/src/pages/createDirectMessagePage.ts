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

export class CreateDirectMessagePage {
  public readonly dialog: Locator;

  constructor(
    page: Page,
    private readonly startChatButton: Locator,
  ) {
    this.dialog = page.getByRole('dialog', { name: 'Direct Messages' });
  }

  async open() {
    await this.startChatButton.click();

    await this.dialog.waitFor();
  }

  async search(text: string) {
    await this.dialog.getByRole('textbox').fill(text);
  }

  getSearchResultEntry(text: string): Locator {
    return this.dialog.getByRole('button', { name: text });
  }
}
