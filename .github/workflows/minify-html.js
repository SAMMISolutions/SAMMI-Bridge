const fs = require('fs');
const uglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
const babel = require('@babel/core');
const path = require('path');
const htmlMinifier = require('html-minifier');

const rootPath = path.resolve(__dirname, '../..');
const sourcePath = process.env.BRIDGE_MINIFY_SOURCE
  ? path.resolve(rootPath, process.env.BRIDGE_MINIFY_SOURCE)
  : path.resolve(rootPath, '_site/bridge.html');
const unminifiedPath = path.resolve(rootPath, 'download/bridge_unminified.html');
const minifiedPath = path.resolve(rootPath, 'download/bridge.html');

if (!process.env.BRIDGE_MINIFY_SOURCE) {
  fs.copyFileSync(sourcePath, unminifiedPath);
}

function minifyJavaScript(source, options = {}) {
  if (!source.trim()) return '';

  const transpiledCode = babel.transform(source, {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        loose: true,
      }],
    ],
  }).code;

  const result = uglifyJS.minify(transpiledCode, {
    compress: options.compress,
    mangle: options.mangle,
    output: {
      comments: options.comments || false,
    },
  });

  if (result.error) {
    throw result.error;
  }

  return result.code || '';
}

function findFunctionEnd(source, functionName, startIndex) {
  const declarationIndex = source.indexOf(`function ${functionName}`, startIndex);
  if (declarationIndex === -1) return -1;

  const braceIndex = source.indexOf('{', declarationIndex);
  if (braceIndex === -1) return -1;

  let depth = 0;
  for (let i = braceIndex; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return i + 1;
  }

  return -1;
}

function minifyScriptPreservingExtensionHooks(source) {
  const sendStart = source.indexOf('function sendExtensionCommands()');
  if (sendStart === -1) {
    return minifyJavaScript(source);
  }

  const sendEnd = findFunctionEnd(source, 'sendExtensionCommands', sendStart);
  const receivedStart = source.indexOf('function SammiExtensionReceived', sendEnd);
  const receivedEnd = receivedStart === -1
    ? -1
    : findFunctionEnd(source, 'SammiExtensionReceived', receivedStart);

  if (sendEnd === -1 || receivedStart === -1 || receivedEnd === -1) {
    return minifyJavaScript(source, {
      compress: false,
      mangle: false,
      comments: /INSERT PART|Your main script|SAMMI Core extension/,
    });
  }

  const part4Index = source.indexOf('/*INSERT PART 4*/', receivedEnd);
  const mainScriptCommentIndex = part4Index === -1
    ? -1
    : source.lastIndexOf('// Your main script will be inserted here', part4Index);
  const twitchExtensionEnd = mainScriptCommentIndex !== -1
    ? mainScriptCommentIndex
    : (part4Index !== -1 ? part4Index : source.length);

  const mainCode = minifyJavaScript(source.slice(0, sendStart));
  const sendExtensionCommands = [
    'function sendExtensionCommands() {',
    '  // You SAMMI Core extension commands will be inserted here',
    '  /*INSERT PART 2*/',
    '}',
  ].join('\n');
  const sammiExtensionReceived = [
    'function SammiExtensionReceived(hook, SAMMIJSON) {',
    '  let LioranBoardJSON = SAMMIJSON;',
    '  switch (hook) {',
    '    // hook you specified.',
    '    default:',
    '      break;',
    '    //You hooks will be inserted here',
    '    /*INSERT PART 3*/',
    '  }',
    '}',
  ].join('\n');
  const twitchExtensionCode = minifyJavaScript(source.slice(receivedEnd, twitchExtensionEnd));
  const insertionTail = source.slice(twitchExtensionEnd).trim();

  return [
    mainCode,
    sendExtensionCommands,
    sammiExtensionReceived,
    twitchExtensionCode,
    insertionTail,
  ].filter(Boolean).join('\n');
}

function minifyInlineScripts(html) {
  return html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, (match, attributes, source) => {
    if (/\bsrc\s*=/i.test(attributes)) return match;

    try {
      const minifiedCode = minifyScriptPreservingExtensionHooks(source);
      return `<script${attributes}>\n/* eslint-disable */\n${minifiedCode}\n/* eslint-enable */\n</script>`;
    } catch (error) {
      console.error('UglifyJS error:', error);
      return match;
    }
  });
}

function minifyInlineStyles(html) {
  return html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (match, attributes, source) => {
    const minifiedCSS = new CleanCSS({}).minify(source);
    if (minifiedCSS.errors.length > 0) {
      console.error('CleanCSS errors:', minifiedCSS.errors);
      return match;
    }

    return `<style${attributes}>${minifiedCSS.styles}</style>`;
  });
}

function minifyHtmlChunk(html) {
  const compactHtml = () => html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();

  try {
    return htmlMinifier.minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeOptionalTags: false,
    });
  } catch (error) {
    console.warn(`HTML minifier warning: ${error.message}`);
    return compactHtml();
  }
}

function compactHtmlChunk(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function minifyBodyHtml(html) {
  const bodyStart = html.indexOf('<body>');
  const bodyEnd = html.indexOf('</body>');
  if (bodyStart === -1 || bodyEnd === -1) return html;

  const bodyContentStart = bodyStart + '<body>'.length;
  let bodyHtml = html.slice(bodyContentStart, bodyEnd);
  const commentIndex = bodyHtml.indexOf('<!--Your external script will be inserted here-->');

  if (commentIndex !== -1) {
    const partToMinify = bodyHtml.slice(0, commentIndex);
    const partToPreserve = bodyHtml.slice(commentIndex);
    bodyHtml = `${compactHtmlChunk(partToMinify)}\n\n${partToPreserve}`;
  } else {
    bodyHtml = minifyHtmlChunk(bodyHtml);
  }

  return `${html.slice(0, bodyContentStart)}${bodyHtml}${html.slice(bodyEnd)}`;
}

let html = fs.readFileSync(sourcePath, 'utf-8');
html = minifyInlineScripts(html);
html = minifyInlineStyles(html);
html = minifyBodyHtml(html);
html = html
  .replace(/<!DOCTYPE html>\s*/, '<!DOCTYPE html>\n')
  .replace(/<html lang="en">\s*/, '<html lang="en">\n');

fs.writeFileSync(minifiedPath, html);
