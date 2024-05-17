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

import styled from 'styled-components';

type Props = {
  ariaExpanded: boolean;
  ariaLabel: string;
  onClick: () => void;
};

const Root = styled.button`
  align-items: center;
  background-color: ${({ 'aria-expanded': ariaExpanded, theme }) =>
    ariaExpanded ? theme.compound.color.textActionAccent : 'transparent'};
  border: none;
  color: ${({ 'aria-expanded': ariaExpanded, theme }) =>
    ariaExpanded
      ? theme.compound.color.iconOnSolidPrimary
      : theme.compound.color.textPrimary};
  cursor: pointer;
  display: flex;
  padding: 0 22px;
`;

export function Launcher({ ariaExpanded, ariaLabel, onClick }: Props) {
  return (
    <Root
      aria-expanded={ariaExpanded}
      aria-haspopup={true}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <svg fill="currentColor" height="16" width="16">
        <path d="M0 4h4V0H0v4Zm6 12h4v-4H6v4Zm-6 0h4v-4H0v4Zm0-6h4V6H0v4Zm6 0h4V6H6v4Zm6-10v4h4V0h-4ZM6 4h4V0H6v4Zm6 6h4V6h-4v4Zm0 6h4v-4h-4v4Z" />
      </svg>
    </Root>
  );
}
