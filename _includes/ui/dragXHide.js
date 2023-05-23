static dragXHide(draggable, classInstance) {
    // Initializing variables for drag timer, close button and drag source
    let dragTimer = null;
    let overCloseButton = false;
    let currentDraggedSource = null;
    const closeButton = document.getElementById('close-tab-button');

    // Event Listener for mouse entering the close button
    closeButton.addEventListener('mouseenter', () => {
      overCloseButton = true;
      closeButton.classList.add('hovered');
      const mirror = document.querySelector('.draggable-mirror');
      mirror?.classList.add('shake');
    });

    // Event Listener for mouse leaving the close button
    closeButton.addEventListener('mouseleave', () => {
      overCloseButton = false;
      closeButton.classList.remove('hovered');
      const mirror = document.querySelector('.draggable-mirror');
      mirror?.classList.remove('shake');
    });

    // Event Listener for creation of mirror image while dragging
    draggable.on('mirror:created', (event) => {
      event.mirror.style.zIndex = '9999';
    });

    // Event Listener for the start of dragging
    draggable.on('drag:start', (event) => {
      const mirror = document.querySelector('.draggable-mirror');
      mirror?.classList.remove('shaking');
      // Start a timer when the drag starts
      dragTimer = setTimeout(() => {
        // If the user is still dragging after 0.5s, show the 'X'
        closeButton.style.display = 'block';
      }, 50);
      currentDraggedSource = event.data.source;
    });

    // Event Listener for dragging movement
    draggable.on('drag:move', (event) => {
      const mirror = document.querySelector('.draggable-mirror');
      const movementY = event.sensorEvent.data.originalEvent.movementY;
      if (overCloseButton && mirror) {
        mirror.classList.add('opacity-90');
        mirror.firstChild.classList.add('shaking');
      } else if (mirror) {
        mirror.classList.remove('opacity-90');
        mirror.firstChild.classList.remove('shaking');
      }

      if (movementY > 0) {  // If the user moves the drag item downwards, hide the 'X' and clear the timer
        closeButton.style.display = 'none';
        if (dragTimer !== null) {
          clearTimeout(dragTimer);
          dragTimer = null;
        }
      } else if (movementY < 0) {  // If the user moves the drag item upwards, show the 'X' again
        closeButton.style.display = 'block';
        if (dragTimer === null) {
          // Start the timer again if it was cleared
          dragTimer = setTimeout(() => {
            closeButton.style.display = 'block';
          }, 500);
        }
      }
    });

    // Event Listener for the end of dragging
    draggable.on('drag:stop', () => {
      const mirror = document.querySelector('.draggable-mirror');
      mirror?.firstChild.classList.remove('shaking');

      // Hide the 'X' when the drag ends
      closeButton.style.display = 'none';
      // Clear the timer
      if (dragTimer !== null) {
        clearTimeout(dragTimer);
        dragTimer = null;
      }

      // If the tab was dropped on the 'X', hide it
      if (overCloseButton) {
        const draggedElement = currentDraggedSource.nextSibling.firstChild;
        draggedElement.classList.add('d-none');
        document.getElementById(`checkbox${draggedElement.id.slice(0, -4)}`).checked = false; // Uncheck the checkbox
        classInstance.saveTabsVisibility();  // save tabs visibility
      }
      currentDraggedSource = null; // Reset the stored id
    });

    // Event Listener for dropping of the draggable item
    draggable.on('dropped', (event) => {
      // If the tab is dropped on the 'X', hide it
      if (event.sensorEvent.target.id === 'close-tab-button') {
        event.source.style.display = 'none';
      }
    });
  } 
