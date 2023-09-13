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
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    await guestElementWebPage.openGuestLoginForm();

    expect(await runAxeAnalysis(alicePage)).toMatchSnapshot();
  });

  test('should join a meeting as a guest', async ({
    aliceElementWebPage,
    guestElementWebPage,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    await guestElementWebPage.waitForRoom('My New Room');

    const userSettingsPage = await guestElementWebPage.openUserSettings();
    await expect(userSettingsPage.displayNameInput).toHaveValue(
      'My Name (Guest)',
    );
    await userSettingsPage.close();
  });

  test('should join a meeting with an existing account', async ({
    aliceElementWebPage,
    guestPage,
    guestElementWebPage,
    bob,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueWithAccount();
    await guestElementWebPage.loginWithForm(bob);

    await guestPage.getByRole('heading', { name: 'Welcome Bob' }).waitFor();

    // The user is not forwarded to the correct room after a non-SSO login, so
    // we manually navigate him there again.
    await guestElementWebPage.navigateToRoomWithLink(roomId);

    // The user will not be able to automatically join this room
    // (even with SSO enabled).
    await guestElementWebPage.joinRoom();

    await guestElementWebPage.waitForRoom('My New Room');

    const userSettingsPage = await guestElementWebPage.openUserSettings();
    await expect(userSettingsPage.displayNameInput).toHaveValue('Bob');
  });

  test('should always keep the guest suffix', async ({
    aliceElementWebPage,
    guestElementWebPage,
  }) => {
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

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
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    await guestElementWebPage.waitForRoom('My New Room');

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
    const { roomId } = await aliceElementWebPage.createRoom('My New Room', {
      visibility: 'public',
    });

    await guestElementWebPage.navigateToRoomWithLink(roomId);

    const loginFormPage = await guestElementWebPage.openGuestLoginForm();

    await loginFormPage.continueAsGuest('My Name');

    await guestElementWebPage.waitForRoom('My New Room');

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
});
