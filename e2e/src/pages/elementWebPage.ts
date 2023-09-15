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
import fetch from 'cross-fetch';
import { Credentials, getElementWebUrl, getSynapseUrl } from '../util';
import { CreateDirectMessagePage } from './createDirectMessagePage';
import { LoginFormPage } from './loginFormPage';
import { UserSettingsPage } from './userSettingsPage';

export class ElementWebPage {
  private readonly navigationRegion: Locator;
  private readonly mainRegion: Locator;
  private readonly headerRegion: Locator;
  private readonly roomNameText: Locator;
  private readonly userMenuButton: Locator;
  private readonly startChatButton: Locator;

  constructor(private readonly page: Page) {
    this.navigationRegion = page.getByRole('navigation');
    this.mainRegion = page.getByRole('main');
    this.headerRegion = this.mainRegion.locator('header');
    this.roomNameText = this.headerRegion.getByRole('heading');
    this.userMenuButton = this.navigationRegion.getByRole('button', {
      name: 'User menu',
    });
    this.startChatButton = this.navigationRegion.getByRole('button', {
      name: 'Start chat',
    });
  }

  public getCurrentRoomId(): string {
    const m = this.page.url().match(/#\/room\/(.*)/);
    const roomId = m && m[1];

    if (!roomId) {
      throw new Error('Unknown room');
    }

    return roomId;
  }

  async createRoom(
    name: string,
    {
      encrypted = false,
      visibility = 'private',
    }: { encrypted?: boolean; visibility?: 'private' | 'public' } = {},
  ): Promise<{ roomId: string }> {
    // Instead of controlling the UI, we use the matrix client as it is faster.
    const { roomId } = await this.page.evaluate(
      async ({ name, encrypted, visibility }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = (window as any).mxMatrixClientPeg.get();

        if (encrypted) {
          // TODO: Support encryption in rooms

          throw new Error('Encryption not supported!');
        }

        const { room_id } = await client.createRoom({
          name,
          visibility,
          power_level_content_override: { invite: 0 },
        });

        return { roomId: room_id };
      },
      { name, encrypted, visibility },
    );

    await this.switchToRoom(name);

    return { roomId };
  }

  async navigateToRoomOrInvitation(name: string) {
    await this.page
      .getByRole('tree', { name: 'Rooms' })
      .getByRole('treeitem', {
        name: new RegExp(`^${name}( Unread messages\\.)?`),
      })
      .click();
  }

  async waitForRoom(name: string) {
    await this.page
      .getByRole('tree', { name: 'Rooms' })
      .getByRole('treeitem', {
        name: new RegExp(`^${name}( Unread messages\\.)?`),
      })
      .click();

    await this.roomNameText.getByText(name).waitFor();
  }

  async switchToRoom(name: string) {
    await this.navigateToRoomOrInvitation(name);
    await this.waitForRoom(name);
  }

  async joinRoom() {
    await this.page
      .getByRole('button', { name: 'Join the discussion' })
      .click();
  }

  async inviteUser(username: string) {
    const roomId = this.getCurrentRoomId();

    // Instead of controlling the UI, we use the matrix client as it is faster.
    await this.page.evaluate(
      async ({ roomId, username }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = (window as any).mxMatrixClientPeg.get();

        await client.invite(roomId, `@${username}:localhost`);
      },
      { roomId, username },
    );
  }

  async login(username: string, password: string): Promise<Credentials> {
    const synapseUrl = getSynapseUrl();
    const url = `${synapseUrl}/_matrix/client/r0/login`;
    const createResp = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: username,
        },
        password,
      }),
    });
    const credentials = (await createResp.json()) as {
      access_token: string;
      user_id: string;
      device_id: string;
      home_server: string;
    };

    // To set the credentials, we have to be on the correct origin. But loading
    // element full is expensive, so we load something else.
    await this.page.goto(`${getElementWebUrl()}/welcome/images/logo.svg`);

    // Seed the localStorage with the required credentials
    await this.page.evaluate(
      ({ synapseUrl, credentials }) => {
        window.localStorage.setItem('mx_hs_url', synapseUrl);
        window.localStorage.setItem('mx_user_id', credentials.user_id);
        window.localStorage.setItem(
          'mx_access_token',
          credentials.access_token,
        );
        window.localStorage.setItem('mx_device_id', credentials.device_id);
        window.localStorage.setItem('mx_is_guest', 'false');
        window.localStorage.setItem('mx_has_pickle_key', 'false');
        window.localStorage.setItem('mx_has_access_token', 'true');
        window.localStorage.setItem(
          'mx_local_settings',
          JSON.stringify({
            // Disable opt-ins and cookie headers
            analyticsOptIn: false,
            showCookieBar: false,
            // Set language to en instead of using the current locale
            language: 'en',
            // Always test in high contrast mode
            theme: 'light-high-contrast',
          }),
        );
        // Don't ask the user if he wants to enable notifications
        window.localStorage.setItem('notifications_hidden', 'true');
        // Disable audio notifications, they can be annoying during tests
        window.localStorage.setItem('audio_notifications_enabled', 'false');
      },
      { synapseUrl, credentials },
    );

    // Reload and use the credentials
    await this.page.goto(getElementWebUrl());

    // Wait for Element to be ready
    await this.navigationRegion
      .getByRole('button', { name: 'Add', exact: true })
      .waitFor();

    return {
      accessToken: credentials.access_token,
      userId: credentials.user_id,
      deviceId: credentials.device_id,
      homeServer: credentials.home_server,
    };
  }

  async loginWithForm(user: { username: string; password: string }) {
    await this.page
      .getByRole('textbox', { name: 'Username' })
      .fill(user.username);
    await this.page
      .getByRole('textbox', { name: 'Password' })
      .fill(user.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async navigateToRoomWithLink(roomId: string) {
    await this.page.goto(`${getElementWebUrl()}/#/room/${roomId}`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async openGuestLoginForm(): Promise<LoginFormPage> {
    await this.page.getByText('Join the room to participate').waitFor();
    await this.page.getByRole('button', { name: 'Join' }).click();

    const dialog = this.page.getByRole('dialog');
    await dialog
      .getByRole('heading', { name: 'Request room access', level: 1 })
      .waitFor();

    return new LoginFormPage(this.page);
  }

  public async openUserSettings(): Promise<UserSettingsPage> {
    const userSettingsPage = new UserSettingsPage(
      this.page,
      this.userMenuButton,
    );

    await userSettingsPage.open();

    return userSettingsPage;
  }

  public async openCreateDirectMessageDialog(): Promise<CreateDirectMessagePage> {
    const createDirectMessagePage = new CreateDirectMessagePage(
      this.page,
      this.startChatButton,
    );

    await createDirectMessagePage.open();

    return createDirectMessagePage;
  }

  public getHiddenGuestLocators(): Locator[] {
    return [
      // Controlled by UIComponent.CreateRooms, UIComponent.ExploreRooms
      this.navigationRegion.getByRole('button', { name: 'Start chat' }),
      this.navigationRegion.getByRole('button', { name: 'Add room' }),

      // Controlled by UIComponent.CreateSpaces
      this.navigationRegion.getByRole('button', { name: 'Create a space' }),

      // Controlled by UIComponent.InviteUsers
      this.mainRegion.getByRole('button', { name: 'Invite to this room' }),

      // Controlled by UIComponent.RoomOptionsMenu
      this.headerRegion.getByRole('button', { name: 'Room options' }),
    ];
  }
}
