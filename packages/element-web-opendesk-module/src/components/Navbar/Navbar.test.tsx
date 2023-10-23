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
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { BannerConfig } from '../../config';
import { renderWithTheme } from '../../test-utils';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  const config: BannerConfig = {
    ics_navigation_json_url: 'https://example.com/navigation.json',
    ics_silent_url: 'https://example.com/silent',
    portal_logo_svg_url: 'https://example.com/logo.svg',
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

  it('renders portal link', () => {
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

  it('fetches navigation JSON', async () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => ({ categories: [{ entries: [] }] }),
    });
    fireEvent(window, messageEvent);
    await waitFor(() =>
      expect(window.fetch).toHaveBeenCalledWith(
        'https://example.com/navigation.json?language=en',
        { credentials: 'include' },
      ),
    );
  });

  it('catches navigation JSON fetch error', async () => {
    renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
    const error = new Error('Test');
    console.error = jest.fn();
    window.fetch = jest.fn().mockRejectedValue(error);
    fireEvent(window, messageEvent);
    await waitFor(() => expect(window.fetch).toHaveBeenCalled());
    expect(console.error).toHaveBeenCalledWith(error);
  });

  describe('menu', () => {
    beforeEach(() => {
      window.fetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: () => ({ categories: [] }) });
    });

    it('allows to toggle menu', async () => {
      renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      expect(screen.getByRole('list')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { expanded: true }));
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('allows to close menu via click on menu-backdrop', async () => {
      renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.click(screen.getByTestId('menu-backdrop'));
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('allows to close menu via escape-key on menu-list', async () => {
      renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.keyDown(screen.getByRole('list'), { key: 'Escape' });
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('disallows to close menu via any other key on menu-list', async () => {
      renderWithTheme(<Navbar config={config} moduleApi={moduleApi} />);
      fireEvent(window, messageEvent);
      await waitFor(() => expect(window.fetch).toHaveBeenCalled());
      fireEvent.click(screen.getByRole('button', { expanded: false }));
      fireEvent.keyDown(screen.getByRole('list'));
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
