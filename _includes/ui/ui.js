// window.addEventListener('load', SAMMIInitTabs, false);
// window.addEventListener('load', SAMMIInitModal, false);
// window.addEventListener('load', populateExtensionTable, false);

// Create a new SAMMIUI class
class SAMMIUI {
  // Constructor function initializes the object with properties
  constructor() {
    // Fetch the DOM elements and localStorage items required
    this.modalElem = document.getElementById('sammiModalElem');
    this.installedExt = document.querySelector('#installedextensions');
    this.ul = document.getElementById('extensions-tab');
    this.parent = document.getElementById('extensions-tabContent');
    this.tabList = {};
    this.tabSortList = JSON.parse(localStorage.getItem('tabsSortList')) || [];
    this.newTabSortList = [];
    this.tabsVisibility = JSON.parse(localStorage.getItem('tabsVisibility')) || {};
    this.lastActiveTab = localStorage.getItem('tabsActive') || 'content-basic';
  }

  // This method adds an event listener to the window load event which will initialize SAMMIUI
  static init() {
    window.addEventListener('load', () => {
      const sammiUI = new SAMMIUI();
      sammiUI.initModal();
      sammiUI.initTabs();
    }, false);
  }

  // This method initializes the modal
  initModal() {
    window.sammiModal = new bootstrap.Modal(this.modalElem, {});
  }

  // Hiding tabs by dragging them over the close X button
  {% include ui/dragXHide.js %}

  // This method initializes tabs
  {% include ui/initTabs.js %}
  initTabs() {
    // Ensures that the last active tab is the one that will be displayed first
    this.lastActiveTab = document.getElementById(this.lastActiveTab) ? this.lastActiveTab : 'content-basic';

    // Select all tab panes and sort them into default and added content
    const contentLi = this.parent.querySelectorAll('.tab-pane');
    const contentAll = Array.from(contentLi).filter((n) => n.parentNode.closest('.tab-pane') === this.parent.closest('.tab-pane'));

    // Separate default and added content
    const defaultContent = contentAll.filter((e) => e.dataset.type === 'default');
    const addedContent = contentAll.filter((e) => e.dataset.type !== 'default').reverse();

    // Reassemble content in the correct order
    const content = [...defaultContent, ...addedContent];

    // Set the active tab
    document.getElementById(this.lastActiveTab).className = 'tab-pane active';

    // For each piece of content, create an extension tab and box
    content.forEach((e) => {
      e.id = e.id.replace(/^[^a-z]+|[^\w:.-]+/g, '');
      this.createExtensionTab(e);
      this.createExtensionBox(e);
    });

    // Sort the tabs according to the sort list
    this.sortTabs();

    // Update tab sort list and save it in localStorage
    this.tabSortList = this.newTabSortList;
    localStorage.setItem('tabsSortList', JSON.stringify(this.newTabSortList));

    // Add draggable functionality to the tabs
    const draggable = new Draggable.Sortable(this.ul, {
      draggable: 'li',
      distance: 1,
      sortAnimation: {
        duration: 200,
        easingFunction: 'ease-in-out',
      },
      plugins: [Draggable.Plugins.SortAnimation],
    });

    // Call the SAMMITabDragXHide method with the draggable instance
    SAMMIUI.dragXHide(draggable, this);

    // Save the tab order when the sorting ends
    draggable.on('sortable:stop', (e) => {
      const sortArr = JSON.parse(localStorage.getItem('tabsSortList')) || [];
      sortArr.splice(e.newIndex, 0, sortArr.splice(e.oldIndex, 1)[0]);
      localStorage.setItem('tabsSortList', JSON.stringify(sortArr));
    });

    // Update the tab visibility when a checkbox is clicked
    this.installedExt.onclick = (ev) => {
      if (ev.target.value) {
        const id = ev.target.id.slice(8);
        const li = document.querySelector(`[aria-controls="${id}"]`);

        ev.target.checked ? li.classList.remove('d-none') : li.classList.add('d-none');
        this.saveTabsVisibility();
      }
    };

    // The following event listeners reset various elements to their default state
    document.querySelector('#extensionsshow').onclick = () => {
      localStorage.removeItem('tabsVisibility');
      window.location.reload();
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

    // Save the last active tab when a button is clicked
    this.ul.querySelectorAll('button').forEach((btn) => {
      btn.onclick = (btn) => {
        localStorage.setItem('tabsActive', btn.target.id.slice(0, -4));
      };
    });
  }

  // This method creates the extension tabs
  createExtensionTab(e) {
    // DOM manipulation to create the required elements
    const li = document.createElement('li');
    const button = document.createElement('button');
    const closeButton = document.createElement('span');
    closeButton.innerHTML = 'X';
    closeButton.style.display = 'none';
    closeButton.classList.add('close-tab-button');
    button.appendChild(closeButton);

    // Set the attributes and content of the created elements
    const hide = this.tabsVisibility[e.id] === false ? 'd-none' : '';
    const active = this.lastActiveTab === e.id ? 'active' : '';

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

    // Store the created tab in the tabList object
    this.tabList[e.id] = li;
  }

  // This method creates the extension boxes
  createExtensionBox(e) {
    // DOM manipulation to create the required elements
    const checkbox = document.createElement('input');
    const text = document.createElement('span');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox${e.id}`;
    checkbox.checked = !(this.tabsVisibility[e.id] === false);
    text.innerHTML = `${e.title}  `;
    text.prepend(checkbox);

    // Add the created elements to the installed extensions box
    this.installedExt.appendChild(text);
  }

  // This method sorts the tabs according to the sort list
  sortTabs() {
    while (Object.keys(this.tabList).length > 0) {
      const childId = this.tabSortList.shift() || Object.keys(this.tabList)[0];
      if (this.tabList[childId]) {
        this.ul.appendChild(this.tabList[childId]);
        this.newTabSortList.push(childId);
        delete this.tabList[childId];
      } else {
        // Handle missing tab (log error, etc.)
      }
    }
  }

  // This method saves the visibility status of tabs
  saveTabsVisibility() {
    const tabsVisibility = this.tabsVisibility || {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisibility[id] = e.checked;
    });
    localStorage.setItem('tabsVisibility', JSON.stringify(tabsVisibility));
    this.tabsVisibility = tabsVisibility;
  }
}

// Initialize the SAMMIUI
SAMMIUI.init();
