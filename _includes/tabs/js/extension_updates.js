// Function to fetch the JSON
async function getExtensionsData() {
  const response = await fetch('https://sammi.solutions/SAMMI-Bridge/extensions/extensions.json');
  const data = await response.json();
  return data.extensions;
}

// Function to get current installed extensions
function getCurrentExtensions() {
  const tabs = document.querySelectorAll('.tab-pane');
  const currentExtensions = [];
  tabs.forEach((tab) => {
    const tabTitle = tab.title.toLowerCase(); // Convert tab title to lowercase
    if (['twitch triggers', 'youtube triggers', 'extensions', 'settings'].includes(tabTitle) || tabTitle === '') return;
    currentExtensions.push({
      extension_name: tab.title,
      current_version: tab.getAttribute('data-version'),
    });
  });
  return currentExtensions;
}

async function populateExtensionTable() {
  const extensionData = await getExtensionsData();
  const currentExtensions = getCurrentExtensions();
  const tbody = document.getElementById('extensionTableBody');
  const extensionTable = document.getElementById('extensionTable');
  const versionSpan = document.getElementById('extensions_status');
  const extensionIcon = document.getElementById('extensions_icon');
  window.extensionVersions = {}; // Add this line to create a new object

  let allUpToDate = true; // Flag to track if all extensions are up to date

  // If there are no current extensions installed
  if (currentExtensions.length === 0) {
    const extensionTab = document.getElementById('content-extensions');
    // Remove the table
    extensionTable.style.display = 'none';

    // Create a paragraph element and set its text
    const p = document.createElement('p');
    p.innerText = 'No extensions installed.';

    // Append the paragraph to the body
    extensionTab.appendChild(p);

    versionSpan.innerText = 'No extensions installed.'; // Set the text of the version status
    return; // Exit the function
  }

  currentExtensions.forEach((current) => {
    const latest = extensionData.find((e) => {
        const extensionNameMatch = e.extension_name.toLowerCase().trim() === current.extension_name.toLowerCase().trim();
        const alternateNamesMatch = e.alternate_names ? e.alternate_names.map(n => n.toLowerCase().trim()).includes(current.extension_name.toLowerCase().trim()) : false;
        return extensionNameMatch || alternateNamesMatch;
    });
    const row = document.createElement('tr');

    // Create the cell for the extension name
    const nameCell = document.createElement('td');
    nameCell.innerText = current.extension_name;
    nameCell.style.cursor = 'pointer'; // make the cursor pointer
    nameCell.title = latest && latest.details.description ? latest.details.description : 'No description available'; // set tooltip text
    nameCell.addEventListener('click', () => {
      const tabId = `content-${current.extension_name.replace(/ /g, '_')}-tab`;
      const tabElement = document.getElementById(tabId);
      const bsTab = new bootstrap.Tab(tabElement);
      bsTab.show();
    });
    row.appendChild(nameCell);

    // Author cell
    const authorCell = document.createElement('td');
    authorCell.className = 'd-none d-sm-table-cell';
    authorCell.innerText = latest ? latest.details.author : 'N/A';
    row.appendChild(authorCell);

    // Current version cell
    const currentVersionCell = document.createElement('td');
    currentVersionCell.innerText = current.current_version != 'unknown' ? current.current_version : 'N/A';
    row.appendChild(currentVersionCell);

    // Latest version cell
    const latestVersionCell = document.createElement('td');
    latestVersionCell.innerText = latest ? latest.details.latest_version : 'N/A';
    row.appendChild(latestVersionCell);

    // save to object to send to SAMMI
    const extensionNameKey = toPascalCase(current.extension_name); // Convert extension name to Pascal Case key
    window.extensionVersions[extensionNameKey] = {
      latest: latest ? latest.details.latest_version : 'N/A',
      current: current.current_version,
    };

    // Download/Update cell
    const downloadCell = document.createElement('td');
    if (latest) {
      downloadCell.innerHTML = `
        <a href="${latest.details.download_link}" target="_blank" rel="noopener noreferrer" 
            class="btn btn-sm"
            style="${latest.details.latest_version !== current.current_version ? 'background-color: #a15900' : 'background-color: #0a8263'}">
            <span class="d-none d-sm-inline">${latest.details.latest_version !== current.current_version ? 'Update' : 'Download'}</span>
            <i class="fas fa-${latest.details.latest_version !== current.current_version ? 'sync' : 'download'} d-sm-none"></i>
        </a>
      `;
    }
    row.appendChild(downloadCell);

    if (!latest) {
      row.style.backgroundColor = '#afab68';
      allUpToDate = false;
    } else if (latest.details.latest_version !== current.current_version) {
      allUpToDate = false;
    }
    tbody.appendChild(row);
  });

  if (allUpToDate) {
    extensionIcon.className = 'fas fa-check-circle me-1 d-md-none';
    extensionIcon.style.color = '#4ad84a';
    versionSpan.innerText = 'All up to date';
    versionSpan.style.color = '#4ad84a';
  } else {
    extensionIcon.className = 'fas fa-exclamation-circle me-1 d-md-none';
    extensionIcon.style.color = 'orange';
    versionSpan.innerText = 'Updates available';
    versionSpan.style.color = 'orange';
  }
}

function waitForExtensions() {
  return new Promise((resolve, reject) => {
    const checkExtensions = () => {
      // Check if window.extensionVersions is a populated array
      if (window.extensionVersions && typeof window.extensionVersions === 'object' && Object.keys(window.extensionVersions).length > 0) {
        setTimeout(() => {
          resolve();
        }, 500);
      } else {
        // If not, check again after 500 milliseconds
        setTimeout(checkExtensions, 500);
      }
    };
    checkExtensions();
  });
}
function toPascalCase(str) {
  return str
    .match(/[a-z]+/gi) // Match all groups of letters (ignores non-letter characters)
    .map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()) // Convert to Pascal Case
    .join('') // Join the groups of letters together
    .replace(/\s+/g, ''); // Remove any remaining spaces
}
