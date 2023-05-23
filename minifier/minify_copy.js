const fs = require('fs');
const { JSDOM } = require('jsdom');
const { minify } = require('uglify-js');
const CleanCSS = require('clean-css');

const html = fs.readFileSync('../download/bridge.html', 'utf-8');
const dom = new JSDOM(html);

// Handle JavaScript minification
const scripts = Array.from(dom.window.document.querySelectorAll('script:not([src])'));
scripts.forEach((script) => {
  const scriptParts = script.textContent.split('function sendExtensionCommands()');
  const partToPreserve = `function sendExtensionCommands()${scriptParts[1]}`;
  const partToMinify = scriptParts[0];

  const result = minify(partToMinify);
  if (result.error) {
    console.error('UglifyJS error:', result.error);
    return;
  }

  script.textContent = `\n/* eslint-disable */${result.code}\n\n/* eslint-enable */\n/* eslint-disable spaced-comment */\n${partToPreserve}`;
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

fs.writeFileSync('../download/bridge.min.html', dom.serialize());
