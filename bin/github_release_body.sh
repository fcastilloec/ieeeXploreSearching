#!/usr/bin/env bash

DIR=$(dirname "$0")
changelog="${DIR}/../CHANGELOG.md"
OUTPUT="${DIR}/../RELEASE.md"

# Get the lines for the latest tag's content
mapfile -t lines < <(grep -n -m 2 "## \[" "${changelog}" | cut -d: -f1)

# Output the body of the latest tag, using the previous lines
# There are empty lines before (last line) and after (first line) that need to be removed
head -n "$(( lines[1] - 2 ))" "${changelog}" | tail -n "+$(( lines[0] + 3 ))" > "${OUTPUT}"
