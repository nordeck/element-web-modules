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

import { KeyboardEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { NavigationJson } from './navigationJson';

type Props = {
  navigationJson: NavigationJson;
  onClick: MouseEventHandler;
  onKeyDown: KeyboardEventHandler;
};

const Root = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 8008;
`;

const List = styled.ul`
  background-color: ${({ theme }) => theme.compound.color.bgCanvasDefault};
  border-top: 4px solid ${({ theme }) => theme.compound.color.textActionAccent};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.navbar.boxShadow};
  left: 24px;
  list-style: none;
  margin: 0;
  padding: 4px 0 20px;
  position: absolute;
  top: ${({ theme }) => theme.navbar.height};
  width: 272px;
`;

const Heading = styled.span`
  display: block;
  font: ${({ theme }) => theme.compound.font.bodyMdSemibold};
  margin: 20px 24px 8px;
`;

const Sublist = styled.ul`
  list-style: none;
  padding: 0;
`;

const Link = styled.a`
  && {
    &:hover {
      background-color: ${({ theme }) => theme.navbar.hoverBackgroundColor};
    }

    align-items: center;
    color: ${({ theme }) => theme.compound.color.textPrimary};
    display: flex;
    padding: 4px 24px;
  }
`;

const Icon = styled.img`
  height: 20px;
  margin-right: 8px;
  width: 20px;
`;

const PlaceholderIcon = styled.div`
  height: 20px;
  margin-right: 8px;
  width: 20px;
`;

export function Menu({ navigationJson, onClick, onKeyDown }: Props) {
  return (
    <Root data-testid="menu-backdrop" onClick={onClick}>
      <List data-testid="menu-list" onKeyDown={onKeyDown}>
        {navigationJson.categories.map((category) => (
          <li key={category.identifier}>
            <Heading>{category.display_name}</Heading>
            <Sublist>
              {category.entries.map((entry) => (
                <li key={entry.identifier}>
                  <Link href={entry.link} target={entry.target}>
                    {entry.icon_url ? (
                      <Icon
                        alt={entry.display_name}
                        role="presentation"
                        src={entry.icon_url}
                      />
                    ) : (
                      <PlaceholderIcon />
                    )}
                    <span>{entry.display_name}</span>
                  </Link>
                </li>
              ))}
            </Sublist>
          </li>
        ))}
      </List>
    </Root>
  );
}
