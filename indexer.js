class DOMIndexer {
    constructor() {
      this.index = new Map();
      this.init();
    }
  
    init() {
      this.buildIndex(document.body);
      this.observeChanges();
    }
  
    buildIndex(element, path = []) {
      const indexPath = [...path, Array.from(element.parentNode.children).indexOf(element)];
      this.index.set(element, indexPath);
  
      Array.from(element.children).forEach((child, i) => {
        this.buildIndex(child, indexPath);
      });
    }
  
    observeChanges() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.buildIndex(node);
              }
            });
            mutation.removedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.index.delete(node);
              }
            });
          }
        });
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  
    getPath(element) {
      return this.index.get(element);
    }
  }
  
  const domIndexer = new DOMIndexer();
  console.log(domIndexer.getPath(document.querySelector('.some-element')));