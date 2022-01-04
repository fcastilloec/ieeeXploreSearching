#!/usr/bin/env bash

# VARIABLES
DIR=$(dirname "$0")
changelog="${DIR}/../CHANGELOG.md"
gron="${DIR}/gron-$(arch)"
tag=$(git describe --tags --abbrev=0)

# Get dependencies that have changed since last tag
# If no changes found, it will return a non-zero value
dependenciesJSON=$(diff --changed-group-format='%>' --unchanged-group-format=''\
 <(git show "${tag}:package.json" | ${gron}) <(${gron} package.json)\
 | grep dependencies\
 | ${gron} --ungron)

if [[ -n ${dependenciesJSON} ]]; then
  # Format text for changelog
  replaceText=$(echo "${dependenciesJSON}" | jq -r '.dependencies | to_entries[] | "* bump `\(.key)` to `\(.value)`" | @text')

  # Replace the latest Dependencies section in the Changelog
  npx --no markdown-replace-section "${changelog}" Dependencies "${changelog}" --not-hungry <<< "${replaceText//[~^]/}"
fi
