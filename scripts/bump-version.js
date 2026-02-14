#!/usr/bin/env node

/**
 * A3KM Studio - Version Bump Helper
 * Automatically increments version and updates relevant files
 * Usage: node bump-version.js [major|minor|patch]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// File paths
const VERSION_JSON_PATH = path.join(__dirname, '..', 'version.json');
const OFFLINE_MANAGER_PATH = path.join(__dirname, '..', 'Optimization', 'offline-content-manager.js');

// Colors for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseVersion(versionString) {
  const match = versionString.match(/v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) throw new Error('Invalid version format');
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

function incrementVersion(version, type) {
  const v = { ...version };
  switch (type) {
    case 'major':
      v.major++;
      v.minor = 0;
      v.patch = 0;
      break;
    case 'minor':
      v.minor++;
      v.patch = 0;
      break;
    case 'patch':
      v.patch++;
      break;
    default:
      throw new Error('Invalid bump type. Use: major, minor, or patch');
  }
  return v;
}

function formatVersion(version) {
  return `v${version.major}.${version.minor}.${version.patch}`;
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  log('\n🚀 A3KM Studio - Version Bump Helper\n', 'cyan');

  // Read current version.json
  if (!fs.existsSync(VERSION_JSON_PATH)) {
    log('❌ Error: version.json not found', 'red');
    process.exit(1);
  }

  const versionData = JSON.parse(fs.readFileSync(VERSION_JSON_PATH, 'utf8'));
  const currentVersion = parseVersion(versionData.version);
  
  log(`Current version: ${colors.bright}${formatVersion(currentVersion)}${colors.reset}`, 'green');
  
  // Get bump type
  const bumpType = process.argv[2] || await question('\nBump type? (major/minor/patch) [patch]: ') || 'patch';
  
  if (!['major', 'minor', 'patch'].includes(bumpType)) {
    log('❌ Invalid bump type. Use: major, minor, or patch', 'red');
    process.exit(1);
  }

  // Calculate new version
  const newVersion = incrementVersion(currentVersion, bumpType);
  const newVersionString = formatVersion(newVersion);
  const today = new Date().toISOString().split('T')[0];
  const fullVersionString = `${newVersionString}-${today}-enhanced`;

  log(`\nNew version will be: ${colors.bright}${fullVersionString}${colors.reset}`, 'yellow');

  // Get changelog
  const changelogInput = await question('\nWhat changed? (comma separated): ');
  const changelog = changelogInput 
    ? changelogInput.split(',').map(s => s.trim()).filter(Boolean)
    : ['Minor updates and improvements'];

  // Get release notes
  const releaseNotes = await question('\nRelease notes (optional): ') || 
    `Version ${newVersionString} release with improvements and updates.`;

  // Confirm
  log('\n📋 Summary:', 'cyan');
  log(`  Version: ${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch} → ${newVersion.major}.${newVersion.minor}.${newVersion.patch}`, 'bright');
  log(`  Full version: ${fullVersionString}`, 'bright');
  log(`  Changes:`);
  changelog.forEach(change => log(`    - ${change}`, 'bright'));

  const confirm = await question('\nProceed with version bump? (y/n) [y]: ') || 'y';
  
  if (confirm.toLowerCase() !== 'y') {
    log('\n❌ Version bump cancelled', 'red');
    rl.close();
    process.exit(0);
  }

  // Update version.json
  log('\n📝 Updating version.json...', 'cyan');
  versionData.version = fullVersionString;
  versionData.releaseDate = new Date().toISOString();
  versionData.changelog = changelog;
  versionData.releaseNotes = releaseNotes;
  
  fs.writeFileSync(VERSION_JSON_PATH, JSON.stringify(versionData, null, 2) + '\n');
  log('✅ version.json updated', 'green');

  // Update offline-content-manager.js
  log('\n📝 Updating offline-content-manager.js...', 'cyan');
  let offlineManagerContent = fs.readFileSync(OFFLINE_MANAGER_PATH, 'utf8');
  
  // Replace version string
  offlineManagerContent = offlineManagerContent.replace(
    /this\.CONTENT_VERSION = ['"]v[\d.]+-[\d-]+-\w+['"]/,
    `this.CONTENT_VERSION = '${fullVersionString}'`
  );
  
  fs.writeFileSync(OFFLINE_MANAGER_PATH, offlineManagerContent);
  log('✅ offline-content-manager.js updated', 'green');

  // Summary
  log('\n✨ Version bump complete!', 'green');
  log('\n📦 Next steps:', 'cyan');
  log('  1. Review changes:', 'bright');
  log(`     git diff`, 'bright');
  log('  2. Commit:', 'bright');
  log(`     git add version.json Optimization/offline-content-manager.js`, 'bright');
  log(`     git commit -m "Release ${fullVersionString}"`, 'bright');
  log('  3. Push:', 'bright');
  log(`     git push`, 'bright');
  log('\n🎉 Users will receive update notification automatically!', 'magenta');

  rl.close();
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
