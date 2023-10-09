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
  alt: string;
  ariaLabel: string;
  href: string;
  src: string;
};

const Root = styled.a`
  display: flex;
  padding: 0 24px;
`;

const Image = styled.img`
  width: 82px;
`;

export function Logo({ alt, ariaLabel, href, src }: Props) {
  return (
    <Root aria-label={ariaLabel} href={href}>
      <Image alt={alt} src={src} />
    </Root>
  );
}
