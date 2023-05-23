window.addEventListener('load', SAMMIInitTabs, false);
window.addEventListener('load', SAMMIInitModal, false);
window.addEventListener('load', populateExtensionTable, false);

function SAMMIInitModal() {
  const modalElem = document.getElementById('sammiModalElem');
  window.sammiModal = new bootstrap.Modal(modalElem, {});
}

function SAMMIInitTabs() {
  const installedExt = document.querySelector('#installedextensions');
  const ul = document.getElementById('extensions-tab');
  const parent = document.getElementById('extensions-tabContent');
  
  const tabList = {};
  let tabSortList = JSON.parse(localStorage.getItem('tabsSortList')) || [];
  const newTabSortList = [];
  const tabsVisibility = JSON.parse(localStorage.getItem('tabsVisibility')) || [];
  let lastActiveTab = localStorage.getItem('tabsActive') || 'content-basic';

  lastActiveTab = document.getElementById(lastActiveTab) ? lastActiveTab : 'content-basic';

  const contentLi = parent.querySelectorAll('.tab-pane');
  const contentAll = Array.from(contentLi).filter((n) => n.parentNode.closest('.tab-pane') === parent.closest('.tab-pane'));

  const defaultContent = contentAll.filter((e) => e.dataset.type === 'default');
  const addedContent = contentAll.filter((e) => e.dataset.type !== 'default').reverse();
  const content = [...defaultContent, ...addedContent];

  document.getElementById(lastActiveTab).className = 'tab-pane active';

  content.forEach((e) => {
    e.id = e.id.replace(/^[^a-z]+|[^\w:.-]+/g, '');
    createExtensionTab(e);
    createExtensionBox(e);
  });

  sortTabs();
  tabSortList = newTabSortList;
  localStorage.setItem('tabsSortList', JSON.stringify(newTabSortList));

  const draggable = new Draggable.Sortable(ul, {
    draggable: 'li',
    distance: 1,
    sortAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
    },
    plugins: [Draggable.Plugins.SortAnimation],
  });


 
  // TEST END

  draggable.on('sortable:sorted', debounce((e) => {
    const sortArr = JSON.parse(localStorage.getItem('tabsSortList')) || [];
    sortArr.splice(e.newIndex, 0, sortArr.splice(e.oldIndex, 1)[0]);
    localStorage.setItem('tabsSortList', JSON.stringify(sortArr));
  }, 250));

  installedExt.onclick = (ev) => {
    if (ev.target.value) {
      const id = ev.target.id.slice(8);
      const li = document.querySelector(`[aria-controls="${id}"]`);

      ev.target.checked ? li.classList.remove('d-none') : li.classList.add('d-none');
      saveTabsVisibility();
    }
  };

  document.querySelector('#extensionsshow').onclick = () => {
    localStorage.removeItem('tabsVisibility');
    location.reload();
  };

  document.querySelector('#extensionshide').onclick = () => {
    const tabsVisibility = {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisibility[id] = false;
    });
    localStorage.setItem('tabsVisibility', JSON.stringify(tabsVisibility));
    window.location.reload();
  };

  document.querySelector('#extensionsresetorder').onclick = () => {
    localStorage.removeItem('tabsSortList');
    window.location.reload();
  };

  ul.querySelectorAll('button').forEach((btn) => {
    btn.onclick = (btn) => {
      localStorage.setItem('tabsActive', btn.target.id.slice(0, -4));
    };
  });

  function createExtensionTab(e) {
    const li = document.createElement('li');
    const button = document.createElement('button');
    // close button to hide the tab when user drags up
    const closeButton = document.createElement('span');
    closeButton.innerHTML = 'X';
    closeButton.style.display = 'none'; // hidden by default
    closeButton.classList.add('close-tab-button');
    button.appendChild(closeButton);

    const hide = tabsVisibility[e.id] === false ? 'd-none' : '';
    const active = lastActiveTab === e.id ? 'active' : '';

    li.setAttribute('class', 'nav-item');
    li.setAttribute('role', 'presentation');
    li.setAttribute('draggable', 'true');

    button.setAttribute('class', `nav-link draggable-source ${active} ${hide}`);
    button.setAttribute('id', `${e.id}-tab`);
    button.setAttribute('data-bs-toggle', 'pill');
    button.setAttribute('data-bs-target', `#${e.id}`);
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', e.id);
    button.setAttribute('aria-selected', 'false');
    button.setAttribute('draggable', 'true');

    button.innerHTML = e.title;
    li.appendChild(button);

    tabList[e.id] = li;
  }

  function createExtensionBox(e) {
    const checkbox = document.createElement('input');
    const text = document.createElement('span');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox${e.id}`;
    checkbox.checked = !(tabsVisibility[e.id] === false);
    text.innerHTML = `${e.title}  `;
    text.prepend(checkbox);
    installedExt.appendChild(text);
  }

  function sortTabs() {
    while (Object.keys(tabList).length > 0) {
      const childId = tabSortList.shift() || Object.keys(tabList)[0];
      if (tabList[childId]) {
        ul.appendChild(tabList[childId]);
        newTabSortList.push(childId);
        delete tabList[childId];
      } else {
        // Handle missing tab (log error, etc.)
      }
    }
  }

  function saveTabsVisibility() {
    const tabsVisibility = JSON.parse(localStorage.getItem('tabsVisibility')) || {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisibility[id] = e.checked;
    });
    localStorage.setItem('tabsVisibility', JSON.stringify(tabsVisibility));
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
