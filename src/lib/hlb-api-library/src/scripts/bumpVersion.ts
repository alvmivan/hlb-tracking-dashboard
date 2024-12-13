//se llama con "bumpPatch": "tsc && node dist/src/scripts/bumpVersion.js patch",
// tambien con minor y major

// este script bumpea el package.json, y tambien hace git tag y git push origin --tags


import fs from 'fs';
import {execSync} from 'child_process';

const bumpType = process.argv[2]; // 'patch', 'minor', or 'major'

if (!['patch', 'minor', 'major'].includes(bumpType)) {
    console.error('Invalid bump type. Use "patch", "minor", or "major".');
    process.exit(1);
}

const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const versionParts = packageJson.version.split('.').map(Number);

switch (bumpType) {
    case 'patch':
        versionParts[2]++;
        break;
    case 'minor':
        versionParts[1]++;
        versionParts[2] = 0;
        break;
    case 'major':
        versionParts[0]++;
        versionParts[1] = 0;
        versionParts[2] = 0;
        break;
}

const newVersion = versionParts.join('.');
packageJson.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`Version bumped to ${newVersion}`);