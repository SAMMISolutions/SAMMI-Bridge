saveTabsVisibility() {
    const tabsVisibility = this.tabsVisibility || {};
    document.querySelectorAll('#installedextensions input[type=checkbox]').forEach((e) => {
      const id = e.id.slice(8);
      tabsVisibility[id] = e.checked;
    });
    localStorage.setItem('bridge_tabsVisibility', JSON.stringify(tabsVisibility));
    this.tabsVisibility = tabsVisibility;
  }