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