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
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavbarModuleConfig } from '../config';
import { NavigationJson } from '../navigationJson';
import { language } from '../utils';
import Launcher from './Launcher';
import Logo from './Logo';
import Menu from './Menu';
import SilentLogin from './SilentLogin';

const Root = styled.nav`
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: ${({ theme }) => theme.navbar.borderBottom};
  display: flex;
  height: ${({ theme }) => theme.navbar.height};
  position: relative;
`;

type Props = {
  config: NavbarModuleConfig;
  moduleApi: ModuleApi;
};

const Navbar = ({ config, moduleApi }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigationJson, setNavigationJson] = useState<NavigationJson>();
  const url = new URL(config.ics_silent_url);

  useEffect(() => {
    async function fetchNavigationJson() {
      let url = new URL(config.ics_navigation_json_url);
      url.search = `?language=${language()}`;

      try {
        const response = await fetch(url.toString(), {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setNavigationJson(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (loggedIn) {
      void fetchNavigationJson();
    }
  }, [config.ics_navigation_json_url, loggedIn]);

  const handleExpanded = () => setExpanded(!expanded);
  const handleLoggedIn = (loggedIn: boolean) => setLoggedIn(loggedIn);

  return (
    <Root>
      <Logo
        href={config.portal_url}
        label={moduleApi.translateString('Show portal')}
      />
      {loggedIn ? (
        navigationJson && (
          <>
            <Launcher expanded={expanded} onClick={handleExpanded} />
            {expanded && <Menu navigationJson={navigationJson} />}
          </>
        )
      ) : (
        <SilentLogin onLoggedIn={handleLoggedIn} url={url} />
      )}
    </Root>
  );
};

export default Navbar;
