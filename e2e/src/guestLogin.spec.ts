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
import { AskToJoinPage } from './pages/askToJoinPage';
import { registerUser } from './util';

test.describe('Guest Module', () => {
  test.beforeEach(({ page: _ }, testInfo) => {
    // Disable platform and browser specific snapshots suffixed. The results are
    // independent from the platform.
    testInfo.snapshotSuffix = '';
  });

  test('guest dialog should not have automatically detectable accessibility violations', async ({
    alicePage,
    aliceElementWebPage,
    guestElementWebPage,
    runAxeAnalysis,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room');

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    await guestElementWebPage.openGuestLoginForm();

    expect(await runAxeAnalysis(alicePage)).toMatchSnapshot();
  });

  test('should request to join a meeting as a guest', async ({
    aliceElementWebPage,
    guestPage,
    guestElementWebPage,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room');

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    const askToJoinPage = new AskToJoinPage(guestPage);
    await askToJoinPage.submitRequest('Please let me in');

    const userSettingsPage = await guestElementWebPage.openUserSettings();
    await expect(userSettingsPage.displayNameInput).toHaveValue(
      'My Name (Guest)',
    );
    await userSettingsPage.close();
  });

  test('should always keep the guest suffix', async ({
    aliceElementWebPage,
    guestElementWebPage,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room');

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    const userSettingsPage = await guestElementWebPage.openUserSettings();
    await expect(userSettingsPage.displayNameInput).toHaveValue(
      'My Name (Guest)',
    );

    await userSettingsPage.changeDisplayName('A new name');

    // reopen the dialog so the textbox includes the new name
    await userSettingsPage.close();
    await guestElementWebPage.openUserSettings();

    await expect(userSettingsPage.displayNameInput).toHaveValue(
      'A new name (Guest)',
    );
  });

  test('should limit UI actions for the guest users', async ({
    aliceElementWebPage,
    guestElementWebPage,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room');

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    // Alice (i.e. a regular user) can do everything
    for (const locator of aliceElementWebPage.getHiddenGuestLocators()) {
      await expect(locator).toBeAttached();
    }

    // The guest misses these elements
    for (const locator of guestElementWebPage.getHiddenGuestLocators()) {
      await expect(locator).not.toBeAttached();
    }
  });

  test('should deny home server actions for the guest user', async ({
    aliceElementWebPage,
    guestElementWebPage,
    bob,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room');

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    // Use the matrix client since the buttons are already hidden from the UI

    await expect(
      aliceElementWebPage.createRoom('A new room'),
    ).resolves.not.toThrow();
    await expect(
      aliceElementWebPage.inviteUser(bob.username),
    ).resolves.not.toThrow();

    await expect(guestElementWebPage.createRoom('A new room')).rejects.toThrow(
      /You are not permitted to create rooms/,
    );
    await expect(guestElementWebPage.inviteUser(bob.username)).rejects.toThrow(
      /Invites have been disabled on this server/,
    );
  });

  test('should not find guests in Element', async ({ aliceElementWebPage }) => {
    await registerUser('guest-example');
    await registerUser('normal-example');

    const createDirectMessagePage =
      await aliceElementWebPage.openCreateDirectMessageDialog();

    createDirectMessagePage.search('example');

    await expect(
      createDirectMessagePage.getSearchResultEntry('normal-example'),
    ).toBeVisible();

    await expect(
      createDirectMessagePage.getSearchResultEntry('guest-example'),
    ).toBeHidden();
  });
});
