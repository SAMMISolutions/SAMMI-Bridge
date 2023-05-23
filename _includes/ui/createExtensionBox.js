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
