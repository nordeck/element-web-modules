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

const packages = fs.readdirSync('packages');

for (let p of packages) {
  const packagePath = path.resolve('packages', p);

  if (!fs.lstatSync(packagePath).isDirectory()) {
    continue;
  }

  const {
    name,
    version,
    private: isPrivate,
  } = JSON.parse(fs.readFileSync(path.resolve(packagePath, 'package.json')));

  if (isPrivate) {
    console.log(`🆗 Package ${name} is private`);
    continue;
  }

  if (!versionNeedsUpload(name, version)) {
    console.log(`✅ Package ${name} already up-to-date`);
    continue;
  }

  console.log(`🔄 Publish package ${name}@${version}`);

  child_process.execSync('npm publish --registry https://npm.pkg.github.com', {
    cwd: packagePath,
  });

  console.log(`✅ Package ${name} published`);
}

// Create the git tags so the changesets CLI will create the proper GitHub releases
console.log(child_process.execSync('yarn changeset tag').toString());

console.log('Done!');

function versionNeedsUpload(name, version) {
  try {
    const result = child_process.execSync(
      `npm view "${name}@${version}" --registry https://npm.pkg.github.com --json`,
    );

    // this line throws if not exists
    JSON.parse(result.toString());

    return false;
  } catch (_) {
    return true;
  }
}
