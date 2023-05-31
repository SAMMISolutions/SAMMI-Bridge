// scripts/copy-and-extract.js

const fs = require('fs');
const path = require('path');

// Copy the file
const srcPath = path.resolve(__dirname, '../download/bridge.html');
const destPath = path.resolve(__dirname, '../release/bridge.html');
fs.copyFileSync(srcPath, destPath);

// Extract the version
const fileContent = fs.readFileSync(destPath, 'utf-8');
const versionMatch = fileContent.match(/<!--Bridge V([\d.]+)-->/);
if (!versionMatch) {
    console.error('Could not extract version from bridge.html');
    process.exit(1);
}

const version = versionMatch[1];
console.log(version);  // Outputs the version so it can be used in the next workflow step
