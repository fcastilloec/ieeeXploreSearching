module.exports = {
  types: [
    { type: 'build', section: 'Dependencies' },
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
  ],
  scripts: {
    postchangelog: './bin/dependencies.sh',
  },
}
