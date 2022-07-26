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
  # jq -j for no new line output because sed expects newlines to be preceded by a backslash
  replaceText=$(echo "${dependenciesJSON}" | jq -j '.dependencies | to_entries[] | "* bump `\(.key)` to `\(.value)`\\n" | @text')

  # Replace the latest Dependencies section in the Changelog
  line1=$(grep -n -m 1 "### Dependencies" "${changelog}" | cut -d: -f1)
  line2=$(grep -n -m 2 "### \[" "${changelog}" | tail -1 | cut -d: -f1)
  line1=$(( line1 + 2 ))
  line2=$(( line2 - 1 )) # sed already inserts a new line after the last replaceText
  sed -i "${line1},${line2}c${replaceText//[~^]/}" "${changelog}"
fi
