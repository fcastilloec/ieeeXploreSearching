# IEEE Xplore searching

## Usage

There are three command-line utilities. They all are implemented using [`yargs`](https://github.com/yargs/yargs) and include help descriptions by passing the `-h` or `--help` argument.

### cli-search.js

Use to search inside IEEE Xplorer and saves the results into a JSON file.
The output is an array of articles, where each article is an object containing the fields specified by the [IEEE API](https://developer.ieee.org/docs/read/Metadata_API_responses)

#### Examples:

`cli-search.js 'optics AND nano' -o search1 -y 1990 -y 2000 -e`\
searches for "optics AND nano" between 1990 and 2000, and save the results in search1.json, and also search1.xls

`cli-search.js 'h264 NEAR/3 cellular' -y 2005 -o search2.json`\
searches for "h264 NEAR/3 cellular" only on 2005, and save the results in search2.json

#### Windows issues:

The scripts only work on **PowerShell**, it won't work properly on **Command Prompt**.
This is because **Command Prompt** doesn't handle single and double quotes together properly.

In fact, under **PowerShell**, if you want to use double quotes as part of the `query`, they have to be escaped with a backwards slash (`\`).

For example: `cli-search.js 'optics AND \"nano\"' -o search1 -y 1990 -y 2000`

### cli-logic.js

The main use is for logic operations among JSON files returned by the [search script](###cli-search.js).
As a secondary use, it can also create an Excel file from a JSON one.

#### Examples:

`cli-logic.js --merge file1.json file2.json file3.json --output output.json`\
merge file1.json, file2.json, file3.json and save into output.json

`cli-logic.js --and file1.json file2.json --output output.json`\
file1.json AND file2.json -> output.json

`cli-logic.js --or file1.json file2.json -not file3.json --output output.json`\
(file1.json OR file2.json) NOT file3.json -> output.json

`cli-logic.js json2xls file.json`\
Converts file.json into file.xls

### cli-count.js

A simple script that returns the number of results inside a JSON file returned by the [search script](###cli-search.js).

#### Example:

`cli-count.js file.json`

## License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html)
