document.addEventListener('DOMContentLoaded', () => {
    class ViewportWrapper {
        constructor() {
            this.wrapper = document.createElement('div');
            this.wrapper.style.position = 'fixed';
            this.wrapper.style.top = '0';
            this.wrapper.style.left = '0';
            this.wrapper.style.width = '100vw';
            this.wrapper.style.height = '100vh';
            this.wrapper.style.overflow = 'hidden';
            this.wrapper.style.zIndex = '9999';
            this.wrapper.style.transition = 'transform 0.3s ease';
            this.originalBodyOverflow = '';
            this.scrollPosition = { top: 0, left: 0 };
        }

        initiate(scale, transformOrigin = 'center') {
            this.wrapper.style.transformOrigin = transformOrigin;
            this.wrapper.style.transform = `scale(${scale})`;

            // Save the current scroll position
            this.scrollPosition.top = window.scrollY;
            this.scrollPosition.left = window.scrollX;

            this.originalBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            document.body.style.margin = '0';
            Array.from(document.body.children).forEach(e=>this.wrapper.appendChild(e))
            document.body.appendChild(this.wrapper);
        }

        unwrap() {
            this.wrapper.style.transform = 'scale(1)';
            this.wrapper.addEventListener('transitionend', () => {
                document.body.style.overflow = this.originalBodyOverflow;
                document.body.style.margin = '';
                document.body.innerHTML = this.wrapper.innerHTML;
                this.wrapper.remove();
            }, { once: true });
        }
    }

    // Usage:
    const viewportWrapper = new ViewportWrapper();

    // To initiate with scale 0.8 and transform origin 'top left':
    viewportWrapper.initiate(0.8, 'top left');

    // To unwrap back to fullscreen:
    viewportWrapper.unwrap();
});
