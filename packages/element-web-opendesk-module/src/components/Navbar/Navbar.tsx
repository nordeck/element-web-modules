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
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import FocusLock from 'react-focus-lock';
import styled from 'styled-components';
import { OpenDeskModuleConfig } from '../../config';
import { language } from '../../utils';
import { Launcher } from './Launcher';
import { Logo } from './Logo';
import { Menu } from './Menu';
import { SilentLogin } from './SilentLogin';
import { NavigationJson, assertValidNavigationJson } from './navigationJson';

const Root = styled.nav`
  background-color: ${({ theme }) => theme.compound.color.bgCanvasDefault};
  border-bottom: ${({ theme }) => theme.navbar.border};
  display: flex;
  height: ${({ theme }) => theme.navbar.height};
`;

type Props = {
  config: OpenDeskModuleConfig;
  moduleApi: ModuleApi;
};

export function Navbar({ config, moduleApi }: Props) {
  const [ariaExpanded, setAriaExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [navigationJson, setNavigationJson] = useState<NavigationJson>();

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
          assertValidNavigationJson(data);
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

  const handleAriaExpanded = () => {
    setAriaExpanded(!ariaExpanded);
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    handleAriaExpanded();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Escape') {
      handleAriaExpanded();
    }
  };

  const handleLoggedIn = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };

  return (
    <Root>
      <Logo
        alt={moduleApi.translateString('Logo')}
        ariaLabel={moduleApi.translateString('Show portal')}
        href={config.portal_url}
        src={config.portal_logo_svg_url}
      />
      {loggedIn ? (
        navigationJson && (
          <>
            <Launcher
              ariaExpanded={ariaExpanded}
              ariaLabel={moduleApi.translateString('Show menu')}
              onClick={handleAriaExpanded}
            />
            {ariaExpanded && (
              <FocusLock>
                <Menu
                  navigationJson={navigationJson}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                />
              </FocusLock>
            )}
          </>
        )
      ) : (
        <SilentLogin onLoggedIn={handleLoggedIn} url={config.ics_silent_url} />
      )}
    </Root>
  );
}
