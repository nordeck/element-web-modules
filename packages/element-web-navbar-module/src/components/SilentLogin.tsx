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

import { useEffect } from 'react';
import styled from 'styled-components';

type Props = {
  onLoggedIn: (loggedIn: boolean) => void;
  url: URL;
};

const Root = styled.iframe`
  display: none;
`;

const SilentLogin = ({ onLoggedIn, url }: Props) => {
  useEffect(() => {
    function listener(event: MessageEvent) {
      if (
        event.origin === url.origin &&
        typeof event.data === 'object' &&
        event.data['loggedIn'] === true
      ) {
        onLoggedIn(true);
      }
    }

    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  }, [onLoggedIn, url.origin]);

  return <Root src={url.toString()} title="Silent Login" />;
};

export default SilentLogin;
