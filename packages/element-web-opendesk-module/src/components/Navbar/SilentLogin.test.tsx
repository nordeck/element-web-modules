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

import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import { SilentLogin } from './SilentLogin';

describe('SilentLogin', () => {
  const url = 'https://example.com/silent';

  it('triggers onLoggedIn-callback', () => {
    const callback = jest.fn();
    const src = new URL(url);
    renderWithTheme(<SilentLogin onLoggedIn={callback} url={url} />);
    fireEvent(
      window,
      new MessageEvent('message', {
        data: {
          loggedIn: true,
        },
        origin: src.origin,
      }),
    );
    expect(callback).toHaveBeenCalledWith(true);
  });

  it(`renders with src "${url.toString()}"`, () => {
    renderWithTheme(<SilentLogin onLoggedIn={() => {}} url={url} />);
    expect(screen.getByTitle('Silent Login')).toHaveAttribute(
      'src',
      url.toString(),
    );
  });
});
