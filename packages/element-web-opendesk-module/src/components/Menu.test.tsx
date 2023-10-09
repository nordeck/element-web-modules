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

import { fireEvent } from '@testing-library/react';
import { renderWithTheme, screen, within } from '../test-utils';
import { Menu } from './Menu';

describe('Menu', () => {
  const navigationJson = {
    categories: [
      {
        display_name: 'Foo',
        entries: [
          {
            display_name: 'Bar',
            icon_url: 'https://example.com/bar-icon.svg',
            identifier: 'foo-bar',
            link: 'https://example.com/bar',
            target: 'bar',
          },
        ],
        identifier: 'foo',
      },
    ],
  };

  it('renders a given navigation JSON', () => {
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={() => {}}
        onKeyDown={() => {}}
      />,
    );
    const link = screen.getByRole('link', { name: 'Bar' });
    expect(link).toHaveAttribute('href', 'https://example.com/bar');
    expect(link).toHaveAttribute('target', 'bar');
    const img = within(link).getByRole('presentation');
    expect(img).toHaveAttribute('src', 'https://example.com/bar-icon.svg');
  });

  it('triggers onClick-callback', () => {
    const callback = jest.fn();
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={callback}
        onKeyDown={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('menu-backdrop'));
    expect(callback).toHaveBeenCalled();
  });

  it('triggers onKeyDown-callback', () => {
    const callback = jest.fn();
    renderWithTheme(
      <Menu
        navigationJson={navigationJson}
        onClick={() => {}}
        onKeyDown={callback}
      />,
    );
    fireEvent.keyDown(screen.getByTestId('menu-list'));
    expect(callback).toHaveBeenCalled();
  });
});
