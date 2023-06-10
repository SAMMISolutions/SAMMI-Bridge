initTabs() {
    // Ensures that the last active tab is the one that will be displayed first
    this.lastActiveTab = document.getElementById(this.lastActiveTab) ? this.lastActiveTab : 'content-settings';

    // Select all tab panes and sort them into default and added content
    const contentLi = this.parent.querySelectorAll('.tab-pane');
    const contentAll = Array.from(contentLi).filter((n) => n.parentNode.closest('.tab-pane') === this.parent.closest('.tab-pane'));

    // Separate default and added content
    const defaultContent = contentAll.filter((e) => e.dataset.type === 'default' || e.dataset.type === 'settings');
    const addedContent = contentAll.filter((e) => e.dataset.type !== 'default').reverse();

    // Reassemble content in the correct order
    const content = [...defaultContent, ...addedContent];

    // Set the active tab
    document.getElementById(this.lastActiveTab).className = 'tab-pane active';

    // For each piece of content, create an extension tab and box
    content.forEach((e) => {
      e.id = e.id.replace(/^[^a-z]+|[^\w:.-]+/g, '');
      this.createExtensionTab(e);
      if (e.dataset.type !== 'settings' && e.id != 'content-extensions') this.createExtensionBox(e);
    });

    // Sort the tabs according to the sort list
    this.sortTabs();

    // Update tab sort list and save it in localStorage
    this.tabSortList = this.newTabSortList;
    localStorage.setItem('bridge_tabsSortList', JSON.stringify(this.newTabSortList));

    // Add draggable functionality to the tabs
    const draggable = new Draggable.Sortable(this.ul, {
      draggable: 'li:not(.non-draggable)', // exclude non-draggable tabs
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
      const sortArr = this.tabSortList || [];
      sortArr.splice(e.newIndex +2, 0, sortArr.splice(e.oldIndex + 2, 1)[0]);
      localStorage.setItem('bridge_tabsSortList', JSON.stringify(sortArr));
      this.tabSortList = sortArr;
    });

    // Update the tab visibility when a checkbox is clicked
    this.installedExt.onclick = (ev) => {
      if (ev.target.value) {
        const id = ev.target.id.slice(8);
        if (id === 'content-settings' || id === 'content-extensions') return;
        const li = document.querySelector(`[aria-controls="${id}"]`);

        ev.target.checked ? li.classList.remove('d-none') : li.classList.add('d-none');
        this.saveTabsVisibility();
      }
    };

    // The following event listeners reset various elements to their default state
    document.querySelector('#extensionsshow').onclick = () => {
      localStorage.removeItem('bridge_tabsVisibility');
      window.location.reload();
    };

    document.querySelector('#extensionshide').onclick = () => {
      const tabsVisibility = {};
      document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
        const id = e.id.slice(8);
        tabsVisibility[id] = false;
      });
      localStorage.setItem('bridge_tabsVisibility', JSON.stringify(tabsVisibility));
      window.location.reload();
    };

    document.querySelector('#extensionsresetorder').onclick = () => {
      localStorage.removeItem('bridge_tabsSortList');
      window.location.reload();
    };

    // Save the last active tab when a button is clicked
    this.ul.querySelectorAll('button').forEach((btn) => {
      btn.onclick = (btn) => {
        localStorage.setItem('bridge_tabsActive', btn.target.id.slice(0, -4));
      };
    });
  }