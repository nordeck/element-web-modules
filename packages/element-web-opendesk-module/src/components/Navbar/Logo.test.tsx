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

import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import { Logo } from './Logo';

describe('Logo', () => {
  const alt = 'Logo';
  const href = 'https://exmaple.com';
  const label = 'Show portal';
  const src = 'https://example.com/logo.svg';

  it(`renders with alt "${alt}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', alt);
  });

  it(`renders with href "${href}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', href);
  });

  it(`renders with aria-label "${label}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('link')).toHaveAccessibleName(label);
  });

  it(`renders with src "${src}"`, () => {
    renderWithTheme(<Logo alt={alt} ariaLabel={label} href={href} src={src} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', src);
  });
});
