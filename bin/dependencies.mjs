import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CHANGELOG_PATH = path.join(__dirname, '../CHANGELOG.md');

/**
 * Get the latest git tag
 */
function getLatestTag() {
  try {
    return execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error: Could not find any git tags\n${error}`);
    process.exit(1);
  }
}

/**
 * Get package.json dependencies from a specific git tag
 */
function getDependenciesFromTag(tag) {
  try {
    const packageJson = execSync(`git show ${tag}:package.json`, { encoding: 'utf8' });
    const parsed = JSON.parse(packageJson);
    return parsed.dependencies || {};
  } catch (error) {
    console.error(`Error: Could not read package.json from tag ${tag}\n${error}`);
    process.exit(1);
  }
}

/**
 * Get current package.json dependencies
 */
function getCurrentDependencies() {
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = fs.readFileSync(packagePath, 'utf8');
    const parsed = JSON.parse(packageJson);
    return parsed.dependencies || {};
  } catch (error) {
    console.error(`Error: Could not read current package.json\n${error}`);
    process.exit(1);
  }
}

/**
 * Compare dependencies and return changes
 */
function getChangedDependencies(oldDeps, newDeps) {
  const changes = [];

  // Helper to strip npm version prefixes
  const clean = (version) => version.replace(/^[~^><= \s]+/, '');

  // Check for added or updated dependencies
  for (const [name, version] of Object.entries(newDeps)) {
    if (!oldDeps[name]) {
      changes.push({ name, version: clean(version), type: 'added' });
    } else if (oldDeps[name] !== version) {
      changes.push({ name, version: clean(version), type: 'updated' });
    }
  }

  // Check for removed dependencies
  for (const name of Object.keys(oldDeps)) {
    if (!newDeps[name]) {
      changes.push({ name, version: oldDeps[name], type: 'removed' });
    }
  }

  return changes;
}

/**
 * Update the changelog with dependency changes
 */
function updateChangelog(changes) {
  if (changes.length === 0) {
    console.log('No dependency changes found');
    return;
  }

  let changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');

  // Find the first "### Dependencies" section
  const depsHeaderRegex = /^### Dependencies$/m;
  const match = changelog.match(depsHeaderRegex);

  if (!match) {
    console.error('Error: Could not find "### Dependencies" section in changelog');
    process.exit(1);
  }

  const headerIndex = match.index;
  const headerLength = match[0].length; // Get actual length of matched text
  const afterHeader = changelog.substring(headerIndex);

  // Find the end of the Dependencies section (next ## or ### header)
  const nextSectionRegex = /\n(##+ )/;
  const nextSectionMatch = afterHeader.substring(headerLength).match(nextSectionRegex); // 15 = "### Dependencies".length

  if (!nextSectionMatch) {
    console.error('Error: Could not find next section after Dependencies');
    process.exit(1);
  }

  const sectionEndIndex = headerIndex + headerLength + nextSectionMatch.index;

  // Generate the new dependency list
  const newContent = changes.map((change) => `* bump \`${change.name}\` to \`${change.version}\``).join('\n');

  // Reconstruct the changelog
  const before = changelog.substring(0, headerIndex + headerLength); // Include "### Dependencies"
  const after = changelog.substring(sectionEndIndex);

  const updatedChangelog = `${before}\n\n${newContent}\n${after}`;

  // Write the updated changelog
  fs.writeFileSync(CHANGELOG_PATH, updatedChangelog, 'utf8');

  console.log(`Updated changelog with ${changes.length} dependency change(s)`);
}

/**
 * Main execution
 */
function main() {
  console.log('Checking for dependency changes...');

  const tag = getLatestTag();
  console.log(`Comparing against tag: ${tag}`);

  const oldDeps = getDependenciesFromTag(tag);
  const newDeps = getCurrentDependencies();

  const changes = getChangedDependencies(oldDeps, newDeps);

  if (changes.length > 0) {
    console.log(`Found ${changes.length} dependency change(s):`);
    changes.forEach((change) => {
      console.log(`  - ${change.name}: ${change.version} (${change.type})`);
    });
  }

  updateChangelog(changes);
}

// Run the script
main();
