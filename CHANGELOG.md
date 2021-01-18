# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2020-08-19)


### ⚠ BREAKING CHANGES

* **logic:** Search results from both API and Scrap can now be mixed when performing logic
  operations.
* Scrap results will no longer have their own data fields. Previous work that
  introduced a standard for saving data is now the default.
* stopping developing the chrome extension for the moment and moving the project to
  use puppeteer and scrapping results
* data will no longer be exported as an object of objects
* data will no longer be exported as CSV, only JSON

### Features

* count multiple JSON files at once ([ea5a232](https://github.com/fcastilloec/ieeexplore2csv/commit/ea5a232a391aa80dcc4b3252e8676c00e571dafe))
* standardize how results are saved for both API and Scrap searching ([1ad0d1b](https://github.com/fcastilloec/ieeexplore2csv/commit/1ad0d1bebe99789274d91d28a1078b5b06ef0cd6))
* use new standardized results when searching ([f8537ed](https://github.com/fcastilloec/ieeexplore2csv/commit/f8537ed11d83c5f906cafe0a822fa4320cd5ae43))
* use verbose option to display encoded query ([969805e](https://github.com/fcastilloec/ieeexplore2csv/commit/969805ec852aeeea762b8656d9b87cafb684b8be))
* **cli:** add both API and Scrap searching ([aec1205](https://github.com/fcastilloec/ieeexplore2csv/commit/aec1205041081c4ec4739ca93a2e79d5a15d3c27))
* **cli:** add command to transform json files to xls ([86e6a49](https://github.com/fcastilloec/ieeexplore2csv/commit/86e6a49b4bf27206f667648811c6fc8341088303))
* **cli:** add counting command for JSON files ([b9ef436](https://github.com/fcastilloec/ieeexplore2csv/commit/b9ef43699cde85a9375e3e4cfc4ee42af9536352))
* **cli:** add verbose option for searching ([e92aec2](https://github.com/fcastilloec/ieeexplore2csv/commit/e92aec285854c6f1a4d16b819b80ceb5eed5b37c))
* **excel:** add styling and convert json-files to xls ([e189f6f](https://github.com/fcastilloec/ieeexplore2csv/commit/e189f6f98fdff25277beaba275ce99a4a5cc1359))
* **logic:** use standardized json for logic operators ([3384655](https://github.com/fcastilloec/ieeexplore2csv/commit/338465509c3e56b67cf6dab19c30e1fb06f76054))
* add background script ([b561317](https://github.com/fcastilloec/ieeexplore2csv/commit/b56131784a079481d43a9c9f7447495b0bf07f4c))
* add chrome extension icons ([b615423](https://github.com/fcastilloec/ieeexplore2csv/commit/b6154230c09b2c0239723906d188a2e57eb842fe))
* add cli commands for searching ([3fd4ad1](https://github.com/fcastilloec/ieeexplore2csv/commit/3fd4ad1eb64a4f5ce7167c1778bc495a3cc4bd4c))
* add content script to retrieve the list of results ([3be223b](https://github.com/fcastilloec/ieeexplore2csv/commit/3be223b39c2c5f62907c3d3d55ef16262b04df1c))
* add headless scrapping and saving to excel ([409de8d](https://github.com/fcastilloec/ieeexplore2csv/commit/409de8db7ad02796a42b63505eefc1e900f2485f))
* add IEEE API searching ([fd84acd](https://github.com/fcastilloec/ieeexplore2csv/commit/fd84acd2cc5787fc42d9eb1da166d800154b643a))
* add support to export to excel from API results ([1e2b981](https://github.com/fcastilloec/ieeexplore2csv/commit/1e2b981d3c7a3394b53248cc8be30a7e8f293e53))
* create initial chrome manifest ([5ec99cd](https://github.com/fcastilloec/ieeexplore2csv/commit/5ec99cd911be9750eda4e6edbadce1f2c428d8bf))
* export data as an array of objects ([b9b1451](https://github.com/fcastilloec/ieeexplore2csv/commit/b9b14513930f1a87a05b11c27d85b66fba5be254))
* export data as JSON ([ca52866](https://github.com/fcastilloec/ieeexplore2csv/commit/ca52866d13403a4ef90a3003bbfd13ee9174c4f3))
* save CSV data to file when clicked ([5aa128b](https://github.com/fcastilloec/ieeexplore2csv/commit/5aa128b5131c66dc783d309196f493a8eb29e347))
* sets the sci-hub url as clickable on excel ([9f6f67d](https://github.com/fcastilloec/ieeexplore2csv/commit/9f6f67de561cf527171e02f95bff65b8a8118fda))


### Bug Fixes

* better handling of errors and readability ([4d6e1b3](https://github.com/fcastilloec/ieeexplore2csv/commit/4d6e1b386aadbc36e1b027dab6e51f48b0a9890d))
* only save to disk if logic operation return any results ([e3f951e](https://github.com/fcastilloec/ieeexplore2csv/commit/e3f951e192453aff5fc3b842d3d193152cf6dae3))
* **cli:** better naming for cli scripts ([a91ad50](https://github.com/fcastilloec/ieeexplore2csv/commit/a91ad500fe87d0e2c13ad437b95088a4d7f92934))
* **createJSON:** add defaults for articleNumber and journal ([da2e6d0](https://github.com/fcastilloec/ieeexplore2csv/commit/da2e6d07632555ab5781be950dcc14a0023bec37))
* **excel:** add filtering to the header row ([47de98d](https://github.com/fcastilloec/ieeexplore2csv/commit/47de98d3292f39a266c2dafac445db38fbd90856))
* **excel:** fixes styling and adds some properties ([397acd4](https://github.com/fcastilloec/ieeexplore2csv/commit/397acd49ce14785752bd77453d9187f800959f7a))
* **json:** get actual article_number from pdf_url ([2322f39](https://github.com/fcastilloec/ieeexplore2csv/commit/2322f3961bc0f12fb17d8e9b08e1438b5033e44a))
* **search:** uses the correct data field for API searching ([71c6dff](https://github.com/fcastilloec/ieeexplore2csv/commit/71c6dff0dffdceec1e2fc6dd9f99673cd31280f2))
* better error and xls filename handling ([fee67f7](https://github.com/fcastilloec/ieeexplore2csv/commit/fee67f738acd27d6baf306f2904ad52a6d06d669))
* better handling of nested parenthesis on queries ([9e56605](https://github.com/fcastilloec/ieeexplore2csv/commit/9e56605bcc904165b64f16363b0ae308da0e3b3b))
* checks for cli options ([c390c30](https://github.com/fcastilloec/ieeexplore2csv/commit/c390c30e1d948b2592cf259a39927c8ae29e693e))
* only save if there are any results ([d28040c](https://github.com/fcastilloec/ieeexplore2csv/commit/d28040c1f399dd921b2f5f9b71873f5e6eb0cd4a))
* output the whole document IEEE url ([ad016d7](https://github.com/fcastilloec/ieeexplore2csv/commit/ad016d7223b42b422ce357fa14449e8d9b3ded06))
* result properties have a default when they don't exist ([e96dba9](https://github.com/fcastilloec/ieeexplore2csv/commit/e96dba96961d4d82473b62c279c7c2149a6295de))
* saving data from either API or scrapping when using data fields ([50cd360](https://github.com/fcastilloec/ieeexplore2csv/commit/50cd36036a22c70c08873d25c94ab547554b5f44))
* use the current year and not whole date ([3de982a](https://github.com/fcastilloec/ieeexplore2csv/commit/3de982a423f6667875b7e6f8380aed53ed2d777b))
* **search:** exit if unknown errors are thrown ([a3f4253](https://github.com/fcastilloec/ieeexplore2csv/commit/a3f4253bd3f75cf676fa517a54da53ae1566a83f))
