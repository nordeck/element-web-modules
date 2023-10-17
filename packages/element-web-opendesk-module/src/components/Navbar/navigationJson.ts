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

import Joi from 'joi';

interface CategoryEntry {
  display_name: string;
  icon_url: string;
  identifier: string;
  link: string;
  target: string;
}

interface Category {
  display_name: string;
  entries: Array<CategoryEntry>;
  identifier: string;
}

export interface NavigationJson {
  categories: Array<Category>;
}

const navigationJsonSchema = Joi.object<NavigationJson, true>({
  categories: Joi.array()
    .items(
      Joi.object<Category, true>({
        display_name: Joi.string(),
        entries: Joi.array()
          .items(
            Joi.object<CategoryEntry, true>({
              display_name: Joi.string(),
              icon_url: Joi.string(),
              identifier: Joi.string(),
              link: Joi.string(),
              target: Joi.string(),
            }).unknown(),
          )
          .required(),
        identifier: Joi.string(),
      }).unknown(),
    )
    .required(),
})
  .unknown()
  .required();

export function assertValidNavigationJson(
  json: unknown,
): asserts json is NavigationJson {
  const { error } = navigationJsonSchema.validate(json);

  if (error) {
    throw error;
  }
}
