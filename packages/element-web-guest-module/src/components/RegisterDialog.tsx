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

import {
  DialogContent,
  DialogProps,
  DialogState,
} from '@matrix-org/react-sdk-module-api/lib/components/DialogContent';
import { TextInputField } from '@matrix-org/react-sdk-module-api/lib/components/TextInputField';
import { AccountAuthInfo } from '@matrix-org/react-sdk-module-api/lib/types/AccountAuthInfo';
import { GuestModuleConfig, LEGACY_REGISTRATION_MODE_URI } from '../config';
import { generatePassword } from '../utils';

export interface RegisterDialogProps extends DialogProps {
  config: GuestModuleConfig;
}

interface RegisterDialogState extends DialogState {
  username: string;
}

export type RegisterDialogSubmitResult = {
  accountAuthInfo?: AccountAuthInfo;
};

export class RegisterDialog extends DialogContent<
  RegisterDialogProps,
  RegisterDialogState
> {
  constructor(props: RegisterDialogProps) {
    super(props);

    this.state = { ...this.state, username: '' };
  }

  public async trySubmit(): Promise<RegisterDialogSubmitResult> {
    this.setState({ busy: true, error: undefined });

    try {
      const homeserverUrl = this.props.config.guest_user_homeserver_url;

      // Call the CS-API register endpoint that is provided by an older version of the Synapse module.
      if (homeserverUrl === LEGACY_REGISTRATION_MODE_URI) {
        const username = this.state.username;
        const password = generatePassword();

        const accountAuthInfo =
          await this.props.moduleApi.registerSimpleAccount(
            'guest',
            password,
            username,
          );

        return { accountAuthInfo };
      }

      const url = new URL('/_synapse/client/register_guest', homeserverUrl);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayname: this.state.username }),
      });

      if (response.ok) {
        return { accountAuthInfo: await response.json() };
      }
    } catch {
      // fall through
    }

    this.setState({
      busy: false,
      error: this.t('The account creation failed.'),
    });

    return {};
  }

  public render() {
    if (this.state.busy) {
      return (
        <div>
          <p>{this.t('Creating your account...')}</p>
        </div>
      );
    }

    return (
      <div>
        {this.state.error}
        <TextInputField
          label={this.t('Name')}
          value={this.state.username}
          onChange={(name) => {
            this.setState({ username: name });
            this.props.setOptions({ canSubmit: name.length > 0 });
          }}
        />
        <a
          href={
            this.props.config.skip_single_sign_on ? '/#/login' : '/#/start_sso'
          }
          onClick={this.props.cancel}
        >
          {this.t('I already have an account.')}
        </a>
      </div>
    );
  }
}
