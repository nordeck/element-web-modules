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
import { NavigationJson } from '../navigationJson';

type Props = {
  navigationJson: NavigationJson;
};

const Root = styled.ul`
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.cloud};
  border-top: 4px solid ${({ theme }) => theme.colors.electricViolet};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  left: 24px;
  list-style: none;
  margin: 0;
  padding: 4px 0 20px;
  position: absolute;
  top: ${({ theme }) => theme.navbar.height};
  width: 272px;
  z-index: 8008;
`;

const Heading = styled.span`
  color: ${(props) => props.theme.colors.black};
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 20px 24px 8px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const Link = styled.a`
  && {
    &:hover {
      background-color: ${({ theme }) => theme.colors.electricViolet15};
    }

    align-items: center;
    color: ${(props) => props.theme.colors.black};
    display: flex;
    padding: 4px 24px;
  }
`;

const Icon = styled.img`
  height: 20px;
  margin-right: 8px;
  width: 20px;
`;

const Menu = ({ navigationJson }: Props) => (
  <Root>
    {navigationJson.categories.map((category) => (
      <li key={category.identifier}>
        <Heading>{category.display_name}</Heading>
        <List>
          {category.entries.map((entry) => (
            <li key={entry.identifier}>
              <Link href={entry.link} target={entry.target}>
                <Icon
                  alt={entry.display_name}
                  role="presentation"
                  src={entry.icon_url}
                />
                <span>{entry.display_name}</span>
              </Link>
            </li>
          ))}
        </List>
      </li>
    ))}
  </Root>
);

export default Menu;
