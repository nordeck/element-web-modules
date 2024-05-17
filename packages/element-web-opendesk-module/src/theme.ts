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

import { DefaultTheme } from 'styled-components';

const bgCanvasDefault = 'var(--cpd-color-bg-canvas-default)';
const textActionAccent = 'var(--cpd-color-text-action-accent)';
const textPrimary = 'var(--cpd-color-text-primary)';
const iconOnSolidPrimary = 'var(--cpd-color-icon-on-solid-primary)';

const bodyMdSemibold = 'var(--cpd-font-body-md-semibold)';

const theme: DefaultTheme = {
  compound: {
    color: {
      bgCanvasDefault,
      textActionAccent,
      textPrimary,
      iconOnSolidPrimary,
    },
    font: {
      bodyMdSemibold,
    },
  },
  navbar: {
    border: '1px solid rgba(27, 29, 34, 0.1)',
    boxShadow: '4px 4px 12px 0 rgba(118, 131, 156, 0.6)',
    height: '63px',
    hoverBackgroundColor: '#f5f8fa',
    offsetHeight: '64px',
  },
};

export { theme };
