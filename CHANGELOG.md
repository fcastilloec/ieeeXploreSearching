# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.0.5](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.4...v4.0.5) (2022-06-27)


### Dependencies

* bump `axios` to `0.27.2`
* bump `fs-extra` to `10.1.0`
* bump `puppeteer-core` to `15.1.1`
* bump `yargs` to `17.5.1`

### [4.0.4](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.3...v4.0.4) (2022-04-06)


### Bug Fixes

* use new SciHub url ([d1d87c2](https://github.com/fcastilloec/ieeeXploreSearching/commit/d1d87c21108333dec907082110f0847aa6d94c3a))


### Dependencies

* bump `axios` to `0.26.1`
* bump `fs-extra` to `10.0.1`
* bump `puppeteer-core` to `13.5.2`
* bump `yargs` to `17.4.0`

### [4.0.3](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.2...v4.0.3) (2022-03-07)


### Dependencies

* bump `axios` to `0.26.0`
* bump `puppeteer-core` to `13.5.0`

### [4.0.2](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.1...v4.0.2) (2022-01-04)


### Bug Fixes

* use working sci-hub URL ([94d7a0c](https://github.com/fcastilloec/ieeeXploreSearching/commit/94d7a0ca379ef8de846c0908a1bad27bd3d82770))
* **excel:** change sci-hub url ([425e0c4](https://github.com/fcastilloec/ieeeXploreSearching/commit/425e0c48b461fecc9f2ddb529574ec48f67e957a))
* **scrap:** check for redirections ([93d6ed0](https://github.com/fcastilloec/ieeeXploreSearching/commit/93d6ed0f49ef0affc592164a316e6f144d1e507f))


### Dependencies

* bump `axios` to `0.24.0`
* bump `puppeteer-core` to `13.0.1`
* bump `yargs` to `17.3.1`

### [4.0.1](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.0...v4.0.1) (2021-06-18)


### Bug Fixes

* use absolute path for constants.js ([f1fd981](https://github.com/fcastilloec/ieeeXploreSearching/commit/f1fd981d37dceee90f366b246005283779fa2bf1))

## [4.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.2...v4.0.0) (2021-06-08)


### ⚠ BREAKING CHANGES

* **cli:** The API key is no longer set using environment variables.
The script will ask and save the key for all future uses.

### Features

* **cli:** ask for API key on the first run ([#148](https://github.com/fcastilloec/ieeeXploreSearching/issues/148)) ([7346d9b](https://github.com/fcastilloec/ieeeXploreSearching/commit/7346d9bdfe2fcd104a1f0a8ef6f8a8384a4c17ea))


### Bug Fixes

* make sure publication year is an integer ([16be7fd](https://github.com/fcastilloec/ieeeXploreSearching/commit/16be7fd359ec4d82bf4ee7267315db0eecdcd9c2))
* selector for pdf_url ([006f4e4](https://github.com/fcastilloec/ieeeXploreSearching/commit/006f4e4577e18e62b71b4a0fc6c72c3ce6880026))

### [3.0.2](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.1...v3.0.2) (2021-05-22)


### Bug Fixes

* warn the user when escaping double quotes on windows ([#138](https://github.com/fcastilloec/ieeeXploreSearching/issues/138)) ([6064585](https://github.com/fcastilloec/ieeeXploreSearching/commit/6064585b4dbde658a81eeeb2d4ca47ad774b0d3b))

### [3.0.1](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.0...v3.0.1) (2021-05-18)


### Bug Fixes

* **cli:** better help description ([#134](https://github.com/fcastilloec/ieeeXploreSearching/issues/134)) ([fba4c1e](https://github.com/fcastilloec/ieeeXploreSearching/commit/fba4c1e5e4deab80a69c85fcb5ede676d808560f))

## [3.0.0](https://github.com/fcastilloec/ieeexplore2csv/compare/v2.0.0...v3.0.0) (2021-03-11)


### ⚠ BREAKING CHANGES

* **search-scrap:** A local Chrome installation is required for scrapping

Please make sure that a valid installation of Chrome exists

### Features

* **excel:** add environment variable to set a font type ([#120](https://github.com/fcastilloec/ieeexplore2csv/issues/120)) ([00b33ec](https://github.com/fcastilloec/ieeexplore2csv/commit/00b33ec30e8814aff88d0481bbe528496012396c))
* **search-scrap:** use local Chrome installation ([#108](https://github.com/fcastilloec/ieeexplore2csv/issues/108)) ([0011168](https://github.com/fcastilloec/ieeexplore2csv/commit/00111687fd26138a2b021ad3d4ad9cf13a84ec1f))


### Bug Fixes

* **search-scrap:** update to new IEEE website design ([#119](https://github.com/fcastilloec/ieeexplore2csv/issues/119)) ([3e68e37](https://github.com/fcastilloec/ieeexplore2csv/commit/3e68e37317f97950b82b9e848521ac4ad0af2089))
* handle all errors ([#107](https://github.com/fcastilloec/ieeexplore2csv/issues/107)) ([242e5c6](https://github.com/fcastilloec/ieeexplore2csv/commit/242e5c6266610f252375744587958cc63571e8e4))

## [2.0.0](https://github.com/fcastilloec/ieeexplore2csv/compare/v1.0.0...v2.0.0) (2021-01-18)


### ⚠ BREAKING CHANGES

* The provided output filename is taken as the name itself. Any use of periods will
  be treated as part of the name, disregarding any provided extension.
* **cli:** The logic CLI no longer accepts files as part of their options. They are pass
  as part of the arguments.

  See ./src/cli-logic.js --help for more details
* When passing a single year argument, searching will no longer be done from
  YEAR to date. Instead search will be perform from YEAR to YEAR (only on the passed year)

### Features

* **excel:** ability to change sci-hub based domain on excel sheet ([#64](https://github.com/fcastilloec/ieeexplore2csv/issues/64)) ([761fc8a](https://github.com/fcastilloec/ieeexplore2csv/commit/761fc8a1443567601d856575ba1840279901ced8))
* add multiple level of verbose ([c44f864](https://github.com/fcastilloec/ieeexplore2csv/commit/c44f864c94f41df11fdc42115e98ed60dab7b5a6))
* better handling of year option ([e914d6a](https://github.com/fcastilloec/ieeexplore2csv/commit/e914d6a9708d063b642403fd5e6473bbf9f483bb))
* **cli:** logic operators are boolean instead of array ([d154561](https://github.com/fcastilloec/ieeexplore2csv/commit/d154561d22cb56300d756d851e873a1ae6e8be29))
* ignore extension if it's an integer ([#46](https://github.com/fcastilloec/ieeexplore2csv/issues/46)) ([7872d7b](https://github.com/fcastilloec/ieeexplore2csv/commit/7872d7b77a0337dac612423ee40664a8332caa7c))
* remove use of changeFileExtension on output ([42a9221](https://github.com/fcastilloec/ieeexplore2csv/commit/42a92219877713e9f471ee2b6f436b4ef2dfac7e))


### Bug Fixes
* **search-scrap:** add missing 'Book' content_type ([#47](https://github.com/fcastilloec/ieeexplore2csv/issues/47)) ([8080222](https://github.com/fcastilloec/ieeexplore2csv/commit/80802221066f3be54d7c2bab11c8121c01bb0555))
* change filename extension ([0cc8a8b](https://github.com/fcastilloec/ieeexplore2csv/commit/0cc8a8bf60b3580f1f5b053e280167fb2cd61500))
* convert to string any 'querytext' ([#66](https://github.com/fcastilloec/ieeexplore2csv/issues/66)) ([97834d0](https://github.com/fcastilloec/ieeexplore2csv/commit/97834d092049ec0983888966674e2a2e85a2f716))
* correctly add a data field to multi-word phrases ([#68](https://github.com/fcastilloec/ieeexplore2csv/issues/68)) ([03b11c2](https://github.com/fcastilloec/ieeexplore2csv/commit/03b11c25e531d08c4d1db768c535962c020ed122))
* don't add extension to output if it's already the correct one ([#65](https://github.com/fcastilloec/ieeexplore2csv/issues/65)) ([9c6e362](https://github.com/fcastilloec/ieeexplore2csv/commit/9c6e3626d1137d32298d6440b91a6688aa2227c3))
* **search-scrap:** update selector according to IEEE changes ([#103](https://github.com/fcastilloec/ieeexplore2csv/issues/103)) ([baaae44](https://github.com/fcastilloec/ieeexplore2csv/commit/baaae44ce1965e123ef202895e438082ee5b0d87))
* **cli:** remove positional argument in logic command ([fd822b1](https://github.com/fcastilloec/ieeexplore2csv/commit/fd822b168a279856c08a418cecde71f257e6727c))
* **cli:** yargs strict no longer works as expected ([b274519](https://github.com/fcastilloec/ieeexplore2csv/commit/b27451991f7aefad87d2f3fa5fa98b57c3595e43))
* **excel:** set style for content_type cells ([#54](https://github.com/fcastilloec/ieeexplore2csv/issues/54)) ([6bb6339](https://github.com/fcastilloec/ieeexplore2csv/commit/6bb6339d0013a3b6e746bc4cec84477b43482d3a))
* **logic:** better error checking when files don't exist ([#53](https://github.com/fcastilloec/ieeexplore2csv/issues/53)) ([70969dd](https://github.com/fcastilloec/ieeexplore2csv/commit/70969dd608c0c04bd4b1d886dab06bf880fb28c3))
* **search-scrap:** check if there's no results before anything else ([#48](https://github.com/fcastilloec/ieeexplore2csv/issues/48)) ([c95302d](https://github.com/fcastilloec/ieeexplore2csv/commit/c95302deadcba273d1694220b8e1f6beaf607d57))
* **search-scrap:** correctly calculate the number of pages ([#45](https://github.com/fcastilloec/ieeexplore2csv/issues/45)) ([075b76c](https://github.com/fcastilloec/ieeexplore2csv/commit/075b76c74fde3d59c260a3290e81b05b6e5f6642))

## 1.0.0 (2020-08-19)


### ⚠ BREAKING CHANGES

* **logic:** Search results from both API and Scrap can now be mixed when performing logic
  operations.
* **search:** Scrap results will no longer have their own data fields. Previous work that
  introduced a standard for saving data is now the default.
* stopping developing the chrome extension for the moment and moving the project to
  use puppeteer and scrapping results
* data will no longer be exported as an object of objects
* data will no longer be exported as CSV, only JSON

### Features

* count multiple JSON files at once ([705f51b](https://github.com/fcastilloec/ieeexplore2csv/commit/705f51bf187491fdfd0afd3e36db456d6fd0332a))
* standardize how results are saved for both API and Scrap searching ([7017e3a](https://github.com/fcastilloec/ieeexplore2csv/commit/7017e3a5e28a7a3a82949e1857aa0221059fb4d8))
* **search:** use new standardize results when searching ([eb1a26d](https://github.com/fcastilloec/ieeexplore2csv/commit/eb1a26d399632a15e986d6a75905715b606d8cbf))
* **cli:** use verbose option to display encoded query ([e4bcfdd](https://github.com/fcastilloec/ieeexplore2csv/commit/e4bcfdd868bb287dacb2d51cacf6fc58e75ddf73))
* **cli:** add both API and Scrap searching ([83bcb36](https://github.com/fcastilloec/ieeexplore2csv/commit/83bcb3695aa1ca2d8154bdcd5324ac355b44bfa5))
* **cli:** add command to transform json files to xls ([a1de6cb](https://github.com/fcastilloec/ieeexplore2csv/commit/a1de6cb27084e2aefeb2dd2b1ba7588ec6f44dc6))
* **cli:** add counting command for JSON files ([bb209ce](https://github.com/fcastilloec/ieeexplore2csv/commit/bb209cec6c138fd71f8844963a8cf90710c54cf9))
* **cli:** add verbose option for searching ([e002b49](https://github.com/fcastilloec/ieeexplore2csv/commit/e002b496279e58c6742bffaa5af46f81c4cc2005))
* **excel:** add styling and convert json-files to xls ([54c64c4](https://github.com/fcastilloec/ieeexplore2csv/commit/
* **logic:** use standardize json for logic operators ([7bb744e](https://github.com/fcastilloec/ieeexplore2csv/commit/7bb744e3d1649782e85f03547cda8325512f6770))
* add background script ([b561317](https://github.com/fcastilloec/ieeexplore2csv/commit/b56131784a079481d43a9c9f7447495b0bf07f4c))
* add chrome extension icons ([b615423](https://github.com/fcastilloec/ieeexplore2csv/commit/b6154230c09b2c0239723906d188a2e57eb842fe))
* add cli commands for searching ([3fd4ad1](https://github.com/fcastilloec/ieeexplore2csv/commit/3fd4ad1eb64a4f5ce7167c1778bc495a3cc4bd4c))
* add content script to retrieve the list of results ([3be223b](https://github.com/fcastilloec/ieeexplore2csv/commit/3be223b39c2c5f62907c3d3d55ef16262b04df1c))
* add headless scrapping and saving to excel ([409de8d](https://github.com/fcastilloec/ieeexplore2csv/commit/409de8db7ad02796a42b63505eefc1e900f2485f))
* **search:** add IEEE API searching ([5103555](https://github.com/fcastilloec/ieeexplore2csv/commit/51035552ef3379a1d7d430f5b2a86b34546f0087))
* add support to export to excel from API results ([4ce3572](https://github.com/fcastilloec/ieeexplore2csv/commit/4ce3572fb2ffad10ca3a6885324ff0f7680d2259))
* create initial chrome manifest ([5ec99cd](https://github.com/fcastilloec/ieeexplore2csv/commit/5ec99cd911be9750eda4e6edbadce1f2c428d8bf))
* export data as an array of objects ([b9b1451](https://github.com/fcastilloec/ieeexplore2csv/commit/b9b14513930f1a87a05b11c27d85b66fba5be254))
* export data as JSON ([ca52866](https://github.com/fcastilloec/ieeexplore2csv/commit/ca52866d13403a4ef90a3003bbfd13ee9174c4f3))
* save CSV data to file when clicked ([5aa128b](https://github.com/fcastilloec/ieeexplore2csv/commit/5aa128b5131c66dc783d309196f493a8eb29e347))
* sets the sci-hub url as clickable on excel ([9f6f67d](https://github.com/fcastilloec/ieeexplore2csv/commit/9f6f67de561cf527171e02f95bff65b8a8118fda))

### Bug Fixes

* better handling of errors and readability ([79379ef](https://github.com/fcastilloec/ieeexplore2csv/commit/79379effa7f1a4ffc18f9634837bec3d24dd2802))
* only save to disk if logic operation return any results ([cb7fa9f](https://github.com/fcastilloec/ieeexplore2csv/commit/cb7fa9fcc78e5613d4e8763ae79af9d1d81aaaa4))
* **cli:** better naming for cli scripts ([ff9df73](https://github.com/fcastilloec/ieeexplore2csv/commit/ff9df73cf7281eee56d126103930071e6dad9c38))
* **search-scrap:** add defaults for articleNumber and journal ([48cba91](https://github.com/fcastilloec/ieeexplore2csv/commit/48cba91ded7b2127b3328d074d89635158bc5b12))
* **excel:** add filtering to the header row ([1581051](https://github.com/fcastilloec/ieeexplore2csv/commit/1581051ece23ea564ced709c0aa989fccf926506))
* **excel:** fixes styling and adds some properties ([a94dab5](https://github.com/fcastilloec/ieeexplore2csv/commit/a94dab5f9e511f88b94da2e1dac1fbbe6b0b10b1))
* **search-scrap:** get actual article_number from pdf_url ([f7fe4eb](https://github.com/fcastilloec/ieeexplore2csv/commit/f7fe4eb47389b465994f59524b6ee00fff1ebf3f))
* **search-api:** uses the correct data field ([237aa19](https://github.com/fcastilloec/ieeexplore2csv/commit/237aa19df401976874965ac104f0d358c7d1d5c9))
* **excel:** better error and filename handling ([0ffe151](https://github.com/fcastilloec/ieeexplore2csv/commit/0ffe15122e2996c1c753dfdd527b13bf8965d605))
* **search-scrap:** better handling of nested parenthesis on queries ([c65cb59](https://github.com/fcastilloec/ieeexplore2csv/commit/c65cb5984240dd851e6c240fbde3a5b70bf425ef))
* **cli:** checks for options ([f14af2a](https://github.com/fcastilloec/ieeexplore2csv/commit/f14af2ad2bf328ec7f52231497856034d82a8363))
* only save if there are any results ([4bb13a1](https://github.com/fcastilloec/ieeexplore2csv/commit/4bb13a188056e8cfffeb5d53c4218cf351612c01))
* output the whole document IEEE url ([ad016d7](https://github.com/fcastilloec/ieeexplore2csv/commit/ad016d7223b42b422ce357fa14449e8d9b3ded06))
* result properties have a default when they don't exist ([e96dba9](https://github.com/fcastilloec/ieeexplore2csv/commit/e96dba96961d4d82473b62c279c7c2149a6295de))
* saving data from either API or scrapping when using data fields ([e431d6c](https://github.com/fcastilloec/ieeexplore2csv/commit/e431d6c4589e90bfdd4629ae1e508dcdd6313a67))
* use the current year and not whole date ([3f1e710](https://github.com/fcastilloec/ieeexplore2csv/commit/3f1e7109fcdbde6f180097d4015f402a9771a509))
* **search:** exit if unknown errors are thrown when searching ([d333929](https://github.com/fcastilloec/ieeexplore2csv/commit/d333929601df6a126e40ae8ae5c9194141e1bca8))
