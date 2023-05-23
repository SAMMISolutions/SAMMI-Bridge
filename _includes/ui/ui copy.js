window.addEventListener('load', SAMMIUITabs, false);

function SAMMIUITabs() {
  window.sammiModal = new bootstrap.Modal(document.getElementById('sammiModalElem'), {});
  const tabList = {};
  let tabSortList = JSON.parse(localStorage.getItem('tabsSortList')) || [];
  const newtabSortList = [];
  const tabsVisibility = JSON.parse(localStorage.getItem('tabsVisibility')) || [];
  let lastActiveTab = localStorage.getItem('tabsActive') || 'content-basic';
  lastActiveTab = (document.getElementById(lastActiveTab)) ? lastActiveTab : 'content-basic';
  const installedExt = document.querySelector('#installedextensions');
  const ul = document.getElementById('extensions-tab');
  const parent = document.getElementById('extensions-tabContent');
  const contentLi = parent.querySelectorAll('.tab-pane');
  const contentAll = [].slice.call(contentLi).filter((n) => n.parentNode.closest('.tab-pane') === parent.closest('.tab-pane'));
  const defaultContent = contentAll.filter((e) => e.dataset.type === 'default');
  const addedContent = contentAll.filter((e) => e.dataset.type !== 'default');
  const content = defaultContent.concat(addedContent.reverse());
  const activeTab = document.getElementById(lastActiveTab);
  activeTab.className = 'tab-pane active';

  // create tabs and checkboxes
  content.forEach((e) => {
    e.id = e.id.replace(/^[^a-z]+|[^\w:.-]+/g, '');
    createExtensionTab(e);
    createExtensionBox(e);
  });
  SortTabs();

  tabSortList = newtabSortList;
  localStorage.setItem('tabsSortList', JSON.stringify(newtabSortList));

  // add drag and sort functionality to tabs
  const draggable = new Draggable.Sortable(ul, {
    draggable: 'li',
    distance: 1,
    sortAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
    },
    plugins: [Draggable.Plugins.SortAnimation],
  });

  // populated extension versions 
  populateExtensionTable();

  // save a new sort order
  draggable.on('sortable:sorted', (e) => {
    const sortArr = JSON.parse(localStorage.getItem('tabsSortList'));
    sortArr.splice(e.newIndex, 0, sortArr.splice(e.oldIndex, 1)[0]);
    localStorage.setItem('tabsSortList', JSON.stringify(sortArr));
  });

  // change and save tab visibility
  document.querySelector('#installedextensions').onclick = (ev) => {
    if (ev.target.value) {
      const id = ev.target.id.slice(8);
      const li = document.querySelector(`[aria-controls="${id}"]`);

      if (ev.target.checked) {
        li.classList.remove('d-none');
      } else {
        li.classList.add('d-none');
      }
      SaveExttabsVisibility();
    }
  };

  // show all tabs
  document.querySelector('#extensionsshow').onclick = () => {
    localStorage.removeItem('tabsVisibility');
    location.reload();
  };

  // hide all tabs
  document.querySelector('#extensionshide').onclick = () => {
    const tabsVisiblity = {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisiblity[id] = false;
    });
    localStorage.setItem('tabsVisibility', JSON.stringify(tabsVisiblity));
    window.location.reload();
  };

  // reset tab order
  document.querySelector('#extensionsresetorder').onclick = () => {
    localStorage.removeItem('tabsSortList');
    window.location.reload();
  };

  // save active tab
  ul.querySelectorAll('button').forEach((btn) => btn.onclick = (btn) => {
    localStorage.setItem('tabsActive', btn.target.id.slice(0, -4));
  });

  // create all tabs
  function createExtensionTab(e) {
    const { title } = e;
    const { id } = e;
    const li = document.createElement('li');
    const button = document.createElement('button');
    const hide = (typeof tabsVisibility[id] !== 'undefined' && tabsVisibility[id] === false) ? 'd-none' : '';
    const active = (lastActiveTab === id) ? 'active' : '';
    li.setAttributes({ class: 'nav-item', role: 'presentation', draggable: 'true' });
    button.setAttributes({
      class: `nav-link draggable-source ${active} ${hide}`, id: `${id}-tab`, 'data-bs-toggle': 'pill', 'data-bs-target': `#${id}`, type: 'button', role: 'tab', 'aria-controls': id, 'aria-selected': 'false', draggable: 'true',
    });
    button.innerHTML = title;
    li.appendChild(button);
    tabList[id] = li;
  }

  // create all tab check boxes
  function createExtensionBox(e) {
    const checkbox = document.createElement('input');
    const text = document.createElement('span');
    text.innerHTML = `${e.title}  `;
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox${e.id}`;
    checkbox.checked = !((typeof tabsVisibility[e.id] !== 'undefined' && tabsVisibility[e.id] === false));
    text.prepend(checkbox);
    installedExt.appendChild(text);
  }

  // sort tabs
  function SortTabs() {
    let i = 0;
    do {
      const childId = tabSortList[i] || Object.keys(tabList)[0];
      try {
        ul.appendChild(tabList[childId]);
        newtabSortList.push(childId);
      } catch (e) { console.log(e); }
      delete tabList[childId];
      i += 1;
    } while (Object.keys(tabList).length > 0);
  }

  // save tabs visiblity
  function SaveExttabsVisibility() {
    const tabsVisiblity = JSON.parse(localStorage.getItem('tabsVisibility')) || {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisiblity[id] = e.checked;
    });
    localStorage.setItem('tabsVisibility', JSON.stringify(tabsVisiblity));
  }
}

// change connection status UI
function ConnectionStatus(id, status, text, fill) {
  document.getElementById(id).className = `${status} d-none d-md-inline-flex`;
  document.getElementById(id).innerHTML = ` ${text}`;
  document.getElementById(`${id}_circle`).setAttribute('fill', fill);
}

// helper function to set multiple element attributes at once
Element.prototype.setAttributes = function (obj) {
  for (const prop in obj) {
    this.setAttribute(prop, obj[prop]);
  }
};

