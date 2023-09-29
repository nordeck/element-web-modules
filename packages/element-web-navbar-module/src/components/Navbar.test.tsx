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

import { ModuleApi } from '@matrix-org/react-sdk-module-api/lib/ModuleApi';
import { NavbarModuleConfig } from '../config';
import { act, fireEvent, renderWithTheme, screen, within } from '../test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  const config: NavbarModuleConfig = {
    ics_navigation_json_url: 'https://example.com/navigation.json',
    ics_silent_url: 'https://example.com/silent',
    portal_url: 'https://example.com',
  };
  const messageEvent = new MessageEvent('message', {
    data: {
      loggedIn: true,
    },
    origin: config.portal_url,
  });

  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      getConfigValue: jest.fn().mockReturnValue(config),
      translateString: jest.fn().mockImplementation((s) => s),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('renders the link to the portal', () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    const navigation = screen.getByRole('navigation');
    const link = within(navigation).getByRole('link');
    expect(link).toHaveAttribute('href', config.portal_url);
  });

  it('logs in silently', () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    const navigation = screen.getByRole('navigation');
    const iframe = within(navigation).getByTitle('Silent Login');
    expect(iframe).toBeInTheDocument();
    fireEvent(window, messageEvent);
    expect(iframe).not.toBeInTheDocument();
  });

  it('fetches the navigation JSON', async () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    jest.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE']);
    window.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => ({}) });
    fireEvent(window, messageEvent);
    await act(async () =>
      expect(window.fetch).toHaveBeenCalledWith(
        'https://example.com/navigation.json?language=de-DE',
        { credentials: 'include' },
      ),
    );
  });

  it('allows to toggle the menu', async () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    window.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => ({ categories: [] }) });
    fireEvent(window, messageEvent);
    await act(async () => expect(window.fetch).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByRole('list')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { expanded: true }));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
