#!/usr/bin/env bash

# VARIABLES
DIR=$(dirname "$0")
changelog="${DIR}/../CHANGELOG.md"
gron="${DIR}/gron-$(arch)"
tag=$(git describe --tags --abbrev=0)

# Get dependencies that have changed since last tag
# If no changes found, it will return a non-zero value
dependenciesJSON=$(/usr/bin/diff --changed-group-format='%>' --unchanged-group-format=''\
 <(git show "${tag}:package.json" | ${gron}) <(${gron} package.json)\
 | grep dependencies\
 | ${gron} --ungron)

if [[ -n ${dependenciesJSON} ]]; then
  # Format text for changelog
  # jq -j for no new line output because sed expects newlines to be preceded by a backslash
  replaceText=$(echo "${dependenciesJSON}" | jq -j '.dependencies | to_entries[] | "* bump `\(.key)` to `\(.value)`\\n" | @text')

  # Replace the latest Dependencies section in the Changelog
  line1=$(grep -n -m 1 "### Dependencies" "${changelog}" | cut -d: -f1)
  line2=$(grep -n -m 2 "## \[" "${changelog}" | tail -1 | cut -d: -f1)
  line3=$(grep -n -m 2 "### \[" "${changelog}" | tail -1 | cut -d: -f1)

  first_line=$(( line1 + 2 ))
  # Use the appropriate section to replace. Some section use double or triple hashtags
  # sed already inserts a new line after the last replaceText, so we remove that line here
  if [[ ${line2} -le ${line3} ]]; then
    last_line=$(( line2 - 1 ))
  else
    last_line=$(( line3 - 1 ))
  fi

  sed -i "${first_line},${last_line}c${replaceText//[~^]/}" "${changelog}"
fi
