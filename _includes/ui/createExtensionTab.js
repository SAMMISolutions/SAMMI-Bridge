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
    // Determine if the element should be draggable
    if (e.id !== 'content-basic' && e.id !== 'content-extensions') {
      li.setAttribute('draggable', 'true');
      button.setAttribute('draggable', 'true');
    } else {
      li.classList.add('non-draggable');
      button.classList.add('non-draggable');
    }

    button.setAttribute('class', `nav-link draggable-source ${active} ${hide}`);
    button.setAttribute('id', `${e.id}-tab`);
    button.setAttribute('data-bs-toggle', 'pill');
    button.setAttribute('data-bs-target', `#${e.id}`);
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', e.id);
    button.setAttribute('aria-selected', 'false');
    button.setAttribute('draggable', 'true');

    // verify data type and add icon to title
    let dataType = e.getAttribute('data-type');
    let title = e.title;
    
    // for default tabs included with bridge
    if (dataType === 'default') {
        title = `<i class="fa-solid fa-star me-1"></i>${title}`;
    // for settings/status tab included with bridge
    } else if (dataType === 'settings') {
        title = `<i class="fa-solid fa-gear me-1"></i>${title}`;
    // for official SAMMI extensions
    } else if (dataType === 'official') {
        // title = `<i class="fa-solid fa-shield me-1"></i>${title}`;
        title = `<i class="fa-solid fa-badge-check me-1"></i>${title}`;
    // for user created extensions
    } else if (!dataType || dataType === 'external') {
        // No icon to be added
    }

    button.innerHTML = title;
    li.appendChild(button);

    // Store the created tab in the tabList object
    this.tabList[e.id] = li;
  }

  // data-type