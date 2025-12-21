# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [9.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v8.0.0...v9.0.0) (2025-07-17)


### ⚠ BREAKING CHANGES

* don't use data field arguments if you want to use the environmental variable FULL

### Dependencies

* bump `dotenv` to `17.2.0`
* bump `puppeteer-core` to `24.12.1`

### Features

* add Abstract as a data field option ([#948](https://github.com/fcastilloec/ieeeXploreSearching/issues/948)) ([e655c1a](https://github.com/fcastilloec/ieeeXploreSearching/commit/e655c1a3c7ef89b39ee00a0e0f2720fa64c551ce))
* add option to show only scrap link ([#935](https://github.com/fcastilloec/ieeeXploreSearching/issues/935)) ([58a155f](https://github.com/fcastilloec/ieeeXploreSearching/commit/58a155f8c1895fb9681c80eda00ed070cb1b30d5))
* prioritize data-field arguments over environmental variables ([#947](https://github.com/fcastilloec/ieeeXploreSearching/issues/947)) ([4a1ce9d](https://github.com/fcastilloec/ieeeXploreSearching/commit/4a1ce9dfaa9ff769c320311430923c10f2e41ffe))


### Bug Fixes

* typo for allContentTypes ([#934](https://github.com/fcastilloec/ieeeXploreSearching/issues/934)) ([e07c07b](https://github.com/fcastilloec/ieeeXploreSearching/commit/e07c07bb25eb0559bbf7a35d54cf13d3a9cee1bb))

## [8.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v7.0.0...v8.0.0) (2025-06-16)


### ⚠ BREAKING CHANGES

* When both argument and environmental variables are present, prioritize the argument
* disable building artifacts (#916)
* move project to esm

### ci

* disable building artifacts ([#916](https://github.com/fcastilloec/ieeeXploreSearching/issues/916)) ([a180a43](https://github.com/fcastilloec/ieeeXploreSearching/commit/a180a43c1565b80a61dec0dd237d5edae675d711))


### Dependencies

* bump `axios` to `1.10.0`
* bump `dotenv` to `16.5.0`
* bump `puppeteer-core` to `24.10.1`
* bump `yargs` to `18.0.0`

### Features

* move project to esm ([61cc508](https://github.com/fcastilloec/ieeeXploreSearching/commit/61cc5084b1402e82553fc30671862bce3763cf3c))
* prioritize years argument over environmental variable ([#923](https://github.com/fcastilloec/ieeeXploreSearching/issues/923)) ([8d51870](https://github.com/fcastilloec/ieeeXploreSearching/commit/8d51870dfad75bb1867ea945b82eb3061774c3ff))

## [7.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v6.0.0...v7.0.0) (2025-06-16)


### ⚠ BREAKING CHANGES

* The default only searches for Journals, Magazines, and Conferences.
Use the --all-content-types option to search for all types.

### Dependencies

* bump `axios` to `1.8.3`
* bump `puppeteer-core` to `24.4.0`

### Features

* add Document Title field ([#860](https://github.com/fcastilloec/ieeeXploreSearching/issues/860)) ([ef39664](https://github.com/fcastilloec/ieeeXploreSearching/commit/ef3966475d1f603bfc1efc5417b27ba7a398ff8a))
* add option to search all content types or just a subset ([#866](https://github.com/fcastilloec/ieeeXploreSearching/issues/866)) ([79e3208](https://github.com/fcastilloec/ieeeXploreSearching/commit/79e3208cb69d00a8db32a074d91fb5b4ca239865))
* adhere to search query rules for IEEE ([#854](https://github.com/fcastilloec/ieeeXploreSearching/issues/854)) ([c10f6f7](https://github.com/fcastilloec/ieeeXploreSearching/commit/c10f6f75e66f0a5252d6c8f639d3cf2cb365980d))
* assign different output name based on type of OUT env variable ([#845](https://github.com/fcastilloec/ieeeXploreSearching/issues/845)) ([cac3754](https://github.com/fcastilloec/ieeeXploreSearching/commit/cac3754f1952b99cdc84979349931c9cbacedc69))
* don't add data fields if query already contains them ([#861](https://github.com/fcastilloec/ieeeXploreSearching/issues/861)) ([36caa9e](https://github.com/fcastilloec/ieeeXploreSearching/commit/36caa9ee370f167e9fd42e07cc48636f2bf79cbc))


### Bug Fixes

* queryText containing only numbers ([#865](https://github.com/fcastilloec/ieeeXploreSearching/issues/865)) ([3bc897d](https://github.com/fcastilloec/ieeeXploreSearching/commit/3bc897d6fecfbbd4725b1a73a1db7be7a7aa85c5))
* run eslint and prettier ([#862](https://github.com/fcastilloec/ieeeXploreSearching/issues/862)) ([fd2e5ae](https://github.com/fcastilloec/ieeeXploreSearching/commit/fd2e5aef1961c222f02ae7ea6ebfcc8036e5e6bf))
* **scrap:** selectors for Abstract and its URL have changed ([#853](https://github.com/fcastilloec/ieeeXploreSearching/issues/853)) ([dc8e9c8](https://github.com/fcastilloec/ieeeXploreSearching/commit/dc8e9c84f4b0930fc3aed5f69427582955afc86b))

## [6.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v5.0.0...v6.0.0) (2025-06-06)


### ⚠ BREAKING CHANGES

* YEAR_START and YEAR_END have been replaces by YEARS.
Use YEARS separated by a colon (:), or a single year.

### Features

* use dotenv to load environmental variables from file ([#836](https://github.com/fcastilloec/ieeeXploreSearching/issues/836)) ([5f451a2](https://github.com/fcastilloec/ieeeXploreSearching/commit/5f451a2f93ff1e7f0aaec7e7091e8c9215f6759e))


### Bug Fixes

* **utils:** better year testing for both arguments and environmental variables ([#835](https://github.com/fcastilloec/ieeeXploreSearching/issues/835)) ([4dd83b1](https://github.com/fcastilloec/ieeeXploreSearching/commit/4dd83b1f0b7421155648dfccf96fe3dc43f73923))

## [5.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.6...v5.0.0) (2025-06-06)


### ⚠ BREAKING CHANGES

* New defaults for searching. Use environmental variables for some options.

API is the default now, use new '-s', '--scrap' to use website scrapping.
'YEAR_START', 'YEAR_END': environmental variables use for setting the range of years.
You can provide only one of them (either), just like the argument option, to search only that year.
'OUT': environmental variable use to name the default output file as: 'search${OUT}'
'FULL': environmental variable use to assign/override the IEEE data fields to 'fullTextAndMetadata'
Its value is not important, only that it's not empty.

### Dependencies

* bump `axios` to `1.7.9`
* bump `fs-extra` to `11.3.0`
* bump `puppeteer-core` to `24.1.0`

### Features

* searching uses new defaults and env variables ([#833](https://github.com/fcastilloec/ieeeXploreSearching/issues/833)) ([9e604e5](https://github.com/fcastilloec/ieeeXploreSearching/commit/9e604e500805233c591b6ad59b0694f0c00559f2))


### Bug Fixes

* make sure that Firefox keeps working ([#830](https://github.com/fcastilloec/ieeeXploreSearching/issues/830)) ([7818fa3](https://github.com/fcastilloec/ieeeXploreSearching/commit/7818fa3326bfae66eb58bb5a5dd9e5305e561eff))

## [4.1.6](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.4...v4.1.6) (2024-12-02)


### Dependencies

* bump `axios` to `1.7.8`
* bump `fs-extra` to `11.2.0`
* bump `locate-app` to `2.5.0`
* bump `puppeteer-core` to `23.9.0`

### Bug Fixes

* add description when using NOT ([#747](https://github.com/fcastilloec/ieeeXploreSearching/issues/747)) ([072f054](https://github.com/fcastilloec/ieeeXploreSearching/commit/072f05403a5b501b7360b5c8ec33510e902bb1de))
* bump packages' versions for vulnerability fixing ([#679](https://github.com/fcastilloec/ieeeXploreSearching/issues/679)) ([cfa87fb](https://github.com/fcastilloec/ieeeXploreSearching/commit/cfa87fbbc51bc1cb99eb473e0fb0e10e1abedab7))

## [4.1.4](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.3...v4.1.4) (2023-09-25)


### ⚠ BREAKING CHANGES

* **scrap:** Use of puppeteer browser, so packaging the search script is not possible.

### Dependencies

* bump `axios` to `1.5.0`
* bump `locate-app` to `2.1.0`
* bump `puppeteer-core` to `21.3.4`

### Features

* **scrap:** use puppeteer browser instead of local one ([#601](https://github.com/fcastilloec/ieeeXploreSearching/issues/601)) ([029ede9](https://github.com/fcastilloec/ieeeXploreSearching/commit/029ede9c0f1258d2891f411e8a55ceb4f969226b))


### Bug Fixes

* add user agent string ([171c7eb](https://github.com/fcastilloec/ieeeXploreSearching/commit/171c7eb145084e6c6e052618a0cf53fcefff4b40))

## [4.1.3](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.2...v4.1.3) (2023-07-13)


### Dependencies

* bump `puppeteer-core` to `20.8.0`

### Bug Fixes

* correctly add data fields to search query ([#568](https://github.com/fcastilloec/ieeeXploreSearching/issues/568)) ([2d59f06](https://github.com/fcastilloec/ieeeXploreSearching/commit/2d59f06acaf7758afd3e58d2bd060af2a6b78d18))

## [4.1.2](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.1...v4.1.2) (2023-06-22)


### Dependencies

* bump `puppeteer-core` to `20.7.3`

### Bug Fixes

* **scrap:** adapt to IEEE change to author fields ([#550](https://github.com/fcastilloec/ieeeXploreSearching/issues/550)) ([8cdeec6](https://github.com/fcastilloec/ieeeXploreSearching/commit/8cdeec67edc28f5f86404e723423ce3fcab34308))
* **scrap:** retrieving total number of records ([#558](https://github.com/fcastilloec/ieeeXploreSearching/issues/558)) ([4d6aeec](https://github.com/fcastilloec/ieeeXploreSearching/commit/4d6aeec019bd8a33b6015d345fc91df7607b5f40))
* **scrap:** the NEXT page selector ([#559](https://github.com/fcastilloec/ieeeXploreSearching/issues/559)) ([1cd1fc7](https://github.com/fcastilloec/ieeeXploreSearching/commit/1cd1fc76ffcfc4e2599967e32443fbbbe9f95b9b))
* **scrap:** the selector for next page ([#560](https://github.com/fcastilloec/ieeeXploreSearching/issues/560)) ([5c07cda](https://github.com/fcastilloec/ieeeXploreSearching/commit/5c07cda252fac3e0bef24b6e74c93c120bdfb945))

## [4.1.1](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.1.0...v4.1.1) (2023-05-08)


### Dependencies

* bump `axios` to `1.4.0`
* bump `excel4node` to `1.8.2`
* bump `puppeteer-core` to `20.1.2`
* bump `yargs` to `17.7.2`

### Bug Fixes

* **scrap:** conference test no longer includes volume information ([#524](https://github.com/fcastilloec/ieeeXploreSearching/issues/524)) ([b1443dd](https://github.com/fcastilloec/ieeeXploreSearching/commit/b1443ddaeb5a9e31783fa5a96656c02fe22c4b88))

## [4.1.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.7...v4.1.0) (2023-04-04)


### Dependencies

* bump `axios` to `1.3.4`
* bump `excel4node` to `1.8.1`
* bump `fs-extra` to `11.1.1`
* bump `locate-app` to `2.0.0`
* bump `puppeteer-core` to `19.8.3`
* bump `yargs` to `17.7.1`

### Features

* **scrap:** add support for using Firefox ([#519](https://github.com/fcastilloec/ieeeXploreSearching/issues/519)) ([ef9dc85](https://github.com/fcastilloec/ieeeXploreSearching/commit/ef9dc851ff1195750b377ef8468e6c3a49626843))


### Bug Fixes

* **api:** better error messaging ([#421](https://github.com/fcastilloec/ieeeXploreSearching/issues/421)) ([bba3388](https://github.com/fcastilloec/ieeeXploreSearching/commit/bba3388273fa15bf4747b6d69dafc1a3bdd6cabb))
* **api:** remove unnecessary serialized function ([bd2f1cc](https://github.com/fcastilloec/ieeeXploreSearching/commit/bd2f1cc5a3003cde89e0ade7237dc6166cb9a5c0))
* error messaging for tests ([#423](https://github.com/fcastilloec/ieeeXploreSearching/issues/423)) ([ae9402c](https://github.com/fcastilloec/ieeeXploreSearching/commit/ae9402c8b46cf61a6c3dd5d80d7db70f5dbbc27e))
* **scrap:** adapt to IEEE changes ([#510](https://github.com/fcastilloec/ieeeXploreSearching/issues/510)) ([2b6dc7d](https://github.com/fcastilloec/ieeeXploreSearching/commit/2b6dc7dd144e6cf27f2f4cb0ad9728b1078fa039))
* **scrap:** adapt to new IEEE changes ([#448](https://github.com/fcastilloec/ieeeXploreSearching/issues/448)) ([b23f3c4](https://github.com/fcastilloec/ieeeXploreSearching/commit/b23f3c45b5810028d7b44fdb35d8a06b1d20f4d8))
* **scrap:** additional check for no results ([#424](https://github.com/fcastilloec/ieeeXploreSearching/issues/424)) ([d222444](https://github.com/fcastilloec/ieeeXploreSearching/commit/d22244464acf40a55d94cd85239081a83559029f))

## [4.0.7](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.6...v4.0.7) (2022-10-12)


### Dependencies

* bump `axios` to `1.1.2`
* bump `puppeteer-core` to `18.2.1`
* bump `yargs` to `17.6.0`

### Bug Fixes

* better testing for redirects ([#412](https://github.com/fcastilloec/ieeeXploreSearching/issues/412)) ([26ff8f5](https://github.com/fcastilloec/ieeeXploreSearching/commit/26ff8f518150a7e7bfa4d296c0bfc2aa6019525d))

## [4.0.6](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.5...v4.0.6) (2022-07-26)


### Dependencies

* bump `excel4node` to `1.8.0`
* bump `puppeteer-core` to `15.5.0`

### Bug Fixes

* better check for ending of double-quoted phrases ([#374](https://github.com/fcastilloec/ieeeXploreSearching/issues/374)) ([fb3abe8](https://github.com/fcastilloec/ieeeXploreSearching/commit/fb3abe89e241cc40368a244e8f7621cd56c171ae))

## [4.0.5](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.4...v4.0.5) (2022-06-27)


### Dependencies

* bump `axios` to `0.27.2`
* bump `fs-extra` to `10.1.0`
* bump `puppeteer-core` to `15.1.1`
* bump `yargs` to `17.5.1`
## [4.0.4](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.3...v4.0.4) (2022-04-06)


### Dependencies

* bump `axios` to `0.26.1`
* bump `fs-extra` to `10.0.1`
* bump `puppeteer-core` to `13.5.2`
* bump `yargs` to `17.4.0`

### Bug Fixes

* use new SciHub url ([d1d87c2](https://github.com/fcastilloec/ieeeXploreSearching/commit/d1d87c21108333dec907082110f0847aa6d94c3a))

## [4.0.3](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.2...v4.0.3) (2022-04-06)


### Dependencies

* bump `axios` to `0.26.0`
* bump `puppeteer-core` to `13.5.0`
## [4.0.2](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.1...v4.0.2) (2022-04-06)


### Dependencies

* bump `axios` to `0.24.0`
* bump `puppeteer-core` to `13.0.1`
* bump `yargs` to `17.3.1`

### Bug Fixes

* **excel:** change sci-hub url ([e05c6bb](https://github.com/fcastilloec/ieeeXploreSearching/commit/e05c6bbf2cc459b78d1c9c4a4b49b8663b8a20c6))
* **scrap:** check for redirections ([191b6b7](https://github.com/fcastilloec/ieeeXploreSearching/commit/191b6b7ac0c2692d53e1d6487daf8b018d774b28))
* use working sci-hub URL ([942f333](https://github.com/fcastilloec/ieeeXploreSearching/commit/942f333aa5e705dcda8fd3c07918502250e93535))

## [4.0.1](https://github.com/fcastilloec/ieeeXploreSearching/compare/v4.0.0...v4.0.1) (2022-04-06)


### Dependencies

* No dependency changes

### Bug Fixes

* use absolute path for constants.js ([9d889c2](https://github.com/fcastilloec/ieeeXploreSearching/commit/9d889c23a72d75926a0b9cd7062a4bb7f85c4579))

## [4.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.2...v4.0.0) (2022-04-06)


### ⚠ BREAKING CHANGES

* **cli:** The API key is no longer set using environment variables.
The script will ask and save the key for all future uses.

### Dependencies

* bump `puppeteer-core` to `10.0.0`
* bump `readline-sync` to `1.4.10`

### Features

* **cli:** ask for API key on the first run ([#148](https://github.com/fcastilloec/ieeeXploreSearching/issues/148)) ([54ae883](https://github.com/fcastilloec/ieeeXploreSearching/commit/54ae88358277c003b7b8d39638fed6685877b146))


### Bug Fixes

* make sure publication year is an integer ([dce03d0](https://github.com/fcastilloec/ieeeXploreSearching/commit/dce03d05a8e38aef00a0d22e4e3714cc4c2e0c2e))
* selector for pdf_url ([eca1043](https://github.com/fcastilloec/ieeeXploreSearching/commit/eca10432d02e7d4fa8ebf7224c40084d71c73c66))

## [3.0.2](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.1...v3.0.2) (2022-04-06)


### Dependencies

* bump `fs-extra` to `10.0.0`

### Bug Fixes

* warn the user when escaping double quotes on windows ([#138](https://github.com/fcastilloec/ieeeXploreSearching/issues/138)) ([28483f6](https://github.com/fcastilloec/ieeeXploreSearching/commit/28483f6d35eac4e2b1f6543952214da8f643b185))

## [3.0.1](https://github.com/fcastilloec/ieeeXploreSearching/compare/v3.0.0...v3.0.1) (2022-04-06)


### Dependencies

* bump `puppeteer-core` to `9.1.1`
* bump `yargs` to `17.0.1`

### Bug Fixes

* **cli:** better help description ([#134](https://github.com/fcastilloec/ieeeXploreSearching/issues/134)) ([0eedc7c](https://github.com/fcastilloec/ieeeXploreSearching/commit/0eedc7c880c856378ad2f3db74f3478ca1baee42))

## [3.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v2.0.0...v3.0.0) (2022-04-06)


### ⚠ BREAKING CHANGES

* **search-scrap:** A local Chrome installation is required for scrapping

Please make sure that a valid installation of Chrome exists

### Dependencies

* bump `fs-extra` to `9.1.0`
* bump `locate-chrome` to `0.1.1`
* bump `lodash` to `4.17.21`
* bump `puppeteer-core` to `8.0.0`

### Features

* **excel:** add environment variable to set a font type ([#120](https://github.com/fcastilloec/ieeeXploreSearching/issues/120)) ([d179539](https://github.com/fcastilloec/ieeeXploreSearching/commit/d179539f39aa1db11d8f17c728caa5ecba47c517))
* **search-scrap:** use local Chrome installation ([#108](https://github.com/fcastilloec/ieeeXploreSearching/issues/108)) ([c1dd873](https://github.com/fcastilloec/ieeeXploreSearching/commit/c1dd873a967a589f2c700a1ab2c757f9226bf45f))


### Bug Fixes

* handle all errors ([#107](https://github.com/fcastilloec/ieeeXploreSearching/issues/107)) ([8e63eb8](https://github.com/fcastilloec/ieeeXploreSearching/commit/8e63eb86cd3fc02b8e8d40da36e9d0e796773ead))
* **search-scrap:** update to new IEEE website design ([#119](https://github.com/fcastilloec/ieeeXploreSearching/issues/119)) ([fc30ef2](https://github.com/fcastilloec/ieeeXploreSearching/commit/fc30ef2bbabe8cc81769b11438dabe916bd6bd75))

## [2.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/v1.0.0...v2.0.0) (2022-04-06)


### ⚠ BREAKING CHANGES

* The provided output filename is taken as the name itself. Any use of periods will
  be treated as part of the name, disregarding any provided extension.
* **cli:** The logic CLI no longer accepts files as part of their options. They are pass
  as part of the arguments.

  See ./src/cli-logic.js --help for more details
* When passing a single year argument, searching will no longer be done from
  YEAR to date. Instead search will be perform from YEAR to YEAR (only on the passed year)

### Dependencies

* bump `axios` to `0.21.1`
* bump `lodash` to `4.17.20`
* bump `puppeteer` to `5.5.0`
* bump `yargs` to `16.2.0`

### Features

* add multiple level of verbose ([0ffbafa](https://github.com/fcastilloec/ieeeXploreSearching/commit/0ffbafa0cccba04e5c5cb0b78e3df62645bad6a8))
* better handling of year option ([8cdefb4](https://github.com/fcastilloec/ieeeXploreSearching/commit/8cdefb4b235a0e6ed0b5d270bea39430e6e3a993))
* **cli:** logic operators are boolean instead of array ([669be50](https://github.com/fcastilloec/ieeeXploreSearching/commit/669be50c7f38343d033033e240d119353322167b))
* **excel:** ability to change sci-hub based domain on excel sheet ([#64](https://github.com/fcastilloec/ieeeXploreSearching/issues/64)) ([e24f4f9](https://github.com/fcastilloec/ieeeXploreSearching/commit/e24f4f977dd5c84daee310d6258c9936f06a0e06))
* ignore extension if it's an integer ([#46](https://github.com/fcastilloec/ieeeXploreSearching/issues/46)) ([539ad2f](https://github.com/fcastilloec/ieeeXploreSearching/commit/539ad2f72cd873c2164be501d7a7d1806e295a32))
* remove use of changeFileExtension on output ([ba18528](https://github.com/fcastilloec/ieeeXploreSearching/commit/ba185283c3f8820c7acefbb4f5bb6996b998545a))


### Bug Fixes

* change filename extension ([58e9b30](https://github.com/fcastilloec/ieeeXploreSearching/commit/58e9b308bd36ed1e27b862119510dc5b6de4cae6))
* **cli:** remove positional argument in logic command ([c00500a](https://github.com/fcastilloec/ieeeXploreSearching/commit/c00500a1ea56afb79b1c0167fadc84c1c2a64bba))
* **cli:** yargs strict no longer works as expected ([f3fb830](https://github.com/fcastilloec/ieeeXploreSearching/commit/f3fb83022a46ba588a47ab732cbeb28dfbadfc1a))
* convert to string any query text ([#66](https://github.com/fcastilloec/ieeeXploreSearching/issues/66)) ([48fd55a](https://github.com/fcastilloec/ieeeXploreSearching/commit/48fd55a2ed192a0354ff8a03a9841a6aff3d087c))
* correctly add a data field to multi-word phrases ([#68](https://github.com/fcastilloec/ieeeXploreSearching/issues/68)) ([bdbdbe9](https://github.com/fcastilloec/ieeeXploreSearching/commit/bdbdbe9dc5d9e86e7ead2aaccc60607719f01dfb))
* don't add extension to output if it's already the correct one ([#65](https://github.com/fcastilloec/ieeeXploreSearching/issues/65)) ([503af23](https://github.com/fcastilloec/ieeeXploreSearching/commit/503af23bf011dcc1a4e678f40a045b7fb2ad3c1f))
* **excel:** set style for content_type cells ([#54](https://github.com/fcastilloec/ieeeXploreSearching/issues/54)) ([cd34c9f](https://github.com/fcastilloec/ieeeXploreSearching/commit/cd34c9f4a1f91b250a6b5fe3b6c33f9fad17fd78))
* **logic:** better error checking when files don't exist ([#53](https://github.com/fcastilloec/ieeeXploreSearching/issues/53)) ([aee2d73](https://github.com/fcastilloec/ieeeXploreSearching/commit/aee2d73d9bf3ca0be0367aa3f0197c7d5bc1e93f))
* **search-scrap:** add missing 'Book' content_type ([#47](https://github.com/fcastilloec/ieeeXploreSearching/issues/47)) ([b9be81b](https://github.com/fcastilloec/ieeeXploreSearching/commit/b9be81bbb5d37e92148925a8fd879f41567480c3))
* **search-scrap:** check if there's no results before anything else ([#48](https://github.com/fcastilloec/ieeeXploreSearching/issues/48)) ([684ad27](https://github.com/fcastilloec/ieeeXploreSearching/commit/684ad279a9c2cbb3b13038e8509c6b8180de35dc))
* **search-scrap:** correctly calculate the number of pages ([#45](https://github.com/fcastilloec/ieeeXploreSearching/issues/45)) ([7f25cd2](https://github.com/fcastilloec/ieeeXploreSearching/commit/7f25cd23ac259fba3587709ce506e90f60120816))
* **search-scrap:** update selector according to IEEE changes ([#103](https://github.com/fcastilloec/ieeeXploreSearching/issues/103)) ([28f5377](https://github.com/fcastilloec/ieeeXploreSearching/commit/28f5377595bd15838798e0ce2576cc036213ccfd))

## [1.0.0](https://github.com/fcastilloec/ieeeXploreSearching/compare/5ec99cd911be9750eda4e6edbadce1f2c428d8bf...v1.0.0) (2022-04-06)


### ⚠ BREAKING CHANGES

* **logic:** Search results from both API and Scrap can now be mixed when performing logic
  operations.
* **search:** Scrap results will no longer have their own data fields. Previous work that
  introduced a standard for saving data is now the default.
* stopping developing the chrome extension for the moment and moving the project to
  use puppeteer and scrapping results
* data will no longer be exported as an object of objects
* data will no longer be exported as CSV, only JSON

### Dependencies

* bump `axios` to `0.19.2`
* bump `excel4node` to `1.7.2`
* bump `fs-extra` to `9.0.1`
* bump `lodash` to `4.17.15`
* bump `puppeteer` to `3.3.0`
* bump `yargs` to `15.3.1`

### Features

* add background script ([b561317](https://github.com/fcastilloec/ieeeXploreSearching/commit/b56131784a079481d43a9c9f7447495b0bf07f4c))
* add chrome extension icons ([b615423](https://github.com/fcastilloec/ieeeXploreSearching/commit/b6154230c09b2c0239723906d188a2e57eb842fe))
* add cli commands for searching ([3fd4ad1](https://github.com/fcastilloec/ieeeXploreSearching/commit/3fd4ad1eb64a4f5ce7167c1778bc495a3cc4bd4c))
* add content script to retrieve the list of results ([3be223b](https://github.com/fcastilloec/ieeeXploreSearching/commit/3be223b39c2c5f62907c3d3d55ef16262b04df1c))
* add headless scrapping and saving to excel ([409de8d](https://github.com/fcastilloec/ieeeXploreSearching/commit/409de8db7ad02796a42b63505eefc1e900f2485f))
* add support to export to excel from API results ([4ce3572](https://github.com/fcastilloec/ieeeXploreSearching/commit/4ce3572fb2ffad10ca3a6885324ff0f7680d2259))
* **cli:** add both API and Scrap searching ([83bcb36](https://github.com/fcastilloec/ieeeXploreSearching/commit/83bcb3695aa1ca2d8154bdcd5324ac355b44bfa5))
* **cli:** add command to transform json files to xls ([a1de6cb](https://github.com/fcastilloec/ieeeXploreSearching/commit/a1de6cb27084e2aefeb2dd2b1ba7588ec6f44dc6))
* **cli:** add counting command for JSON files ([bb209ce](https://github.com/fcastilloec/ieeeXploreSearching/commit/bb209cec6c138fd71f8844963a8cf90710c54cf9))
* **cli:** add verbose option for searching ([e002b49](https://github.com/fcastilloec/ieeeXploreSearching/commit/e002b496279e58c6742bffaa5af46f81c4cc2005))
* **cli:** use verbose option to display encoded query ([e4bcfdd](https://github.com/fcastilloec/ieeeXploreSearching/commit/e4bcfdd868bb287dacb2d51cacf6fc58e75ddf73))
* count multiple JSON files at once ([705f51b](https://github.com/fcastilloec/ieeeXploreSearching/commit/705f51bf187491fdfd0afd3e36db456d6fd0332a))
* create initial chrome manifest ([5ec99cd](https://github.com/fcastilloec/ieeeXploreSearching/commit/5ec99cd911be9750eda4e6edbadce1f2c428d8bf))
* **excel:** add styling and convert json-files to xls ([54c64c4](https://github.com/fcastilloec/ieeeXploreSearching/commit/54c64c4987766c0e5cdda7e945ac59a7314f0ccb))
* export data as an array of objects ([b9b1451](https://github.com/fcastilloec/ieeeXploreSearching/commit/b9b14513930f1a87a05b11c27d85b66fba5be254))
* export data as JSON ([ca52866](https://github.com/fcastilloec/ieeeXploreSearching/commit/ca52866d13403a4ef90a3003bbfd13ee9174c4f3))
* **logic:** use standardize json for logic operators ([7bb744e](https://github.com/fcastilloec/ieeeXploreSearching/commit/7bb744e3d1649782e85f03547cda8325512f6770))
* save CSV data to file when clicked ([5aa128b](https://github.com/fcastilloec/ieeeXploreSearching/commit/5aa128b5131c66dc783d309196f493a8eb29e347))
* **search:** add IEEE API searching ([5103555](https://github.com/fcastilloec/ieeeXploreSearching/commit/51035552ef3379a1d7d430f5b2a86b34546f0087))
* **search:** use new standardize results when searching ([eb1a26d](https://github.com/fcastilloec/ieeeXploreSearching/commit/eb1a26d399632a15e986d6a75905715b606d8cbf))
* sets the sci-hub url as clickable on excel ([9f6f67d](https://github.com/fcastilloec/ieeeXploreSearching/commit/9f6f67de561cf527171e02f95bff65b8a8118fda))
* standardize how results are saved for both API and Scrap searching ([7017e3a](https://github.com/fcastilloec/ieeeXploreSearching/commit/7017e3a5e28a7a3a82949e1857aa0221059fb4d8))


### Bug Fixes

* better handling of errors and readability ([79379ef](https://github.com/fcastilloec/ieeeXploreSearching/commit/79379effa7f1a4ffc18f9634837bec3d24dd2802))
* **cli:** better naming for cli scripts ([ff9df73](https://github.com/fcastilloec/ieeeXploreSearching/commit/ff9df73cf7281eee56d126103930071e6dad9c38))
* **cli:** checks for options ([f14af2a](https://github.com/fcastilloec/ieeeXploreSearching/commit/f14af2ad2bf328ec7f52231497856034d82a8363))
* **excel:** add filtering to the header row ([1581051](https://github.com/fcastilloec/ieeeXploreSearching/commit/1581051ece23ea564ced709c0aa989fccf926506))
* **excel:** better error and filename handling ([0ffe151](https://github.com/fcastilloec/ieeeXploreSearching/commit/0ffe15122e2996c1c753dfdd527b13bf8965d605))
* **excel:** fixes styling and adds some properties ([a94dab5](https://github.com/fcastilloec/ieeeXploreSearching/commit/a94dab5f9e511f88b94da2e1dac1fbbe6b0b10b1))
* only save if there are any results ([4bb13a1](https://github.com/fcastilloec/ieeeXploreSearching/commit/4bb13a188056e8cfffeb5d53c4218cf351612c01))
* only save to disk if logic operation return any results ([cb7fa9f](https://github.com/fcastilloec/ieeeXploreSearching/commit/cb7fa9fcc78e5613d4e8763ae79af9d1d81aaaa4))
* output the whole document IEEE url ([ad016d7](https://github.com/fcastilloec/ieeeXploreSearching/commit/ad016d7223b42b422ce357fa14449e8d9b3ded06))
* result properties have a default when they don't exist ([e96dba9](https://github.com/fcastilloec/ieeeXploreSearching/commit/e96dba96961d4d82473b62c279c7c2149a6295de))
* saving data from either API or scrapping when using data fields ([e431d6c](https://github.com/fcastilloec/ieeeXploreSearching/commit/e431d6c4589e90bfdd4629ae1e508dcdd6313a67))
* **search-api:** uses the correct data field ([237aa19](https://github.com/fcastilloec/ieeeXploreSearching/commit/237aa19df401976874965ac104f0d358c7d1d5c9))
* **search-scrap:** add defaults for articleNumber and journal ([48cba91](https://github.com/fcastilloec/ieeeXploreSearching/commit/48cba91ded7b2127b3328d074d89635158bc5b12))
* **search-scrap:** better handling of nested parenthesis on queries ([c65cb59](https://github.com/fcastilloec/ieeeXploreSearching/commit/c65cb5984240dd851e6c240fbde3a5b70bf425ef))
* **search-scrap:** get actual article_number from pdf_url ([f7fe4eb](https://github.com/fcastilloec/ieeeXploreSearching/commit/f7fe4eb47389b465994f59524b6ee00fff1ebf3f))
* **search:** exit if unknown errors are thrown when searching ([d333929](https://github.com/fcastilloec/ieeeXploreSearching/commit/d333929601df6a126e40ae8ae5c9194141e1bca8))
* use the current year and not whole date ([3f1e710](https://github.com/fcastilloec/ieeeXploreSearching/commit/3f1e7109fcdbde6f180097d4015f402a9771a509))
