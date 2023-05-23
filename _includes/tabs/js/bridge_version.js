// Function to get version from HTML content
async function getVersionFromHTML() {
// Get the content of the page\
  // Initialize bridgeVersion as not found
  let bridgeVersion = 'Bridge Version Not Found';
  const versionLine = document.firstChild.nextSibling.textContent;
  const versionRegex = /V([\d.]+)/;
  const match = versionRegex.exec(versionLine);

  if (match && match[1]) {
    [, bridgeVersion] = match;
  }
  // Use the bridge version
  document.querySelector('span[name="version"]').innerText = bridgeVersion;
}
