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
import { Launcher } from './Launcher';

describe('Launcher', () => {
  const label = 'Show menu';

  it('renders with aria-expanded "false"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('renders with aria-expanded "true"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={true} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });

  it('renders with aria-label', () => {
    renderWithTheme(
      <Launcher ariaExpanded={true} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('triggers onClick-callback', () => {
    const callback = jest.fn();
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={callback} />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(callback).toHaveBeenCalled();
  });

  it('renders with aria-haspopup "true"', () => {
    renderWithTheme(
      <Launcher ariaExpanded={false} ariaLabel={label} onClick={() => {}} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'true');
  });
});
