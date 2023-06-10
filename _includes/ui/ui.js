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
    this.tabSortList = JSON.parse(localStorage.getItem('bridge_tabsSortList')) || [];
    this.newTabSortList = [];
    this.tabsVisibility = JSON.parse(localStorage.getItem('bridge_tabsVisibility')) || {};
    this.lastActiveTab = localStorage.getItem('bridge_tabsActive') || 'content-settings';
  }

  // This method initializes the modal used by SAMMI Core to call Bridge
  initModal() {
    window.sammiModal = new bootstrap.Modal(this.modalElem, {});
  }

  // Hiding tabs by dragging them over the close X button
  {% include ui/dragXHide.js %}

  // This method initializes tabs
  {% include ui/initTabs.js %}

  // This method creates the extension tabs
  {% include ui/createExtensionTab.js %}

  // This method creates the extension boxes
  {% include ui/createExtensionBox.js %}

  // This method sorts the tabs according to the sort list
  {% include ui/sortTabs.js %}

  // This method saves the visibility status of tabs
  {% include ui/saveTabsVisibility.js %}
}