function SAMMITabDragXHide(draggable) {
/// Hiding tabs by dragging them over the close X button
  let dragTimer = null;
  let overCloseButton = false;
  let currentDraggedSource = null;
  const closeButton = document.getElementById('close-tab-button');

  closeButton.addEventListener('mouseenter', () => {
    overCloseButton = true;
    closeButton.classList.add('hovered');
    const mirror = document.querySelector('.draggable-mirror');
    if (mirror) {
      mirror.classList.add('shake');
    }
  });

  closeButton.addEventListener('mouseleave', () => {
    overCloseButton = false;
    closeButton.classList.remove('hovered');
    const mirror = document.querySelector('.draggable-mirror');
    if (mirror) {
      mirror.classList.remove('shake');
    }
  });

  draggable.on('mirror:created', (event) => {
    event.mirror.style.zIndex = '9999'; // Or whatever value you want
  });

  draggable.on('drag:start', (event) => {
    const mirror = document.querySelector('.draggable-mirror');
    if (mirror) {
      mirror.classList.remove('shaking');
    }
    // Start a timer when the drag starts
    dragTimer = setTimeout(() => {
    // If the user is still dragging after 0.5s, show the 'X'
      document.getElementById('close-tab-button').style.display = 'block';
    }, 50);
    currentDraggedSource = event.data.source;
  });

  draggable.on('drag:move', (event) => {
    const mirror = document.querySelector('.draggable-mirror');
    if (overCloseButton && mirror) {
      mirror.classList.add('opacity-90');
      mirror.firstChild.classList.add('shaking');
    } else if (mirror) {
      mirror.classList.remove('opacity-90');
      mirror.firstChild.classList.remove('shaking');
    }
    // If the user moves the drag item downwards, hide the 'X' and clear the timer
    if (event.sensorEvent.data.originalEvent.movementY > 0) {
      document.getElementById('close-tab-button').style.display = 'none';
      if (dragTimer !== null) {
        clearTimeout(dragTimer);
        dragTimer = null;
      }
    // If the user moves the drag item upwards, show the 'X' again
    } else if (event.sensorEvent.data.originalEvent.movementY < 0) {
      document.getElementById('close-tab-button').style.display = 'block';
      if (dragTimer === null) {
      // Start the timer again if it was cleared
        dragTimer = setTimeout(() => {
        // If the user is still dragging upwards after 0.5s, keep showing the 'X'
          document.getElementById('close-tab-button').style.display = 'block';
        }, 500);
      }
    }
  });

  draggable.on('drag:stop', () => {
    const mirror = document.querySelector('.draggable-mirror');
    if (mirror) {
      mirror.firstChild.classList.remove('shaking');
    }
    // Hide the 'X' when the drag ends
    document.getElementById('close-tab-button').style.display = 'none';
    // Clear the timer
    if (dragTimer !== null) {
      clearTimeout(dragTimer);
      dragTimer = null;
    }
    // If the tab was dropped on the 'X', hide it
    if (overCloseButton) {
      currentDraggedSource.nextSibling.firstChild.classList.add('d-none');
      document.getElementById(`checkbox${currentDraggedSource.nextSibling.firstChild.id.slice(0, -4)}`).checked = false; // Uncheck the checkbox
      saveTabsVisibility();
    }
    currentDraggedSource = null; // Reset the stored id
  });

  draggable.on('dropped', (event) => {
  // If the tab is dropped on the 'X', hide it
    if (event.sensorEvent.target.id === 'close-tab-button') {
      event.source.style.display = 'none';
    }
  });
}
