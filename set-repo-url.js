const fs = require('fs');
const NPM_TOKEN = process.env.NPM_TOKEN;

if (NPM_TOKEN) {
    
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const dependencyName = 'hlb-api-library';
    const currentVersion = packageJson.dependencies[dependencyName].split('#')[1];
    packageJson.dependencies[dependencyName] = `https://${NPM_TOKEN}@github.com/alvmivan/hlb-api-library.git#${currentVersion}`;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('Updated hlb-api-library URL based on environment');
}  
