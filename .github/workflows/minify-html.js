const fs = require('fs');
const { JSDOM } = require('jsdom');
const uglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const babel = require('@babel/core');
const path = require('path');
const htmlMinifier = require('html-minifier');

// copy bridge.html to bridge_unminified.html
const sourcePath = path.resolve(__dirname, '../../_site/bridge.html');
const destPath = path.resolve(__dirname, '../../download/bridge_unminified.html');
const destPathMin = path.resolve(__dirname, '../../download/bridge.html');

fs.copyFileSync(sourcePath, destPath);

// read bridge_unminified.html
const html = fs.readFileSync(destPath, 'utf-8');
const doctypeIndex = html.indexOf('<!DOCTYPE html>');
const preDoctypeHtml = html.slice(0, doctypeIndex);
const postDoctypeHtml = html.slice(doctypeIndex);

const dom = new JSDOM(postDoctypeHtml);
// Handle JavaScript minification and transformation
const scripts = Array.from(dom.window.document.querySelectorAll('script:not([src])'));
scripts.forEach((script) => {
  const scriptParts = script.textContent.split('function sendExtensionCommands()');
  const partToPreserve = `function sendExtensionCommands()${scriptParts[1]}`;
  const partToMinify = scriptParts[0];

  const transpiledCode = babel.transform(partToMinify, {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        loose: true,
      }],
    ],
  }).code;

  const result = uglifyJS.minify(transpiledCode);
  if (result.error) {
    console.error('UglifyJS error:', result.error);
    return;
  }

  script.textContent = `\n/* eslint-disable */\n${result.code}\n\n/* eslint-enable */\n/* eslint-disable spaced-comment */\n${partToPreserve}`;
});

// Handle CSS minification
const styles = Array.from(dom.window.document.querySelectorAll('style'));
styles.forEach((style) => {
  const minifiedCSS = new CleanCSS({}).minify(style.textContent);
  if (minifiedCSS.errors.length > 0) {
    console.error('CleanCSS errors:', minifiedCSS.errors);
    return;
  }
  style.textContent = minifiedCSS.styles;
});

// Serialize back to HTML
let serializedHtml = dom.serialize();

// Add newlines after specific tags
serializedHtml = serializedHtml.replace(/<!DOCTYPE html>/, '<!DOCTYPE html>\n')
                               .replace(/<html lang="en">/, '<html lang="en">\n')
                               .replace(/<head>/, '<head>');

// Handle HTML minification
const bodyStart = serializedHtml.indexOf('<body>') + 6; // +6 to get after the '<body>' tag
const bodyEnd = serializedHtml.indexOf('</body>' + 7); // +7 to get after the '</body>' tag (7 = length of '</body>'
let bodyHtml = serializedHtml.slice(bodyStart, bodyEnd);

const commentIndex = bodyHtml.indexOf('<!--Your external script will be inserted here-->');
if (commentIndex !== -1) {
  const partToPreserve = bodyHtml.slice(commentIndex);
  const partToMinify = bodyHtml.slice(0, commentIndex);

  const minifiedHTML = htmlMinifier.minify(partToMinify, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeOptionalTags: false,
  });

  const minifiedHTMLReplaced = minifiedHTML.replace(/<\/div><\/div>$/, '');
  bodyHtml = `${minifiedHTMLReplaced}\n\n${partToPreserve}`;
}

// Replace the original body content with the minified content
serializedHtml = serializedHtml.slice(0, bodyStart) + bodyHtml + serializedHtml.slice(bodyEnd);

// Prepend the extracted comments
serializedHtml = `${preDoctypeHtml}\n${serializedHtml}`;

// Write to bridge.html
fs.writeFileSync(destPathMin, serializedHtml);
