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
import { RuntimeModule } from '@matrix-org/react-sdk-module-api/lib/RuntimeModule';
import {
  JoinFromPreviewListener,
  RoomPreviewListener,
  RoomViewLifecycle,
} from '@matrix-org/react-sdk-module-api/lib/lifecycles/RoomViewLifecycle';
import {
  RegisterDialog,
  RegisterDialogProps,
  RegisterDialogSubmitResult,
} from './components/RegisterDialog';
import {
  GUEST_MODULE_CONFIG_KEY,
  GUEST_MODULE_CONFIG_NAMESPACE,
  GuestModuleConfig,
  assertValidGuestModuleConfig,
} from './config';

export class GuestModule extends RuntimeModule {
  private config: GuestModuleConfig;

  public constructor(moduleApi: ModuleApi) {
    super(moduleApi);

    this.moduleApi.registerTranslations({
      'Request room access': {
        en: 'Request room access',
        de: 'Raumbeitritt anfragen',
      },
      'Creating your account...': {
        en: 'Creating your account...',
        de: 'Erstelle dein Konto...',
      },
      'Continue as guest': {
        en: 'Continue as guest',
        de: 'Als Gast fortfahren',
      },
      Name: {
        en: 'Name',
        de: 'Name',
      },
      'I already have an account.': {
        en: 'I already have an account.',
        de: 'Ich habe bereits einen Account.',
      },
      'The account creation failed.': {
        en: 'The account creation failed.',
        de: 'Die Anmeldung als Gastnutzer ist fehlgeschlagen.',
      },
    });

    const rawConfig = this.moduleApi.getConfigValue(
      GUEST_MODULE_CONFIG_NAMESPACE,
      GUEST_MODULE_CONFIG_KEY,
    );

    assertValidGuestModuleConfig(rawConfig);
    this.config = rawConfig;

    this.on(RoomViewLifecycle.PreviewRoomNotLoggedIn, this.onRoomPreviewBar);
    this.on(RoomViewLifecycle.JoinFromRoomPreview, this.onTryJoin);
  }

  protected onRoomPreviewBar: RoomPreviewListener = (opts) => {
    opts.canJoin = true;
  };

  protected onTryJoin: JoinFromPreviewListener = async (roomId) => {
    const { didOkOrSubmit, model } = await this.moduleApi.openDialog<
      RegisterDialogSubmitResult,
      RegisterDialogProps,
      RegisterDialog
    >(
      {
        title: this.t('Request room access'),
        actionLabel: this.t('Continue as guest'),
        canSubmit: false,
      },
      (props, ref) => <RegisterDialog ref={ref} {...props} />,
      { config: this.config },
    );

    if (didOkOrSubmit && model.accountAuthInfo) {
      await this.moduleApi.overwriteAccountAuth(model.accountAuthInfo);
      await this.moduleApi.navigatePermalink(
        `https://matrix.to/#/${roomId}`,
        true,
      );
    }
  };
}
