class Router {
  constructor(options) {
    this.options = options;
    this.routes = {};
    this.currentRoute = null;
    this.transitioning = false;
    
    // Create a wrapper element to append the content to
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('router-wrapper wrap');
    toMom(this.wrapper, Get1('main'));
  }

  addRoute(route, component) {
    this.routes[route] = component;
  }

  navigate(el) {
    if (this.transitioning) return;
    if(el.getUrl) ezCurl(el, navigate)
    const currentComponent = this.currentRoute ? this.routes[this.currentRoute] : null;
    const nextComponent = this.routes[route];

    if (!el) {
      console.error(`Route not found: ${route}`);
      return;
    }

    this.transitioning = true;

    // Create a new element to render the next component
    const nextElement = document.createElement('div');
    nextElement.classList.add('wrap router-content');
    nextElement.appendChild(el);

    // Append the next element to the wrapper
    this.wrapper.appendChild(nextElement);

    // Animate the transition
    this.animateTransition(currentComponent, nextComponent, nextElement);

    // Update the current route
    this.currentRoute = route;

    // Remove the old component
    if (currentComponent) {
      currentComponent.destroy();
    }

    this.transitioning = false;
  }

  animateTransition(currentComponent, nextComponent, nextElement) {
    const animationOptions = this.options.animationOptions || {};

    // Use Web Animations API to animate the transition
    nextElement.animate([
      { opacity: 0, transform: 'translateX(100%)' },
      { opacity: 1, transform: 'translateX(0)' },
    ], {
      duration: animationOptions.duration || 300,
      easing: animationOptions.easing || 'ease-in-out',
      fill: 'forwards',
    });

    // Wait for the animation to finish before removing the old component
    nextElement.addEventListener('animationend', () => {
      if (currentComponent) {
        currentComponent.element.remove();
      }
    });
  }
}

// Create a router instance
const router = new Router({
  animationOptions: {
    duration: 500,
    easing: 'ease-in-out',
  },
});

// Define some routes
router.addRoute('home', {
  render: () => '<h1>Home</h1>',
  destroy: () => console.log('Home component destroyed'),
});

router.addRoute('about', {
  render: () => '<h1>About</h1>',
  destroy: () => console.log('About component destroyed'),
});


