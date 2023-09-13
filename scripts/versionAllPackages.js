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

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// Run the original versioning command
console.log(child_process.execSync('yarn changeset version').toString());

// Updates the new version in the synapse-guest-module/setup.cfg
const packagePath = path.resolve('./', 'synapse-guest-module');

const { version } = JSON.parse(
  fs.readFileSync(path.resolve(packagePath, 'package.json')),
);

const setupPyContent = fs
  .readFileSync(path.resolve(packagePath, 'setup.cfg'))
  .toString();
const newContent = setupPyContent.replace(
  /version = \d\.\d\.\d/g,
  `version = ${version}`,
);
fs.writeFileSync(path.resolve(packagePath, 'setup.cfg'), newContent);
