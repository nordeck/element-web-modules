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
import { AccountAuthInfo } from '@matrix-org/react-sdk-module-api/lib/types/AccountAuthInfo';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { generatePassword } from '../utils';
import { RegisterDialog } from './RegisterDialog';

jest.mock('../utils');

describe('<RegisterDialog />', () => {
  let moduleApi: jest.Mocked<ModuleApi>;

  beforeEach(() => {
    moduleApi = {
      translateString: jest.fn().mockImplementation((s) => s),
      registerSimpleAccount: jest.fn(),
    } as Partial<jest.Mocked<ModuleApi>> as jest.Mocked<ModuleApi>;
  });

  it('should render without exploding', () => {
    render(
      <RegisterDialog
        config={{}}
        moduleApi={moduleApi}
        setOptions={jest.fn()}
        cancel={jest.fn()}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'I already have an account.' }),
    ).toBeInTheDocument();
  });

  it('should register a guest account', async () => {
    jest.mocked(generatePassword).mockReturnValue('RANDOM-PASSWORD');

    const ref = React.createRef<RegisterDialog>();
    render(
      <RegisterDialog
        ref={ref}
        config={{}}
        moduleApi={moduleApi}
        setOptions={jest.fn()}
        cancel={jest.fn()}
      />,
    );

    const nameInput = screen.getByRole('textbox', { name: 'Name' });

    await userEvent.type(nameInput, 'My Name');

    let resolvePromise: (value: AccountAuthInfo) => void = () => {};
    moduleApi.registerSimpleAccount.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const trySubmitPromise = ref.current?.trySubmit();

    expect(moduleApi.registerSimpleAccount).toBeCalledWith(
      'guest',
      'RANDOM-PASSWORD',
      'My Name',
    );

    expect(nameInput).not.toBeInTheDocument();
    expect(screen.getByText('Creating your account...')).toBeInTheDocument();

    resolvePromise({
      userId: '@guest-XXX:matrix.local',
      deviceId: 'DEVICE_0',
      accessToken: 'syn_...',
      homeserverUrl: 'http://matrix.local',
    });

    expect(await trySubmitPromise).toEqual({
      accountAuthInfo: {
        userId: '@guest-XXX:matrix.local',
        deviceId: 'DEVICE_0',
        accessToken: 'syn_...',
        homeserverUrl: 'http://matrix.local',
      },
    });
  });

  it('should show an error if the guest account registration fails', async () => {
    const ref = React.createRef<RegisterDialog>();
    render(
      <RegisterDialog
        ref={ref}
        config={{}}
        moduleApi={moduleApi}
        setOptions={jest.fn()}
        cancel={jest.fn()}
      />,
    );

    const nameInput = screen.getByRole('textbox', { name: 'Name' });

    await userEvent.type(nameInput, 'My Name');

    moduleApi.registerSimpleAccount.mockImplementation(async () => {
      throw new Error('Unexpected errors');
    });

    expect(await ref.current?.trySubmit()).toEqual({});

    expect(
      screen.getByText('The account creation failed.'),
    ).toBeInTheDocument();
  });

  it('should login with an existing account', async () => {
    const onCancel = jest.fn();

    render(
      <RegisterDialog
        config={{}}
        moduleApi={moduleApi}
        setOptions={jest.fn()}
        cancel={onCancel}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'I already have an account.',
    });
    expect(link).toHaveAttribute('href', '/#/start_sso');

    await userEvent.click(link);

    expect(onCancel).toBeCalledTimes(1);
  });

  it('should login with an existing account without sso', async () => {
    const onCancel = jest.fn();

    render(
      <RegisterDialog
        config={{
          skip_single_sign_on: true,
        }}
        moduleApi={moduleApi}
        setOptions={jest.fn()}
        cancel={onCancel}
      />,
    );

    const link = screen.getByRole('link', {
      name: 'I already have an account.',
    });
    expect(link).toHaveAttribute('href', '/#/login');

    await userEvent.click(link);

    expect(onCancel).toBeCalledTimes(1);
  });

  it('should only enable the submit button if a name is entered', async () => {
    const onSetOptions = jest.fn();

    render(
      <RegisterDialog
        config={{}}
        moduleApi={moduleApi}
        setOptions={onSetOptions}
        cancel={jest.fn()}
      />,
    );

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.type(nameInput, 'Name');

    expect(onSetOptions).toHaveBeenLastCalledWith({ canSubmit: true });

    await userEvent.clear(nameInput);
    expect(onSetOptions).toHaveBeenLastCalledWith({ canSubmit: false });
  });
});
