const fs = require('fs');
const NPM_TOKEN = process.env.NPM_TOKEN;

console.log("Running pre install script");

if (!NPM_TOKEN) {
    console.error("NPM_TOKEN environment variable is not set");
    process.exit(1);
}

try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencyName = 'hlb-api-library';
    const currentVersion = packageJson.dependencies[dependencyName].split('#')[1];
    packageJson.dependencies[dependencyName] = `https://${NPM_TOKEN}@github.com/alvmivan/hlb-api-library.git#${currentVersion}`;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('Successfully updated hlb-api-library URL with auth token');
} catch (error) {
    console.error('Error updating package.json:', error);
    process.exit(1);
}

console.log("Pre install script completed");