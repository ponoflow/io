function createSplitter(selector) {
    const container = document.querySelector(selector);
    if (!container) return null;
  
    // Create the splitter elements
    const leftPane = document.createElement('div');
    const bar = document.createElement('div');
    const rightPane = document.createElement('div');
  
    // Apply classes
    container.classList.add('container', 'split');
    leftPane.classList.add('split__left');
    bar.classList.add('split__bar');
    rightPane.classList.add('split__right');
    bar.style.cssText.cssText ="width: 15px; height: 100%;cursor: col-resize;";
    rightPane.style.cssText ="width:50%";
    container.style.cssText ="width:50%";
    // Append elements to the container
    container.appendChild(leftPane);
    container.appendChild(bar);
    container.appendChild(rightPane);
  
    document.head.appendChild(style);
    // Event handling for resizing
    let mouseIsDown = false;
    bar.addEventListener('mousedown', () => {
      mouseIsDown = true;
    });
    document.addEventListener('mouseup', (e) => {
      if (!mouseIsDown) return;
      const newWidth = Math.max(e.clientX, 400); // Minimum width of 400px
      leftPane.style.width = `${newWidth}px`;
    });
    document.addEventListener('mouseup', () => {
      mouseIsDown = false;
    });
    // Ensure minimum height of 400px
    const checkAndSetHeight = () => {
      const height = container.clientHeight;
      if (height < 400) {
        container.style.height = '400px';
      }
    };
    checkAndSetHeight();
    window.addEventListener('resize', checkAndSetHeight);
    return {
      parent: container,
      left: leftPane,
      right: rightPane
    };
  }