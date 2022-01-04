#!/usr/bin/env bash

set -eE
failure() {
  local lineno=$1; local msg=$2; echo "$(basename "$0"): failed at ${lineno}: ${msg}"
}
trap 'failure ${LINENO} "$BASH_COMMAND"' ERR

# VARIABLES
DIR=$(dirname "$0")
changelog="${DIR}/../CHANGELOG.md"
gron="${DIR}/gron-x64"
tag=$(git describe --tags --abbrev=0)

# Get dependencies that have changed since last tag
dependenciesJSON=$(diff --changed-group-format='%>'" "--unchanged-group-format=''\
 <(git show "${tag}:package.json" | ${gron}) <(${gron} package.json)\
 | grep dependencies\
 | ${gron} --ungron)

# Format text for changelog
replaceText=$(echo "${dependenciesJSON}" | jq -r '.dependencies | to_entries[] | "* bump `\(.key)` to `\(.value)`" | @text')

# Replace the latest Dependencies section in the Changelog
npx --no markdown-replace-section "${changelog}" Dependencies "${changelog}" --not-hungry <<< "${replaceText//[~^]/}"
